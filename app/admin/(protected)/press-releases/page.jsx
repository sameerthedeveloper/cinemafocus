"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Trash2, Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminPressReleasesPage() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setReleases(data || []);
    } catch (error) {
      console.error("Error fetching press releases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this press release?")) {
      try {
        const { error } = await supabase
          .from('press_releases')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setReleases(releases.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete press release: " + error.message);
      }
    }
  };

  if (loading) return <div className="p-4 md:p-8">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in pb-20 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Press Releases</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage news and announcements</p>
        </div>
        <Link href="/admin/press-releases/new" className="bg-primary text-primary-foreground px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity w-full md:w-auto font-medium">
          <Plus size={18} />
          Add New
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/20 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {releases.map((release) => (
              <tr key={release.id} className="hover:bg-secondary/10 transition-colors">
                <td className="p-4 font-medium text-sm md:text-base">{release.title}</td>
                <td className="p-4 text-muted-foreground text-sm">{formatDate(release.date)}</td>
                <td className="p-4">
                   <div className="flex justify-end gap-3">
                      <Link href={`/admin/press-releases/edit/${release.id}`} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(release.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
            {releases.length === 0 && (
               <tr>
                 <td colSpan="3" className="p-8 text-center text-muted-foreground">No press releases found.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
