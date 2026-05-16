import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import Papa from 'papaparse';

const supabaseUrl = 'https://tdqqfbuftgmnlzirexjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcXFmYnVmdGdtbmx6aXJleGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MzgzOTEsImV4cCI6MjA5NDQxNDM5MX0.QuwUSAYlZU9ohCUonAOa_Jc48dsV7F-JFFLfY02rASw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedCategories() {
    console.log('Reading and parsing Categories CSV...');
    
    let rawCsv = fs.readFileSync('../csvs/categories.csv', 'utf8');
    
    // Clean up BOM if present
    if (rawCsv.charCodeAt(0) === 0xFEFF) {
        rawCsv = rawCsv.slice(1);
    }

    // Parse the CSV
    const parsed = Papa.parse(rawCsv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    });

    if (parsed.errors.length > 0) {
        console.warn('CSV parsing finished with some warnings/errors:', parsed.errors);
    }

    let categoriesData = parsed.data;
    
    // Clean up data types
    categoriesData = categoriesData.map(item => ({
        id: Number(item.id) || 0,
        category_name: String(item.category_name),
        macro_category: String(item.macro_category),
    }));

    console.log(`Parsed ${categoriesData.length} valid categories. Let's upload to Supabase!`);
    
    // Upload all at once since it's only ~160 rows
    const { data, error } = await supabase.from('categories').insert(categoriesData);
    
    if (error) {
        console.error('Error inserting categories:', error.message);
    } else {
        console.log('Successfully inserted categories!');
    }
}

seedCategories();
