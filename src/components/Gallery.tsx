import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, signInWithGoogle } from '../firebase';
import { Photo } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Camera } from 'lucide-react';

const featuredPhotos: Partial<Photo>[] = [
  { url: 'https://i.ibb.co/DPB4KyJJ/photo.jpg', caption: 'aesthetic ki 14', year: '2026' },
  { url: 'https://i.ibb.co/N2ngX5vz/photo.jpg', caption: 'heeee', year: '2026' },
  { url: 'https://i.ibb.co/dspQ0c4s/photo.jpg', caption: 'servicing', year: '2026' },
  { url: 'https://i.ibb.co/NdFC6BTm/photo.jpg', caption: 'oo sundari', year: '2026' },
  
];

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '', year: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      setPhotos(fetchedPhotos);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, []);

  const allPhotos = [...featuredPhotos, ...photos];

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.url.trim() || !auth.currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'photos'), {
        ...newPhoto,
        createdAt: serverTimestamp(),
        authorUid: auth.currentUser.uid
      });
      setNewPhoto({ url: '', caption: '', year: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding photo: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-pink-900 mb-2">A Journey Through Time</h2>
          <p className="text-pink-600/60">Capturing the moments that made us smile.</p>
        </div>
        
        {auth.currentUser ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={
              <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full gap-2">
                <Plus size={18} /> Add Photo
              </Button>
            } />
            <DialogContent className="bg-white rounded-3xl border-pink-100">
              <DialogHeader>
                <DialogTitle className="text-pink-700 font-serif">Add a New Memory</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPhoto} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pink-600">Photo URL</label>
                  <Input 
                    placeholder="https://example.com/photo.jpg" 
                    value={newPhoto.url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                    className="rounded-xl border-pink-100 focus:ring-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pink-600">Caption (Optional)</label>
                  <Input 
                    placeholder="A beautiful day..." 
                    value={newPhoto.caption}
                    onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                    className="rounded-xl border-pink-100 focus:ring-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-pink-600">Year (Optional)</label>
                  <Input 
                    placeholder="2024" 
                    value={newPhoto.year}
                    onChange={(e) => setNewPhoto({ ...newPhoto, year: e.target.value })}
                    className="rounded-xl border-pink-100 focus:ring-pink-500"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !newPhoto.url.trim()}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl"
                >
                  {loading ? 'Adding...' : 'Save Memory'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <Button onClick={signInWithGoogle} className="bg-pink-500 hover:bg-pink-600 text-white rounded-full gap-2">
            <Camera size={18} /> Sign in to Add Photos
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {allPhotos.map((photo, index) => (
            <motion.div
              key={photo.id || `static-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="overflow-hidden rounded-3xl border-none shadow-xl group">
                <CardContent className="p-0 relative">
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    {photo.year && <span className="text-pink-300 text-xs font-bold tracking-widest uppercase mb-1">{photo.year}</span>}
                    {photo.caption && <p className="text-white font-serif text-lg">{photo.caption}</p>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
