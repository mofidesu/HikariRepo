import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const urunlerFile = path.join('..', 'csvs', 'urunler.csv');
const rawUrunlerCsv = fs.readFileSync(urunlerFile, 'utf8');

const parsedUrunler = Papa.parse(rawUrunlerCsv, {
    header: true,
    delimiter: ';',
    skipEmptyLines: true
});

const newProductsFile = path.join('..', 'csvs', 'new_products.csv');
let rawNewProductsCsv = '';
let parsedNewProducts = { data: [] };

if (fs.existsSync(newProductsFile)) {
    rawNewProductsCsv = fs.readFileSync(newProductsFile, 'utf8');
    parsedNewProducts = Papa.parse(rawNewProductsCsv, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true
    });
}

let data = [...parsedUrunler.data, ...parsedNewProducts.data];


const rules = [
    // Elektronik
    { main: 'Elektronik', sub: 'Telefon & Aksesuar', keywords: ['telefon', 'kılıf', 'şarj', 'kablo', 'powerbank', 'kulaklık', 'ekran koruyucu', 'bluetooth', 'airpods'] },
    { main: 'Elektronik', sub: 'Bilgisayar & Tablet', keywords: ['bilgisayar', 'laptop', 'tablet', 'mouse', 'klavye', 'monitör', 'yazıcı', 'ssd', 'usb', 'modem', 'pil', 'batarya', 'oyuncu'] },
    { main: 'Elektronik', sub: 'Beyaz Eşya', keywords: ['buzdolabı', 'çamaşır makinesi', 'bulaşık makinesi', 'klima', 'fırın', 'derin dondurucu'] },
    { main: 'Elektronik', sub: 'Elektrikli Ev Aletleri', keywords: ['süpürge', 'ütü', 'blender', 'tost makinesi', 'kahve makinesi', 'çay makinesi', 'rondo', 'mikser'] },
    { main: 'Elektronik', sub: 'TV & Görüntü', keywords: ['televizyon', 'tv', 'projeksiyon'] },
    { main: 'Elektronik', sub: 'Giyilebilir Teknoloji', keywords: ['akıllı saat', 'bileklik'] },
    
    // Süpermarket
    { main: 'Süpermarket', sub: 'Gıda', keywords: ['çikolata', 'kahve', 'çay', 'bisküvi', 'yağ', 'salça', 'makarna', 'pirinç', 'bal', 'fındık', 'ceviz', 'kuruyemiş', 'lokum', 'şeker'] },
    { main: 'Süpermarket', sub: 'İçecek', keywords: ['su', 'meyve suyu', 'kola', 'gazoz', 'enerji içeceği'] },
    { main: 'Süpermarket', sub: 'Ev Bakım & Temizlik', keywords: ['deterjan', 'yumuşatıcı', 'sabun', 'temizleyici', 'çamaşır suyu', 'peçete', 'tuvalet kağıdı', 'kağıt havlu'] },
    { main: 'Süpermarket', sub: 'Pet Shop', keywords: ['kedi', 'köpek', 'mama', 'kum', 'tasma', 'ödül', 'kuş yemi'] },
    { main: 'Süpermarket', sub: 'Kırtasiye & Ofis', keywords: ['kalem', 'defter', 'kağıt', 'rulo', 'pos', 'kutu', 'bant', 'silgi', 'dosya', 'ajanda', 'fotokopi kağıdı'] },

    // Kozmetik
    { main: 'Kozmetik', sub: 'Makyaj', keywords: ['ruj', 'fondöten', 'maskara', 'far', 'göz kalemi', 'allık', 'pudra', 'kapatıcı', 'eyeliner', 'oje', 'makyaj'] },
    { main: 'Kozmetik', sub: 'Cilt Bakımı', keywords: ['krem', 'serum', 'maske', 'nemlendirici', 'tonik', 'losyon', 'güneş kremi', 'peeling'] },
    { main: 'Kozmetik', sub: 'Saç Bakımı', keywords: ['şampuan', 'saç kremi', 'saç boyası', 'tarak', 'jöle', 'saç spreyi', 'saç bakım'] },
    { main: 'Kozmetik', sub: 'Parfüm & Deodorant', keywords: ['parfüm', 'deodorant', 'roll-on'] },
    { main: 'Kozmetik', sub: 'Ağız Bakım', keywords: ['diş macunu', 'diş fırçası', 'ağız çalkalama', 'diş ipi'] },
    { main: 'Kozmetik', sub: 'Erkek Bakım', keywords: ['tıraş', 'sakall', 'jilet', 'after shave'] },
    
    // Ayakkabı & Çanta
    { main: 'Ayakkabı & Çanta', sub: 'Erkek Ayakkabı', keywords: ['erkek ayakkabı', 'erkek spor ayakkabı', 'erkek bot', 'erkek terlik', 'erkek sneaker', 'kundura'] },
    { main: 'Ayakkabı & Çanta', sub: 'Kadın Ayakkabı', keywords: ['kadın ayakkabı', 'topuklu', 'babet', 'kadın bot', 'kadın terlik', 'kadın sneaker'] },
    { main: 'Ayakkabı & Çanta', sub: 'Kadın Çanta', keywords: ['kadın çanta', 'omuz çantası'] },
    { main: 'Ayakkabı & Çanta', sub: 'Erkek Çanta', keywords: ['erkek çanta'] },
    { main: 'Ayakkabı & Çanta', sub: 'Valiz & Seyahat', keywords: ['valiz', 'bavul'] },

    // Ev & Mobilya
    { main: 'Ev & Mobilya', sub: 'Sofra & Mutfak', keywords: ['tabak', 'bardak', 'tencere', 'tava', 'çatal', 'kaşık', 'bıçak', 'kase', 'fincan', 'tepsi', 'saklama kabı', 'termos'] },
    { main: 'Ev & Mobilya', sub: 'Ev Tekstili', keywords: ['nevresim', 'yorgan', 'yastık', 'havlu', 'battaniye', 'çarşaf', 'pike', 'perde', 'halı', 'kilim', 'paspas'] },
    { main: 'Ev & Mobilya', sub: 'Ev Dekorasyon', keywords: ['tablo', 'vazo', 'mum', 'çerçeve', 'biblo', 'duvar saati', 'tütsü'] },
    { main: 'Ev & Mobilya', sub: 'Mobilya', keywords: ['koltuk', 'masa', 'sandalye', 'dolap', 'şifonyer', 'kitaplık', 'sehpa', 'karyola'] },
    { main: 'Ev & Mobilya', sub: 'Aydınlatma', keywords: ['avize', 'lamba', 'ampul', 'abajur', 'led'] },
    { main: 'Ev & Mobilya', sub: 'Yapı Market', keywords: ['matkap', 'tornavida', 'çekiç', 'priz', 'kablo', 'anahtar seti', 'vida'] },

    // Anne & Çocuk
    { main: 'Anne & Çocuk', sub: 'Bebek Giyim', keywords: ['bebek takımı', 'zıbın', 'bebek tulum', 'bebek battaniyesi'] },
    { main: 'Anne & Çocuk', sub: 'Erkek Çocuk Giyim', keywords: ['erkek çocuk'] },
    { main: 'Anne & Çocuk', sub: 'Kız Çocuk Giyim', keywords: ['kız çocuk'] },
    { main: 'Anne & Çocuk', sub: 'Bebek Bakım', keywords: ['bebek bezi', 'ıslak mendil', 'pişik kremi', 'emzik', 'biberon', 'göğüs pompası'] },
    { main: 'Anne & Çocuk', sub: 'Oyuncak', keywords: ['oyuncak', 'lego', 'puzzle', 'araba', 'bebek', 'peluş', 'kutu oyunu'] },

    // Saat & Aksesuar
    { main: 'Saat & Aksesuar', sub: 'Takı & Mücevher', keywords: ['kolye', 'küpe', 'yüzük', 'bileklik', 'altın', 'gümüş', 'broş', 'tesbih'] },
    { main: 'Saat & Aksesuar', sub: 'Kadın Saat', keywords: ['kadın saat'] },
    { main: 'Saat & Aksesuar', sub: 'Erkek Saat', keywords: ['erkek saat'] },
    { main: 'Saat & Aksesuar', sub: 'Şapka & Bere', keywords: ['şapka', 'bere', 'kasket'] },
    { main: 'Saat & Aksesuar', sub: 'Şal & Eşarp', keywords: ['şal', 'eşarp', 'atkı'] },
    { main: 'Saat & Aksesuar', sub: 'Güneş Gözlüğü', keywords: ['gözlük', 'güneş gözlüğü'] },

    // Spor & Outdoor
    { main: 'Spor & Outdoor', sub: 'Spor Giyim', keywords: ['eşofman', 'spor tayt', 'spor sütyeni', 'forma'] },
    { main: 'Spor & Outdoor', sub: 'Kamp & Doğa', keywords: ['çadır', 'uyku tulumu', 'matara', 'kamp', 'fener'] },
    { main: 'Spor & Outdoor', sub: 'Kondisyon & Fitness', keywords: ['dambıl', 'pilates', 'koşu bandı', 'direnç lastiği'] },
    { main: 'Spor & Outdoor', sub: 'Spor Ekipmanları', keywords: ['futbol topu', 'basketbol topu', 'voleybol', 'tenis', 'bisiklet'] },

    // Kadın & Erkek Giyim (Fallback to main clothing categories based on explicit words)
    { main: 'Erkek', sub: 'İç Giyim', keywords: ['boxer', 'erkek külot', 'erkek atlet', 'erkek çorap', 'erkek pijama'] },
    { main: 'Erkek', sub: 'Giyim', keywords: ['erkek tişört', 'erkek pantolon', 'erkek gömlek', 'erkek mont', 'erkek ceket', 'erkek kaban', 'erkek kazak', 'erkek şort', 'erkek sweatshirt'] },
    
    { main: 'Kadın', sub: 'İç Giyim', keywords: ['sütyen', 'kadın külot', 'kadın atlet', 'pijama', 'gecelik', 'kadın çorap', 'korse', 'jartiyer'] },
    { main: 'Kadın', sub: 'Giyim', keywords: ['elbise', 'kadın tişört', 'kadın pantolon', 'kadın gömlek', 'kadın mont', 'kadın ceket', 'kadın kaban', 'kazak', 'şort', 'etek', 'bluz', 'tunik', 'kadın sweatshirt'] },

    // Super generic fallbacks
    { main: 'Ayakkabı & Çanta', sub: 'Kadın Ayakkabı', keywords: ['ayakkabı', 'sneaker'] },
    { main: 'Kadın', sub: 'Giyim', keywords: ['pantolon', 'gömlek', 'tişört', 'ceket', 'kaban'] }
];

let matchCount = 0;

for (let row of data) {
    const title = (row['Ürün Adı'] || '').toLowerCase();
    const brand = (row['Marka'] || '').toLowerCase();
    const oldMain = (row['Ana Kategori'] || '').toLowerCase();
    const oldSub = (row['Alt Kategori'] || '').toLowerCase();
    
    const combinedText = title + ' ' + brand + ' ' + oldMain + ' ' + oldSub;
    
    let matched = false;
    for (const rule of rules) {
        if (rule.keywords.some(kw => combinedText.includes(kw))) {
            row['Ana Kategori'] = rule.main;
            row['Alt Kategori'] = rule.sub;
            matched = true;
            matchCount++;
            break;
        }
    }
    
    if (!matched) {
        // Fallback for completely unclassified items (try to guess by brand or just put default)
        row['Ana Kategori'] = 'Süpermarket';
        row['Alt Kategori'] = 'Diğer';
    }
}

const updatedCsv = Papa.unparse(data, {
    delimiter: ';',
    quotes: true
});

fs.writeFileSync(path.join('..', 'csvs', 'urunler.csv'), updatedCsv, 'utf8');

console.log('Total items processed:', data.length);
console.log('Successfully categorized:', matchCount);
console.log('Uncategorized (set to default):', data.length - matchCount);
