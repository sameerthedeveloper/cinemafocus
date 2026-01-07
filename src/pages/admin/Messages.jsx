import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Trash2, Mail, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setMessages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, currentStatus) => {
    if (currentStatus) return; // Already read
    try {
      await updateDoc(doc(db, "messages", id), { read: true });
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this message?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in pb-20">
      <header className="mb-10 flex justify-between items-end">
         <div>
           <h1 className="text-3xl font-medium tracking-tight">Messages</h1>
           <p className="text-muted-foreground mt-1">Customer inquiries and contact form submissions.</p>
         </div>
      </header>

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
           <div className="text-center py-20 text-muted-foreground">Loading messages...</div>
        ) : (
           messages.map((message) => (
             <div 
               key={message.id} 
               onClick={() => handleMarkAsRead(message.id, message.read)}
               className={clsx(
                 "bg-background p-6 rounded-2xl border transition-all cursor-pointer group",
                 message.read ? "border-border opacity-75" : "border-primary/50 shadow-sm bg-primary/5"
               )}
             >
               <div className="flex justify-between items-start gap-4">
                 
                 <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-3">
                     <span className={clsx("font-medium text-lg", !message.read && "text-primary")}>
                       {message.firstName} {message.lastName}
                     </span>
                     <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                       {message.subject}
                     </span>
                     {!message.read && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
                   </div>
                   
                   <p className="text-muted-foreground text-sm flex items-center gap-2">
                     <Mail size={14} /> {message.email} • {new Date(message.createdAt).toLocaleString()}
                   </p>
                   
                   <p className="text-foreground mt-2 leading-relaxed">
                     {message.message}
                   </p>
                 </div>

                 <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                    {message.read && (
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
          <div className="text-center py-20 bg-secondary/30 rounded-2xl border-dashed border-2 border-border text-muted-foreground">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
