const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const { data, error } = await supabase.from('products').select('*').limit(1).single();
    if (error) {
        console.error('Error fetching product:', error.message);
        return;
    }
    console.log('--- SUPABASE PRODUCT DATA ---');
    console.log(JSON.stringify(data, null, 2));
}

check();
