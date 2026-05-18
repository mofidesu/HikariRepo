import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { mapCategory } from './category_mapper.mjs';

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
    const catMap = {};

    categories.forEach(c => {
        const key = `${(c.main_category || '').toLowerCase().trim()}-${(c.sub_category || '').toLowerCase().trim()}`;
        catMap[key] = c.id;
    });

    console.log(`Veritabanından ${categories.length} adet kategori hafızaya alındı.`);

    console.log('Mevcut ürünler siliniyor (Temiz başlangıç)...');
    // UUID formatı beklendiği için id != 0 yerine id is not null kullanıyoruz
    const { error: delError } = await supabase.from('products').delete().not('id', 'is', null);
    if (delError) {
        console.error('Ürünleri silerken hata oluştu:', delError);
        return;
    }

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

    const batchSize = 1000;
    
    for (let i = 0; i < productsData.length; i += batchSize) {
        let batchRows = productsData.slice(i, i + batchSize);
        
        let batch = batchRows.map(row => {
            let priceStr = (row['Fiyat'] || '0').replace(/TL/gi, '').replace(/\./g, '').replace(/,/g, '.').trim();
            let priceNum = parseFloat(priceStr);
            if (isNaN(priceNum)) priceNum = 0;

            let starsStr = (row['Yıldız'] || '0').replace(/,/g, '.');
            let starsNum = parseFloat(starsStr);
            if (isNaN(starsNum)) starsNum = 0;

            let reviewsStr = (row['Yorum Sayısı'] || '0').replace(/\./g, '');
            let reviewsNum = parseInt(reviewsStr, 10);
            if (isNaN(reviewsNum)) reviewsNum = 0;

            // Kategori eşleştirmesi yapılıyor
            const { mappedMain, mappedSub } = mapCategory(row['Ana Kategori'], row['Alt Kategori']);
            
            let categoryId = null;
            if (mappedMain && mappedSub) {
                const key = `${mappedMain.toLowerCase()}-${mappedSub.toLowerCase()}`;
                categoryId = catMap[key] || null;
            }

            return {
                productname: row['Ürün Adı'] || '',
                "imgUrl": row['Resim URL'] || '',
                brand: row['Marka'] || '',
                price: priceNum,
                stars: starsNum,
                reviews: reviewsNum,
                social_proof: row['Sosyal Kanıt (Favori)'] || '',
                main_category: mappedMain,
                sub_category: mappedSub,
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
