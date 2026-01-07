import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, setDoc, increment, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        const trackView = async () => {
            // Don't track admin pages
            if (location.pathname.startsWith('/admin')) return;

            const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const docId = `visits_${dateStr}`;
            const docRef = doc(db, "stats", docId);

            try {
                // Try to update existing day
                await updateDoc(docRef, {
                    count: increment(1)
                });
            } catch (e) {
                // If doesn't exist, create it (careful with race conditions, but fine for simple stats)
                try {
                    const snap = await getDoc(docRef);
                    if (!snap.exists()) {
                        await setDoc(docRef, {
                            date: dateStr,
                            count: 1
                        });
                    } else {
                        // Retry update if it existed but update failed (rare edge case)
                        await updateDoc(docRef, { count: increment(1) });
                    }
                } catch (err) {
                    console.error("Analytics Error:", err);
                }
            }
        };

        trackView();
    }, [location.pathname]);
};
