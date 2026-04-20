import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Mail, Calendar, User, Clock } from 'lucide-react';
import { formatDate } from '../../lib/utils';

const PortalMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-3">
          <Mail className="text-primary" />
          Messages
        </h1>
        <p className="text-muted-foreground mt-1">View customer inquiries (read-only)</p>
      </header>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Mail size={48} className="mx-auto mb-4 opacity-50" />
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Message List */}
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedMessage?.id === msg.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-muted-foreground" />
                  <span className="font-medium text-sm">{msg.name}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {msg.createdAt?.toDate ? formatDate(msg.createdAt.toDate()) : 'Unknown date'}
                </div>
              </button>
            ))}
          </div>

          {/* Message Detail */}
          <div className="bg-background border border-border rounded-xl p-6">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedMessage.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                </div>
                
                {selectedMessage.phone && (
                  <p className="text-sm text-muted-foreground">📞 {selectedMessage.phone}</p>
                )}
                
                <div className="border-t border-border pt-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar size={12} />
                  {selectedMessage.createdAt?.toDate ? formatDate(selectedMessage.createdAt.toDate()) : 'Unknown date'}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Mail size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalMessages;
