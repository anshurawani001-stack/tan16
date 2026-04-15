import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

interface CountdownProps {
  targetDate: Date;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [tapCount, setTapCount] = useState(0);
  const [showSurprise, setShowSurprise] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now >= targetDate) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: differenceInDays(targetDate, now),
        hours: differenceInHours(targetDate, now) % 24,
        minutes: differenceInMinutes(targetDate, now) % 60,
        seconds: differenceInSeconds(targetDate, now) % 60
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    if (tapCount > 0) {
      const timeout = setTimeout(() => setTapCount(0), 1000);
      return () => clearTimeout(timeout);
    }
  }, [tapCount]);

  const handleTap = () => {
    if (showSurprise) return;
    setTapCount(prev => {
      const next = prev + 1;
      if (next === 3) {
        setShowSurprise(true);
        setTimeout(() => setShowSurprise(false), 5000);
        return 0;
      }
      return next;
    });
  };

  const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <motion.div 
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-serif font-bold text-pink-600"
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <div className="text-xs md:text-sm uppercase tracking-widest text-pink-400 font-medium">
        {label}
      </div>
    </div>
  );

  return (
    <div 
      onClick={handleTap}
      className="relative flex justify-center items-center py-8 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl cursor-pointer select-none overflow-hidden"
    >
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />

      <AnimatePresence>
        {showSurprise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-pink-500/90 z-50"
          >
            <div className="relative flex items-center justify-center w-full h-full">
              {/* Petals Bloom Animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <motion.div
                    key={angle}
                    initial={{ scale: 0, rotate: angle }}
                    animate={{ scale: [0, 1.5, 1.2], rotate: angle + 20 }}
                    className="absolute w-12 h-24 bg-pink-200/80 rounded-full origin-bottom"
                    style={{ 
                      bottom: '50%',
                      left: '50%',
                      marginLeft: '-24px'
                    }}
                    transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                  />
                ))}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute w-16 h-16 bg-yellow-400 rounded-full z-10 shadow-lg"
                  transition={{ type: "spring", damping: 12 }}
                />
              </div>
              
              <motion.h2 
                initial={{ y: 40, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="relative z-20 text-white text-4xl md:text-6xl font-serif font-black text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
              >
                Happy Birthday!
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
