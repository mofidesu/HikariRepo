import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

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

function generateSQL() {
    console.log('Reading products.csv...');
    const productsFile = path.join('..', 'products.csv');
    let rawCsv = fs.readFileSync(productsFile, 'utf8');

    if (rawCsv.charCodeAt(0) === 0xFEFF) {
        rawCsv = rawCsv.slice(1);
    }

    const parsed = Papa.parse(rawCsv, { header: true, skipEmptyLines: true });

    const mainCategories = new Set();
    const subCategoriesMap = new Map();

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

    let sql = `-- Otomatik Oluşturulan Kategori Tablosu Güncellemesi\n\n`;
    sql += `DELETE FROM categories;\n\n`;

    let mainCatId = 1;
    let subCatId = 1000;

    sql += `-- Ana Kategoriler\n`;
    const mainIdMap = {};
    mainCategories.forEach(mainCat => {
        const slug = turkishSlugify(mainCat);
        sql += `INSERT INTO categories (id, name, slug, parent_id) VALUES (${mainCatId}, '${mainCat.replace(/'/g, "''")}', '${slug}', NULL);\n`;
        mainIdMap[mainCat] = mainCatId;
        mainCatId++;
    });

    sql += `\n-- Alt Kategoriler\n`;
    subCategoriesMap.forEach((subs, mainCatName) => {
        const parentId = mainIdMap[mainCatName];
        subs.forEach(subCat => {
            const slug = turkishSlugify(mainCatName + '-' + subCat);
            sql += `INSERT INTO categories (id, name, slug, parent_id) VALUES (${subCatId}, '${subCat.replace(/'/g, "''")}', '${slug}', ${parentId});\n`;
            subCatId++;
        });
    });

    // Also generate the UPDATE query for products
    sql += `\n\n-- Ürünlerin category_id Değerlerini Güncelleme\n`;
    sql += `
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.name = p.sub_category 
  AND c.parent_id = (SELECT id FROM categories WHERE name = p.main_category LIMIT 1);
  
-- Alt kategorisi olmayan ana kategoriye ait ürünler
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.name = p.main_category AND c.parent_id IS NULL AND p.sub_category = '';
`;

    fs.writeFileSync('rebuild_categories.sql', sql);
    console.log(`Successfully generated rebuild_categories.sql with ${mainCatId - 1} main categories and ${subCatId - 1000} sub categories.`);
}

generateSQL();
