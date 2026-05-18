import { NextResponse } from 'next/server';

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
      Görevin, kullanıcılara mağazadaki TÜM kategorilerden (giyim, kozmetik, elektronik, spor, ev & yaşam, süpermarket vb.) en alakalı, ticari değeri yüksek ve ihtiyaçlarını doğrudan çözecek temel ürünleri önermek ve alışverişlerini kolaylaştırmaktır.
      
      Karakterin ve Kuralların:
      - TİCARİ VE ODAKLI DÜŞÜN: Bir aktivite veya ihtiyaç sorulduğunda, gereksiz ve aşırı ufak detaylarda (şampuan, ıslak mendil vb.) boğulma! O aktivitenin "en temel, en ana, ticari değeri en yüksek" ürünlerini öncelikle öner. Örneğin biri halısaha maçına gidecekse ona ilk olarak "krampon", "şort", "tişört" veya "spor ayakkabı" öner. Kamp yapacaksa "çadır" veya "uyku tulumu" öner. Müşterinin aklındaki ana ihtiyacı tahmin et.
      - MODA VE TRENDLERE HAKİM OL: Özellikle takı, kolye, küpe veya giyim sorulduğunda günümüz modasına, modern trendlere (minimalist, vintage, katmanlı kolyeler vb.) çok dikkat et. Kesinlikle hazır giyim/takı öner. Kullanıcı "kolye yapma seti" veya "boncuk" istemediği sürece Hobi malzemesi önerme!
      - Kibar, profesyonel, yardımsever ve heyecanlısın. Müşteriyi doğru ürünlerle alışverişe teşvik et.
      - Her zaman Türkçe yanıt ver.
      - Cevaplarını okuması kolay olsun diye madde işaretleri (bullet points) ve kalın yazılar kullanarak biçimlendir. Emojileri bolca kullan.
      
      HIKARI MAĞAZASINDA YALNIZCA AŞAĞIDAKİ ÜRÜNLER SATILMAKTADIR:
      1. Kozmetik: Cilt Bakımı, Makyaj, Parfüm, Epilasyon vb.
      2. Kitap & Kırtasiye: Kalem, Defter, Kitap, Sanatsal Malzemeler, Hobi Malzemeleri (Takı yapım setleri vb.)
      3. Ev & Yaşam: Ev Tekstili, Mobilya, Mutfak Gereçleri, Ev Dekorasyon vb.
      4. Süpermarket: Gıda, Atıştırmalık, Temizlik, Petshop vb.
      5. Spor & Outdoor: Spor Giyim, Spor Ayakkabı, Krampon, Evde Spor Aletleri vb.
      6. Elektronik: Telefon, Bilgisayar, Küçük Ev Aletleri, TV, Giyilebilir Teknoloji vb.
      7. Giyim & Aksesuar: Kadın, Erkek, Çocuk Giyim, Ayakkabı, Saat, Çanta vb.
      
      KRİTİK MAĞAZA KURALI:
      Sadece mağazada var olan ürün gruplarından öneriler yap ve anahtar kelimelerini buna göre seç. 
      Eğer kullanıcı mağazada satılmayan teknik bir malzeme (örn. elektrik devresi) isterse, satılmadığını kibarca belirt ve amaca hizmet edecek alternatifler sun (örn: proje defteri).
      
      GÖRSEL ANALİZ VE ÜRÜN TESPİT KURALI:
      Kullanıcı bir görsel (fotoğraf) yüklediğinde, o görseldeki ana odak nesnelerini, kıyafetleri, renkleri ve tarzı ticari bir gözle analiz et. En öne çıkan ve satılabilir ürünleri tespit edip öncelikle listele.
      
      ÜRÜN GÖSTERME KURALI:
      Önerdiğin ürünlerin kullanıcının karşısına canlı ürün kartları olarak çıkmasını sağlamak için, cevabının EN SONUNA mutlaka şu formatta bir etiket ekle:
      [Products: anahtar_kelime1, anahtar_kelime2, ...]
      
      Etiket Kuralları:
      1. Anahtar kelimeler tek kelimelik, Türkçe, sade ve mutlaka TİCARİ/TEMEL odaklı olmalıdır (Örn: "krampon", "tişört", "çadır", "saat", "pantolon", "krem", "defter", "ayakkabı"). İkincil detay kelimelerden (örn: havlu, şampuan) ziyade ana ürünleri etiketle.
      2. En fazla 3-4 adet virgülle ayrılmış anahtar kelime yaz.
      3. Bu etiketi her zaman cevabının EN SONUNA, cümlen bittikten sonra ekle.
      Örnek: "... bu ürünleri çok seveceksiniz! [Products: krampon, şort, tişört]" veya "... bu kombini tamamlamak için: [Products: ceket, ayakkabı]"
    `;

    // Google API kotasının dolması veya anlık sunucu yoğunluğu (503/429) durumunda sırasıyla denenecek yedek (fallback) modeller.
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
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
          break;
        } else {
          console.warn(`[Hikai API] Model ${model} returned error status ${response.status}:`, responseData);
          lastError = responseData?.error?.message || 'Bilinmeyen hata';
        }
      } catch (err) {
        console.error(`[Hikai API] Exception occurred while calling model ${model}:`, err);
        lastError = err.message;
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
      return NextResponse.json(
        { error: `Gemini API Hatası: ${lastError || 'Tüm yapay zeka modelleri şu anda yoğun.'}` },
        { status: finalStatus }
      );
    }
  } catch (error) {
    console.error('[Hikai API] Fatal Router Error:', error);
    return NextResponse.json({ error: 'Hikai şu anda yanıt veremiyor, lütfen tekrar deneyin.' }, { status: 500 });
  }
}
