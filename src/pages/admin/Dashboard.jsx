import React, { useEffect, useState } from 'react';
import { BarChart, Package, MessageSquare, Users, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: "Total Products", value: "-", icon: Package, link: "/admin/products" },
    { label: "Categories", value: "-", icon: LayoutGrid, link: "/admin/categories" },
    { label: "Users", value: "-", icon: Users, link: "/admin/users" },
    { label: "Messages", value: "-", icon: MessageSquare, link: "/admin/messages" },
  ]);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simple client-side counting. For production with large data, use server counters or aggregation queries.
        const productsSnap = await getDocs(collection(db, 'products'));
        const categoriesSnap = await getDocs(collection(db, 'categories'));
        const messagesSnap = await getDocs(collection(db, 'messages'));
        // Cannot list auth users from client SDK easily. Just showing 1 for now (admin)
        const adminsCount = 1;

        setStats([
          { label: "Total Products", value: productsSnap.size, icon: Package, link: "/admin/products" },
          { label: "Categories", value: categoriesSnap.size, icon: LayoutGrid, link: "/admin/categories" },
          { label: "Users", value: adminsCount, icon: Users, link: "/admin/users" },
          { label: "Messages", value: messagesSnap.size, icon: MessageSquare, link: "/admin/messages" },
        ]);

        // Mock Analytics or Fetch from a 'stats' collection if you have one. 
        // Reverting to mock data or empty since we don't have a 'stats' collection populated by Firebase typically unless set up.
        // Let's check if 'stats' exists, otherwise show empty or mock.
        
        // For now, let's use a placeholder or empty chart data to avoid errors.
        setChartData([]);

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in pb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
           <div>
               <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
               <p className="text-muted-foreground mt-1">Overview of your store performance.</p>
           </div>
           
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          {/* Card render logic same as before... */}
          const CardContent = (
            <>
               <div className="flex items-center justify-between mb-4">
                 <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
                 <Icon size={20} className="text-primary/70" />
               </div>
               <div className="text-3xl font-medium">{stat.value}</div>
            </>
          );

          if (stat.link) {
            return (
              <Link key={idx} to={stat.link} className="bg-background p-6 rounded-2xl border border-border shadow-sm block hover:border-primary/50 transition-colors">
                {CardContent}
              </Link>
            );
          }
          return <div key={idx} className="bg-background p-6 rounded-2xl border border-border shadow-sm">{CardContent}</div>;
        })}
      </div>

      <div className="mt-12 bg-background p-8 rounded-2xl border border-border shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-medium">Site Activity (Last 7 Days)</h2>
            <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">Real-time Visits</div>
         </div>
         
         <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 border-b border-border pb-4">
            {chartData.map((data, i) => {
              // Calculate relative height (max 100%)
              const maxVal = Math.max(...chartData.map(d => d.count), 10); // Minimum scale of 10
              const heightPct = (data.count / maxVal) * 100;
              
              return (
              <div key={i} className="w-full flex flex-col items-center gap-2 group flex-1">
                 <div className="w-full h-full flex items-end justify-center relative">
                    <div 
                      className="w-[80%] bg-primary/80 rounded-t-sm hover:bg-primary transition-all duration-500 relative min-h-[4px]" 
                      style={{ height: `${heightPct}%` }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {data.count} Visits
                        </div>
                    </div>
                 </div>
                 <span className="text-xs text-muted-foreground">{data.label}</span>
              </div>
            )})}
            {chartData.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Loading analytics...
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
