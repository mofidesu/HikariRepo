import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const PLANNER_MODELS   = ['gemini-2.5-flash', 'gemini-2.0-flash'];
const RESPONDER_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];
const VALIDATOR_MODEL  = 'gemini-2.5-flash';

let plannerCooldowns   = {};
let responderCooldowns = {};
let preferredPlanner   = 'gemini-2.5-flash';
let preferredResponder = 'gemini-2.5-flash';

// ── Gemini Çağrı Yardımcısı ─────────────────────────────────────────────────
async function callGemini({ apiKey, models, cooldowns, getPreferred, setPreferred, body, label }) {
  const now = Date.now();
  const preferred = getPreferred();

  const sorted = [...models].sort((a, b) => {
    const cA = cooldowns[a] || 0, cB = cooldowns[b] || 0;
    const dA = cA > now, dB = cB > now;
    if (!dA && !dB) { if (a === preferred) return -1; if (b === preferred) return 1; return 0; }
    if (!dA &&  dB) return -1;
    if ( dA && !dB) return  1;
    return cA - cB;
  });

  for (const model of sorted) {
    try {
      console.log(`[${label}] Trying: ${model}`);
      const res  = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      const data = await res.json();
      if (res.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) { setPreferred(model); cooldowns[model] = 0; return { ok: true, text }; }
      } else {
        console.warn(`[${label}] ${model} → ${res.status}`);
        if (res.status === 429 || res.status >= 500) cooldowns[model] = Date.now() + 60_000;
      }
    } catch (e) {
      console.error(`[${label}] ${model} exception:`, e.message);
      cooldowns[model] = Date.now() + 60_000;
    }
  }
  return { ok: false };
}

// ── Görsel Doğrulama (Gemini Vision) ────────────────────────────────────────
async function validateWithImages(products, userQuery, apiKey) {
  if (!products.length) return products;

  const TIMEOUT = 4_000;
  const pool    = products.slice(0, 5);

  const fetchImg = async (url) => {
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!r.ok) return null;
      const buf  = await r.arrayBuffer();
      const mime = (r.headers.get('content-type') || 'image/jpeg').split(';')[0];
      return { base64: Buffer.from(buf).toString('base64'), mimeType: mime };
    } catch { clearTimeout(timer); return null; }
  };

  const imgs = await Promise.allSettled(pool.map(p => fetchImg(p.imgUrl)));
  const pairs = pool
    .map((p, i) => ({ p, img: imgs[i].status === 'fulfilled' ? imgs[i].value : null }))
    .filter(x => x.img);

  if (!pairs.length) return products;

  const parts = [
    { text: `Kullanıcı isteği: "${userQuery}"\n\nBu ürün görsellerini incele. Kullanıcı bir yetişkin. Eğer görselde açıkça çocuk/bebek ürünü görünüyorsa veya ürün kullanıcının isteğiyle hiç uyumlu değilse "keep": false yap. Sadece JSON döndür:\n{"v":[{"id":"ID","keep":true/false}]}` }
  ];
  pairs.forEach(({ p, img }) => {
    parts.push({ text: `ID:${p.id} — ${p.productname}` });
    parts.push({ inlineData: { mimeType: img.mimeType, data: img.base64 } });
  });

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${VALIDATOR_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 512, temperature: 0 }
        })
      }
    );
    if (!res.ok) return products;
    const data = await res.json();
    const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return products;

    const parsed   = JSON.parse(raw);
    const removeIds = new Set(parsed.v.filter(x => !x.keep).map(x => String(x.id)));
    console.log(`[Validator] Removed IDs: ${[...removeIds].join(', ') || 'none'}`);
    return products.filter(p => !removeIds.has(String(p.id)));
  } catch (e) {
    console.error('[Validator] Error:', e.message);
    return products;
  }
}

// ── Ürün Arama (Planner JSON → Supabase) ────────────────────────────────────
async function searchProducts(planItems, userQuery) {
  if (!planItems?.length) return [];

  const uqLower = userQuery.toLowerCase().replace(/[.,?!]/g, '');
  const uqWords = uqLower.split(' ').filter(w => w.length > 3);

  // Yetişkin niyet tespiti — çocuk/bebek ürünlerini filtrele
  const ADULT_KW = ['erkek', 'kadın', 'halısaha', 'spor', 'futbol', 'maç', 'antrenman', 'koşu', 'fitness', 'plaj', 'tatil', 'ofis', 'iş'];
  const CHILD_KW = ['bebek', 'çocuk', 'oyuncak'];
  const isAdult = ADULT_KW.some(k => uqLower.includes(k));
  const isChild = CHILD_KW.some(k => uqLower.includes(k));

  const POLLUTION = ['boya', 'boyası', 'kılıf', 'kılıfı', 'koruyucu', 'tutucu', 'stand', 'aparat', 'yedek', 'parça', 'şarj', 'kablo', 'fırça', 'maket', 'kordon', 'kayış', 'sprey', 'pompa'];

  const results = [];

  for (const item of planItems) {
    const { mainCat = '', subCat = '', keyword = '', description = '' } = item;
    if (!keyword.trim()) continue;

    let matches = [];

    // 1. Kategori + keyword
    if (mainCat && subCat) {
      const { data: cats } = await supabase.from('categories').select('id')
        .ilike('main_category', mainCat).ilike('sub_category', subCat).limit(1);
      const catId = cats?.[0]?.id;
      if (catId) {
        const { data } = await supabase.from('products').select('*')
          .eq('category_id', catId).ilike('productname', `%${keyword}%`).limit(5);
        if (data?.length) matches = data;
      }
    }

    // 2. Global fallback
    if (matches.length < 3) {
      const { data } = await supabase.from('products').select('*')
        .ilike('productname', `%${keyword}%`).limit(12);
      if (data?.length) {
        const tgtMain = mainCat.toLowerCase();
        const extra = data.filter(g => {
          const gM = (g.main_category || '').toLowerCase();
          const gS = (g.sub_category  || '').toLowerCase();
          const gN = (g.productname   || '').toLowerCase();
          if (tgtMain && (gM.includes(tgtMain) || tgtMain.includes(gM))) return true;
          if (uqWords.some(w => gN.includes(w) || gM.includes(w) || gS.includes(w))) return true;
          if ((tgtMain.includes('elektronik') || tgtMain.includes('bilgisayar')) &&
              (gM.includes('elektronik') || gS.includes('elektronik'))) return true;
          const far = ['bisiklet', 'oto', 'yapı market', 'petshop', 'bahçe'];
          if (far.some(c => gM.includes(c) || gS.includes(c))) return false;
          return true;
        });
        const ids = new Set(matches.map(m => m.id));
        matches = [...matches, ...extra.filter(g => !ids.has(g.id))].slice(0, 5);
      }
    }

    // 3. Yetişkin filtresi
    if (isAdult && !isChild) {
      matches = matches.filter(p => {
        const n = (p.productname || '').toLowerCase();
        const s = (p.sub_category  || '').toLowerCase();
        return !n.includes('bebek') && !n.includes('çocuk') &&
               !s.includes('bebek') && !s.includes('çocuk');
      });
    }

    // 4. Smart Scoring
    const kwL   = keyword.toLowerCase();
    const descL = description.toLowerCase();
    const tWords = descL.split(' ').filter(w => w.length > 2);
    const activePoll = POLLUTION.filter(pw => !kwL.includes(pw) && !descL.includes(pw) && !uqLower.includes(pw));

    matches = matches.map(p => {
      let score = 0;
      const pN = (p.productname || '').toLowerCase();
      const pW = pN.split(/[\s-]+/);
      tWords.forEach(tw => { if (pN.includes(tw)) score += 5; });
      if (pN.includes(kwL)) score += 10;
      if (activePoll.some(pw => pW.includes(pw) || pN.endsWith(pw))) score -= 50;
      const last = pW[pW.length - 1]?.replace(/[^a-zğüşöçı]/g, '') || '';
      if (last.includes(kwL) || tWords.some(tw => last.includes(tw))) score += 20;
      return { ...p, _score: score };
    }).filter(p => p._score > 0).sort((a, b) => b._score - a._score);

    results.push(...matches);
  }

  const seen = new Set();
  return results.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
}

// ── Anahtar Kelime Tabanlı Fallback Arama (Planner başarısız olursa) ─────────
async function keywordFallbackSearch(userText) {
  const stopWords = new Set(['bir','ve','de','da','için','çok','mi','mı','var','yok','bul','öner','lazım','istiyorum','benim','senin','ile','en','daha','bu','şu','ne','nasıl','neden','kim','bana','bunu']);
  const words = userText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-`~()?]/g, '').split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w)).slice(0, 6);

  if (!words.length) return { primary: [], secondary: [] };

  const results = await Promise.allSettled(words.map(async kw => {
    const { data } = await supabase.from('products').select('*')
      .ilike('productname', `%${kw}%`).limit(5);
    return data || [];
  }));

  const flat = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
  const seen = new Set();
  const unique = flat.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });

  return { primary: unique.slice(0, 3), secondary: unique.slice(3, 7) };
}

// ── Responder Başarısız → Anlamlı Fallback Yanıt ────────────────────────────
function buildFallbackText(planData, primary, secondary) {
  if (planData && !planData.storeHasProducts) {
    return `${planData.noStoreReason || 'Bu ihtiyacı karşılayacak ürün mağazamızda bulunmuyor.'} Başka bir konuda yardımcı olabilir miyim?`;
  }
  const intent = planData?.intent || 'isteğin';
  let text = `**${intent}** için mağazamızdan öneriler:\n\n`;
  if (primary.length)   { text += `🎯 **Öncelikli İhtiyacın:**\n- ${primary[0].productname}\n\n`; }
  if (secondary.length) { text += `✨ **Bunlar da Lazım Olabilir:**\n${secondary.slice(0,3).map(p => `- ${p.productname}`).join('\n')}`; }
  if (!primary.length && !secondary.length) {
    text = `"${intent}" için mağazamızda şu an uygun ürün bulunamadı. Farklı bir arama deneyin!`;
  }
  return text;
}

// ── Sistem Promptları ────────────────────────────────────────────────────────
const PLANNER_PROMPT = `Sen HIKARI e-ticaret mağazasının ürün planlama motorusun. Kullanıcının mesajını analiz et ve JSON plan üret.

HIKARI KATEGORİLERİ:
Kadın > Giyim|Ayakkabı|Aksesuar & Çanta|Ev & İç Giyim
Erkek > Giyim|Ayakkabı|Saat & Aksesuar|İç Giyim|Çanta
Spor & Outdoor > Spor Üst Giyim|Spor Alt Giyim|Spor Ayakkabı|Spor Malzemeleri
Elektronik > Giyilebilir Teknoloji|Telefon|Bilgisayar|Küçük Ev Aletleri
Kozmetik > Cilt Bakımı|Saç Bakımı|Makyaj|Parfüm
Kitap & Kırtasiye > Roman|Kalem|Defter|Çakmak Ürünleri
Süpermarket > Gıda|Ev & Temizlik
Ev & Yaşam > Ev Tekstili|Mutfak Gereçleri|Mobilya

KURALLAR:
1. Her türlü ihtiyacı geniş düşün (spor, giyim, gıda, bakım, elektronik, kırtasiye...).
2. Problem söylüyorsa (kokuyorum, acıktım, üşüdüm vb.) mağazadaki ürünle çöz.
3. Mağazayla alakasız ise storeHasProducts:false, noStoreReason doldur.
4. primary: en acil 1-2 ürün. secondary: tamamlayıcı 2-3 ürün.
5. keyword: tek Türkçe kelime.
SADECE JSON döndür:
{"intent":"kısa niyet","storeHasProducts":true,"noStoreReason":"","primary":[{"mainCat":"","subCat":"","keyword":"","description":""}],"secondary":[{"mainCat":"","subCat":"","keyword":"","description":""}]}`;

function buildResponderPrompt(planData, primary, secondary) {
  const hasProds = primary.length > 0 || secondary.length > 0;
  const prodCtx = hasProds
    ? '\nVERİTABANINDAN DOĞRULANMIŞ ÜRÜNLER (bunlara odaklan):\n' +
      [...primary.map(p => `  [ANA] ${p.productname} — ${p.sub_category} — ${p.price} TL`),
       ...secondary.map(p => `  [YAN] ${p.productname} — ${p.sub_category} — ${p.price} TL`)].join('\n')
    : '';
  const noStoreNote = planData && !planData.storeHasProducts
    ? `\nÖNEMLİ: Bu ihtiyaç mağazamızda karşılanamaz. Kibarca açıkla: "${planData.noStoreReason || ''}". Ürün önerme.`
    : '';

  return `Sen HIKARI mağazasının yardımsever tezgahtarısın. Her türlü ihtiyaç için — spor, giyim, kozmetik, gıda, elektronik, ev — samimi ve kısa yanıt verirsin. Robotik değil, içten konuş. Daima Türkçe. Yanıt yapısı:
🎯 **Öncelikli İhtiyacın:** - (ana ürün)
✨ **Bunlar da Lazım Olabilir:** - (yan ürünler)
${prodCtx}${noStoreNote}`;
}

// ── Ana Handler ──────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { messages } = await req.json();
    const key1 = process.env.GEMINI_API_KEY;
    const key2 = process.env.GEMINI_API_KEY_2 || key1;

    if (!key1) return NextResponse.json({ error: 'GEMINI_API_KEY eksik.' }, { status: 500 });

    let contents = messages
      .filter(m => !m.isLoading)
      .map(m => {
        const parts = [];
        if (m.image) parts.push({ inlineData: { mimeType: m.image.mimeType, data: m.image.base64Data } });
        if (m.text)  parts.push({ text: m.text });
        return { role: m.sender === 'user' ? 'user' : 'model', parts };
      });

    if (contents[0]?.role === 'model') contents.shift();
    if (!contents.length) return NextResponse.json({ text: 'Merhaba! Nasıl yardımcı olabilirim?', primaryProducts: [], secondaryProducts: [] });

    const lastUserText = messages.filter(m => m.sender === 'user').pop()?.text || '';

    // ── AŞAMA 1: PLANNER ────────────────────────────────────────────────────
    let planData  = null;
    let primary   = [];
    let secondary = [];

    const planResult = await callGemini({
      apiKey: key1, models: PLANNER_MODELS, cooldowns: plannerCooldowns,
      getPreferred: () => preferredPlanner, setPreferred: m => { preferredPlanner = m; },
      body: {
        contents: [{ role: 'user', parts: [{ text: lastUserText }] }],
        systemInstruction: { parts: [{ text: PLANNER_PROMPT }] },
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 8192,
          temperature: 0.1,
          thinkingConfig: { thinkingBudget: 0 }
        }
      },
      label: 'Planner'
    });

    if (planResult.ok) {
      try {
        planData = JSON.parse(planResult.text);
        console.log('[Planner] OK:', planData.intent, '| storeHas:', planData.storeHasProducts);

        if (planData.storeHasProducts !== false) {
          // ── AŞAMA 2a: DB ARAMASI ───────────────────────────────────────────
          [primary, secondary] = await Promise.all([
            searchProducts(planData.primary  || [], lastUserText),
            searchProducts(planData.secondary || [], lastUserText)
          ]);
          console.log(`[DB] primary:${primary.length} secondary:${secondary.length}`);

          // ── AŞAMA 2b: GÖRSEL DOĞRULAMA ─────────────────────────────────────
          // key2 kullanılır (ayrı key varsa kota baskısı azalır)
          [primary, secondary] = await Promise.all([
            validateWithImages(primary,   lastUserText, key2),
            validateWithImages(secondary, lastUserText, key2)
          ]);
          console.log(`[Validator] After: primary:${primary.length} secondary:${secondary.length}`);

          // -- ASAMA 2c: CINSIYET / DEMOGRAFIK FILTRE ---
          const uq = lastUserText.toLowerCase();
          const wantsKadin  = uq.includes('kad\u0131n') || uq.includes('kadin') || uq.includes('bayan');
          const wantsErkek  = (uq.includes('erkek') && !uq.includes('erkek \u00e7ocuk') && !uq.includes('erkek cocuk'));
          const wantsCocuk  = uq.includes('\u00e7ocuk') || uq.includes('cocuk') || uq.includes('bebek');

          const genderFilter = (products) => {
            if (!wantsKadin && !wantsErkek && !wantsCocuk) return products;
            return products.filter(p => {
              const all = `${(p.productname||'').toLowerCase()} ${(p.main_category||'').toLowerCase()} ${(p.sub_category||'').toLowerCase()}`;
              if (wantsKadin) {
                if (all.includes('erkek') && !all.includes('kad\u0131n')) return false;
                if (all.includes('bebek') || (all.includes('\u00e7ocuk') && !uq.includes('\u00e7ocuk'))) return false;
              }
              if (wantsErkek) {
                if (all.includes('kad\u0131n') || all.includes('bayan')) return false;
                if (all.includes('bebek') || (all.includes('\u00e7ocuk') && !uq.includes('\u00e7ocuk'))) return false;
              }
              if (wantsCocuk) {
                if (!all.includes('\u00e7ocuk') && !all.includes('bebek') && !all.includes('cocuk')) return false;
              }
              return true;
            });
          };
          primary   = genderFilter(primary);
          secondary = genderFilter(secondary);
          console.log(`[GenderFilter] primary:${primary.length} secondary:${secondary.length}`);

          // -- ASAMA 2d: KOMBIN BUTUNLUGU ---
          const isKombin = uq.includes('kombin') || uq.includes('outfit');
          if (isKombin) {
            const allProds = [...primary, ...secondary];
            const allText  = allProds.map(p => `${(p.productname||'')} ${p.sub_category||''}`).join(' ').toLowerCase();

            const hasUst  = /ti\u015f\u00f6rt|bluz|g\u00f6mlek|kazak|ceket|mont|elbise|forma|sweat|hoodie|tunik|crop|atlet|\u00fcst giyim/i.test(allText);
            const hasAlt  = /pantolon|\u015fort|etek|tayt|jean|e\u015fofman|bermuda|jogger|alt giyim/i.test(allText);
            const hasAyak = /ayakkab\u0131|sneaker|bot|\u00e7izme|sandalet|terlik|krampon|babet|topuklu|loafer/i.test(allText);

            const fetchPart = async (kw) => {
              const { data } = await supabase.from('products').select('*').ilike('productname', `%${kw}%`).limit(6);
              return genderFilter(data || []).slice(0, 2);
            };

            const missing = [];
            if (!hasUst)  { missing.push(...await fetchPart(wantsKadin ? 'bluz' : 'ti\u015f\u00f6rt')); console.log('[Kombin] Ust eksik, eklendi.'); }
            if (!hasAlt)  { missing.push(...await fetchPart(wantsKadin ? 'etek' : '\u015fort'));   console.log('[Kombin] Alt eksik, eklendi.'); }
            if (!hasAyak) { missing.push(...await fetchPart(wantsKadin ? 'sandalet' : 'ayakkab\u0131')); console.log('[Kombin] Ayakkabi eksik, eklendi.'); }

            if (missing.length) {
              const ids = new Set(allProds.map(p => p.id));
              secondary = [...secondary, ...missing.filter(p => !ids.has(p.id))];
              console.log(`[Kombin] ${missing.filter(p => !ids.has(p.id)).length} eksik parca eklendi.`);
            }
          }
        }
      } catch (e) {
        console.error('[Planner] JSON parse error:', e.message);
      }
    } else {
      // Planner başarısız → keyword fallback
      console.warn('[Planner] All models failed, running keyword fallback search...');
      const fallback = await keywordFallbackSearch(lastUserText);
      primary   = fallback.primary;
      secondary = fallback.secondary;
    }

    // ── AŞAMA 3: RESPONDER ───────────────────────────────────────────────────
    const respResult = await callGemini({
      apiKey: key2, models: RESPONDER_MODELS, cooldowns: responderCooldowns,
      getPreferred: () => preferredResponder, setPreferred: m => { preferredResponder = m; },
      body: {
        contents,
        systemInstruction: { parts: [{ text: buildResponderPrompt(planData, primary, secondary) }] },
        generationConfig: { maxOutputTokens: 8192, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',        threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',  threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT',  threshold: 'BLOCK_NONE' }
        ]
      },
      label: 'Responder'
    });

    const text = respResult.ok ? respResult.text : buildFallbackText(planData, primary, secondary);

    return NextResponse.json({ text, primaryProducts: primary, secondaryProducts: secondary });

  } catch (e) {
    console.error('[Hikai] Fatal:', e);
    return NextResponse.json({ error: 'Hikai şu anda yanıt veremiyor, lütfen tekrar deneyin.' }, { status: 500 });
  }
}
