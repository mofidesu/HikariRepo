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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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
    console.log('--- FINAL DB FIX SCRIPT ---');

    // 1. Fetch all categories to create a dynamic lookup map
    const { data: categories, error: catError } = await fetchWithRetry(() => supabase.from('categories').select('*'));
    if (catError) {
        console.error('Failed to fetch categories:', catError);
        return;
    }

    const categoryMap = {};
    const mainCategoryDefaultMap = {}; // Fallback if subcategory doesn't match
    categories.forEach(c => {
        const key = `${c.main_category} -> ${c.sub_category}`;
        categoryMap[key] = c.id;
        
        // Save the first encountered ID of a main_category as its fallback
        if (!mainCategoryDefaultMap[c.main_category]) {
            mainCategoryDefaultMap[c.main_category] = c.id;
        }
    });
    
    // Explicit overrides based on user request
    const EVDE_SPOR_ALETLERI_ID = categoryMap["Spor & Outdoor -> Evde Spor Aletleri"] || mainCategoryDefaultMap["Spor & Outdoor"];

    console.log(`Loaded ${categories.length} categories.`);
    
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

    // 3. Analyze and find fixes
    for (const p of allProducts) {
        let newCatId = p.category_id;
        const name = (p.productname || '').toLowerCase();
        
        // FIX A: Barfiks, dambıl, vs in Spor Üst Giyim
        if (p.main_category === 'Spor & Outdoor' && p.sub_category !== 'Evde Spor Aletleri') {
            if (name.includes('barfiks') || name.includes('barfix') || name.includes('dambıl') || name.includes('ağırlık') || name.includes('direnç yayı') || name.includes('pilates') || name.includes('çubuğu') || name.includes('alet')) {
                newCatId = EVDE_SPOR_ALETLERI_ID;
            }
        }

        // FIX B: category_id is completely null
        if (newCatId === null || newCatId === undefined) {
            const comboKey = `${p.main_category} -> ${p.sub_category}`;
            if (categoryMap[comboKey]) {
                newCatId = categoryMap[comboKey];
            } else if (mainCategoryDefaultMap[p.main_category]) {
                // Fallback to the main category's default ID
                newCatId = mainCategoryDefaultMap[p.main_category];
            } else {
                // Ultimate fallback: Just assign to Kadın -> Giyim (or something generic) to prevent nulls
                newCatId = mainCategoryDefaultMap['Kadın']; 
            }
        }

        if (newCatId !== p.category_id && newCatId !== null && newCatId !== undefined) {
            targetUpdates.push({ id: p.id, category_id: newCatId });
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
            const { error } = await fetchWithRetry(() => supabase.from('products').update({ category_id: update.category_id }).eq('id', update.id), 5, 2000);
            if (!error) {
                successCount++;
            }
        } catch (e) {
            // Ignore for logging brevity
        }

        await sleep(40); // 40ms delay to prevent network congestion
        
        if ((i + 1) % 100 === 0) {
            console.log(`Progress: ${i + 1} / ${targetUpdates.length} items updated.`);
        }
    }

    console.log(`\n--- FINAL FIX COMPLETE ---`);
    console.log(`Successfully updated ${successCount} products out of ${targetUpdates.length}!`);
}

main();
