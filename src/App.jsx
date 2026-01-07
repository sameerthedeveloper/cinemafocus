import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Components & Pages
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminAddProduct from './pages/admin/AddProduct';
import SiteControl from './pages/admin/SiteControl';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import AdminMessages from './pages/admin/Messages';
import AdminProjects from './pages/admin/Projects';
import { usePageTracking } from './lib/analytics';

const AppContent = () => {
  usePageTracking();
  return (
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
             <Route path="categories" element={<AdminCategories />} />
             <Route path="users" element={<AdminUsers />} />
             <Route path="messages" element={<AdminMessages />} />
             <Route path="projects" element={<AdminProjects />} />
             <Route path="site-control" element={<SiteControl />} />
          </Route>
        </Route>
        
      </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
