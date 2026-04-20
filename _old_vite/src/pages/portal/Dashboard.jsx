import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Mail, Newspaper, Rocket, ArrowRight } from 'lucide-react';

const PortalDashboard = () => {
  const { user, role } = useOutletContext() || {};

  const quickLinks = [
    { 
      icon: Mail, 
      title: 'Messages', 
      description: 'View customer inquiries and messages',
      path: '/portal/messages',
      color: 'bg-blue-500'
    },
    { 
      icon: Newspaper, 
      title: 'Press Releases', 
      description: 'Access the latest press releases and announcements',
      path: '/portal/press-releases',
      color: 'bg-green-500'
    },
    { 
      icon: Rocket, 
      title: 'New Launches', 
      description: 'Discover newly launched products',
      path: '/portal/new-launches',
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-muted-foreground mt-1">
          Access your dealer resources below
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className="group bg-background border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <item.icon className="text-white" size={24} />
            </div>
            <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
              {item.title}
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PortalDashboard;
