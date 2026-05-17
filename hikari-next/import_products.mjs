import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// 1. Çevresel değişkenleri (Environment Variables) yükle
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) env[parts[0]] = parts.slice(1).join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function importProducts() {
    console.log('Kategoriler Supabase\'den çekiliyor...');
    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    if (catError) {
        console.error('Kategoriler çekilirken hata oluştu:', catError);
        return;
    }

    // Kategori eşleştirme haritası (Map) oluştur
    const mainCatMap = {};
    const subCatMap = {};

    categories.forEach(c => {
        if (c.parent_id === null) {
            mainCatMap[c.name.toLowerCase().trim()] = c.id;
        }
    });

    categories.forEach(c => {
        if (c.parent_id !== null) {
            subCatMap[`${c.parent_id}-${c.name.toLowerCase().trim()}`] = c.id;
        }
    });

    console.log(`Veritabanından ${categories.length} adet kategori hafızaya alındı.`);

    console.log('products.csv dosyası okunuyor...');
    const productsFile = path.join('..', 'products.csv');
    let rawCsv = fs.readFileSync(productsFile, 'utf8');
    
    // Eğer BOM (Byte Order Mark) varsa temizle
    if (rawCsv.charCodeAt(0) === 0xFEFF) {
        rawCsv = rawCsv.slice(1);
    }

    const parsed = Papa.parse(rawCsv, {
        header: true,
        skipEmptyLines: true
    });

    if (parsed.errors.length > 0) {
        console.warn('CSV okunurken bazı uyarılar oluştu:', parsed.errors.slice(0, 5));
    }

    let productsData = parsed.data;
    console.log(`Toplam ${productsData.length} ürün satırı ayrıştırıldı. Yükleme başlıyor...`);
    
    let successCount = 0;
    let failCount = 0;

    // Supabase tek seferde maksimum ~1000 satır (hatta daha az) insert önerebiliyor, 
    // Yüksek veri miktarı nedeniyle 1000'lik paketler (batch) halinde yükleyeceğiz.
    const batchSize = 1000;
    
    for (let i = 0; i < productsData.length; i += batchSize) {
        let batchRows = productsData.slice(i, i + batchSize);
        
        let batch = batchRows.map(row => {
            // Fiyat bilgisini sayıya çevir: "359,40 TL" -> 359.40
            let priceStr = (row['Fiyat'] || '0').replace(/TL/gi, '').replace(/\./g, '').replace(/,/g, '.').trim();
            let priceNum = parseFloat(priceStr);
            if (isNaN(priceNum)) priceNum = 0;

            // Yıldız ve Yorum Sayısı hesaplaması
            let starsStr = (row['Yıldız'] || '0').replace(/,/g, '.');
            let starsNum = parseFloat(starsStr);
            if (isNaN(starsNum)) starsNum = 0;

            let reviewsStr = (row['Yorum Sayısı'] || '0').replace(/\./g, '');
            let reviewsNum = parseInt(reviewsStr, 10);
            if (isNaN(reviewsNum)) reviewsNum = 0;

            // Kategori ID'sini tespit et
            const mainCatName = (row['Ana Kategori'] || '').toLowerCase().trim();
            const subCatName = (row['Alt Kategori'] || '').toLowerCase().trim();
            
            let categoryId = null;
            if (mainCatName && mainCatMap[mainCatName]) {
                const mainId = mainCatMap[mainCatName];
                if (subCatName && subCatMap[`${mainId}-${subCatName}`]) {
                    categoryId = subCatMap[`${mainId}-${subCatName}`];
                } else {
                    categoryId = mainId; // Eğer alt kategori bulunamazsa ana kategoriye bağla
                }
            }

            return {
                productname: row['Ürün Adı'] || '',
                "imgUrl": row['Resim URL'] || '',
                brand: row['Marka'] || '',
                price: priceNum,
                stars: starsNum,
                reviews: reviewsNum,
                social_proof: row['Sosyal Kanıt (Favori)'] || '',
                main_category: row['Ana Kategori'] || '',
                sub_category: row['Alt Kategori'] || '',
                category_id: categoryId
            };
        });

        const { data, error } = await supabase.from('products').insert(batch);
        
        if (error) {
            console.error(`Batch ${Math.floor(i / batchSize) + 1} yüklenirken hata oluştu:`, error.message);
            failCount += batch.length;
        } else {
            successCount += batch.length;
            process.stdout.write(`\rYükleniyor... Başarılı: ${successCount} / Toplam: ${productsData.length}`);
        }
    }
    
    console.log('\n\n--- Yükleme İşlemi Tamamlandı ---');
    console.log(`Başarıyla Yüklenen: ${successCount}`);
    console.log(`Başarısız / Hata Alınan: ${failCount}`);
}

importProducts();
