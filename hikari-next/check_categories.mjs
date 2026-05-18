import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) env[parts[0]] = parts.slice(1).join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    const { data: categories, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error(error);
        return;
    }
    
    const catMap = new Set();
    categories.forEach(c => {
        catMap.add(`${(c.main_category || '').toLowerCase().trim()}-${(c.sub_category || '').toLowerCase().trim()}`);
    });

    const productsFile = path.join('..', 'products.csv');
    let rawCsv = fs.readFileSync(productsFile, 'utf8');
    if (rawCsv.charCodeAt(0) === 0xFEFF) {
        rawCsv = rawCsv.slice(1);
    }
    const parsed = Papa.parse(rawCsv, { header: true, skipEmptyLines: true });
    
    const unmatched = new Map();
    let totalUnmatched = 0;
    
    parsed.data.forEach(row => {
        const mainCatName = (row['Ana Kategori'] || '').trim();
        const subCatName = (row['Alt Kategori'] || '').trim();
        const key = `${mainCatName.toLowerCase()}-${subCatName.toLowerCase()}`;
        
        if (!catMap.has(key)) {
            const displayKey = `${mainCatName} > ${subCatName}`;
            unmatched.set(displayKey, (unmatched.get(displayKey) || 0) + 1);
            totalUnmatched++;
        }
    });

    console.log(`Total unmatched products: ${totalUnmatched}`);
    console.log(`Unique unmatched categories: ${unmatched.size}`);
    
    // Sort and print top 20
    const sorted = [...unmatched.entries()].sort((a, b) => b[1] - a[1]);
    sorted.slice(0, 30).forEach(([k, v]) => {
        console.log(`${k}: ${v} products`);
    });
}

check();
