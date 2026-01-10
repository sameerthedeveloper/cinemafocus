import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Components & Pages  (Lazy Loaded)
import AdminLayout from './components/AdminLayout'; // Layout can remain static or lazy, keeping static for sidebar
import ProtectedRoute from './components/ProtectedRoute'; // Keep static for faster auth check

const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminAddProduct = lazy(() => import('./pages/admin/AddProduct'));
const AdminEditProduct = lazy(() => import('./pages/admin/EditProduct'));
const SiteControl = lazy(() => import('./pages/admin/SiteControl'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminProjects = lazy(() => import('./pages/admin/Projects'));
const AdminSEO = lazy(() => import('./pages/admin/SEO'));

import { usePageTracking } from './lib/analytics';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="animate-spin text-primary" size={32} />
  </div>
);

const AppContent = () => {
  usePageTracking();
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
             <Route index element={<Navigate to="/admin/dashboard" replace />} />
             <Route path="dashboard" element={<Dashboard />} />
             <Route path="products" element={<AdminProducts />} />
             <Route path="products/new" element={<AdminAddProduct />} />
             <Route path="products/edit/:id" element={<AdminEditProduct />} />
             <Route path="categories" element={<AdminCategories />} />
             <Route path="users" element={<AdminUsers />} />
             <Route path="messages" element={<AdminMessages />} />
             <Route path="gallery" element={<AdminProjects />} />
             <Route path="seo" element={<AdminSEO />} />
             <Route path="site-control" element={<SiteControl />} />
          </Route>
        </Route>
        
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
    <Helmet>
      <title>Cinema Focus</title>
      <meta name="description" content="Premium Audio & Home Cinema Systems" />
    </Helmet>
    <ScrollToTop />
      <AppContent />
    </Router>
  );
};

export default App;
