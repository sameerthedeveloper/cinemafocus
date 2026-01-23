import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PressReleases = lazy(() => import('./pages/PressReleases'));
const PressReleaseDetail = lazy(() => import('./pages/PressReleaseDetail'));

// Admin Components & Pages  (Lazy Loaded)
import AdminLayout from './components/AdminLayout'; // Layout can remain static or lazy, keeping static for sidebar
import ProtectedRoute from './components/ProtectedRoute'; // Keep static for faster auth check
import RoleProtectedRoute from './components/RoleProtectedRoute'; // Role-based protection
import PortalLayout from './components/PortalLayout'; // Dealer portal layout

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
const AdminPressReleases = lazy(() => import('./pages/admin/PressReleases'));
const AdminAddPressRelease = lazy(() => import('./pages/admin/AddPressRelease'));
const AdminEditPressRelease = lazy(() => import('./pages/admin/EditPressRelease'));
const AdminNewLaunches = lazy(() => import('./pages/admin/NewLaunches'));
const AdminAddNewLaunch = lazy(() => import('./pages/admin/AddNewLaunch'));

// Portal Pages (Lazy Loaded)
const PortalLogin = lazy(() => import('./pages/portal/Login'));
const PortalDashboard = lazy(() => import('./pages/portal/Dashboard'));
const PortalMessages = lazy(() => import('./pages/portal/Messages'));
const PortalPressReleases = lazy(() => import('./pages/portal/PressReleases'));
const PortalNewLaunches = lazy(() => import('./pages/portal/NewLaunches'));

import { usePageTracking } from './lib/analytics';
import AppleLoader from './components/AppleLoader';
import HomeSkeleton from './components/HomeSkeleton';

const PageLoader = () => (
  <HomeSkeleton />
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
          <Route path="/press" element={<PressReleases />} />
          <Route path="/press/:id" element={<PressReleaseDetail />} />
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
             
             {/* New Sections */}
             <Route path="new-launches" element={<AdminNewLaunches />} />
             <Route path="new-launches/new" element={<AdminAddNewLaunch />} />
             <Route path="press-releases" element={<AdminPressReleases />} />
             <Route path="press-releases/new" element={<AdminAddPressRelease />} />
             <Route path="press-releases/edit/:id" element={<AdminEditPressRelease />} />

             <Route path="categories" element={<AdminCategories />} />
             <Route path="users" element={<AdminUsers />} />
             <Route path="messages" element={<AdminMessages />} />
             <Route path="gallery" element={<AdminProjects />} />
             <Route path="seo" element={<AdminSEO />} />
             <Route path="site-control" element={<SiteControl />} />
          </Route>
        </Route>

        {/* Dealer Portal Routes */}
        <Route path="/portal/login" element={<PortalLogin />} />
        <Route element={<RoleProtectedRoute allowedRoles={['dealer', 'admin']} redirectTo="/portal/login" />}>
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<Navigate to="/portal/dashboard" replace />} />
            <Route path="dashboard" element={<PortalDashboard />} />
            <Route path="messages" element={<PortalMessages />} />
            <Route path="press-releases" element={<PortalPressReleases />} />
            <Route path="new-launches" element={<PortalNewLaunches />} />
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
    <SiteSettingsProvider>
      <ScrollToTop />
      <AppContent />
    </SiteSettingsProvider>
    </Router>
  );
};

export default App;
