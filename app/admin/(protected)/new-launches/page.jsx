"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';

export default function AdminNewLaunchesPage() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchLaunches();
  }, []);

  const fetchLaunches = async () => {
    try {
      const { data, error } = await supabase
        .from("new_launches")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLaunches(data || []);
    } catch (error) {
      console.error("Error fetching new launches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this launch highlight?")) {
      try {
        const { error } = await supabase
          .from("new_launches")
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setLaunches(launches.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting launch:", error);
        alert("Failed to delete launch: " + error.message);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in pb-20 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-10">
        <div>
           <h1 className="text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-2">
             <Sparkles className="text-primary" size={24} />
             New Arrivals
           </h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage the featured product carousel on the homepage.</p>
        </div>
        <Link href="/admin/new-launches/new" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto justify-center font-medium shadow-sm">
          <Plus size={18} />
          Feature Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
          <thead className="bg-secondary/30 border-b border-border">
            <tr>
              <th className="p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Product</th>
              <th className="p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Brand</th>
              <th className="p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="p-4 font-medium text-xs uppercase tracking-wider text-muted-foreground text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
               <tr>
                 <td colSpan="4" className="p-12 text-center text-muted-foreground">
                    <Loader2 className="animate-spin mx-auto mb-2 text-primary/50" />
                    <span className="text-sm">Fetching arrivals...</span>
                 </td>
               </tr>
            ) : launches.map((launch) => (
              <tr key={launch.id} className="hover:bg-secondary/5 transition-colors">
                <td className="p-4 font-medium flex items-center gap-3">
                   {launch.images && launch.images[0] ? (
                      <img src={launch.images[0]} alt={launch.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                   ) : (
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <Sparkles size={16} className="opacity-20" />
                      </div>
                   )}
                   <span className="text-sm">{launch.name}</span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{launch.brand}</td>
                <td className="p-4 text-sm font-medium">₹{launch.price?.toLocaleString()}</td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => handleDelete(launch.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && launches.length === 0 && (
               <tr>
                 <td colSpan="4" className="p-12 text-center text-muted-foreground">
                    <div className="max-w-xs mx-auto space-y-2">
                       <Sparkles size={40} className="mx-auto opacity-10" />
                       <p className="font-medium text-foreground">No featured arrivals</p>
                       <p className="text-xs">Click 'Feature Product' to highlight a product on the homepage.</p>
                    </div>
                 </td>
               </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
