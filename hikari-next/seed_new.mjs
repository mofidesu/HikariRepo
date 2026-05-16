import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import Papa from 'papaparse';

// Load env vars
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) env[parts[0]] = parts.slice(1).join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function seedNewProducts() {
    console.log('Fetching valid categories...');
    const { data: categories, error: catError } = await supabase.from('categories').select('id');
    if (catError) {
        console.error('Failed to fetch categories:', catError);
        return;
    }
    const validCategoryIds = new Set(categories.map(c => c.id));
    console.log(`Found ${validCategoryIds.size} valid categories.`);

    console.log('Ensure you have wiped the existing products manually via SQL!');

    console.log('Reading and parsing new CSV (products_new2.csv)...');
    let rawCsv = fs.readFileSync('../csvs/products_new2.csv', 'utf8');
    
    // Clean up BOM if present
    if (rawCsv.charCodeAt(0) === 0xFEFF) {
        rawCsv = rawCsv.slice(1);
    }

    // Parse the new CSV
    const parsed = Papa.parse(rawCsv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically converts numbers and booleans
    });

    if (parsed.errors.length > 0) {
        console.warn('CSV parsing finished with some warnings/errors:', parsed.errors.slice(0, 5));
    }

    const productsData = parsed.data;
    console.log(`Parsed ${productsData.length} valid rows. Let's upload to Supabase!`);
    
    // Upload in batches of 100
    const batchSize = 100;
    for (let i = 0; i < productsData.length; i += batchSize) {
        let batch = productsData.slice(i, i + batchSize);
        
        batch = batch.map(item => {
            // Check if category_id is valid, otherwise set to null
            let catId = Number(item.category_id);
            if (isNaN(catId) || !validCategoryIds.has(catId)) {
                catId = null;
            }

            return {
                productname: item.title ? String(item.title) : '',
                imgUrl: item.imgUrl ? String(item.imgUrl) : '',
                productUrl: '', // empty as it doesn't exist in new CSV
                stars: Number(item.stars) || 0,
                reviews: Number(item.reviews) || 0,
                price: Number(item.price) || 0,
                category_id: catId,
                isbestseller: String(item.isBestSeller).toLowerCase() === 'true',
                boughtinlastmonth: Number(item.boughtInLastMonth) || 0,
            };
        });

        const { data, error } = await supabase.from('products').insert(batch);
        
        if (error) {
            console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        } else {
            process.stdout.write(`\rSuccessfully inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(productsData.length / batchSize)}`);
        }
    }
    console.log('\nFinished seeding new products!');
}

seedNewProducts();
