-- 1. Ürünler tablosundaki category_id sütununu Kategoriler tablosundaki id sütununa bağla
ALTER TABLE public.products
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id)
REFERENCES public.categories (id);
