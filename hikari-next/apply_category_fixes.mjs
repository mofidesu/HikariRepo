import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('.env.local', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(apiCall, retries = 5, delayMs = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await apiCall();
            if (result.error && result.error.message && result.error.message.includes('fetch failed')) {
                throw new Error('fetch failed');
            }
            return result;
        } catch (err) {
            if (i === retries - 1) throw err;
            await sleep(delayMs);
        }
    }
}

async function main() {
    console.log('--- STARTING CATEGORY FIX SCRIPT ---');

    // 1. Fetch all categories
    const { data: categories, error: catError } = await fetchWithRetry(() => supabase.from('categories').select('*'));
    if (catError) {
        console.error('Failed to fetch categories:', catError);
        return;
    }

    const categoryMap = {};
    categories.forEach(c => {
        const key = `${c.main_category} -> ${c.sub_category}`;
        categoryMap[key] = c.id;
    });

    // 2. Fetch all products
    console.log('Fetching all products...');
    let allProducts = [];
    let start = 0;
    const pageSize = 1000;
    while (true) {
        const { data, error } = await fetchWithRetry(() => supabase.from('products').select('id, productname, main_category, sub_category, category_id').range(start, start + pageSize - 1));
        if (error || !data || data.length === 0) break;
        allProducts = allProducts.concat(data);
        start += pageSize;
    }

    console.log(`Total products scanned: ${allProducts.length}`);

    const targetUpdates = [];

    // 3. Analyze and fix
    for (const p of allProducts) {
        const name = (p.productname || '').toLowerCase();
        let newMain = p.main_category;
        let newSub = p.sub_category;

        let needsChange = false;

        if (name.includes('matara') || name.includes('suluk')) {
            newMain = 'Spor & Outdoor';
            newSub = 'Spor Malzemeleri';
            needsChange = true;
        } else if (name.includes('krampon')) {
            newMain = 'Spor & Outdoor';
            newSub = 'Spor Ayakkabı';
            needsChange = true;
        } else if (name.includes('çorap') || name.includes('soket')) {
            if (name.includes('erkek')) {
                newMain = 'Erkek';
                newSub = 'İç Giyim';
            } else {
                newMain = 'Kadın';
                newSub = 'Ev & İç Giyim';
            }
            needsChange = true;
        } else if (name.includes('çizme')) {
            newMain = 'Kadın';
            newSub = 'Ayakkabı';
            needsChange = true;
        }

        if (needsChange) {
            const comboKey = `${newMain} -> ${newSub}`;
            const newCatId = categoryMap[comboKey];

            if (newCatId && newCatId !== p.category_id) {
                targetUpdates.push({ 
                    id: p.id, 
                    category_id: newCatId,
                    main_category: newMain,
                    sub_category: newSub,
                    old_main: p.main_category,
                    old_sub: p.sub_category
                });
            }
        }
    }

    console.log(`Found ${targetUpdates.length} items that need fixing.`);

    if (targetUpdates.length === 0) {
        console.log('Everything is perfectly clean!');
        return;
    }

    // 4. Execute updates
    let successCount = 0;
    for (let i = 0; i < targetUpdates.length; i++) {
        const update = targetUpdates[i];
        try {
            const { error } = await fetchWithRetry(() => supabase.from('products').update({ 
                category_id: update.category_id,
                main_category: update.main_category,
                sub_category: update.sub_category
            }).eq('id', update.id), 5, 2000);
            
            if (!error) {
                successCount++;
            }
        } catch (e) {
            console.error('Update error on ID', update.id, e.message);
        }

        await sleep(30); 
        
        if ((i + 1) % 100 === 0) {
            console.log(`Progress: ${i + 1} / ${targetUpdates.length} items updated.`);
        }
    }

    console.log(`\n--- FINAL FIX COMPLETE ---`);
    console.log(`Successfully updated ${successCount} products out of ${targetUpdates.length}!`);
}

main();
