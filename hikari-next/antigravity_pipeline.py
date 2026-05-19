"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  ANTIGRAVITY E-TİCARET AKILLI ALIŞVERİŞ DANIŞMANI                         ║
║  Two-Stage Pipeline: Recommender → Evaluator (Judge/Critic Pattern)        ║
║                                                                            ║
║  Mimari:                                                                   ║
║  ┌────────────────┐     ┌────────────────┐     ┌────────────────┐          ║
║  │  Kullanıcı     │ ──▷ │  1. Model      │ ──▷ │  2. Model      │          ║
║  │  Problemi      │     │  (Recommender) │     │  (Evaluator)   │          ║
║  └────────────────┘     │  temp=0.7      │     │  temp=0.0      │          ║
║                         │  JSON çıktı    │     │  JSON çıktı    │          ║
║                         └────────────────┘     └────────────────┘          ║
║                                                       │                    ║
║                                                       ▼                    ║
║                                                 Onaylanan Ürünler          ║
║                                                 (DB Sorgusu İçin)          ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import google.generativeai as genai

# ══════════════════════════════════════════════════════════════════════════════
# API AYARLARI
# ══════════════════════════════════════════════════════════════════════════════

# API anahtarını ortam değişkeninden veya doğrudan atayarak kullanın
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "BURAYA_API_ANAHTARINIZI_YAZIN")
genai.configure(api_key=GEMINI_API_KEY)

# ── 1. Model: Öneri Motoru (Recommender) ─────────────────────────────────────
# Yaratıcılık için temperature=0.7, çıktı formatı zorunlu JSON
RECOMMENDER_SYSTEM_INSTRUCTION = (
    "Role: Sen bir e-ticaret akıllı alışveriş danışmanısın. "
    "Görevin, kullanıcının belirttiği probleme veya ihtiyaca yönelik "
    "mantıklı ve çözüm odaklı ürün kategorileri/türleri türetmektir.\n\n"
    "Constraints:\n"
    "- Kesinlikle marka/model ismi uydurma, jenerik ürün türleri kullan "
    "(Örn: 'Oyuncu Kulaklığı').\n"
    "- Sadece probleme doğrudan çözüm olacak ürünleri listele.\n"
    "- Çıktıyı başka hiçbir metin eklemeden SADECE şu JSON formatında ver:\n"
    '{\n'
    '  "kullanici_amaci": "isteğin özeti",\n'
    '  "aday_urunler": [\n'
    '    {"urun_turu": "Ürün Türü", "gerekce": "Açıklama"}\n'
    '  ]\n'
    '}'
)

recommender_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=RECOMMENDER_SYSTEM_INSTRUCTION,
    generation_config=genai.GenerationConfig(
        temperature=0.7,
        response_mime_type="application/json",  # JSON çıktı zorunlu
        max_output_tokens=1024,
    ),
)

# ── 2. Model: Doğrulayıcı / Hakem (Evaluator) ──────────────────────────────
# Saf mantık için temperature=0.0, çıktı formatı zorunlu JSON
EVALUATOR_SYSTEM_INSTRUCTION = (
    "Role: Sen bir e-ticaret ürün doğrulama ve mantık hakemisin. "
    "Görevin, ilk aşamada üretilen aday ürünlerin, kullanıcının orijinal "
    "amacına %100 uygun olup olmadığını denetlemek ve halüsinasyonları elemektir.\n\n"
    "Constraints:\n"
    "- Acımasız ol. Doğrudan hedefi desteklemeyen veya e-ticaret deneyiminde "
    "kullanıcının kafasını karıştıracak yan/alakasız ürünleri ele "
    "(Örn: Yayıncı olmak isteyene bisiklet koltuğu önermek kesinlikle "
    "REDDEDİLMELİDİR).\n"
    "- Çıktıyı başka hiçbir metin eklemeden SADECE şu JSON formatında ver:\n"
    '[\n'
    '  {"urun_turu": "Gelen ürün türü", "durum": "ONAYLANDI" veya "REDDEDİLDİ", '
    '"gerekce": "Neden"}\n'
    ']'
)

evaluator_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=EVALUATOR_SYSTEM_INSTRUCTION,
    generation_config=genai.GenerationConfig(
        temperature=0.0,       # Saf mantık — yaratıcılık sıfır
        response_mime_type="application/json",
        max_output_tokens=1024,
    ),
)


# ══════════════════════════════════════════════════════════════════════════════
# ANA PİPELINE FONKSİYONU
# ══════════════════════════════════════════════════════════════════════════════

def antigravity_shopping_pipeline(user_prompt: str) -> list[str]:
    """
    İki aşamalı akıllı alışveriş danışmanı pipeline'ı.

    Aşama 1 (Recommender): Kullanıcının problemini analiz eder → aday ürün listesi üretir.
    Aşama 2 (Evaluator):   Aday ürünleri mantık süzgecinden geçirir → sadece onaylananları döndürür.

    Args:
        user_prompt: Kullanıcının problemi veya ihtiyacı (doğal dil).

    Returns:
        Onaylanan ürün türlerinin listesi (List[str]).
        Hata durumunda boş liste döner.
    """

    print("=" * 70)
    print(f"🛒 Kullanıcı İsteği: \"{user_prompt}\"")
    print("=" * 70)

    # ─────────────────────────────────────────────────────────────────────────
    # AŞAMA 1: ÖNERİ MOTORU (Recommender)
    # ─────────────────────────────────────────────────────────────────────────
    print("\n🔹 AŞAMA 1: Öneri Motoru çalışıyor...")

    try:
        recommender_response = recommender_model.generate_content(user_prompt)
        raw_recommender_text = recommender_response.text
        print(f"   ✅ Recommender ham çıktı:\n   {raw_recommender_text[:500]}")
    except Exception as e:
        print(f"   ❌ Recommender hatası: {e}")
        return []

    # Recommender JSON çıktısını parse et
    try:
        recommender_data = json.loads(raw_recommender_text)
        kullanici_amaci  = recommender_data.get("kullanici_amaci", "Bilinmiyor")
        aday_urunler     = recommender_data.get("aday_urunler", [])
    except json.JSONDecodeError as e:
        print(f"   ❌ Recommender JSON parse hatası: {e}")
        return []

    print(f"   📌 Tespit Edilen Amaç: {kullanici_amaci}")
    print(f"   📦 Aday Ürün Sayısı: {len(aday_urunler)}")
    for i, urun in enumerate(aday_urunler, 1):
        print(f"      {i}. {urun['urun_turu']} — {urun['gerekce']}")

    if not aday_urunler:
        print("   ⚠️ Recommender hiç ürün üretemedi. Pipeline sonlandırılıyor.")
        return []

    # ─────────────────────────────────────────────────────────────────────────
    # AŞAMA 2: DOĞRULAYICI / HAKEM (Evaluator)
    # ─────────────────────────────────────────────────────────────────────────
    print("\n🔹 AŞAMA 2: Hakem/Doğrulayıcı çalışıyor...")

    # Hakem'e gönderilecek birleşik prompt:
    # Kullanıcının orijinal amacı + Recommender'ın ürettiği aday ürün listesi
    evaluator_prompt = (
        f"Kullanıcının Orijinal İsteği: \"{user_prompt}\"\n\n"
        f"Recommender'ın Ürettiği Aday Ürünler (JSON):\n"
        f"{json.dumps(aday_urunler, ensure_ascii=False, indent=2)}\n\n"
        f"Yukarıdaki her bir ürünü kullanıcının orijinal amacına göre değerlendir."
    )

    try:
        evaluator_response = evaluator_model.generate_content(evaluator_prompt)
        raw_evaluator_text = evaluator_response.text
        print(f"   ✅ Evaluator ham çıktı:\n   {raw_evaluator_text[:500]}")
    except Exception as e:
        print(f"   ❌ Evaluator hatası: {e}")
        # Evaluator başarısız olursa, güvenlik adına tüm adayları geçir
        print("   ⚠️ Fallback: Tüm aday ürünler onaylanmış kabul ediliyor.")
        return [u["urun_turu"] for u in aday_urunler]

    # Evaluator JSON çıktısını parse et
    try:
        evaluator_data = json.loads(raw_evaluator_text)
    except json.JSONDecodeError as e:
        print(f"   ❌ Evaluator JSON parse hatası: {e}")
        return [u["urun_turu"] for u in aday_urunler]

    # ─────────────────────────────────────────────────────────────────────────
    # SONUÇ: Sadece ONAYLANAN ürünleri ayıkla
    # ─────────────────────────────────────────────────────────────────────────
    print("\n🔹 SONUÇ: Hakem kararları:")

    onaylanan_urunler = []
    for karar in evaluator_data:
        urun_turu = karar.get("urun_turu", "?")
        durum     = karar.get("durum", "?")
        gerekce   = karar.get("gerekce", "?")

        if durum == "ONAYLANDI":
            icon = "✅"
            onaylanan_urunler.append(urun_turu)
        else:
            icon = "❌"

        print(f"   {icon} {urun_turu}: {durum} — {gerekce}")

    print(f"\n{'=' * 70}")
    print(f"🎯 Nihai Onaylı Ürün Listesi ({len(onaylanan_urunler)} ürün):")
    for i, u in enumerate(onaylanan_urunler, 1):
        print(f"   {i}. {u}")
    print("=" * 70)

    return onaylanan_urunler


# ══════════════════════════════════════════════════════════════════════════════
# TEST BLOĞU
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":

    # ── Test Senaryosu ────────────────────────────────────────────────────────
    test_prompt = "Twitch'te yayın yapmak istiyorum, ne lazım?"

    sonuc = antigravity_shopping_pipeline(test_prompt)

    print("\n\n📋 Pipeline'dan dönen temiz ürün listesi:")
    print(sonuc)
    # Örnek çıktı: ['Oyuncu Kulaklığı', 'USB Mikrofon', 'Web Kamerası', 'Yeşil Perde']

    # ── Veritabanı Entegrasyonu Örneği (Yorum Satırında) ──────────────────────
    #
    # Bu listeyi yerel bir veritabanında (PostgreSQL, SQLite, Supabase vb.)
    # SQL LIKE sorgusuyla şu şekilde aratabilirsiniz:
    #
    # import sqlite3  # veya psycopg2, supabase-py vb.
    #
    # conn = sqlite3.connect("products.db")
    # cursor = conn.cursor()
    #
    # for urun_turu in sonuc:
    #     # Her onaylı ürün türünü veritabanında ilike/LIKE ile aratıyoruz
    #     cursor.execute(
    #         "SELECT id, productname, price, category FROM products WHERE productname LIKE ?",
    #         (f"%{urun_turu}%",)
    #     )
    #     rows = cursor.fetchall()
    #     print(f"\n🔍 '{urun_turu}' için DB sonuçları:")
    #     for row in rows:
    #         print(f"   → ID:{row[0]} | {row[1]} | {row[2]} TL | Kat: {row[3]}")
    #
    # conn.close()
    #
    # ── Supabase ile Kullanım Örneği ──────────────────────────────────────────
    #
    # from supabase import create_client
    #
    # supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    #
    # for urun_turu in sonuc:
    #     response = (
    #         supabase_client
    #         .table("products")
    #         .select("id, productname, price, sub_category")
    #         .ilike("productname", f"%{urun_turu}%")
    #         .limit(5)
    #         .execute()
    #     )
    #     print(f"\n🔍 '{urun_turu}' Supabase sonuçları:")
    #     for row in response.data:
    #         print(f"   → {row['productname']} | {row['price']} TL")
