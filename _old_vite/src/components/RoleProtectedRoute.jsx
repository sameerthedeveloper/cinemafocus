import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

/**
 * RoleProtectedRoute - Protects routes based on user roles
 * @param {string[]} allowedRoles - Array of roles that can access this route
 * @param {string} redirectTo - Where to redirect if unauthorized
 */
const RoleProtectedRoute = ({ allowedRoles = ['admin'], redirectTo = '/admin/login' }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || 'dealer'); // Default to dealer if no role set
          } else {
            // If user document doesn't exist, check if they're in admins collection (legacy)
            const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
            setRole(adminDoc.exists() ? 'admin' : 'dealer');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRole('dealer'); // Default to lowest privilege
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Authenticated but wrong role
  if (!allowedRoles.includes(role)) {
    // Redirect dealers trying to access admin to portal
    if (role === 'dealer' && redirectTo === '/admin/login') {
      return <Navigate to="/portal/dashboard" replace />;
    }
    // Redirect admins trying to access portal-only routes to admin
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet context={{ user, role }} />;
};

export default RoleProtectedRoute;
