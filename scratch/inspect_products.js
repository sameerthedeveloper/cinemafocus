const admin = require('firebase-admin');
const path = require('path');
const SERVICE_ACCOUNT_PATH = path.join(process.cwd(), 'firebase-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(require(SERVICE_ACCOUNT_PATH))
});

const db = admin.firestore();

async function inspect() {
    const snapshot = await db.collection('products').limit(1).get();
    if (snapshot.empty) {
        console.log('No products found');
        return;
    }
    console.log('--- PRODUCT DATA ---');
    console.log(JSON.stringify(snapshot.docs[0].data(), null, 2));
    process.exit(0);
}

inspect();
