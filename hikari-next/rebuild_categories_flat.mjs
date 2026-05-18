import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
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
    console.log('Reading kategori sistemi.txt...');
    const catFile = path.join('..', 'kategori sistemi.txt');
    const content = fs.readFileSync(catFile, 'utf8');
    
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentMainCategory = '';
    const flatCategories = [];
    
    for (const line of lines) {
        if (line.startsWith('-')) {
            // It's a sub category
            const subCategory = line.substring(1).trim();
            if (currentMainCategory) {
                const combinedName = `${currentMainCategory}, ${subCategory}`;
                flatCategories.push({
                    name: combinedName,
                    slug: turkishSlugify(combinedName)
                });
            }
        } else {
            // It's a main category
            currentMainCategory = line.trim();
        }
    }

    console.log(`Found ${flatCategories.length} flat categories to insert.`);
    
    // 1. Delete all existing categories
    console.log('Clearing existing categories...');
    const { error: delError } = await supabase.from('categories').delete().neq('id', 0);
    if (delError) {
        console.error('Error deleting categories:', delError);
        return;
    }
    
    // 2. Insert flat categories
    console.log('Inserting flat categories...');
    const { data: inserted, error: insertErr } = await supabase
        .from('categories')
        .insert(flatCategories)
        .select();
        
    if (insertErr) {
        console.error('Error inserting flat categories:', insertErr);
        return;
    }
    
    console.log(`Successfully inserted ${inserted.length} categories.`);
    console.log('Categories successfully rebuilt! Now run import_products.mjs to update product category_ids.');
}

rebuild();
