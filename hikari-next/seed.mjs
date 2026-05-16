import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import Papa from 'papaparse';

const supabaseUrl = 'https://tdqqfbuftgmnlzirexjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcXFmYnVmdGdtbmx6aXJleGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MzgzOTEsImV4cCI6MjA5NDQxNDM5MX0.QuwUSAYlZU9ohCUonAOa_Jc48dsV7F-JFFLfY02rASw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedProducts() {
    console.log('Reading and parsing CSV...');
    
    // Read the file and clean up the extra quotes
    // The file seems to have lines wrapped in an extra set of quotes and inner quotes doubled
    let rawCsv = fs.readFileSync('../csvs/products.csv', 'utf8');
    
    // Clean up BOM if present
    if (rawCsv.charCodeAt(0) === 0xFEFF) {
        rawCsv = rawCsv.slice(1);
    }

    // Since the CSV is incorrectly quoted, we fix it by removing the outermost quotes on each line and replacing "" with "
    let lines = rawCsv.split('\n');
    lines = lines.map(line => {
        let cleaned = line.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
            cleaned = cleaned.substring(1, cleaned.length - 1);
        }
        cleaned = cleaned.replace(/""/g, '"');
        return cleaned;
    });
    
    const cleanedCsv = lines.join('\n');

    // Parse the cleaned CSV
    const parsed = Papa.parse(cleanedCsv, {
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
        
        // Clean up data types before inserting
        batch = batch.map(item => ({
            productname: item.productname ? String(item.productname) : '',
            imgUrl: item.imgUrl ? String(item.imgUrl) : '',
            productUrl: item.productUrl ? String(item.productUrl) : '',
            stars: Number(item.stars) || 0,
            reviews: Number(item.reviews) || 0,
            price: Number(item.price) || 0,
            category_id: Number(item.category_id) || 0,
            isbestseller: String(item.isbestseller).toLowerCase() === 'true',
            boughtinlastmonth: Number(item.boughtinlastmonth) || 0,
        }));

        const { data, error } = await supabase.from('products').insert(batch);
        
        if (error) {
            console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        } else {
            console.log(`Successfully inserted batch ${Math.floor(i / batchSize) + 1} (Rows ${i} to ${i + batch.length - 1})`);
        }
    }
    console.log('Finished seeding products!');
}

seedProducts();
