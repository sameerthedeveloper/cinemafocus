/**
 * SEO Optimization Script
 * Updates the Supabase database with real SEO and contact data for Cinema Focus India.
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SEO_DATA = {
  siteTitle: 'Cinema Focus',
  titleSuffix: '| Ultimate Audio & Visual Experiences',
  defaultDescription: 'Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Chennai, India. Explore our curated collection of high-end speakers, subwoofers, amplifiers, and turntables.',
  defaultKeywords: 'home cinema, hi-fi audio, premium audio showroom, Chennai, India, ATC, Aurender, home theater'
};

const FOOTER_DATA = {
  address: 'New Decor Towers, No. 71, Dr. Radhakrishnan Salai, Mylapore, Chennai 600004, India',
  phones: ['+91 98410 35821', '044-28117722'],
  email: 'info@cinemafocus.in',
  workingHours: 'Mon - Sat: 11:00 AM - 8:00 PM'
};

async function optimizeSeo() {
  console.log('🚀 Optimizing SEO and Contact settings in Database...');

  // Update SEO
  const { error: seoError } = await supabase
    .from('site_settings')
    .update({ data: SEO_DATA })
    .eq('id', 'seo');
  
  if (seoError) {
    console.error('❌ Failed to update SEO:', seoError.message);
  } else {
    console.log('✅ SEO metadata optimized successfully.');
  }

  // Update Footer (Contact Details)
  const { error: footerError } = await supabase
    .from('site_settings')
    .update({ data: FOOTER_DATA })
    .eq('id', 'footer');

  if (footerError) {
    console.error('❌ Failed to update Contact Data:', footerError.message);
  } else {
    console.log('✅ Contact data optimized successfully.');
  }
  
  console.log('\n🏁 SEO Optimization Complete!');
}

optimizeSeo();
