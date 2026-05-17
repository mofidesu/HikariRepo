import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const productsFile = path.join('..', 'products.csv');
const rawProductsCsv = fs.readFileSync(productsFile, 'utf8');

const parsedProducts = Papa.parse(rawProductsCsv, {
    header: true,
    delimiter: ';',
    skipEmptyLines: true
});

const rules = [
    // Elektronik
    { main: 'Elektronik', sub: 'Telefon & Aksesuar', keywords: ['telefon', 'kılıf', 'şarj', 'kablo', 'powerbank', 'kulaklık', 'ekran koruyucu', 'bluetooth', 'airpods'] },
    { main: 'Elektronik', sub: 'Bilgisayar & Tablet', keywords: ['bilgisayar', 'laptop', 'tablet', 'mouse', 'klavye', 'monitör', 'yazıcı', 'ssd', 'usb', 'modem', 'pil', 'batarya', 'oyuncu'] },
    { main: 'Elektronik', sub: 'Beyaz Eşya', keywords: ['buzdolabı', 'çamaşır makinesi', 'bulaşık makinesi', 'klima', 'fırın', 'derin dondurucu'] },
    { main: 'Elektronik', sub: 'Elektrikli Ev Aletleri', keywords: ['süpürge', 'ütü', 'blender', 'tost makinesi', 'kahve makinesi', 'çay makinesi', 'rondo', 'mikser', 'epilatör', 'saç kurutma', 'maşa', 'düzleştirici'] },
    { main: 'Elektronik', sub: 'TV & Görüntü', keywords: ['televizyon', 'tv', 'projeksiyon'] },
    { main: 'Elektronik', sub: 'Giyilebilir Teknoloji', keywords: ['akıllı saat', 'bileklik'] },
    
    // Süpermarket
    { main: 'Süpermarket', sub: 'Gıda', keywords: ['çikolata', 'kahve', 'çay', 'bisküvi', 'yağ', 'salça', 'makarna', 'pirinç', 'bal', 'fındık', 'ceviz', 'kuruyemiş', 'lokum', 'şeker'] },
    { main: 'Süpermarket', sub: 'İçecek', keywords: ['su', 'meyve suyu', 'kola', 'gazoz', 'enerji içeceği'] },
    { main: 'Süpermarket', sub: 'Ev Bakım & Temizlik', keywords: ['deterjan', 'yumuşatıcı', 'sabun', 'temizleyici', 'çamaşır suyu', 'peçete', 'tuvalet kağıdı', 'kağıt havlu', 'bulaşık deterjanı', 'yüzey temizleyici'] },
    { main: 'Süpermarket', sub: 'Pet Shop', keywords: ['kedi', 'köpek', 'mama', 'kum', 'tasma', 'ödül', 'kuş yemi'] },
    { main: 'Süpermarket', sub: 'Kırtasiye & Ofis', keywords: ['kalem', 'defter', 'kağıt', 'rulo', 'pos', 'kutu', 'bant', 'silgi', 'dosya', 'ajanda', 'fotokopi kağıdı'] },

    // Kozmetik
    { main: 'Kozmetik', sub: 'Makyaj', keywords: ['ruj', 'fondöten', 'maskara', 'far', 'göz kalemi', 'allık', 'pudra', 'kapatıcı', 'eyeliner', 'oje', 'makyaj', 'dipliner', 'aydınlatıcı', 'highlighter'] },
    { main: 'Kozmetik', sub: 'Cilt Bakımı', keywords: ['krem', 'serum', 'maske', 'nemlendirici', 'tonik', 'losyon', 'güneş kremi', 'peeling', 'yüz yıkama', 'anti-aging', 'göz kremi'] },
    { main: 'Kozmetik', sub: 'Saç Bakımı', keywords: ['şampuan', 'saç kremi', 'saç boyası', 'tarak', 'jöle', 'saç spreyi', 'saç bakım', 'wax'] },
    { main: 'Kozmetik', sub: 'Parfüm & Deodorant', keywords: ['parfüm', 'deodorant', 'roll-on', 'vücut spreyi', 'edt', 'edp'] },
    { main: 'Kozmetik', sub: 'Ağız Bakım', keywords: ['diş macunu', 'diş fırçası', 'ağız çalkalama', 'diş ipi'] },
    { main: 'Kozmetik', sub: 'Erkek Bakım', keywords: ['tıraş', 'sakal', 'jilet', 'after shave', 'tıraş makinesi', 'tıraş köpüğü'] },
    
    // Ayakkabı & Çanta
    { main: 'Ayakkabı & Çanta', sub: 'Erkek Ayakkabı', keywords: ['erkek ayakkabı', 'erkek spor ayakkabı', 'erkek bot', 'erkek terlik', 'erkek sneaker', 'kundura', 'erkek çizme'] },
    { main: 'Ayakkabı & Çanta', sub: 'Kadın Ayakkabı', keywords: ['kadın ayakkabı', 'topuklu', 'babet', 'kadın bot', 'kadın terlik', 'kadın sneaker', 'sandalet', 'kadın çizme'] },
    { main: 'Ayakkabı & Çanta', sub: 'Kadın Çanta', keywords: ['kadın çanta', 'omuz çantası', 'sırt çantası', 'cüzdan', 'çapraz çanta'] },
    { main: 'Ayakkabı & Çanta', sub: 'Erkek Çanta', keywords: ['erkek çanta', 'erkek sırt çantası', 'erkek cüzdan', 'evrak çantası'] },
    { main: 'Ayakkabı & Çanta', sub: 'Valiz & Seyahat', keywords: ['valiz', 'bavul', 'seyahat çantası'] },

    // Ev & Mobilya
    { main: 'Ev & Mobilya', sub: 'Sofra & Mutfak', keywords: ['tabak', 'bardak', 'tencere', 'tava', 'çatal', 'kaşık', 'bıçak', 'kase', 'fincan', 'tepsi', 'saklama kabı', 'termos', 'süzgeç'] },
    { main: 'Ev & Mobilya', sub: 'Ev Tekstili', keywords: ['nevresim', 'yorgan', 'yastık', 'havlu', 'battaniye', 'çarşaf', 'pike', 'perde', 'halı', 'kilim', 'paspas', 'hurç'] },
    { main: 'Ev & Mobilya', sub: 'Ev Dekorasyon', keywords: ['tablo', 'vazo', 'mum', 'çerçeve', 'biblo', 'duvar saati', 'tütsü', 'mumluk', 'ayna'] },
    { main: 'Ev & Mobilya', sub: 'Mobilya', keywords: ['koltuk', 'masa', 'sandalye', 'dolap', 'şifonyer', 'kitaplık', 'sehpa', 'karyola', 'puf', 'yatak'] },
    { main: 'Ev & Mobilya', sub: 'Aydınlatma', keywords: ['avize', 'lamba', 'ampul', 'abajur', 'led', 'lambader', 'aplik'] },
    { main: 'Ev & Mobilya', sub: 'Yapı Market', keywords: ['matkap', 'tornavida', 'çekiç', 'priz', 'kablo', 'anahtar seti', 'vida', 'boya', 'bant'] },

    // Anne & Çocuk
    { main: 'Anne & Çocuk', sub: 'Bebek Giyim', keywords: ['bebek takımı', 'zıbın', 'bebek tulum', 'bebek battaniyesi', 'hastane çıkışı'] },
    { main: 'Anne & Çocuk', sub: 'Erkek Çocuk Giyim', keywords: ['erkek çocuk'] },
    { main: 'Anne & Çocuk', sub: 'Kız Çocuk Giyim', keywords: ['kız çocuk'] },
    { main: 'Anne & Çocuk', sub: 'Bebek Bakım', keywords: ['bebek bezi', 'ıslak mendil', 'pişik kremi', 'emzik', 'biberon', 'göğüs pompası', 'bebek şampuanı', 'bebek arabası', 'oto koltuğu'] },
    { main: 'Anne & Çocuk', sub: 'Oyuncak', keywords: ['oyuncak', 'lego', 'puzzle', 'araba', 'bebek', 'peluş', 'kutu oyunu', 'yapboz', 'figür', 'akülü araba'] },

    // Saat & Aksesuar
    { main: 'Saat & Aksesuar', sub: 'Takı & Mücevher', keywords: ['kolye', 'küpe', 'yüzük', 'bileklik', 'altın', 'gümüş', 'broş', 'tesbih', 'çelik kolye', 'zincir'] },
    { main: 'Saat & Aksesuar', sub: 'Kadın Saat', keywords: ['kadın saat'] },
    { main: 'Saat & Aksesuar', sub: 'Erkek Saat', keywords: ['erkek saat'] },
    { main: 'Saat & Aksesuar', sub: 'Şapka & Bere', keywords: ['şapka', 'bere', 'kasket', 'kep'] },
    { main: 'Saat & Aksesuar', sub: 'Şal & Eşarp', keywords: ['şal', 'eşarp', 'atkı', 'fular'] },
    { main: 'Saat & Aksesuar', sub: 'Güneş Gözlüğü', keywords: ['gözlük', 'güneş gözlüğü'] },

    // Spor & Outdoor
    { main: 'Spor & Outdoor', sub: 'Spor Giyim', keywords: ['eşofman', 'spor tayt', 'spor sütyeni', 'forma', 'spor şort'] },
    { main: 'Spor & Outdoor', sub: 'Kamp & Doğa', keywords: ['çadır', 'uyku tulumu', 'matara', 'kamp', 'fener', 'termos'] },
    { main: 'Spor & Outdoor', sub: 'Kondisyon & Fitness', keywords: ['dambıl', 'pilates', 'koşu bandı', 'direnç lastiği', 'kumbara'] },
    { main: 'Spor & Outdoor', sub: 'Spor Ekipmanları', keywords: ['futbol topu', 'basketbol topu', 'voleybol', 'tenis', 'bisiklet', 'kaykay', 'paten'] },

    // Kadın & Erkek Giyim (Fallback to main clothing categories based on explicit words)
    { main: 'Erkek', sub: 'İç Giyim', keywords: ['boxer', 'erkek külot', 'erkek atlet', 'erkek çorap', 'erkek pijama'] },
    { main: 'Erkek', sub: 'Giyim', keywords: ['erkek tişört', 'erkek pantolon', 'erkek gömlek', 'erkek mont', 'erkek ceket', 'erkek kaban', 'erkek kazak', 'erkek şort', 'erkek sweatshirt', 't-shirt', 'erkek yelek', 'erkek hırka'] },
    
    { main: 'Kadın', sub: 'İç Giyim', keywords: ['sütyen', 'kadın külot', 'kadın atlet', 'pijama', 'gecelik', 'kadın çorap', 'korse', 'jartiyer', 'badi'] },
    { main: 'Kadın', sub: 'Giyim', keywords: ['elbise', 'kadın tişört', 'kadın pantolon', 'kadın gömlek', 'kadın mont', 'kadın ceket', 'kadın kaban', 'kazak', 'şort', 'etek', 'bluz', 'tunik', 'kadın sweatshirt', 'tayt', 'tulum', 'kadın yelek', 'kadın hırka'] },

    // Super generic fallbacks
    { main: 'Ayakkabı & Çanta', sub: 'Kadın Ayakkabı', keywords: ['ayakkabı', 'sneaker', 'çizme', 'bot'] },
    { main: 'Kadın', sub: 'Giyim', keywords: ['pantolon', 'gömlek', 'tişört', 'ceket', 'kaban', 'sweatshirt', 'hırka', 'yelek'] }
];

let updatedCount = 0;
let totalProcessed = 0;

for (let row of parsedProducts.data) {
    if (!row['Ürün Adı']) continue;
    
    totalProcessed++;
    
    // Check if category is missing or N/A
    const mainCat = (row['Ana Kategori'] || '').trim().toUpperCase();
    const subCat = (row['Alt Kategori'] || '').trim().toUpperCase();
    
    if (!mainCat || mainCat === 'N/A' || mainCat === 'NA' || !subCat || subCat === 'N/A' || subCat === 'NA') {
        const title = (row['Ürün Adı'] || '').toLowerCase();
        const brand = (row['Marka'] || '').toLowerCase();
        
        const combinedText = title + ' ' + brand;
        
        let matched = false;
        for (const rule of rules) {
            // Using a word boundary-like regex is better, but simple includes is what original script used
            if (rule.keywords.some(kw => combinedText.includes(kw))) {
                row['Ana Kategori'] = rule.main;
                row['Alt Kategori'] = rule.sub;
                matched = true;
                updatedCount++;
                break;
            }
        }
        
        if (!matched) {
            // Fallback for completely unclassified items
            row['Ana Kategori'] = 'Süpermarket';
            row['Alt Kategori'] = 'Diğer';
            updatedCount++;
        }
    }
}

const updatedCsv = Papa.unparse(parsedProducts.data, {
    delimiter: ';',
    quotes: true
});

fs.writeFileSync(productsFile, updatedCsv, 'utf8');

console.log('Total items processed:', totalProcessed);
console.log('Successfully updated N/A categories:', updatedCount);
