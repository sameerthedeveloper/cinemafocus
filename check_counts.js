const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: cats, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error(error);
    return;
  }
  console.log("Categories in DB:");
  for (const c of cats) {
    const { count, error: err2 } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category', c.slug);
    console.log(`- ${c.name} (${c.slug}): category.product_count=${c.product_count}, actual products=${count}`);
    
    if (c.product_count !== count) {
       console.log(`  Updating ${c.slug} to ${count}...`);
       await supabase.from('categories').update({ product_count: count }).eq('id', c.id);
    }
  }
  console.log("Done.");
}

check();
