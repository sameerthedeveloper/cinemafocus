import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const bucketName = process.env.VITE_SUPABASE_BUCKET || 'images';

console.log(`Checking bucket: ${bucketName} on ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBucket() {
    console.log("Attempting test upload...");

    // Upload a tiny file
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload('health_check.txt', 'OK', { upsert: true });

    if (error) {
        console.error("❌ UPLOAD FAILED");
        console.error("Error Message:", error.message);
        console.error("Details:", error);

        if (error.message.includes("not found")) {
            console.log("\nCONCLUSION: The bucket 'images' DOES NOT EXIST.");
        } else if (error.message.includes("security")) {
            console.log("\nCONCLUSION: One of two things:");
            console.log("1. The bucket exists but is NOT PUBLIC.");
            console.log("2. You need an RLS policy to allow uploads.");
            console.log("Fix: Go to Supabase > Storage > images > Configuration and ensure 'Public Bucket' is ON.");
        }
    } else {
        console.log("✅ UPLOAD SUCCESS!");
        console.log("The bucket exists and is writable.");

        // Cleanup
        await supabase.storage.from(bucketName).remove(['health_check.txt']);
    }
}

checkBucket();
