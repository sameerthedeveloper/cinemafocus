import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, ArrowLeft, Settings, LayoutGrid, Users, MessageSquare, Image } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import clsx from 'clsx';
const logo = '/images/logo.png'; 

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Categories", path: "/admin/categories", icon: LayoutGrid },
    { label: "Projects", path: "/admin/projects", icon: Image },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Messages", path: "/admin/messages", icon: MessageSquare },
    { label: "Site Control", path: "/admin/site-control", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border fixed inset-y-0 left-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-border flex items-center gap-3">
           <img src={logo} alt="Cinema Focus Admin" className="h-6 w-auto" />
           <span className="font-medium text-sm text-muted-foreground uppercase tracking-widest">Admin</span>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
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
      <main className="flex-1 md:ml-64 bg-background/50 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
