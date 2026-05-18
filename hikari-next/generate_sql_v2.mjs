import fs from 'fs';
import path from 'path';

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

function generate() {
    const catFile = path.join('..', 'kategori_sistemi.txt'); 
    const content = fs.readFileSync(catFile, 'utf8');
    
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentMainCategory = '';
    const flatCategories = [];
    
    for (const line of lines) {
        if (line.startsWith('-')) {
            const subCategory = line.substring(1).trim();
            if (currentMainCategory) {
                const combinedName = `${currentMainCategory}-${subCategory}`;
                flatCategories.push({
                    main_category: currentMainCategory.replace(/'/g, "''"),
                    sub_category: subCategory.replace(/'/g, "''"),
                    slug: turkishSlugify(combinedName)
                });
            }
        } else {
            currentMainCategory = line.trim();
        }
    }

    let sql = `-- 1. Mevcut kategorileri temizle\n`;
    sql += `DELETE FROM categories;\n\n`;

    sql += `-- 2. Sütunları düzenle\n`;
    sql += `ALTER TABLE categories DROP COLUMN IF EXISTS parent_id;\n`;
    sql += `ALTER TABLE categories DROP COLUMN IF EXISTS name;\n`;
    sql += `ALTER TABLE categories ADD COLUMN IF NOT EXISTS main_category TEXT;\n`;
    sql += `ALTER TABLE categories ADD COLUMN IF NOT EXISTS sub_category TEXT;\n\n`;
    
    sql += `-- 3. Yeni kategorileri ekle\n`;
    sql += `INSERT INTO categories (main_category, sub_category, slug) VALUES\n`;
    
    const values = flatCategories.map(c => `('${c.main_category}', '${c.sub_category}', '${c.slug}')`);
    sql += values.join(',\n') + ';\n';
    
    fs.writeFileSync('insert_flat_categories_v2.sql', sql);
    console.log('Successfully generated insert_flat_categories_v2.sql');
}

generate();
