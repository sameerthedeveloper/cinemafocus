-- =========================================================================
-- Cinema Focus - Postgres Schema Migration
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. USERS TABLE (Extending Supabase Auth)
-- =========================================================================
-- We rely on auth.users for authentication, but keep a public.users table 
-- for custom roles and application-level profile data.

-- Helper function to check admin status safely across all policies
-- SECURITY DEFINER allows it to bypass RLS for its internal check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'dealer' CHECK (role IN ('admin', 'dealer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins have full access to users" ON public.users USING (
  public.is_admin()
);

-- Function to automatically create a user profile when auth.users is populated
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    COALESCE(new.raw_user_meta_data->>'role', 'dealer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- =========================================================================
-- 2. PRODUCTS TABLE
-- =========================================================================
CREATE TABLE public.products (
  id TEXT PRIMARY KEY, -- We use string slug as ID for compatibility
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can modify products" ON public.products USING (
  public.is_admin()
);

-- =========================================================================
-- 3. CATEGORIES TABLE
-- =========================================================================
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY, -- We use string slug as ID for compatibility
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can modify categories" ON public.categories USING (
  public.is_admin()
);

-- =========================================================================
-- 4. NEW LAUNCHES TABLE
-- =========================================================================
CREATE TABLE public.new_launches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT,
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT true,
  original_product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.new_launches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view new launches" ON public.new_launches FOR SELECT USING (true);
CREATE POLICY "Admins can modify new launches" ON public.new_launches USING (
  public.is_admin()
);

-- =========================================================================
-- 5. PRESS RELEASES TABLE
-- =========================================================================
CREATE TABLE public.press_releases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  cover_images TEXT[] DEFAULT '{}',
  pdf_url TEXT,
  content_blocks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view press releases" ON public.press_releases FOR SELECT USING (true);
CREATE POLICY "Admins can modify press releases" ON public.press_releases USING (
  public.is_admin()
);

-- =========================================================================
-- 6. PROJECTS (GALLERY) TABLE
-- =========================================================================
CREATE TABLE public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  image_position TEXT DEFAULT 'center',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration helper for existing projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center';
UPDATE public.projects SET featured = false WHERE featured IS NULL;
UPDATE public.projects SET image_position = 'center' WHERE image_position IS NULL;

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can modify projects" ON public.projects USING (
  public.is_admin()
);

-- =========================================================================
-- 7. MESSAGES TABLE
-- =========================================================================
CREATE TABLE public.messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  text TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and modify messages" ON public.messages USING (
  public.is_admin()
);

-- =========================================================================
-- 8. SITE SETTINGS
-- =========================================================================
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY, -- e.g. 'hero_main', 'philosophy', 'footer', 'seo', 'general'
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify site settings" ON public.site_settings USING (
  public.is_admin()
);

-- =========================================================================
-- 9. ANALYTICS (STATS) TABLE
-- =========================================================================
CREATE TABLE public.stats (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can update stats via RPC" ON public.stats USING (true);
CREATE POLICY "Admins can view stats" ON public.stats USING (
  public.is_admin()
);

-- RPC for atomic increment
CREATE OR REPLACE FUNCTION public.increment_stat(d DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO public.stats (date, count)
  VALUES (d, 1)
  ON CONFLICT (date) DO UPDATE 
  SET count = stats.count + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================================================
-- 10. STORAGE BUCKETS & POLICIES
-- =========================================================================
-- Note: These should be run in the SQL Editor. 
-- Ensure the 'images' bucket exists in your Supabase Dashboard.

-- Policy: Allow public read access to images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );

-- Policy: Allow admins to upload/update/delete images
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK ( 
  bucket_id = 'images' AND 
  public.is_admin() 
);

CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING ( 
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') 
);

CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING ( 
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') 
);
