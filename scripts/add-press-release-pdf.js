import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import 'dotenv/config';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newPressRelease = {
    title: "SCS140iW Pro & SCS240iW Pro - New Product Launch",
    date: new Date().toISOString().split('T')[0],
    excerpt: "Introducing the latest in high-performance architectural subwoofers: the SCS140iW Pro and SCS240iW Pro. Engineered for power and precision.",
    imageUrl: "/images/product-speakers.webp", // Defaulting to a speaker image
    pdfUrl: "https://mcusercontent.com/757a2666cba8d5631d57d04ea/files/09ae448a-6ce4-756c-3c88-72634000c84c/SCS140iW_Pro_SCS240iW_Pro_Press_Release_Distributor_Copy.pdf",
    content: "We are thrilled to announce the availability of our newest subwoofer models..."
};

const addRelease = async () => {
    console.log("Adding new press release...");
    try {
        const docRef = await addDoc(collection(db, "press_releases"), newPressRelease);
        console.log("Document written with ID: ", docRef.id);
        console.log("✅ Press Release added successfully.");
    } catch (e) {
        console.error("Error adding document: ", e);
        process.exit(1);
    }
    process.exit(0);
};

addRelease();
