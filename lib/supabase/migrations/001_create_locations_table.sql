-- Create locations table for GEO + local SEO
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  locality TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  hours_open TEXT NOT NULL DEFAULT '10:00',
  hours_close TEXT NOT NULL DEFAULT '19:00',
  hours_sunday_open TEXT,
  hours_sunday_close TEXT,
  service_area TEXT DEFAULT 'pan-india',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on is_primary for faster queries
CREATE INDEX IF NOT EXISTS idx_locations_primary ON locations(is_primary);

-- Create index on city for local queries
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);

-- Insert Cinema Focus primary showroom
INSERT INTO locations
  (business_name, street_address, locality, city, state, postal_code, country, latitude, longitude, phone, email, hours_open, hours_close, hours_sunday_open, hours_sunday_close, service_area, is_primary)
VALUES
  (
    'Cinema Focus',
    'New Decor Towers, Plot No. 71, Dr. Radhakrishnan Salai',
    'Mylapore',
    'Chennai',
    'Tamil Nadu',
    '600004',
    'India',
    13.0415,
    80.2720,
    '+91-4428117722',
    'info@cinemafocus.in',
    '10:00',
    '19:00',
    '11:00',
    '17:00',
    'pan-india',
    true
  )
ON CONFLICT DO NOTHING;
