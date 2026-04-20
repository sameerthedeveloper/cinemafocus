import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Initialize Firebase with process.env (Node.js compatible)
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
    console.error("Error: Missing VITE_FIREBASE_API_KEY in .env");
    process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newRelease = {
    title: "SCS-140iW Pro & SCS-240iW Pro Launch",
    excerpt: "Introducing the new reference-class architectural subwoofers from Cinema Focus. The SCS-140iW Pro and SCS-240iW Pro set new standards for in-wall low-frequency performance.",
    content: "Cinema Focus is proud to announce the launch of its latest architectural subwoofer solutions. The SCS-140iW Pro and SCS-240iW Pro are designed to deliver uncompromising bass performance in a discreet in-wall form factor, ensuring that the visual aesthetic of the room is preserved without sacrificing audio quality. Please download the full press release PDF for detailed specifications and features.",
    date: new Date().toISOString(),
    pdfUrl: "https://mcusercontent.com/757a2666cba8d5631d57d04ea/files/09ae448a-6ce4-756c-3c88-72634000c84c/SCS140iW_Pro_SCS240iW_Pro_Press_Release_Distributor_Copy.pdf",
    imageUrl: "/images/product-amp.webp", // Using a placeholder image from existing assets
    coverImages: ["/images/product-amp.webp"],
    status: "published"
};

const main = async () => {
    try {
        console.log("Adding new press release...");
        const docRef = await addDoc(collection(db, "pressReleases"), newRelease);
        console.log("Document written with ID: ", docRef.id);
        console.log("Done.");
        process.exit(0);
    } catch (e) {
        console.error("Error adding document: ", e);
        process.exit(1);
    }
};

main();
