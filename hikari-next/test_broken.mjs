import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) env[parts[0]] = parts.slice(1).join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixBrokenImages() {
    console.log("Fetching broken images...");
    const { data, error } = await supabase
        .from('products')
        .select('id, productname, imgUrl')
        .like('productname', '%","http%');
        
    if (error) {
        console.error("Error fetching:", error);
        return;
    }
    
    console.log(`Found ${data.length} broken products.`);
    
    let count = 0;
    for (const item of data) {
        const splitIdx = item.productname.indexOf('","http');
        if (splitIdx > -1) {
            const realName = item.productname.substring(0, splitIdx);
            const realImgUrl = item.productname.substring(splitIdx + 3); // skip `","`
            
            const { error: updateError } = await supabase
                .from('products')
                .update({ productname: realName, imgUrl: realImgUrl })
                .eq('id', item.id);
                
            if (updateError) {
                console.error(`Failed to update ${item.id}:`, updateError);
            } else {
                count++;
            }
        }
    }
    console.log(`Successfully fixed ${count} products!`);
}

fixBrokenImages();
