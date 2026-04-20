import React from 'react';
import { NavLink, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Mail, 
  Newspaper, 
  Rocket, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const logo = '/images/logo.webp';

const PortalLayout = () => {
  const navigate = useNavigate();
  const { user, role } = useOutletContext() || {};
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/portal/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/portal/dashboard' },
    { icon: Mail, label: 'Messages', path: '/portal/messages' },
    { icon: Newspaper, label: 'Press Releases', path: '/portal/press-releases' },
    { icon: Rocket, label: 'New Launches', path: '/portal/new-launches' },
  ];

  const NavItem = ({ icon: Icon, label, path }) => (
    <NavLink
      to={path}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? 'bg-primary text-primary-foreground font-medium'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-6" />
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-background border-r border-border p-6 flex flex-col z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center gap-3 mb-8 pt-12 md:pt-0">
          <img src={logo} alt="Logo" className="h-8" />
          <div>
            <span className="font-semibold text-sm">Dealer Portal</span>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>

        <div className="pt-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen pt-16 md:pt-0">
        <Outlet context={{ user, role }} />
      </main>
    </div>
  );
};

export default PortalLayout;
