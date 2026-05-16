import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tdqqfbuftgmnlzirexjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcXFmYnVmdGdtbmx6aXJleGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MzgzOTEsImV4cCI6MjA5NDQxNDM5MX0.QuwUSAYlZU9ohCUonAOa_Jc48dsV7F-JFFLfY02rASw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Error fetching products:', error);
  } else {
    console.log('Products fetched successfully:', data);
  }
}

test();
