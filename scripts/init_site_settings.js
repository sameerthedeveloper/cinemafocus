/**
 * Site Settings Initialization Script
 * 
 * Ensures all required rows exist in the site_settings table.
 * Uses upsert to avoid overwriting existing data while ensuring structure.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DEFAULT_SETTINGS = [
  {
    id: 'general',
    data: {
      showDesktopMenu: true,
      showPrice: true,
      siteName: 'Cinema Focus',
      supportEmail: 'contact@cinemafocus.com'
    }
  },
  {
    id: 'seo',
    data: {
      siteTitle: 'Cinema Focus',
      titleSuffix: '| Ultimate Audio & Visual Experiences',
      defaultDescription: 'Cinema Focus delivers reference-class Home Cinema & Hi-Fi audio systems in Chennai, India. Explore our curated collection of high-end speakers, subwoofers, amplifiers, and turntables.',
      defaultKeywords: 'home cinema, hi-fi audio, premium audio showroom, Chennai, India, ATC, Aurender, home theater'
    }
  },
  {
    id: 'hero_main',
    data: {
      title: 'Sound, unbound.',
      subtitle: 'Experience music in its purest form with our curated collection of world-class audio systems.',
      ctaText: 'Discover Collection',
      ctaLink: '/products',
      imageUrl: 'products/atc/atc-scm-100a-sl-pro/atc-scm-100a-sl-pro-0.png'
    }
  },
  {
    id: 'footer',
    data: {
      address: 'New Decor Towers, No. 71, Dr. Radhakrishnan Salai, Mylapore, Chennai 600004, India',
      phones: ['+91 98410 35821', '044-28117722'],
      email: 'info@cinemafocus.in',
      workingHours: 'Mon - Sat: 11:00 AM - 8:00 PM'
    }
  },
  {
    id: 'philosophy',
    data: {
      title: 'Our Philosophy',
      text: 'We believe that audio should be felt, not just heard. Our mission is to bring the reference-standard audio experience into your home.'
    }
  },
  {
    id: 'trust_badges',
    data: {
      items: [
        { icon: 'ShieldCheck', title: '5-Year Warranty', description: 'On all components' },
        { icon: 'Award', title: 'Authorized Dealer', description: '100% Genuine' }
      ]
    }
  }
];

async function init() {
  console.log('🚀 Initializing Site Settings...');

  for (const setting of DEFAULT_SETTINGS) {
    // Check if row exists
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('id', setting.id)
      .single();

    if (!existing) {
      console.log(`   ➕ Creating ${setting.id}...`);
      const { error } = await supabase
        .from('site_settings')
        .insert(setting);
      if (error) console.error(`      ❌ Error creating ${setting.id}:`, error.message);
    } else {
      console.log(`   ✅ ${setting.id} already exists.`);
    }
  }

  console.log('\n🏁 Site Settings Initialization Complete!');
}

init();
