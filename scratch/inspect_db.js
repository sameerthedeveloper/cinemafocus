const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log("Fetching categories...");
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*');

  if (catError) {
    console.error("Error fetching categories:", catError);
  } else {
    console.log("Active Categories in Database:", categories);
  }

  console.log("\nFetching product count...");
  const { count, error: prodError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (prodError) {
    console.error("Error fetching products count:", prodError);
  } else {
    console.log("Total Products in Database:", count);
  }
}

inspect();
