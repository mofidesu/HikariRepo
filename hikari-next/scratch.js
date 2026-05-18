const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  line = line.replace('\r', '');
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const lastUserMsg = "bahçeme koymak için mobilya önerileri";
    const cleanText = lastUserMsg.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").toLowerCase();
    const words = cleanText.split(/\s+/);
    
    const stopWords = new Set([
      'bir', 've', 'de', 'da', 'için', 'çok', 'mi', 'mı', 'var', 'yok', 'bul', 
      'öner', 'tavsiye', 'et', 'yap', 'al', 'sat', 'lazım', 'gerek', 'istiyorum', 
      'benim', 'senin', 'kendi', 'ile', 'en', 'daha', 'ise', 'ki', 'ama', 'fakat', 
      'lakin', 'ancak', 'bu', 'şu', 'o', 'ne', 'nasıl', 'neden', 'niye', 'kim',
      'nerede', 'neye', 'kime', 'bana', 'bunu', 'şunu', 'onu'
    ]);
    
    const suffixes = [
      'umuz', 'ümüz', 'imiz', 'ımız', 
      'miz', 'niz', 'ler', 'lar', 
      'yim', 'yim', 'yum', 'yüm',
      'ım', 'im', 'um', 'üm', 
      'ın', 'in', 'un', 'ün',
      'da', 'de', 'ta', 'te',
      'sı', 'si', 'su', 'sü'
    ];

    const keywords = words
      .filter(w => w.length > 2 && !stopWords.has(w))
      .map(word => {
        let root = word;
        for (const suffix of suffixes) {
          if (root.endsWith(suffix) && root.length - suffix.length >= 3) {
            root = root.slice(0, -suffix.length);
            break;
          }
        }
        return root;
      });

    console.log("Keywords to search:", keywords);

    const searchPromises = keywords.map(async (kw) => {
        const { data } = await supabase
        .from('products')
        .select('productname, main_category, sub_category')
        .or(`productname.ilike.%${kw}%,sub_category.ilike.%${kw}%`)
        .limit(5);
        
        console.log(`Results for keyword "${kw}":`, data ? data.length : 0);
        if (data && data.length > 0) {
            console.log(data.map(d => d.productname));
        }
        return data || [];
    });

    await Promise.all(searchPromises);
}

test();
