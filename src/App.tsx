import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactConfetti from 'react-confetti';
import useMeasure from 'react-use-measure';
import { Heart, Sparkles, Camera, MessageSquare, Music as MusicIcon } from 'lucide-react';

import Flower from './components/Flower';
import Countdown from './components/Countdown';
import MessageBoard from './components/MessageBoard';
import Gallery from './components/Gallery';
import MusicPlayer from './components/MusicPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

interface FlowerData {
  id: number;
  x: number;
  y: number;
  color: string;
}

const FLOWER_COLORS = ['#f472b6', '#fb7185', '#f43f5e', '#ec4899', '#d946ef', '#a855f7'];

export default function App() {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ref, bounds] = useMeasure();
  
  // Target: April 16th at midnight in Bangladesh Time (UTC+6)
  const targetDate = new Date('2026-04-16T00:00:00+06:00');

  const removeFlower = useCallback((id: number) => {
    setFlowers(prev => prev.filter(f => f.id !== id));
  }, []);

  const addFlower = useCallback((e: React.MouseEvent) => {
    const newFlower = {
      id: Date.now(),
      x: e.clientX - 10,
      y: e.clientY - 20,
      color: FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)]
    };
    setFlowers(prev => [...prev.slice(-19), newFlower]); // Keep last 20 flowers
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 2000);
    const stopTimer = setTimeout(() => setShowConfetti(false), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <div 
      ref={ref}
      className="min-h-screen bg-[#fff5f7] text-gray-800 font-sans selection:bg-pink-200 overflow-x-hidden relative"
      onClick={addFlower}
    >
      {showConfetti && <ReactConfetti width={bounds.width} height={bounds.height} recycle={false} numberOfPieces={200} colors={FLOWER_COLORS} />}
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 blur-[150px] rounded-full" />
      </div>

      {/* Interactive Flowers Layer */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <AnimatePresence>
          {flowers.map(flower => (
            <Flower 
              key={flower.id} 
              id={flower.id}
              x={flower.x} 
              y={flower.y} 
              color={flower.color} 
              onRemove={removeFlower}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="relative z-20 container mx-auto px-4 py-12 md:py-20">
        
        {/* Hero Section */}
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-bold tracking-widest uppercase mb-6">
              <Sparkles size={16} />
              A Special Surprise
              <Sparkles size={16} />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-black text-pink-900 mb-6 leading-tight">
              Happy <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Birthday</span>,<br />
              billu badmosh
            </h1>
            <p className="text-lg md:text-xl text-pink-700/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Click anywhere to plant a flower in your digital garden. 
              This is a small space dedicated to celebrating you and all the joy you bring to our lives.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <Countdown targetDate={targetDate} />
          </motion.div>
        </section>

        {/* Interactive Tabs Section */}
        <section className="max-w-6xl mx-auto">
          <Tabs defaultValue="gallery" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white/50 backdrop-blur-md border border-pink-100 p-1 rounded-full h-auto">
                <TabsTrigger value="gallery" className="rounded-full px-6 py-3 data-[state=active]:bg-pink-500 data-[state=active]:text-white flex gap-2 items-center">
                  <Camera size={18} />
                  <span className="hidden sm:inline">Memories</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="rounded-full px-6 py-3 data-[state=active]:bg-pink-500 data-[state=active]:text-white flex gap-2 items-center">
                  <MessageSquare size={18} />
                  <span className="hidden sm:inline">Wishes</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="rounded-full px-6 py-3 data-[state=active]:bg-pink-500 data-[state=active]:text-white flex gap-2 items-center">
                  <Heart size={18} />
                  <span className="hidden sm:inline">Our Story</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="gallery">
              <Gallery />
            </TabsContent>

            <TabsContent value="messages">
              <MessageBoard />
            </TabsContent>

            <TabsContent value="about" className="max-w-3xl mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-[3rem] border border-white shadow-xl text-center"
              >
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-8 text-pink-500">
                  <Heart size={40} fill="currentColor" />
                </div>
                <h2 className="text-4xl font-serif text-pink-900 mb-6">To My Dearest Friend</h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-medium italic">
                  <p>
                    "From a social media notification to one of the most important people in my life—I’m so grateful our paths crossed in the vastness of the internet meeting you, Tanisha, has been a wonderful experience I'll always cherish. You make it worth of remembering. Happy Birthday, beautiful billu 🌸"
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Footer */}
        <footer className="mt-32 text-center pb-20">
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-pink-200 self-center" />
            <Heart className="text-pink-400" size={20} fill="currentColor" />
            <div className="w-12 h-[1px] bg-pink-200 self-center" />
          </div>
          <p className="text-pink-400 font-medium tracking-widest uppercase text-xs">
            Made with love for your special day
          </p>
        </footer>
      </main>

      <MusicPlayer />
    </div>
  );
}
