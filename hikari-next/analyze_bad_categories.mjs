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

async function main() {
    // Fetch all categories to see what we have
    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    if (catError) {
        console.error('Error fetching categories:', catError);
        return;
    }
    
    const uniqueMainCats = [...new Set(categories.map(c => c.main_category))];
    console.log("Available Main Categories:", uniqueMainCats);
    
    // Check EV & TEMİZLİK items
    const { data: evTemizlikProducts, error: evError } = await supabase.from('products')
        .select('id, productname, main_category, sub_category')
        .eq('main_category', 'EV & TEMİZLİK');
        
    if (evTemizlikProducts) {
        console.log(`\nFound ${evTemizlikProducts.length} items in EV & TEMİZLİK`);
        console.log("Sample items:");
        evTemizlikProducts.slice(0, 10).forEach(p => console.log(`- ${p.productname}`));
    }

    // Check Spor Üst Giyim items
    const { data: sporGiyimProducts, error: sporError } = await supabase.from('products')
        .select('id, productname, main_category, sub_category')
        .eq('sub_category', 'Spor Üst Giyim');
        
    if (sporGiyimProducts) {
        console.log(`\nFound ${sporGiyimProducts.length} items in Spor Üst Giyim`);
        console.log("Sample items with 'matara' or 'suluk':");
        const mataralar = sporGiyimProducts.filter(p => p.productname.toLowerCase().includes('matara') || p.productname.toLowerCase().includes('suluk'));
        mataralar.forEach(p => console.log(`- ${p.productname}`));
    }
}

main();
