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
    <div className="flex justify-center items-center py-8 bg-white/30 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}
