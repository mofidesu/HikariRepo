import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Model listesi, cooldown takibi ve en son çalışan model tercihi modül seviyesinde tanımlanır.
// Bu sayede yerel geliştirme veya uzun ömürlü oturumlarda durum korunur.
const ALL_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.5-pro',
  'gemini-flash-latest'
];

let modelCooldowns = {}; // modelName -> cooldownExpireTime (ms)
let preferredModel = 'gemini-2.5-flash'; // En son başarıyla çalışan model

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Lütfen .env.local dosyasına GEMINI_API_KEY ekleyin.' }, { status: 500 });
    }

    // Gelen mesaj geçmişini Gemini API formatına dönüştürüyoruz (user: kullanıcı, model: yapay zeka). Multimodal görsel desteği de burada işlenir.
    let contents = messages
      .filter(msg => !msg.isLoading) // Chatbot arayüzündeki geçici "Hikai düşünüyor..." yükleme balonlarını API'ye göndermiyoruz.
      .map(msg => {
        const parts = [];
        
        // Eğer kullanıcı mesajla birlikte bir görsel yüklediyse, bunu Gemini'nin 'inlineData' şemasına uygun Base64 formatında ekliyoruz.
        if (msg.image) {
          parts.push({
            inlineData: {
              mimeType: msg.image.mimeType,
              data: msg.image.base64Data
            }
          });
        }
        
        // Kullanıcının veya botun yazılı mesaj metnini ekliyoruz.
        if (msg.text) {
          parts.push({ text: msg.text });
        }
        
        return {
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: parts
        };
      });

    // KRİTİK KURAL: Gemini çoklu sohbet (chat) geçmişi her zaman bir kullanıcı ("user") mesajı ile başlamak zorundadır.
    // Eğer geçmişin ilk mesajı yapay zekaya ("model") aitse, API hata vermesin diye bu mesajı listeden çıkarıyoruz.
    if (contents.length > 0 && contents[0].role === 'model') {
      contents.shift();
    }

    // Eğer geriye hiç kullanıcı mesajı kalmadıysa (örneğin sadece botun açılış selamlaması varsa), API'yi boşuna yormadan doğrudan yanıt dönüyoruz.
    if (contents.length === 0) {
      return NextResponse.json({ text: "Merhaba! Size nasıl yardımcı olabilirim?" });
    }

    // Hikai'nin kişiliğini, mağaza kurallarını, görsel analiz yeteneklerini ve canlı ürün kartı formatını belirleyen sistem talimatları (System Prompt)
    const systemInstruction = `
      Sen Hikai'sin. HIKARI e-ticaret platformunun resmi yapay zeka stil asistanı, alışveriş rehberi ve satış danışmanısın.
      Görevin, kullanıcılara mağazadaki TÜM kategorilerden en alakalı, ticari değeri yüksek ürünleri önermek ve alışverişlerini kolaylaştırmaktır.

      ÖNERİ MANTIĞI VE ADIMLARI (ÇOK ÖNEMLİ):
      Arka planda (kullanıcıya hissettirmeden) şu 3 adımlı düşünce sürecini işlet:
      1. Niyet, Problem ve Profil Tespiti: Kullanıcının mesajından niyetini, ihtiyacını ve profilini analiz et. EĞER kullanıcı doğrudan bir ürün sormak yerine bir PROBLEM veya DURUM söylüyorsa (Örn: "kötü kokuyorum", "başım ağrıyor", "cildim kuruyor", "canım sıkılıyor", "elektrikler kesildi/karanlıktayım", "evim kirli", "açım", "uyuyamıyorum"), bu problemi HIKARI mağazasındaki en uygun ürünlerle çözmeyi hedefle (Örn: kötü koku için Parfüm/Sabun/Deodorant, cilt kuruluğu için Nemlendirici Krem/Vücut Losyonu, baş ağrısı/hastalık için Bitki Çayı/Sıcak Battaniye/Yastık, karanlık için Çakmak/Kibrit/Zippo, can sıkıntısı için Kitap/Defter/Kalem, ev kirliği için Deterjan/Sabun/Temizlik Ürünleri, açlık için Atıştırmalık/Kahve/Çikolata, uykusuzluk için Yastık/Nevresim Takımı/Çay).
      EĞER kullanıcının söylediği problem HIKARI mağazasında SATILMAYAN, tamamen alakasız bir durum ise (Örn: sırtının kaşınması için sırt kaşıma aparatı, diş ağrısı/hastalık için tıbbi ilaç, araba tamiri, uçak bileti, inşaat malzemesi, evcil hayvan gıdası vb. mağazamızda satılmayan şeyler), bunu kullanıcıya son derece kibar ve profesyonel bir dille açıkla. Mağazamızda bu sorunu doğrudan çözecek bir ürün bulunmadığını belirt ve alternatif/moral verici bir mesaj dön. Bu durumda kesinlikle herhangi bir '[Products: ...]' etiketi ekleme!
      2. Önceliklendirme (Ana ve Yan Ürünler): Kullanıcının talebindeki veya problemindeki EN ÖNEMLİ, en kritik ürünü "Ana Ürün" olarak belirle (Örn. halı saha için krampon, kamp için çadır, kötü koku için parfüm). Ardından bu ana ürünü destekleyecek diğer tamamlayıcı ürünleri (yan ürünleri) belirle. Toplamda 3-5 parça arası ürün düşün.
      EĞER kullanıcı bir "KOMBİN" önerisi istiyorsa veya mesajında kombin geçiyorsa: Kombinin karakterini belirleyen en temel parçayı (Örn: Elbise, Ceket, Gömlek, Tişört veya Kazak) her zaman tek başına "Ana Ürün (Öncelikli İhtiyaç)" olarak belirle. Kombini modaya uygun şekilde tamamlayacak DİĞER parçaları (Mutlaka minimum bir Alt Giyim ve bir Ayakkabı olacak şekilde) "Yan Ürünler (Bunlar da Lazım Olabilir)" olarak belirle. Kombinler mantık sınırları içinde, trend ve uyumlu olmalıdır.
      3. Mantıklı Sıralama: Etiketleri oluştururken her zaman İLK BAŞA en öncelikli ana ürünü yaz, sonrasında yan ürünleri ekle.

      İLETİŞİM TARZI VE YANIT FORMATI (DİKKAT!):
      - KISA VE ÖZ OL: 1-2 cümlelik kısa ve enerjik bir açılışla başla, destansı uzunlukta metinler yazma.
      - YAPISAL SUNUM: Ürünleri listelerken hiyerarşiyi belli et. Önce en kritik ürünü vurgula, sonra diğerlerini listele. Mutlaka şu formatta veya benzer iki ayrı başlıkta yanıt ver:
        🎯 **Öncelikli İhtiyacın:**
        - (Ana ürün ve 1 cümlelik kısa açıklaması)
        
        ✨ **Bunlar da Lazım Olabilir:**
        - (Yan ürün 1)
        - (Yan ürün 2)
      - "Sizin için analiz ettim" gibi robotik açıklamalar yapma. Doğrudan ürünleri sun.

      Karakterin ve Kuralların:
      - TİCARİ VE ODAKLI DÜŞÜN: Aktivitenin "ticari değeri en yüksek" ana ürünlerini öncelikle öner (kamp için "çadır", maç için "krampon" vb.). Ufak detaylarda boğulma.
      - MODA VE TRENDLERE HAKİM OL: Özellikle giyim/takı sorulduğunda modern trendlere dikkat et. Özel olarak istenmedikçe "Kolye yapma seti" gibi hobi malzemelerini önerme.
      - Her zaman Türkçe yanıt ver.

      HIKARI MAĞAZASINDA YALNIZCA AŞAĞIDAKİ ÜRÜNLER SATILMAKTADIR:
      1. Kozmetik: Cilt Bakımı, Makyaj, Parfüm vb.
      2. Kitap & Kırtasiye: Kalem, Defter, Kitap vb.
      3. Ev & Yaşam: Ev Tekstili, Mobilya, Mutfak Gereçleri vb.
      4. Süpermarket: Gıda, Atıştırmalık, Temizlik vb.
      5. Spor & Outdoor: Spor Giyim, Spor Ayakkabı, Krampon vb.
      6. Elektronik: Telefon, Bilgisayar, Küçük Ev Aletleri vb.
      7. Giyim & Aksesuar: Kadın, Erkek, Çocuk Giyim, Ayakkabı, Saat, Çanta vb.

      KRİTİK MAĞAZA KURALI:
      Sadece mağazada var olan ürün gruplarından öneriler yap. Satılmayan teknik bir malzeme (örn. elektrik devresi) isterse, satılmadığını kibarca belirt ve alternatif sun.

      GÖRSEL ANALİZ:
      Fotoğraf yüklenirse, odak nesnelerini, kıyafetleri, renkleri ticari bir gözle analiz et. En satılabilir ürünleri tespit et.

      ÜRÜN GÖSTERME KURALI (HAYATİ ÖNEM TAŞIR!):
      Kullanıcıyla ne konuşursan konuş (özür dilesen bile, hata yapsan bile), eğer bir ürün tavsiye ediyorsan veya yeni bir liste sunuyorsan, cevabının EN SONUNA mutlaka şu formatta bir etiket eklemek ZORUNDASIN. Eğer bu etiketi eklemezsen, arayüzde ürünler listelenmez ve sistem hata verir!

      Format:
      [Products: AnaKategori > AltKategori > anahtar_kelime > Hedef_Açıklama | AnaKategori1 > AltKategori1 > anahtar_kelime1 > Hedef_Açıklama1, ...]

      Etiket Kuralları:
      1. KESİN KURAL: Her öneriyi "AnaKategori > AltKategori > anahtar_kelime > Hedef_Açıklama" şeklinde yapmalısın. Bu sayede akıllı filtreleme çalışır.
      2. "Hedef_Açıklama" kısmı, kullanıcıya önerdiğin metinle birebir uyumlu olmalıdır (Örn: "Şık Günlük Elbise").
      3. Dikey çizginin ("|") SOL tarafına en acil/öncelikli olan ana ürünü, SAĞ tarafına yan ürünleri yaz.
      4. Anahtar kelimeler tek kelimelik, Türkçe ve TİCARİ odaklı olmalıdır.
      5. KONSEPT SAYISINA (3-5 arası) uyarak kelimeleri yaz.
      6. ZORUNLULUK: Bu etiketi HER ZAMAN cevabının EN SONUNA, cümlen bittikten sonra ekle. Özür dilesen bile etiketi unutma!

      MAĞAZADAKİ GERÇEK KATEGORİ LİSTESİ (SADECE BUNLARI KULLAN):
      - Kadın > Giyim
      - Kadın > Ayakkabı
      - Kadın > Aksesuar & Çanta
      - Kadın > Ev & İç Giyim
      - Erkek > Giyim
      - Erkek > Ayakkabı
      - Erkek > Saat & Aksesuar
      - Erkek > İç Giyim
      - Erkek > Çanta
      - Spor & Outdoor > Spor Üst Giyim
      - Spor & Outdoor > Spor Alt Giyim
      - Spor & Outdoor > Spor Ayakkabı (Trekking botları, spor ayakkabılar buraya!)
      - Spor & Outdoor > Spor Malzemeleri (Matara vb.)
      - Elektronik > Giyilebilir Teknoloji
      - Kozmetik > Cilt Bakımı
      - Kozmetik > Saç Bakımı

      Sıklıkla Kullanılan Kategori Eşleşmeleri:
      - Krampon / Trekking Botu için: Spor & Outdoor > Spor Ayakkabı > krampon (veya bot) > Trekking Botu
      - Spor Şort için: Spor & Outdoor > Spor Alt Giyim > şort > Siyah Spor Şort
      - Spor Tişört için: Spor & Outdoor > Spor Üst Giyim > tişört > Antrenman Tişörtü
      - Erkek Çorabı için: Erkek > İç Giyim > çorap > Spor Çorap
      - Matara/Suluk için: Spor & Outdoor > Spor Malzemeleri > matara > Detoks Suluk
      - Kadın Çizmesi için: Kadın > Ayakkabı > çizme > Deri Çizme
      - Kadın Giyim için: Kadın > Giyim > elbise > Günlük Elbise

      Örnek: "... harika görüneceksiniz! [Products: Spor & Outdoor > Spor Ayakkabı > bot > Sağlam Trekking Botu | Spor & Outdoor > Spor Üst Giyim > tişört > Antrenman Tişörtü, Spor & Outdoor > Spor Alt Giyim > şort > Siyah Spor Şort]"
    `;

    // Cooldown'ı bitmiş modelleri aktif hale getirmek için mevcut zamanı alıyoruz
    const now = Date.now();
    
    // Modelleri öncelik sırasına göre diziyoruz:
    // 1. En son başarıyla çalışan model (preferredModel) eğer cooldown'da değilse en başta olmalı.
    // 2. Cooldown'da olmayan diğer modeller.
    // 3. Cooldown süresi en erken bitecek olanlar en sonda.
    const models = [...ALL_MODELS].sort((a, b) => {
      const cooldownA = modelCooldowns[a] || 0;
      const cooldownB = modelCooldowns[b] || 0;
      
      const isCooldownA = cooldownA > now;
      const isCooldownB = cooldownB > now;
      
      // İkisi de cooldown'da değilse preferredModel olanı öne al
      if (!isCooldownA && !isCooldownB) {
        if (a === preferredModel) return -1;
        if (b === preferredModel) return 1;
        return 0;
      }
      
      // Biri cooldown'da diğeri değilse, cooldown'da olmayanı öne al
      if (!isCooldownA && isCooldownB) return -1;
      if (isCooldownA && !isCooldownB) return 1;
      
      // İkisi de cooldown'daysa, cooldown süresi erken biteni öne al
      return cooldownA - cooldownB;
    });

    console.log(`[Hikai API] Active models list: ${JSON.stringify(models)} (Last working: ${preferredModel})`);

    let lastError = null;
    let responseData = null;
    let success = false;
    let finalStatus = 500;

    for (const model of models) {
      try {
        console.log(`[Hikai API] Attempting chat request with model: ${model}`);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: contents,
              systemInstruction: {
                parts: [{ text: systemInstruction }]
              },
              generationConfig: {
                maxOutputTokens: 8192, // Gemini düşünme (reasoning) modunun token tüketimini karşılamak için limitimizi yüksek tutuyoruz.
                temperature: 0.7
              },
              safetySettings: [
                // İnsan ve kombin fotoğraflarının hatalı şekilde sansüre takılmasını engellemek için güvenlik filtrelerini serbest bırakıyoruz.
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_NONE"
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_NONE"
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_NONE"
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_NONE"
                }
              ]
            }),
          }
        );

        responseData = await response.json();
        finalStatus = response.status;
        
        if (response.ok) {
          success = true;
          console.log(`[Hikai API] Successfully received response using model: ${model}`);
          preferredModel = model; // Başarı durumunda en son çalışan model olarak kaydediyoruz.
          modelCooldowns[model] = 0; // Cooldown'ı sıfırlıyoruz.
          break;
        } else {
          console.warn(`[Hikai API] Model ${model} returned error status ${response.status}:`, responseData);
          lastError = responseData?.error?.message || 'Bilinmeyen hata';
          
          // Eğer kota aşımı (429) veya sunucu hatası (503/500) alındıysa modeli 60 saniye cooldown'a alıyoruz.
          if (response.status === 429 || response.status === 503 || response.status >= 500) {
            console.warn(`[Hikai API] Model ${model} rate limited or failed. Putting it on 60s cooldown.`);
            modelCooldowns[model] = Date.now() + 60000;
          }
        }
      } catch (err) {
        console.error(`[Hikai API] Exception occurred while calling model ${model}:`, err);
        lastError = err.message;
        // Exception durumunda da modeli geçici cooldown'a alıyoruz.
        modelCooldowns[model] = Date.now() + 60000;
      }
    }

    if (success && responseData) {
      if (responseData.candidates && responseData.candidates[0].content.parts[0].text) {
        const botReply = responseData.candidates[0].content.parts[0].text;
        return NextResponse.json({ text: botReply });
      } else {
        console.error('[Hikai API] Response parsing failed, empty candidates structure:', responseData);
        throw new Error('Gemini API returned an empty response');
      }
    } else {
      console.warn(`[Hikai API] Gemini API completely exhausted (${lastError}). Activating Premium Local Semantic Fallback Engine...`);
      
      // En son kullanıcı mesajını tespit ederek alışveriş niyetini analiz ediyoruz.
      const lastUserMsg = (messages.filter(m => m.sender === 'user').pop()?.text || '').toLowerCase();
      
      let replyText = "";
      let productsTag = "";
      
      if (lastUserMsg.includes('halısaha') || lastUserMsg.includes('halı saha') || lastUserMsg.includes('futbol') || lastUserMsg.includes('krampon') || lastUserMsg.includes('maç')) {
        replyText = `Harika bir halı saha maçı için ihtiyacınız olan tüm ekipmanları sizin için seçtim! Performansınızı artıracak profesyonel kramponlar ve tamamlayıcı spor giyim ürünleri aşağıda listelenmiştir. Şimdiden iyi maçlar dilerim!\n\n🎯 **Öncelikli İhtiyacın:**\n- Profesyonel Halı Saha Kramponu (Zemin tutuşu yüksek ve esnek tabanlı)\n\n✨ **Bunlar da Lazım Olabilir:**\n- Dry-Fit Spor Tişört & Şort\n- Ter Emici Erkek Spor Çorabı\n- Ergonomik Sporcu Matarası / Suluk`;
        productsTag = `[Products: Spor & Outdoor > Spor Ayakkabı > krampon | Spor & Outdoor > Spor Alt Giyim > şort, Spor & Outdoor > Spor Üst Giyim > tişört, Erkek > İç Giyim > çorap, Spor & Outdoor > Spor Malzemeleri > matara]`;
      } else if (lastUserMsg.includes('kokuyorum') || lastUserMsg.includes('kötü koku') || lastUserMsg.includes('terledim') || lastUserMsg.includes('koku') || lastUserMsg.includes('ter kokusu') || lastUserMsg.includes('duş')) {
        replyText = `Kötü koku problemini anında giderecek ve gün boyu taze, ferah ve çekici hissetmenizi sağlayacak en kaliteli kişisel bakım ürünlerini sizin için seçtim! Şık parfümler ve temizleyici sabunlar aşağıda sizi bekliyor!\n\n🎯 **Öncelikli İhtiyacın:**\n- Premium Kalıcı Odunsu & Çiçeksi Erkek Parfümü\n\n✨ **Bunlar da Lazım Olabilir:**\n- Doğal Özlü Canlandırıcı Sıvı El Sabunu\n- Yoğun Nemlendirici El ve Vücut Kremi\n- Ferahlatıcı Cilt Tonik Seti`;
        productsTag = `[Products: Kozmetik > Parfüm > parfüm > Hoş Kokulu Parfüm | Süpermarket > Ev & Temizlik > sabun > El Sabunu, Kozmetik > Cilt Bakımı > krem > Nemlendirici Krem]`;
      } else if (lastUserMsg.includes('kuruyor') || lastUserMsg.includes('kuruluk') || lastUserMsg.includes('kuru cilt') || lastUserMsg.includes('çatlak') || lastUserMsg.includes('cildim')) {
        replyText = `Cildinizin kurumasını önleyecek, yoğun nemlendirici desteği sağlayarak pamuk gibi yumuşacık ve sağlıklı bir cilde kavuşmanızı sağlayacak en iyi cilt bakım kremlerini seçtim!\n\n🎯 **Öncelikli İhtiyacın:**\n- Yoğun Nemlendirici Cilt Bakım Kremi\n\n✨ **Bunlar da Lazım Olabilir:**\n- Besleyici Vücut Losyonu\n- Canlandırıcı Gözenek Sıkılaştırıcı Tonik\n- Doğal Özlü Nemlendirici Sıvı El Sabunu`;
        productsTag = `[Products: Kozmetik > Cilt Bakımı > krem > Yoğun Nemlendirici Bakım Kremi | Kozmetik > Cilt Bakımı > losyon > Vücut Losyonu, Kozmetik > Cilt Bakımı > tonik > Yüz Toniği]`;
      } else if (lastUserMsg.includes('hasta') || lastUserMsg.includes('hastayım') || lastUserMsg.includes('ağrı') || lastUserMsg.includes('ağrıyor') || lastUserMsg.includes('halsiz') || lastUserMsg.includes('grip') || lastUserMsg.includes('nezle')) {
        replyText = `Halsizliğinizi ve ağrılarınızı hafifletmeye yardımcı olacak, sizi sıcacık sarıp dinlendirecek bitki çayları ve konforlu ev tekstili ürünlerini sizin için derledim. Çok geçmiş olsun!\n\n🎯 **Öncelikli İhtiyacın:**\n- Yumuşacık Isı Yalıtımlı Polar Battaniye\n\n✨ **Bunlar da Lazım Olabilir:**\n- Rahatlatıcı Organik Bitki Çayı / Ihlamur Sepeti\n- Ortopedik Konforlu Uyku Yastığı\n- Mikrofiber Sıcak Tutan Çorap Seti`;
        productsTag = `[Products: Süpermarket > Gıda > çay > Bitki Çayı | Ev & Yaşam > Ev Tekstili > battaniye > Polar Battaniye, Ev & Yaşam > Ev Tekstili > yastık > Uyku Yastığı, Kadın > Ev & İç Giyim > çorap > Kışlık Çorap]`;
      } else if (lastUserMsg.includes('sıkıldım') || lastUserMsg.includes('sıkılıyor') || lastUserMsg.includes('canım sıkıldı') || lastUserMsg.includes('yapacak') || lastUserMsg.includes('hobi')) {
        replyText = `Can sıkıntınızı anında giderecek, sizi bambaşka dünyalara götürecek sürükleyici kitapları ve zihninizi dinlendirecek kaliteli kırtasiye ürünlerini sizin için seçtim! Keyifli vakitler dilerim.\n\n🎯 **Öncelikli İhtiyacın:**\n- Sürükleyici ve Ufuk Açıcı Roman / Kitap\n\n✨ **Bunlar da Lazım Olabilir:**\n- Çizgisiz Kaliteli Tasarım Defteri\n- İnce Uçlu Renkli Yazım Kalemleri\n- Lüks Metal Çakmak (Hobi/koleksiyon amaçlı)`;
        productsTag = `[Products: Kitap & Kırtasiye > Roman > kitap > Roman Kitap | Kitap & Kırtasiye > Yazım Gereçleri > defter > Tasarım Defter, Kitap & Kırtasiye > Yazım Gereçleri > kalem > Yazım Kalemi, Kitap & Kırtasiye > Çakmak Ürünleri > zippo > Metal Çakmak]`;
      } else if (lastUserMsg.includes('açım') || lastUserMsg.includes('acıktı') || lastUserMsg.includes('açlık') || lastUserMsg.includes('yemek') || lastUserMsg.includes('atıştırmalık') || lastUserMsg.includes('çikolata')) {
        replyText = `Açlığınızı yatıştıracak, çayınızın veya kahvenizin yanına harika şekilde eşlik edecek en lezzetli ve taze atıştırmalık sepetini sizin için hazırladım. Afiyet olsun!\n\n🎯 **Öncelikli İhtiyacın:**\n- Karışık Lezzetli Atıştırmalık ve Bisküvi Sepeti\n\n✨ **Bunlar da Lazım Olabilir:**\n- Yoğun Aromalı Filtre Kahve / Çözünebilir Kahve\n- Premium Sütlü ve Antep Fıstıklı Çikolata\n- Taze Demleme Siyah Çay`;
        productsTag = `[Products: Süpermarket > Gıda > atıştırmalık > Atıştırmalık Sepeti | Süpermarket > Gıda > çikolata > Sütlü Çikolata, Süpermarket > Gıda > kahve > Filtre Kahve, Süpermarket > Gıda > çay > Siyah Çay]`;
      } else if (lastUserMsg.includes('uyku') || lastUserMsg.includes('uyuyamıyorum') || lastUserMsg.includes('uykusuz') || lastUserMsg.includes('yatak')) {
        replyText = `Daha rahat, kesintisiz ve huzurlu bir uyku çekmenize yardımcı olacak, konforunuzu en üst düzeye çıkaracak uyku ve yatak ürünlerini sizin için bir araya getirdim. Şimdiden tatlı rüyalar!\n\n🎯 **Öncelikli İhtiyacın:**\n- Ortopedik Boyun Destekli Konforlu Yastık\n\n✨ **Bunlar da Lazım Olabilir:**\n- %100 Pamuklu Yumuşak Nevresim Takımı\n- Rahatlatıcı Papatya / Lavanta Çayı\n- Yumuşak Unisex Ev Çorabı`;
        productsTag = `[Products: Ev & Yaşam > Ev Tekstili > yastık > Ortopedik Yastık | Ev & Yaşam > Ev Tekstili > nevresim > Nevresim Takımı, Süpermarket > Gıda > çay > Rahatlatıcı Çay, Kadın > Ev & İç Giyim > çorap > Yumuşak Çorap]`;
      } else if (lastUserMsg.includes('karanlık') || lastUserMsg.includes('elektrik') || lastUserMsg.includes('ışık') || lastUserMsg.includes('lamba') || lastUserMsg.includes('kesildi')) {
        replyText = `Karanlıkta kaldığınız anlarda veya elektrik kesintilerinde anında ışık kaynağı sağlayacak, dayanıklı ve şık metal çakmak ile kibrit alternatiflerini sizin için listeledim!\n\n🎯 **Öncelikli İhtiyacın:**\n- Zippo Kibrit Bitmeyen Metal Çakmak (Rüzgarda sönmeyen, benzinli klasik tasarım)\n\n✨ **Bunlar da Lazım Olabilir:**\n- Ejderha Figürlü Lüks Gazlı Çakmak\n- Mutfak Tipi Güvenli Ahşap Kibrit\n- Uzun Ömürlü Ledli El Feneri`;
        productsTag = `[Products: Kitap & Kırtasiye > Çakmak Ürünleri > zippo > Klasik Zippo Çakmak | Kitap & Kırtasiye > Çakmak Ürünleri > çakmak > Gazlı Çakmak, Ev & Yaşam > Mutfak Gereçleri > kibrit > Ahşap Kibrit]`;
      } else if (lastUserMsg.includes('kirli') || lastUserMsg.includes('pis') || lastUserMsg.includes('temizlik') || lastUserMsg.includes('ev battı') || lastUserMsg.includes('toz') || lastUserMsg.includes('hijyen')) {
        replyText = `Evinizde derinlemesine hijyen sağlayacak, temizliği zahmetsiz ve keyifli hale getirecek en etkili temizlik ve deterjan ürünlerini sizin için listeledim. Kolay gelsin!\n\n🎯 **Öncelikli İhtiyacın:**\n- Ultra Hijyen Sıvı Çamaşır Deterjanı\n\n✨ **Bunlar da Lazım Olabilir:**\n- Doğal Özlü Nemlendirici Sıvı El Sabunu\n- Genel Yüzey Temizleyici Sprey\n- Çift Motorlu Akıllı Şarjlı Süpürge`;
        productsTag = `[Products: Süpermarket > Ev & Temizlik > deterjan > Çamaşır Deterjanı | Süpermarket > Ev & Temizlik > sabun > Sıvı Sabun, Süpermarket > Ev & Temizlik > temizleyici > Yüzey Temizleyici, Elektronik > Küçük Ev Aletleri > süpürge > Şarjlı Süpürge]`;
      } else if (lastUserMsg.includes('zippo') || lastUserMsg.includes('çakmak') || lastUserMsg.includes('kibrit') || lastUserMsg.includes('ateş')) {
        replyText = `Klasik ve şık tarzınızı tamamlayacak en kaliteli Zippo ve metal çakmak modellerini sizin için seçtim. Dayanıklı yapıları ve şık tasarımlarıyla ömür boyu kullanabileceğiniz alternatifler aşağıda sizi bekliyor!\n\n🎯 **Öncelikli İhtiyacın:**\n- Zippo Kibrit Bitmeyen Metal Çakmak (Benzinle çalışan, rüzgarda sönmeyen klasik tasarım)\n\n✨ **Bunlar da Lazım Olabilir:**\n- Ejderha Figürlü Lüks Gazlı Çakmak\n- Premium Deri Çakmak Kılıfı\n- Zippo Orijinal Çakmak Benzini ve Taşı`;
        productsTag = `[Products: Kitap & Kırtasiye > Çakmak Ürünleri > zippo > Klasik Zippo Çakmak | Kitap & Kırtasiye > Çakmak Ürünleri > çakmak > Lüks Çakmak, Ev & Yaşam > Mutfak Gereçleri > kibrit > Ahşap Kibrit]`;
      } else if (lastUserMsg.includes('kamp') || lastUserMsg.includes('çadır') || lastUserMsg.includes('outdoor') || lastUserMsg.includes('doğa') || lastUserMsg.includes('piknik')) {
        replyText = `Doğayla baş başa muhteşem bir kamp deneyimi için en temel ve kaliteli outdoor ekipmanlarını sizin için bir araya getirdim. Keyifli ve güvenli bir kamp dilerim!\n\n🎯 **Öncelikli İhtiyacın:**\n- Çift Katmanlı Su Geçirmez Kamp Çadırı\n\n✨ **Bunlar da Lazım Olabilir:**\n- Isı Yalıtımlı Kamp Matı / Şişme Yatak\n- Termal Sporcu Matarası & Termos\n- Pratik Katlanabilir Kamp Sandalyesi`;
        productsTag = `[Products: Spor & Outdoor > Spor Malzemeleri > çadır > Kamp Çadırı | Spor & Outdoor > Spor Malzemeleri > matara > Termos Matara, Spor & Outdoor > Evde Spor Aletleri > matara > Matara]`;
      } else if (lastUserMsg.includes('kozmetik') || lastUserMsg.includes('makyaj') || lastUserMsg.includes('parfüm') || lastUserMsg.includes('cilt') || lastUserMsg.includes('bakım') || lastUserMsg.includes('ruj') || lastUserMsg.includes('krem')) {
        replyText = `Güzelliğinizi ve cilt sağlığınızı destekleyecek, en çok tercih edilen popüler kozmetik ve kişisel bakım ürünlerini sizin için listeledim. Işıltınız hiç sönmesin!\n\n🎯 **Öncelikli İhtiyacın:**\n- Yoğun Nemlendirici Cilt Bakım Kremi\n\n✨ **Bunlar da Lazım Olabilir:**\n- Mat Bitişli Kalıcı Likit Ruj\n- Kalıcı Odunsu & Çiçeksi Premium Parfüm\n- Gözenek Sıkılaştırıcı Canlandırıcı Tonik`;
        productsTag = `[Products: Kozmetik > Cilt Bakımı > krem > Cilt Bakım Kremi | Kozmetik > Makyaj > ruj > Likit Ruj, Kozmetik > Parfüm > parfüm > Premium Parfüm]`;
      } else if (lastUserMsg.includes('telefon') || lastUserMsg.includes('bilgisayar') || lastUserMsg.includes('kulaklık') || lastUserMsg.includes('elektronik') || lastUserMsg.includes('şarj') || lastUserMsg.includes('süpürge')) {
        replyText = `Teknolojik ihtiyaçlarınızı karşılayacak, yüksek performanslı ve en popüler elektronik ürünleri sizin için seçtim. Hayatınızı kolaylaştıracak alternatifler aşağıda!\n\n🎯 **Öncelikli İhtiyacın:**\n- Yeni Nesil Akıllı Cep Telefonu\n\n✨ **Bunlar da Lazım Olabilir:**\n- Aktif Gürültü Engelleyici Kablosuz Kulaklık\n- Pratik Şarjlı El Süpürgesi\n- Hızlı Şarj Destekli Güç Kaynağı (Powerbank)`;
        productsTag = `[Products: Elektronik > Telefon > telefon > Akıllı Telefon | Elektronik > Bilgisayar > kulaklık > Kablosuz Kulaklık, Elektronik > Küçük Ev Aletleri > süpürge > El Süpürgesi]`;
      } else if (lastUserMsg.includes('giyim') || lastUserMsg.includes('elbise') || lastUserMsg.includes('tişört') || lastUserMsg.includes('t-shirt') || lastUserMsg.includes('pantolon') || lastUserMsg.includes('gömlek') || lastUserMsg.includes('kombin')) {
        const isMale = lastUserMsg.includes('erkek') || lastUserMsg.includes('adam');
        const isWinter = lastUserMsg.includes('kış') || lastUserMsg.includes('soğuk') || lastUserMsg.includes('kaban') || lastUserMsg.includes('kazak');
        const isSummer = lastUserMsg.includes('yaz') || lastUserMsg.includes('sıcak') || lastUserMsg.includes('şort') || lastUserMsg.includes('terlik');
        
        if (isMale) {
            if (isWinter) {
                replyText = `Erkek kış modasına uygun, hem şık hem de soğuktan koruyacak harika bir kombin önerisi hazırladım!\n\n🎯 **Öncelikli İhtiyacın:**\n- Erkek Kalın Kışlık Kaban / Mont\n\n✨ **Bunlar da Lazım Olabilir:**\n- Erkek Boğazlı Triko Kazak\n- Kalın Kumaş Erkek Pantolon\n- Kışlık Erkek Bot`;
                productsTag = `[Products: Erkek > Giyim > mont > Kışlık Erkek Mont | Erkek > Giyim > kazak > Erkek Kazak, Erkek > Giyim > pantolon > Erkek Pantolon, Erkek > Ayakkabı > bot > Erkek Bot]`;
            } else if (isSummer) {
                replyText = `Yaz sıcaklarında ferah tutacak, şık ve rahat erkek yazlık kombinlerini sizin için özenle seçtim!\n\n🎯 **Öncelikli İhtiyacın:**\n- Pamuklu Rahat Erkek Basic Tişört\n\n✨ **Bunlar da Lazım Olabilir:**\n- Yazlık Erkek Şort / Bermuda\n- Konforlu Erkek Spor Ayakkabı / Sneaker\n- Şık Güneş Gözlüğü`;
                productsTag = `[Products: Erkek > Giyim > tişört > Erkek Tişört | Erkek > Giyim > şort > Erkek Şort, Erkek > Ayakkabı > spor > Erkek Spor Ayakkabı, Giyim & Aksesuar > Güneş Gözlüğü > gözlük > Güneş Gözlüğü]`;
            } else {
                replyText = `Tarzınızı yansıtacak, modern ve rahat erkek giyim kombinlerini sizin için özenle seçtim!\n\n🎯 **Öncelikli İhtiyacın:**\n- Şık Kesim Erkek Tişört / Gömlek\n\n✨ **Bunlar da Lazım Olabilir:**\n- Erkek Chino / Jean Pantolon\n- Erkek Konforlu Spor Ayakkabı\n- Aksesuar: Erkek Saat`;
                productsTag = `[Products: Erkek > Giyim > tişört > Erkek Tişört | Erkek > Giyim > pantolon > Erkek Pantolon, Erkek > Ayakkabı > spor > Erkek Spor Ayakkabı, Giyim & Aksesuar > Saat > erkek > Erkek Kol Saati]`;
            }
        } else {
            if (isWinter) {
                replyText = `Kış aylarında hem şık hem de sıcacık kalmanızı sağlayacak muhteşem kadın kombinlerini sizin için seçtim!\n\n🎯 **Öncelikli İhtiyacın:**\n- Yeni Sezon Şık Kadın Kaban / Mont\n\n✨ **Bunlar da Lazım Olabilir:**\n- Sıcacık Tutan Kadın Triko Kazak\n- Kışlık Kalın Kumaş Kadın Pantolon\n- Kadın Deri Çizme / Bot`;
                productsTag = `[Products: Kadın > Giyim > kaban > Kadın Kaban Mont | Kadın > Giyim > kazak > Kadın Kazak, Kadın > Giyim > pantolon > Kadın Pantolon, Kadın > Ayakkabı > çizme > Kadın Çizme]`;
            } else if (isSummer) {
                replyText = `Yaz sıcaklarında ferahlık ve şıklığı bir arada sunan muhteşem yazlık kadın kombinlerini sizin için seçtim!\n\n🎯 **Öncelikli İhtiyacın:**\n- Yeni Sezon Şık Kadın Yazlık Elbise\n\n✨ **Bunlar da Lazım Olabilir:**\n- Kadın Şort / Tiril Etek\n- Rahat Kadın Sandalet / Terlik\n- Plaj ve Günlük Hasır Çanta`;
                productsTag = `[Products: Kadın > Giyim > elbise > Kadın Yazlık Elbise | Kadın > Giyim > şort > Kadın Şort, Kadın > Ayakkabı > sandalet > Kadın Sandalet, Kadın > Çanta > çanta > Kadın Çanta]`;
            } else {
                replyText = `Tarzınızı yansıtacak, modern ve rahat kadın giyim kombinlerini sizin için özenle seçtim. Şıklığınıza şıklık katacak en yeni sezon ürünleri aşağıda listelenmiştir!\n\n🎯 **Öncelikli İhtiyacın:**\n- Yeni Sezon Şık Kadın Günlük Elbise / Bluz\n\n✨ **Bunlar da Lazım Olabilir:**\n- Kadın Kumaş / Jean Pantolon\n- Konforlu Taban Kadın Spor Ayakkabı\n- Günlük Kullanıma Uygun Kadın Çanta`;
                productsTag = `[Products: Kadın > Giyim > elbise > Kadın Günlük Elbise | Kadın > Giyim > pantolon > Kadın Pantolon, Kadın > Ayakkabı > spor > Kadın Spor Ayakkabı, Kadın > Çanta > çanta > Kadın Çanta]`;
            }
        }
      } else if (lastUserMsg.includes('temizlik') || lastUserMsg.includes('deterjan') || lastUserMsg.includes('sabun') || lastUserMsg.includes('gıda') || lastUserMsg.includes('atıştırmalık') || lastUserMsg.includes('market')) {
        replyText = `Evinizin tüm süpermarket, gıda ve temizlik ihtiyaçlarını en taze ve kaliteli seçeneklerle sizin için derledim. Keyifli alışverişler!\n\n🎯 **Öncelikli İhtiyacın:**\n- Ultra Hijyen Sıvı Çamaşır Deterjanı\n\n✨ **Bunlar da Lazım Olabilir:**\n- Doğal Özlü Nemlendirici Sıvı El Sabunu\n- Lezzetli ve Sağlıklı Atıştırmalık Sepeti\n- Organik Sızma Zeytinyağı`;
        productsTag = `[Products: Süpermarket > Ev & Temizlik > deterjan > Çamaşır Deterjanı | Süpermarket > Gıda > atıştırmalık > Atıştırmalık, Süpermarket > Ev & Temizlik > sabun > Sıvı Sabun]`;
      } else {
        // HİÇBİR HAZIR KATEGORİYE UYMAYAN DURUM: DİNAMİK VERİTABANI ARAMA MOTORU DEVREDE!
        const cleanText = lastUserMsg.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").toLowerCase();
        const words = cleanText.split(/\s+/);
        
        const stopWords = new Set([
          'bir', 've', 'de', 'da', 'için', 'çok', 'mi', 'mı', 'var', 'yok', 'bul', 
          'öner', 'tavsiye', 'et', 'yap', 'al', 'sat', 'lazım', 'gerek', 'istiyorum', 
          'benim', 'senin', 'kendi', 'ile', 'en', 'daha', 'ise', 'ki', 'ama', 'fakat', 
          'lakin', 'ancak', 'bu', 'şu', 'o', 'ne', 'nasıl', 'neden', 'niye', 'kim',
          'nerede', 'neye', 'kime', 'bana', 'bunu', 'şunu', 'onu'
        ]);
        
        const suffixes = [
          'umuz', 'ümüz', 'imiz', 'ımız', 
          'miz', 'niz', 'ler', 'lar', 
          'yim', 'yim', 'yum', 'yüm',
          'ım', 'im', 'um', 'üm', 
          'ın', 'in', 'un', 'ün',
          'da', 'de', 'ta', 'te',
          'sı', 'si', 'su', 'sü'
        ];

        const keywords = words
          .filter(w => w.length > 2 && !stopWords.has(w))
          .map(word => {
            let root = word;
            for (const suffix of suffixes) {
              if (root.endsWith(suffix) && root.length - suffix.length >= 3) {
                root = root.slice(0, -suffix.length);
                break;
              }
            }
            return root;
          });

        let searchKeywords = [...keywords];

        // DİNAMİK PROBLEM-KONSEPT HARİTASI (Arka planda ürün listesi belirleme)
        // Kullanıcının problemine uygun hedef ürünleri arka planda bulur ve DB aramasını ona göre şekillendirir.
        const conceptMap = [
          {
            conceptKeys: ['twitch', 'yayın', 'oyun', 'oyuncu', 'gamer', 'pc', 'bilgisayar', 'stream', 'ekipman'],
            targetProducts: ['kulaklık', 'mikrofon', 'kamera', 'mouse', 'klavye', 'kasa', 'monitör']
          },
          {
            conceptKeys: ['tatil', 'yaz', 'deniz', 'plaj', 'kum', 'güneş', 'sıcak', 'yüzmek'],
            targetProducts: ['şort', 'terlik', 'kremi', 'gözlük', 'havlu', 'tişört', 'mayo', 'bikini']
          },
          {
            conceptKeys: ['kış', 'soğuk', 'kar', 'üşüdüm', 'ayaz', 'donuyorum', 'yağmur'],
            targetProducts: ['mont', 'kazak', 'bere', 'eldiven', 'battaniye', 'çorap', 'bot', 'şemsiye']
          },
          {
            conceptKeys: ['spor', 'fitness', 'kas', 'zayıfla', 'diyet', 'antrenman', 'koşu', 'egzersiz'],
            targetProducts: ['dambıl', 'mat', 'protein', 'eşofman', 'spor ayakkabı', 'tayt', 'şort', 'matara']
          },
          {
            conceptKeys: ['bebek', 'çocuk', 'hamile', 'oyuncak', 'bez', 'mama'],
            targetProducts: ['bebek bezi', 'oyuncak', 'biberon', 'emzik', 'bebek arabası', 'zıbın']
          },
          {
            conceptKeys: ['araba', 'oto', 'araç', 'motor', 'seyahat', 'yolculuk'],
            targetProducts: ['oto kokusu', 'termos', 'seyahat yastığı', 'telefon tutucu']
          },
          {
            conceptKeys: ['evcil', 'kedi', 'köpek', 'tasma'],
            targetProducts: ['kedi maması', 'köpek maması', 'kedi kumu', 'tasma', 'oyuncak']
          }
        ];

        let matchedConceptFound = false;
        for (const concept of conceptMap) {
          if (concept.conceptKeys.some(ck => lastUserMsg.includes(ck))) {
            searchKeywords.push(...concept.targetProducts);
            matchedConceptFound = true;
            break; 
          }
        }

        // Tekrarları temizle ve arama limitini koru
        searchKeywords = [...new Set(searchKeywords)].slice(0, 8);

        if (searchKeywords.length > 0) {
          const searchPromises = searchKeywords.map(async (kw) => {
            try {
              const { data } = await supabase
                .from('products')
                .select('id, productname, main_category, sub_category')
                .or(`productname.ilike.%${kw}%,sub_category.ilike.%${kw}%`)
                .limit(5);
              return data || [];
            } catch (e) {
              console.error(`[Local Search] Error searching for keyword "${kw}":`, e);
              return [];
            }
          });

          const resultsArray = await Promise.all(searchPromises);
          let matchedProducts = resultsArray.flat().filter((p, index, self) => 
            self.findIndex(t => t.productname === p.productname) === index
          );

          // AKILLI EŞLEŞTİRİCİ (SMART SCORER) - Backend
          // "dağ" aratıldığında "Isı Dağılımı (Saç Düzleştirici)" gelmesi gibi kronik Hataları (False Positives) önler!
          
          const poisonWords = ['bisiklet', 'araba', 'motor', 'bebek', 'kitap', 'roman', 'boya', 'kılıf', 'askı', 'oyuncak', 'yedek', 'parça'];
          const userWordsStr = lastUserMsg.toLowerCase();

          matchedProducts = matchedProducts.map(p => {
              let score = 0;
              const pName = (p.productname || '').toLowerCase();
              const pWords = pName.split(/[\s-]+/);
              
              searchKeywords.forEach(kw => {
                  const kwLower = kw.toLowerCase();
                  if (pName.includes(kwLower)) score += 5;
                  
                  // Tam kelime eşleşmesi çok değerli!
                  if (pWords.includes(kwLower)) score += 20;
                  
                  // Kısa kelimelerde (4 harf veya altı) kısmi eşleşme genellikle hatadır (dağ -> dağılım, çam -> çamaşır)
                  if (kwLower.length <= 4 && pName.includes(kwLower) && !pWords.includes(kwLower) && !pWords.some(w => w.startsWith(kwLower))) {
                      score -= 20; // Ağır ceza!
                  }
              });
              
              // Kirlilik/Yan Ürün Filtresi
              const isPoisoned = poisonWords.some(pw => (pWords.includes(pw) || pName.endsWith(pw)) && !userWordsStr.includes(pw));
              if (isPoisoned) score -= 50;

              return { ...p, _score: score };
          })
          .filter(p => p._score >= 10) // Sadece yüksek isabetli ürünleri geçir (En az 1 tam kelime eşleşmesi veya 2 güçlü kısmi eşleşme)
          .sort((a, b) => b._score - a._score);

          // Sorgunun fiziksel bir problem veya vücut bölgesi içerip içermediğini analiz ediyoruz (Türkçe ve Türkçe-olmayan karakter varyasyonları dahil)
          const isPhysicalOrBodyProblem = lastUserMsg.includes('kaşın') || lastUserMsg.includes('kaşıntı') || 
                                          lastUserMsg.includes('kasin') || lastUserMsg.includes('kasinti') ||
                                          lastUserMsg.includes('ağrı') || lastUserMsg.includes('hastalık') || 
                                          lastUserMsg.includes('agri') || lastUserMsg.includes('hastalik') ||
                                          lastUserMsg.includes('hasta') || lastUserMsg.includes('yara') || 
                                          lastUserMsg.includes('sivilce') || lastUserMsg.includes('kuruluk') || 
                                          lastUserMsg.includes('sırt') || lastUserMsg.includes('sirt') ||
                                          lastUserMsg.includes('kol') || lastUserMsg.includes('bacak') || 
                                          lastUserMsg.includes('sırt') || lastUserMsg.includes('kol') || 
                                          lastUserMsg.includes('bacak') || lastUserMsg.includes('boyun') || 
                                          lastUserMsg.includes('başım');

          const isBookOrStationeryIntent = lastUserMsg.includes('kitap') || lastUserMsg.includes('roman') || 
                                           lastUserMsg.includes('oku') || lastUserMsg.includes('defter') || 
                                           lastUserMsg.includes('kalem') || lastUserMsg.includes('kırtasiye') || 
                                           lastUserMsg.includes('yazar') || lastUserMsg.includes('ders') || 
                                           lastUserMsg.includes('sınav');

          const finalProducts = matchedProducts.filter(p => {
            const mainCat = (p.main_category || '').toLowerCase();
            const subCat = (p.sub_category || '').toLowerCase();
            const prodName = (p.productname || '').toLowerCase();
            
            if (isPhysicalOrBodyProblem) {
              if (!(mainCat.includes('kozmetik') || mainCat.includes('süpermarket') || mainCat.includes('yaşam') || mainCat.includes('ev'))) {
                return false;
              }
            }

            // 2. KİTAP & KIRTASİYE FALSE-POSITIVE FİLTRESİ
            // Sıradan kelimeler (yayıncı, olmak, istiyorum) kitap isimlerinde geçtiği için oluşan kitap kirliliğini tamamen önler.
            if (mainCat.includes('kitap') || mainCat.includes('kırtasiye') || subCat.includes('yayın') || prodName.includes('yayıncılık') || prodName.includes('yayincilik')) {
              // Eğer kullanıcı okul/eğitim/kitap niyetinde değilse kitapları filtrele!
              if (!isBookOrStationeryIntent) {
                return false; 
              }
            }

            return true;
          });

          if (finalProducts.length > 0) {
            const priorityProduct = finalProducts[0];
            const alternativeProducts = finalProducts.slice(1, 5);

            replyText = `Talebiniz veya probleminiz üzerine mağazamızdaki ürünler arasında yaptığım aramada, size en uygun olabilecek ürünleri buldum! \n\n🎯 **Öncelikli İhtiyacın:**\n- ${priorityProduct.productname} (Sorununuzu çözmek için özel olarak seçildi)\n\n`;
            if (alternativeProducts.length > 0) {
              replyText += `✨ **Bunlar da Lazım Olabilir:**\n${alternativeProducts.map(p => `- ${p.productname}`).join('\n')}`;
            }

            const formatTag = (p) => {
              if (p.id) return `EXACT > ID > ${p.id}`;
              const mainCat = p.main_category || 'Süpermarket';
              const subCat = p.sub_category || 'Kişisel Bakım';
              const cleanName = p.productname.split(' ')[0].replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ]/g, "");
              return `${mainCat} > ${subCat} > ${cleanName}`;
            };

            const primaryTag = formatTag(priorityProduct);
            const extraTags = alternativeProducts.map(formatTag);

            productsTag = `[Products: ${primaryTag}`;
            if (extraTags.length > 0) {
              productsTag += ` | ${extraTags.join(', ')}`;
            }
            productsTag += `]`;
          } else {
            // EŞLEŞEN HİÇBİR ÜRÜN BULUNAMADI: KULLANICIYA KİBAR VE NET AÇIKLAMA
            replyText = `HIKARI mağazamızın mevcut ürün yelpazesinde (Kozmetik, Kırtasiye, Ev & Yaşam, Süpermarket, Spor, Elektronik ve Giyim) şu anda bu problemi çözebilecek doğrudan bir ürün bulunmamaktadır.\n\nSizin için başka bir konuda yardımcı olabilir miyim? Yeni bir ürün araması yapmak veya farklı bir konuda tavsiye almak isterseniz buradayım!`;
            productsTag = "";
          }
        } else {
          // KELİME ÇIKARILAMADI VEYA ANLAMSIZ GİRİŞ
          replyText = `HIKARI mağazamızın mevcut ürün yelpazesinde (Kozmetik, Kırtasiye, Ev & Yaşam, Süpermarket, Spor, Elektronik ve Giyim) şu anda bu problemi çözebilecek doğrudan bir ürün bulunmamaktadır.\n\nSizin için başka bir konuda yardımcı olabilir miyim? Yeni bir ürün araması yapmak veya farklı bir konuda tavsiye almak isterseniz buradayım!`;
          productsTag = "";
        }
      }
      
      const botReply = `${replyText}\n\n${productsTag}`;
      return NextResponse.json({ text: botReply });
    }
  } catch (error) {
    console.error('[Hikai API] Fatal Router Error:', error);
    return NextResponse.json({ error: 'Hikai şu anda yanıt veremiyor, lütfen tekrar deneyin.' }, { status: 500 });
  }
}
