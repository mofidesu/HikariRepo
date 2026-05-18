export function mapCategory(oldMain, oldSub) {
    let main = oldMain || '';
    let sub = oldSub || '';

    const lowerMain = main.toLowerCase();
    const lowerSub = sub.toLowerCase();

    // -- 1. MAIN CATEGORY MAPPING --
    if (lowerMain.includes('çocuk') || lowerMain.includes('bebek') || lowerMain === 'anne bebek' || lowerSub.includes('bebek')) {
        main = 'Anne & Çocuk';
    } else if (lowerMain.includes('kadın')) {
        main = 'Kadın';
    } else if (lowerMain.includes('erkek')) {
        main = 'Erkek';
    } else if (lowerMain.includes('ev ve mobilya') || lowerMain.includes('ev & mobilya') || lowerSub.includes('mobilya')) {
        main = 'Ev & Mobilya';
    } else if (lowerMain.includes('süpermarket') || lowerMain.includes('supermarket')) {
        main = 'Süpermarket';
    } else if (lowerMain.includes('kozmetik') || lowerMain.includes('kişisel bakım') || lowerSub.includes('makyaj')) {
        main = 'Kozmetik';
    } else if (lowerMain.includes('elektronik') || lowerSub.includes('telefon') || lowerSub.includes('bilgisayar')) {
        main = 'Elektronik';
    } else if (lowerMain.includes('spor') || lowerMain.includes('outdoor')) {
        main = 'Spor & Outdoor';
    } else if (lowerMain.includes('hobi') || lowerMain.includes('kitap') || lowerMain.includes('kırtasiye') || lowerSub.includes('kırtasiye')) {
        main = 'Kitap & Kırtasiye';
    }

    // -- 2. SUB CATEGORY MAPPING BASED ON MAIN CATEGORY --
    
    // YARDIMCI KEYWORDLER
    const isAyakkabi = /ayakkabı|sneaker|bot|terlik|sandalet|çizme|babet|loafer/i.test(lowerSub);
    const isGiyim = /t-shirt|sweatshirt|mont|jeans|ceket|gömlek|eşofman|pantolon|kazak|şort|yelek|elbise|etek|bluz|kaban|hırka|tayt|tulum|tunik/i.test(lowerSub);
    const isIcGiyim = /iç giyim|iç çamaşırı|pijama|sütyen|külot|çorap|boxer/i.test(lowerSub);
    const isCanta = /çanta|cüzdan|valiz/i.test(lowerSub);
    const isSaatAksesuar = /saat|gözlük|takı|kemer|şapka|bere|atkı/i.test(lowerSub);
    
    if (main === 'Kadın') {
        if (isAyakkabi) sub = 'Ayakkabı';
        else if (isCanta || isSaatAksesuar) sub = 'Aksesuar & Çanta';
        else if (isIcGiyim) sub = 'Ev & İç Giyim';
        else if (isGiyim) sub = 'Giyim';
        else sub = 'Giyim'; // Default
    } 
    else if (main === 'Erkek') {
        if (isAyakkabi) sub = 'Ayakkabı';
        else if (isCanta) sub = 'Çanta';
        else if (isSaatAksesuar) sub = 'Saat & Aksesuar';
        else if (isIcGiyim) sub = 'İç Giyim';
        else if (/bakım|tıraş|kozmetik/i.test(lowerSub)) sub = 'Kişisel Bakım';
        else if (isGiyim) sub = 'Giyim';
        else sub = 'Giyim'; // Default
    }
    else if (main === 'Anne & Çocuk') {
        if (/bakım/i.test(lowerSub)) sub = 'Bebek Bakım';
        else if (/oyuncak/i.test(lowerSub)) sub = 'Oyuncak';
        else if (/beslenme|emzirme|biberon/i.test(lowerSub)) sub = 'Beslenme Emzirme';
        else if (/taşıma|güvenlik|bebek arabası|oto koltuğu/i.test(lowerSub)) sub = 'Taşıma & Güvenlik';
        else if (/oda|beşik|mobilya/i.test(lowerSub)) sub = 'Bebek Odası';
        else if (/bebek/i.test(lowerSub)) sub = 'Bebek';
        else if (/erkek/i.test(lowerSub)) sub = 'Erkek Çocuk';
        else sub = 'Kız Çocuk'; // Default to Kız Çocuk if unknown child clothing
    }
    else if (main === 'Ev & Mobilya') {
        if (/sofra|mutfak|tabak|bardak/i.test(lowerSub)) sub = 'Sofra & Mutfak';
        else if (/tekstil|yorgan|yastık|nevresim|halı/i.test(lowerSub)) sub = 'Ev Tekstil';
        else if (/aydınlatma|avize|lamba/i.test(lowerSub)) sub = 'Aydınlatma';
        else if (/dekorasyon|tablo|ayna/i.test(lowerSub)) sub = 'Ev Dekorasyon';
        else if (/mobilya|koltuk|dolap|yatak|salon|oturma/i.test(lowerSub)) sub = 'Mobilya';
        else sub = 'Ev Gereçleri'; // Default
    }
    else if (main === 'Süpermarket') {
        if (/temizlik|deterjan/i.test(lowerSub) || lowerSub === 'diğer') sub = 'Ev & Temizlik';
        else if (/bakım/i.test(lowerSub)) sub = 'Kişisel Bakım';
        else if (/bebek/i.test(lowerSub)) sub = 'Bebek Bakım';
        else if (/gıda|içecek/i.test(lowerSub)) sub = 'Gıda ve İçecek';
        else if (/atıştırmalık|çikolata|bisküvi/i.test(lowerSub)) sub = 'Atıştırmalık';
        else if (/pet|kedi|köpek/i.test(lowerSub)) sub = 'Petshop';
        else sub = 'Gıda ve İçecek'; // Default
    }
    else if (main === 'Kozmetik') {
        if (/makyaj/i.test(lowerSub)) sub = 'Makyaj';
        else if (/cilt|yüz/i.test(lowerSub)) sub = 'Cilt Bakımı';
        else if (/parfüm|deodorant/i.test(lowerSub)) sub = 'Parfüm & Deodorant';
        else if (/saç bakımı|şampuan/i.test(lowerSub)) sub = 'Saç Bakımı';
        else if (/saç şekillendirici/i.test(lowerSub)) sub = 'Saç Şekillendirici';
        else if (/epilasyon|tıraş/i.test(lowerSub)) sub = 'Epilasyon & Tıraş';
        else if (/aksesuar/i.test(lowerSub)) sub = 'Makyaj Aksesuarları';
        else sub = 'Genel Bakım'; // Default
    }
    else if (main === 'Elektronik') {
        if (/küçük ev aletleri|süpürge|ütü/i.test(lowerSub)) sub = 'Küçük Ev Aletleri';
        else if (/giyilebilir|saat|bileklik/i.test(lowerSub)) sub = 'Giyilebilir Teknoloji';
        else if (/telefon/i.test(lowerSub)) sub = 'Telefon';
        else if (/foto|kamera/i.test(lowerSub)) sub = 'Foto & Kamera';
        else if (/tv|görüntü|ses|televizyon/i.test(lowerSub)) sub = 'TV & Görüntü & Ses';
        else if (/beyaz eşya|buzdolabı|çamaşır|bulaşık/i.test(lowerSub)) sub = 'Beyaz Eşya';
        else if (/bilgisayar|tablet|laptop/i.test(lowerSub)) sub = 'Bilgisayar & Tablet';
        else if (/oyun|konsol/i.test(lowerSub)) sub = 'Oyunculara Özel';
        else if (/aksesuar/i.test(lowerSub)) sub = 'Elektronik Aksesuarlar';
        else sub = 'Küçük Ev Aletleri'; // Default
    }
    else if (main === 'Spor & Outdoor') {
        if (/ayakkabı|sneaker/i.test(lowerSub)) sub = 'Spor Ayakkabı';
        else if (/alet/i.test(lowerSub)) sub = 'Evde Spor Aletleri';
        else if (/malzeme/i.test(lowerSub)) sub = 'Spor Malzemeleri';
        else if (/bisiklet/i.test(lowerSub)) sub = 'Bisiklet';
        else if (/fitness/i.test(lowerSub)) sub = 'Fitness Kondisyon';
        else if (/besin/i.test(lowerSub)) sub = 'Sporcu Besinleri';
        else if (/alt|eşofman/i.test(lowerSub)) sub = 'Spor Alt Giyim';
        else sub = 'Spor Üst Giyim'; // Default
    }
    else if (main === 'Kitap & Kırtasiye') {
        if (/parti/i.test(lowerSub)) sub = 'Parti Malzemeleri';
        else if (/hobi/i.test(lowerSub)) sub = 'Hobi Malzemeleri';
        else if (/drone/i.test(lowerSub)) sub = 'Drone';
        else if (/araç/i.test(lowerSub)) sub = 'Uzaktan Kumandalı Araçlar';
        else if (/çakmak/i.test(lowerSub)) sub = 'Çakmak Ürünleri';
        else if (/müzik/i.test(lowerSub)) sub = 'Müzik Aletleri';
        else if (/hediye/i.test(lowerSub)) sub = 'Hediyelik Ürünler';
        else if (/okuyucu/i.test(lowerSub)) sub = 'E-kitap Okuyucu';
        else if (/kırtasiye/i.test(lowerSub)) sub = 'Kırtasiye';
        else if (/ofis/i.test(lowerSub)) sub = 'Ofis';
        else sub = 'Kitap & Kırtasiye'; // Fallback
    }
    else {
        // Fallback catch-all
        main = 'Süpermarket';
        sub = 'Ev & Temizlik';
    }

    return { mappedMain: main, mappedSub: sub };
}
