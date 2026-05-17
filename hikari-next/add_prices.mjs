import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const file = path.join('..', 'csvs', 'urunler.csv');
const rawCsv = fs.readFileSync(file, 'utf8');

const parsed = Papa.parse(rawCsv, {
    header: true,
    delimiter: ';',
    skipEmptyLines: true
});

if (parsed.errors.length) {
    console.warn(parsed.errors.slice(0, 5));
}

let data = parsed.data;

// Yardımcı fonksiyon: Belirli aralıkta rastgele .90'lı veya .99'lu fiyat üretir (Örn: 299.90, 1499.00)
function generatePrice(min, max) {
    const rawPrice = Math.floor(Math.random() * (max - min + 1)) + min;
    const endings = [9.90, 9.99, 0.00, 4.90];
    const randomEnding = endings[Math.floor(Math.random() * endings.length)];
    
    let basePrice = Math.floor(rawPrice / 10) * 10;
    if (basePrice === 0) basePrice = 10;
    
    // Çok düşük fiyatlar için ending kısmını küçült (Örn 10-50 tl arası)
    if (basePrice <= 30) return (rawPrice - Math.floor(rawPrice%1) + 0.90).toFixed(2);
    
    return (basePrice - 10 + randomEnding).toFixed(2);
}

// Detaylı Kelime Bazlı Fiyatlandırma Kuralları (Öncelik sırası üstten aşağıdır, en spesifikler üstte olmalı)
const detailedPriceRules = [
    // Elektronik & Telefon
    { keywords: ['kılıf', 'ekran koruyucu', 'şarj kablosu', 'şarj adaptörü', 'telefon tutucu', 'kablo'], min: 100, max: 400 },
    { keywords: ['kulaklık', 'bluetooth kulaklık', 'airpods', 'earbuds'], min: 400, max: 6000 },
    { keywords: ['iphone 11', 'iphone 12', 'iphone 13', 'iphone 14', 'iphone 15', 'samsung galaxy s'], min: 25000, max: 70000 },
    { keywords: ['telefon', 'cep telefonu', 'xiaomi', 'redmi', 'poco'], min: 8000, max: 35000 },
    { keywords: ['powerbank', 'taşınabilir şarj'], min: 300, max: 1500 },
    { keywords: ['pil', 'düğme pil', 'kalem pil', 'şarjlı pil', 'battery', 'cr2032'], min: 30, max: 250 },
    
    // Bilgisayar
    { keywords: ['laptop', 'dizüstü bilgisayar', 'macbook', 'oyuncu bilgisayarı'], min: 15000, max: 80000 },
    { keywords: ['tablet', 'ipad'], min: 5000, max: 30000 },
    { keywords: ['monitör', 'ekran'], min: 3000, max: 15000 },
    { keywords: ['klavye', 'mouse', 'fare'], min: 200, max: 3000 },
    { keywords: ['yazıcı', 'tarayıcı'], min: 3000, max: 12000 },
    { keywords: ['ssd', 'harddisk', 'flash bellek', 'usb bellek'], min: 200, max: 4000 },
    
    // Ev Aletleri & Beyaz Eşya
    { keywords: ['buzdolabı', 'derin dondurucu'], min: 15000, max: 50000 },
    { keywords: ['çamaşır makinesi', 'bulaşık makinesi', 'kurutma makinesi'], min: 12000, max: 35000 },
    { keywords: ['klima'], min: 15000, max: 45000 },
    { keywords: ['fırın', 'ankastre set', 'ocak'], min: 3000, max: 20000 },
    { keywords: ['süpürge', 'robot süpürge', 'dyson'], min: 3000, max: 25000 },
    { keywords: ['ütü', 'blender', 'tost makinesi', 'kahve makinesi', 'çaycı', 'çay makinesi', 'mikser', 'rondo', 'fritöz', 'airfryer'], min: 800, max: 6000 },
    { keywords: ['televizyon', 'tv'], min: 10000, max: 70000 },
    { keywords: ['tıraş makinesi', 'epilatör', 'saç kurutma', 'maşa', 'düzleştirici'], min: 500, max: 5000 },

    // Süpermarket & Gıda & Temizlik
    { keywords: ['pos rulosu', 'rulo kağıt', 'termal rulo', 'yazar kasa rulosu'], min: 50, max: 400 },
    { keywords: ['çikolata', 'bisküvi', 'kraker', 'gofret', 'sakız', 'şekerleme', 'cips', 'fıstık ezmesi', 'krem çikolata'], min: 20, max: 150 },
    { keywords: ['kahve', 'türk kahvesi', 'filtre kahve', 'nescafe', 'çay'], min: 80, max: 400 },
    { keywords: ['zeytinyağı', 'ayçiçek yağı'], min: 200, max: 1000 },
    { keywords: ['makarna', 'pirinç', 'bulgur', 'salça', 'un', 'şeker', 'tuz'], min: 30, max: 300 },
    { keywords: ['su', 'maden suyu', 'kola', 'gazoz', 'meyve suyu'], min: 15, max: 150 },
    { keywords: ['tuvalet kağıdı', 'kağıt havlu', 'peçete', 'ıslak mendil'], min: 40, max: 400 },
    { keywords: ['deterjan', 'çamaşır suyu', 'yumuşatıcı', 'bulaşık tableti', 'sıvı sabun'], min: 60, max: 600 },
    { keywords: ['kedi maması', 'köpek maması', 'kedi kumu'], min: 150, max: 2000 },
    
    // Kırtasiye
    { keywords: ['defter', 'kalem', 'silgi', 'ajanda', 'fotokopi kağıdı', 'bant', 'dosya', 'kutu'], min: 20, max: 300 },
    
    // Kozmetik & Bakım
    { keywords: ['parfüm', 'edp', 'edt'], min: 500, max: 5000 },
    { keywords: ['deodorant', 'roll on', 'roll-on'], min: 80, max: 350 },
    { keywords: ['ruj', 'maskara', 'fondöten', 'kapatıcı', 'eyeliner', 'göz kalemi', 'allık', 'far paleti', 'oje'], min: 150, max: 1200 },
    { keywords: ['şampuan', 'saç kremi', 'saç boyası', 'saç spreyi', 'jöle'], min: 100, max: 800 },
    { keywords: ['diş macunu', 'diş fırçası', 'ağız bakım suyu', 'diş ipi'], min: 60, max: 350 },
    { keywords: ['krem', 'nemlendirici', 'serum', 'güneş kremi', 'peeling', 'tonik', 'yüz yıkama jeli', 'vücut losyonu', 'maske'], min: 150, max: 1500 },
    { keywords: ['tıraş bıçağı', 'tıraş köpüğü', 'tıraş jeli', 'jilet', 'after shave'], min: 50, max: 500 },
    
    // Giyim
    { keywords: ['tişört', 't-shirt', 'atlet', 'bluz'], min: 150, max: 800 },
    { keywords: ['gömlek', 'tunik'], min: 300, max: 1500 },
    { keywords: ['jean', 'kot pantolon', 'kumaş pantolon', 'pantolon', 'eşofman altı'], min: 400, max: 2000 },
    { keywords: ['şort', 'etek', 'tayt'], min: 250, max: 1200 },
    { keywords: ['kazak', 'hırka', 'sweatshirt', 'süveter'], min: 350, max: 2000 },
    { keywords: ['elbise', 'tulum', 'abiye'], min: 500, max: 5000 },
    { keywords: ['mont', 'kaban', 'ceket', 'yağmurluk', 'trençkot', 'palto', 'şişme mont'], min: 1000, max: 8000 },
    { keywords: ['sütyen', 'külot', 'boxer', 'babet çorabı', 'çorap', 'pijama takımı', 'gecelik', 'korse'], min: 50, max: 800 },
    { keywords: ['spor sütyeni', 'spor tayt', 'forma', 'eşofman takımı'], min: 300, max: 1500 },
    
    // Ayakkabı & Çanta
    { keywords: ['spor ayakkabı', 'sneaker', 'yürüyüş ayakkabısı', 'koşu ayakkabısı'], min: 800, max: 6000 },
    { keywords: ['kar botu', 'outdoor bot', 'bot', 'çizme'], min: 1200, max: 8000 },
    { keywords: ['terlik', 'sandalet', 'babet', 'topuklu ayakkabı', 'kundura', 'klasik ayakkabı', 'ayakkabı'], min: 300, max: 3000 },
    { keywords: ['sırt çantası', 'omuz çantası', 'el çantası', 'çapraz çanta', 'postacı çantası', 'kadın çanta', 'erkek çanta', 'cüzdan', 'kartlık'], min: 150, max: 4000 },
    { keywords: ['valiz', 'bavul', 'seyahat çantası'], min: 1000, max: 5000 },
    
    // Ev & Mobilya
    { keywords: ['yatak odası takımı', 'yemek odası takımı', 'koltuk takımı', 'kanepe', 'berjer', 'köşe takımı', 'koltuk'], min: 5000, max: 50000 },
    { keywords: ['masa', 'sandalye', 'sehpa', 'tv ünitesi', 'kitaplık', 'şifonyer', 'gardırop', 'dolap', 'karyola', 'baza'], min: 1500, max: 15000 },
    { keywords: ['nevresim takımı', 'yorgan', 'yastık', 'battaniye', 'pike', 'çarşaf', 'yatak'], min: 300, max: 5000 },
    { keywords: ['halı', 'kilim', 'yolluk', 'perde', 'tül', 'fon perde'], min: 500, max: 6000 },
    { keywords: ['tabak', 'bardak', 'tencere', 'tava', 'çatal bıçak takımı', 'kase', 'fincan takımı', 'çaydanlık', 'saklama kabı', 'termos'], min: 150, max: 4000 },
    { keywords: ['avize', 'abajur', 'lambader', 'ampul', 'led ışık'], min: 100, max: 3000 },
    { keywords: ['tablo', 'çerçeve', 'biblo', 'duvar saati', 'mum', 'tütsü'], min: 100, max: 1500 },
    { keywords: ['havlu', 'bornoz', 'banyo paspası', 'duşakabin', 'klozet', 'banyo dolabı'], min: 150, max: 5000 },
    { keywords: ['matkap', 'tornavida seti', 'çekiç', 'vida', 'anahtar takımı'], min: 100, max: 3000 },
    
    // Bebek & Anne
    { keywords: ['bebek arabası', 'oto koltuğu', 'park yatak', 'ana kucağı', 'mama sandalyesi'], min: 2000, max: 20000 },
    { keywords: ['bebek bezi', 'ıslak mendil', 'pişik kremi'], min: 100, max: 800 },
    { keywords: ['akülü araba', 'oyun halısı', 'lego', 'puzzle', 'peluş', 'oyuncak', 'araba', 'bebek'], min: 150, max: 5000 },
    { keywords: ['bebek tulumu', 'zıbın', 'bebek takımı', 'battaniye'], min: 150, max: 800 },
    { fallbackMain: 'Anne & Çocuk', min: 200, max: 1500 }, // Genel anne bebek eşyaları
    
    // Saat & Aksesuar
    { keywords: ['akıllı saat', 'apple watch', 'samsung watch', 'xiaomi watch'], min: 1000, max: 15000 },
    { keywords: ['pırlanta', 'tektaş', 'çeyrek altın', 'gram altın', '22 ayar', 'altın kolye', 'altın bilezik'], min: 3000, max: 50000 },
    { keywords: ['saat', 'kol saati'], min: 500, max: 10000 },
    { keywords: ['kolye', 'küpe', 'yüzük', 'bileklik', 'gümüş', 'bijuteri', 'broş', 'tesbih'], min: 100, max: 2000 },
    { keywords: ['güneş gözlüğü', 'gözlük'], min: 400, max: 5000 },
    { keywords: ['şapka', 'bere', 'atkı', 'şal', 'eşarp', 'kravat', 'kemer'], min: 100, max: 1000 },
    
    // Spor & Outdoor
    { keywords: ['koşu bandı', 'kondisyon bisikleti', 'eliptik bisiklet'], min: 5000, max: 30000 },
    { keywords: ['bisiklet', 'scooter', 'paten', 'kaykay'], min: 1000, max: 25000 },
    { keywords: ['çadır', 'uyku tulumu', 'mat', 'kamp sandalyesi', 'kamp masası'], min: 500, max: 8000 },
    { keywords: ['dambıl', 'halter', 'direnç lastiği', 'pilates topu', 'yoga matı'], min: 100, max: 2000 },
    { keywords: ['futbol topu', 'basketbol topu', 'voleybol topu', 'raket'], min: 300, max: 2500 }
];

function getLogicalPriceByTitle(title, mainCat, subCat) {
    const lowerTitle = (title || '').toLowerCase();
    
    // 1. Önce isimden yakalamaya çalış
    for (const rule of detailedPriceRules) {
        if (rule.keywords) {
            if (rule.keywords.some(kw => lowerTitle.includes(kw))) {
                return generatePrice(rule.min, rule.max);
            }
        }
    }
    
    // 2. İsimden bulamadıysak Ana Kategori bazlı çok geniş genel değerlere dön (Eski fallback)
    if (mainCat === 'Elektronik') return generatePrice(1500, 15000);
    if (mainCat === 'Ev & Mobilya') return generatePrice(400, 4000);
    if (mainCat === 'Süpermarket') return generatePrice(80, 600);
    if (mainCat === 'Kozmetik') return generatePrice(200, 1500);
    if (mainCat === 'Ayakkabı & Çanta') return generatePrice(800, 4500);
    if (mainCat === 'Saat & Aksesuar') return generatePrice(300, 1500);
    if (mainCat === 'Anne & Çocuk') return generatePrice(200, 2000);
    if (mainCat === 'Spor & Outdoor') return generatePrice(500, 3500);
    if (mainCat === 'Kadın' || mainCat === 'Erkek') return generatePrice(400, 3000);

    return generatePrice(300, 2000);
}

for (let row of data) {
    // Her türlü fiyatı yeniden yazmasını isterseniz aşağıdaki if koşulunu kaldırın.
    // Ancak user'ın isteği üzerine tüm ürünleri bu yeni detaylı mantığa göre güncellemeliyiz.
    row['Fiyat'] = getLogicalPriceByTitle(row['Ürün Adı'], row['Ana Kategori'], row['Alt Kategori']);
}

const updatedCsv = Papa.unparse(data, {
    delimiter: ';',
    quotes: true
});

fs.writeFileSync(path.join('..', 'csvs', 'urunler.csv'), updatedCsv, 'utf8');

console.log('Tüm ürünlerin fiyatları piyasa şartlarına ve ürün adlarına göre tamamen yenilendi!');
