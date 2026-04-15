import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion } from 'motion/react';
import { Song } from '../types';

const songs: Song[] = [
  { 
    title: 'Nazar Na Lag Jaaye', 
    artist: 'Ash King & Sachin-Jigar', 
    url: 'https://genetic-aqua-91xxtapw4j.edgeone.app/Nazar%20Na%20Lag%20Jaaye%20With%20Lyrics%20_%20STREE%20_%20Rajkummar%20Rao,%20Shraddha%20Kapoor%20_%20Ash%20King%20&%20Sachin-Jigar.mp3',
    cover: 'https://picsum.photos/seed/stree/200/200'
  },
];

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const attemptPlay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log("Autoplay blocked, waiting for user interaction");
          // If autoplay is blocked, wait for first click anywhere
          const handleFirstInteraction = async () => {
            try {
              if (audioRef.current) {
                await audioRef.current.play();
                setIsPlaying(true);
              }
              window.removeEventListener('click', handleFirstInteraction);
              window.removeEventListener('touchstart', handleFirstInteraction);
            } catch (e) {
              console.error("Interaction play failed:", e);
            }
          };
          window.addEventListener('click', handleFirstInteraction);
          window.addEventListener('touchstart', handleFirstInteraction);
        }
      }
    };

    attemptPlay();
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(false);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(false);
  };

  const currentSong = songs[currentSongIndex];

  return (
    <Card className="fixed bottom-6 right-6 w-80 bg-white/80 backdrop-blur-xl border-pink-100 shadow-2xl rounded-3xl overflow-hidden z-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-200 shadow-lg"
          >
            <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-pink-900 truncate">{currentSong.title}</h4>
            <p className="text-xs text-pink-500 truncate">{currentSong.artist}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={prevSong} className="text-pink-400 hover:text-pink-600">
              <SkipBack size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={togglePlay} className="bg-pink-100 text-pink-600 hover:bg-pink-200 rounded-full h-10 w-10">
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextSong} className="text-pink-400 hover:text-pink-600">
              <SkipForward size={18} />
            </Button>
          </div>
        </div>
        <audio 
          ref={audioRef} 
          src={currentSong.url} 
          onEnded={nextSong}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </CardContent>
    </Card>
  );
}
