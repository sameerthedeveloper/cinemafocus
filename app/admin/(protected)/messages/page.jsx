"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Trash2, Mail, CheckCircle, Loader2, Reply } from 'lucide-react';
import clsx from 'clsx';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, currentStatus) => {
    if (currentStatus) return; // Already read
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'read' })
        .eq('id', id);
      
      if (error) throw error;
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this message?")) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("Failed to delete message: " + error.message);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in pb-20 md:pb-8">
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
         <div>
           <h1 className="text-2xl md:text-3xl font-medium tracking-tight">Messages</h1>
           <p className="text-muted-foreground mt-1 text-sm md:text-base">Customer inquiries and contact form submissions.</p>
         </div>
      </header>

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
           <div className="text-center py-20 text-muted-foreground flex items-center justify-center gap-2">
             <Loader2 className="animate-spin" size={20} /> Loading messages...
           </div>
        ) : (
           messages.map((message) => (
             <div 
               key={message.id} 
               onClick={() => handleMarkAsRead(message.id, message.status === 'read')}
               className={clsx(
                 "bg-background p-6 rounded-2xl border transition-all cursor-pointer group",
                 message.status === 'read' ? "border-border opacity-75" : "border-primary/50 shadow-sm bg-primary/5"
               )}
             >
               <div className="flex justify-between items-start gap-4">
                 
                 <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-3">
                     <span className={clsx("font-medium text-lg", message.status !== 'read' && "text-primary")}>
                       {message.name}
                     </span>
                     <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                       {message.subject || 'New Inquiry'}
                     </span>
                     {message.status !== 'read' && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
                   </div>
                   
                   <p className="text-muted-foreground text-sm flex items-center gap-2">
                     <Mail size={14} /> {message.email} • {message.created_at ? new Date(message.created_at).toLocaleString() : ''}
                   </p>
                   
                   <p className="text-foreground mt-2 leading-relaxed">
                     {message.text}
                   </p>
                 </div>

                 <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(message.email)}&su=${encodeURIComponent(`Re: ${message.subject || 'Inquiry'} - Cinema Focus`)}&body=${encodeURIComponent(`Hello ${message.name},\n\nRegarding the message you sent:\n"${message.text}"\n\n`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20 flex items-center justify-center"
                      title="Reply via Gmail"
                    >
                      <Reply size={18} />
                    </a>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    {message.status === 'read' && (
                      <div className="p-2 text-green-500" title="Read">
                        <CheckCircle size={18} />
                      </div>
                    )}
                 </div>
               </div>
             </div>
           ))
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center py-20 bg-secondary/30 rounded-2xl border-dashed border-2 border-border text-muted-foreground font-medium">
            No inquiries received yet.
          </div>
        )}
      </div>
    </div>
  );
}
