import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from './firebase';
import { doc, setDoc, increment } from 'firebase/firestore';

export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        const trackView = async () => {
            // Don't track admin pages
            if (location.pathname.startsWith('/admin')) return;

            const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            try {
                // Atomic increment
                const docRef = doc(db, 'stats', dateStr);
                await setDoc(docRef, {
                    date: dateStr,
                    count: increment(1)
                }, { merge: true });
            } catch (err) {
                console.error("Analytics Error:", err);
            }
        };

        trackView();
    }, [location.pathname]);
};
