-- 1. Eğer eski products tablosu varsa sil (Zaten silindiyse sorun değil)
DROP TABLE IF EXISTS public.products CASCADE;

-- 2. Products Tablosunu Oluştur
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  productname text,
  "imgUrl" text,
  brand text,
  price numeric,
  stars numeric,
  reviews numeric,
  social_proof text,
  main_category text,
  sub_category text,
  category_id bigint REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Row Level Security (RLS) Ayarları
-- Herkesin ürünleri okuyabilmesi için:
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- (Sadece Kurulum İçin) Anonim key ile Node.js üzerinden veri basabilmek için geçici INSERT yetkisi veriyoruz:
CREATE POLICY "Products can be inserted by anon during setup" ON public.products FOR INSERT WITH CHECK (true);
