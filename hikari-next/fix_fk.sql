-- 1. Kategoriler tablosunda olmayan (örneğin ID'si 0 olan) "yetim" kategori ID'lerini NULL olarak güncelle
UPDATE public.products 
SET category_id = NULL 
WHERE category_id NOT IN (SELECT id FROM public.categories);

-- 2. İlişkiyi şimdi sorunsuz bir şekilde kur
ALTER TABLE public.products
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id)
REFERENCES public.categories (id);
