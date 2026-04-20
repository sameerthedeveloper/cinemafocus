import { seedDatabase } from './src/lib/seeder.js';

console.log("Running seeder...");
seedDatabase()
    .then(() => {
        console.log("Done.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Seeding failed:", err);
        process.exit(1);
    });
