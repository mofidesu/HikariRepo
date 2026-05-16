-- Fiyatları Dolar'dan (USD) Türk Lirası'na (TRY) çevirmek için SQL komutu
-- Dolar kurunu güncel bir ortalama olarak 32.25 aldık ve yuvarlama işlemi (ROUND) ekledik.

UPDATE public.products
SET price = ROUND((price * 32.25)::numeric, 2)
WHERE price > 0;
