-- 1. Kategoriler Tablosunu Oluştur
CREATE TABLE public.categories (
  id numeric PRIMARY KEY,
  category_name text,
  macro_category text
);

-- 2. Güvenlik Politikaları (Herkes okuyabilsin, geçici olarak anonim key ile yazılabilsin)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories can be inserted by anon during setup" ON public.categories FOR INSERT WITH CHECK (true);
