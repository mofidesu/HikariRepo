-- 1. Profiles (Profiller) tablosunu oluştur
-- Bu tablo auth.users (Supabase'in kendi kullanıcı tablosu) ile birebir ilişkilidir.
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name text,
  last_name text,
  cart jsonb DEFAULT '[]'::jsonb,
  favorites jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone
);

-- 2. Güvenlik Politikaları (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi profillerini görebilir
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Kullanıcılar sadece kendi profillerini güncelleyebilir
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. Otomatik Profil Oluşturma Tetikleyicisi (Trigger)
-- Biri kayıt olduğunda otomatik olarak profiles tablosuna da bir kayıt atar.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı auth.users tablosuna bağla
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
