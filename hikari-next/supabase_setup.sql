-- 1. Products (Ürünler) Tablosunu Oluştur
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  productname text,
  "imgUrl" text,
  "productUrl" text,
  stars numeric,
  reviews numeric,
  price numeric,
  category_id numeric,
  isbestseller boolean,
  boughtinlastmonth numeric
);

-- 2. Güvenlik Politikalarını (RLS) Ayarla
-- Herkesin ürünleri okuyabilmesi için:
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- (Sadece Kurulum İçin) Anonim key ile Node.js üzerinden veri basabilmek için geçici INSERT yetkisi veriyoruz:
CREATE POLICY "Products can be inserted by anon during setup" ON public.products FOR INSERT WITH CHECK (true);
