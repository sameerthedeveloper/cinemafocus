import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, ArrowLeft, Settings, LayoutGrid, Users, MessageSquare, Image, Search, Newspaper, Sparkles, Menu, X } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import clsx from 'clsx';
const logo = '/images/logo.webp';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "New Launches", path: "/admin/new-launches", icon: Sparkles },
    { label: "Press Releases", path: "/admin/press-releases", icon: Newspaper },
    { label: "Categories", path: "/admin/categories", icon: LayoutGrid },
    { label: "Gallery", path: "/admin/gallery", icon: Image },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Messages", path: "/admin/messages", icon: MessageSquare },
    { label: "SEO", path: "/admin/seo", icon: Search },
    { label: "Site Control", path: "/admin/site-control", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-background border-b border-border p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
         <div className="flex items-center gap-3">
             <img src={logo} alt="Cinema Focus" className="h-6 w-auto" />
             <span className="font-medium text-sm text-foreground uppercase tracking-widest">Admin</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-lg">
             <Menu size={24} />
         </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
            "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static h-full shadow-2xl md:shadow-none",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
           <div className="flex items-center gap-3">
             <img src={logo} alt="Cinema Focus Admin" className="h-6 w-auto" />
             <span className="font-medium text-sm text-muted-foreground uppercase tracking-widest">Admin</span>
           </div>
           {/* Close text/icon for mobile only */}
           <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground">
             <X size={20} />
           </button>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border space-y-2">
           <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
             <ArrowLeft size={18} />
             Back to Site
           </Link>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
           >
             <LogOut size={18} />
             Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background/50 h-[calc(100vh-64px)] md:h-screen overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
