import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, auth, signInWithGoogle } from '../firebase';
import { Message } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export default function MessageBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        authorName: auth.currentUser.displayName || name || 'Anonymous',
        content: newMessage,
        createdAt: serverTimestamp(),
        authorPhoto: auth.currentUser.photoURL,
        authorUid: auth.currentUser.uid
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error adding message: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-pink-900 mb-2">From the Heart</h2>
        <p className="text-pink-600/60">Messages from everyone who loves you.</p>
      </div>
      <Card className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md border-pink-100 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-pink-50/50 border-b border-pink-100">
        <CardTitle className="text-2xl font-serif text-pink-700 flex items-center gap-2">
          ✨ Wishes & Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!auth.currentUser ? (
          <div className="text-center py-8">
            <p className="text-pink-600 mb-4">Sign in to leave a birthday wish!</p>
            <Button onClick={signInWithGoogle} className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8">
              Sign in with Google
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <Textarea
              placeholder="Write your birthday wish here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border-pink-200 focus:ring-pink-500 rounded-2xl resize-none h-24"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading || !newMessage.trim()}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6"
              >
                {loading ? 'Sending...' : 'Send Wish'}
              </Button>
            </div>
          </form>
        )}

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-4 items-start"
                >
                  <Avatar className="border-2 border-pink-100 w-10 h-10">
                    <AvatarImage src={msg.authorPhoto} />
                    <AvatarFallback className="bg-pink-100 text-pink-600">
                      {msg.authorName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-pink-50/50 p-4 rounded-2xl rounded-tl-none border border-pink-100 relative group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-pink-800 text-sm">{msg.authorName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-pink-400">
                          {msg.createdAt?.seconds ? format(new Date(msg.createdAt.seconds * 1000), 'MMM d, h:mm a') : 'Just now'}
                        </span>
                        {(auth.currentUser?.uid === msg.authorUid || auth.currentUser?.email === 'anshurawani25@gmail.com') && (
                          <button 
                            onClick={() => msg.id && handleDelete(msg.id)}
                            className="text-pink-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete wish"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
    </div>
  );
}
