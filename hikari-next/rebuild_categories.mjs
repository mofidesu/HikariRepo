import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Load Env
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) env[parts[0]] = parts.slice(1).join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function turkishSlugify(text) {
    if (!text) return '';
    const charMap = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    };
    const mappedText = text.replace(/[çğışöüÇĞİŞÖÜ]/g, match => charMap[match] || match);
    return slugify(mappedText);
}

async function rebuild() {
    console.log('Reading products.csv...');
    const productsFile = path.join('..', 'products.csv');
    let rawCsv = fs.readFileSync(productsFile, 'utf8');
    
    if (rawCsv.charCodeAt(0) === 0xFEFF) {
        rawCsv = rawCsv.slice(1);
    }

    const parsed = Papa.parse(rawCsv, { header: true, skipEmptyLines: true });
    
    // Extract unique main categories and sub categories
    const mainCategories = new Set();
    const subCategoriesMap = new Map(); // main_category -> Set of sub_categories

    parsed.data.forEach(row => {
        const mainCat = (row['Ana Kategori'] || '').trim();
        const subCat = (row['Alt Kategori'] || '').trim();
        
        if (mainCat) {
            mainCategories.add(mainCat);
            if (!subCategoriesMap.has(mainCat)) {
                subCategoriesMap.set(mainCat, new Set());
            }
            if (subCat) {
                subCategoriesMap.get(mainCat).add(subCat);
            }
        }
    });

    console.log(`Found ${mainCategories.size} main categories.`);
    
    // 1. Delete all existing categories
    console.log('Clearing existing categories...');
    const { error: delError } = await supabase.from('categories').delete().neq('id', 0); // Delete all
    if (delError) {
        console.error('Error deleting categories:', delError);
        return;
    }
    
    // 2. Insert main categories
    const mainCatInsertData = Array.from(mainCategories).map(name => ({
        name: name,
        slug: turkishSlugify(name),
        parent_id: null
    }));
    
    console.log('Inserting main categories...');
    const { data: insertedMains, error: mainErr } = await supabase
        .from('categories')
        .insert(mainCatInsertData)
        .select();
        
    if (mainErr) {
        console.error('Error inserting main categories:', mainErr);
        return;
    }
    
    // Map of main category name to its new ID
    const mainIdMap = {};
    insertedMains.forEach(cat => {
        mainIdMap[cat.name] = cat.id;
    });

    // 3. Insert sub categories
    const subCatInsertData = [];
    subCategoriesMap.forEach((subs, mainCatName) => {
        const mainId = mainIdMap[mainCatName];
        subs.forEach(subName => {
            subCatInsertData.push({
                name: subName,
                slug: turkishSlugify(mainCatName + '-' + subName),
                parent_id: mainId
            });
        });
    });

    console.log(`Inserting ${subCatInsertData.length} sub categories...`);
    const { error: subErr } = await supabase
        .from('categories')
        .insert(subCatInsertData);

    if (subErr) {
        console.error('Error inserting sub categories:', subErr);
        return;
    }

    console.log('Categories successfully rebuilt! Now run npm run import to update product category_ids.');
}

rebuild();
