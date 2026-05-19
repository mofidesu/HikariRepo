/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  ANTIGRAVITY E-TİCARET AKILLI ALIŞVERİŞ DANIŞMANI                         ║
 * ║  Two-Stage Pipeline: Recommender → Evaluator (Judge/Critic Pattern)        ║
 * ║                                                                            ║
 * ║  Mimari:                                                                   ║
 * ║  ┌────────────────┐     ┌────────────────┐     ┌────────────────┐          ║
 * ║  │  Kullanıcı     │ ──▷ │  1. Model      │ ──▷ │  2. Model      │          ║
 * ║  │  Problemi      │     │  (Recommender) │     │  (Evaluator)   │          ║
 * ║  └────────────────┘     │  temp=0.7      │     │  temp=0.0      │          ║
 * ║                         │  JSON çıktı    │     │  JSON çıktı    │          ║
 * ║                         └────────────────┘     └────────────────┘          ║
 * ║                                                       │                    ║
 * ║                                                       ▼                    ║
 * ║                                                 Onaylanan Ürünler          ║
 * ║                                                 (DB Sorgusu İçin)          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 *  Kullanım:  node antigravity_pipeline.mjs
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// ══════════════════════════════════════════════════════════════════════════════
// API AYARLARI
// ══════════════════════════════════════════════════════════════════════════════

const GEMINI_API_KEY = "AIzaSyC5XGHB0f_aaLDRMBTe9jHT2ivq6IP0WMY";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ── 1. Model: Öneri Motoru (Recommender) ─────────────────────────────────────
const RECOMMENDER_SYSTEM = `Role: Sen bir e-ticaret akıllı alışveriş danışmanısın. Görevin, kullanıcının belirttiği probleme veya ihtiyaca yönelik mantıklı ve çözüm odaklı ürün kategorileri/türleri türetmektir.

Constraints:
- Kesinlikle marka/model ismi uydurma, jenerik ürün türleri kullan (Örn: 'Oyuncu Kulaklığı').
- Sadece probleme doğrudan çözüm olacak ürünleri listele.
- Çıktıyı başka hiçbir metin eklemeden SADECE şu JSON formatında ver:
{
  "kullanici_amaci": "isteğin özeti",
  "aday_urunler": [
    {"urun_turu": "Ürün Türü", "gerekce": "Açıklama"}
  ]
}`;

const recommenderModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: RECOMMENDER_SYSTEM,
  generationConfig: {
    temperature: 0.7,
    responseMimeType: "application/json",
    maxOutputTokens: 8192,
    thinkingConfig: { thinkingBudget: 0 },
  },
});

// ── 2. Model: Doğrulayıcı / Hakem (Evaluator) ──────────────────────────────
const EVALUATOR_SYSTEM = `Role: Sen bir e-ticaret ürün doğrulama ve mantık hakemisin. Görevin, ilk aşamada üretilen aday ürünlerin, kullanıcının orijinal amacına %100 uygun olup olmadığını denetlemek ve halüsinasyonları elemektir.

Constraints:
- Acımasız ol. Doğrudan hedefi desteklemeyen veya e-ticaret deneyiminde kullanıcının kafasını karıştıracak yan/alakasız ürünleri ele (Örn: Yayıncı olmak isteyene bisiklet koltuğu önermek kesinlikle REDDEDİLMELİDİR).
- Çıktıyı başka hiçbir metin eklemeden SADECE şu JSON formatında ver:
[
  {"urun_turu": "Gelen ürün türü", "durum": "ONAYLANDI" veya "REDDEDİLDİ", "gerekce": "Neden"}
]`;

const evaluatorModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: EVALUATOR_SYSTEM,
  generationConfig: {
    temperature: 0.0,
    responseMimeType: "application/json",
    maxOutputTokens: 8192,
    thinkingConfig: { thinkingBudget: 0 },
  },
});


// ══════════════════════════════════════════════════════════════════════════════
// ANA PİPELINE FONKSİYONU
// ══════════════════════════════════════════════════════════════════════════════

/**
 * İki aşamalı akıllı alışveriş danışmanı pipeline'ı.
 *
 * Aşama 1 (Recommender): Kullanıcının problemini analiz eder → aday ürün listesi üretir.
 * Aşama 2 (Evaluator):   Aday ürünleri mantık süzgecinden geçirir → sadece onaylananları döndürür.
 *
 * @param {string} userPrompt - Kullanıcının problemi veya ihtiyacı (doğal dil).
 * @returns {Promise<string[]>} Onaylanan ürün türlerinin listesi.
 */
async function antigravityShoppingPipeline(userPrompt) {
  console.log("=".repeat(70));
  console.log(`🛒 Kullanıcı İsteği: "${userPrompt}"`);
  console.log("=".repeat(70));

  // ─────────────────────────────────────────────────────────────────────────
  // AŞAMA 1: ÖNERİ MOTORU (Recommender)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("\n🔹 AŞAMA 1: Öneri Motoru çalışıyor...");

  let recommenderData;
  try {
    const result = await recommenderModel.generateContent(userPrompt);
    const rawText = result.response.text();
    console.log(`   ✅ Recommender ham çıktı:\n   ${rawText.slice(0, 500)}`);

    recommenderData = JSON.parse(rawText);
  } catch (e) {
    console.error(`   ❌ Recommender hatası: ${e.message}`);
    return [];
  }

  const kullaniciAmaci = recommenderData.kullanici_amaci || "Bilinmiyor";
  const adayUrunler    = recommenderData.aday_urunler    || [];

  console.log(`   📌 Tespit Edilen Amaç: ${kullaniciAmaci}`);
  console.log(`   📦 Aday Ürün Sayısı: ${adayUrunler.length}`);
  adayUrunler.forEach((u, i) => {
    console.log(`      ${i + 1}. ${u.urun_turu} — ${u.gerekce}`);
  });

  if (!adayUrunler.length) {
    console.log("   ⚠️ Recommender hiç ürün üretemedi. Pipeline sonlandırılıyor.");
    return [];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AŞAMA 2: DOĞRULAYICI / HAKEM (Evaluator)
  // ─────────────────────────────────────────────────────────────────────────
  console.log("\n🔹 AŞAMA 2: Hakem/Doğrulayıcı çalışıyor...");

  const evaluatorPrompt =
    `Kullanıcının Orijinal İsteği: "${userPrompt}"\n\n` +
    `Recommender'ın Ürettiği Aday Ürünler (JSON):\n` +
    `${JSON.stringify(adayUrunler, null, 2)}\n\n` +
    `Yukarıdaki her bir ürünü kullanıcının orijinal amacına göre değerlendir.`;

  let evaluatorData;
  try {
    const result = await evaluatorModel.generateContent(evaluatorPrompt);
    const rawText = result.response.text();
    console.log(`   ✅ Evaluator ham çıktı:\n   ${rawText.slice(0, 500)}`);

    evaluatorData = JSON.parse(rawText);
  } catch (e) {
    console.error(`   ❌ Evaluator hatası: ${e.message}`);
    console.log("   ⚠️ Fallback: Tüm aday ürünler onaylanmış kabul ediliyor.");
    return adayUrunler.map(u => u.urun_turu);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SONUÇ: Sadece ONAYLANAN ürünleri ayıkla
  // ─────────────────────────────────────────────────────────────────────────
  console.log("\n🔹 SONUÇ: Hakem kararları:");

  const onaylananUrunler = [];
  for (const karar of evaluatorData) {
    const urunTuru = karar.urun_turu || "?";
    const durum    = karar.durum     || "?";
    const gerekce  = karar.gerekce   || "?";

    const icon = durum === "ONAYLANDI" ? "✅" : "❌";
    console.log(`   ${icon} ${urunTuru}: ${durum} — ${gerekce}`);

    if (durum === "ONAYLANDI") {
      onaylananUrunler.push(urunTuru);
    }
  }

  console.log(`\n${"=".repeat(70)}`);
  console.log(`🎯 Nihai Onaylı Ürün Listesi (${onaylananUrunler.length} ürün):`);
  onaylananUrunler.forEach((u, i) => console.log(`   ${i + 1}. ${u}`));
  console.log("=".repeat(70));

  return onaylananUrunler;
}


// ══════════════════════════════════════════════════════════════════════════════
// TEST BLOĞU
// ══════════════════════════════════════════════════════════════════════════════

const testPrompt = "Twitch'te yayın yapmak istiyorum, ne lazım?";

const sonuc = await antigravityShoppingPipeline(testPrompt);

console.log("\n\n📋 Pipeline'dan dönen temiz ürün listesi:");
console.log(sonuc);

// ── Veritabanı Entegrasyonu Örneği (Yorum Satırında) ──────────────────────
//
// Bu listeyi yerel Supabase veritabanında şu şekilde sorgulayabilirsiniz:
//
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
//
// for (const urunTuru of sonuc) {
//   const { data, error } = await supabase
//     .from("products")
//     .select("id, productname, price, sub_category")
//     .ilike("productname", `%${urunTuru}%`)
//     .limit(5);
//
//   console.log(`\n🔍 '${urunTuru}' için DB sonuçları:`);
//   data?.forEach(row => {
//     console.log(`   → ${row.productname} | ${row.price} TL | ${row.sub_category}`);
//   });
// }
