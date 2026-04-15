import React, { useState } from 'react';
import { motion } from 'motion/react';

interface FlowerProps {
  key?: React.Key;
  id: number;
  x: number;
  y: number;
  color: string;
  delay?: number;
  onRemove?: (id: number) => void;
}

export default function Flower({ id, x, y, color, delay = 0, onRemove }: FlowerProps) {
  const [isBloomed, setIsBloomed] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFading) return;
    
    setIsBloomed(true);
    // After blooming, start fading out
    setTimeout(() => {
      setIsFading(true);
    }, 800);
  };

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer"
      style={{ left: x, top: y }}
      initial={{ scale: 0, rotate: 0, opacity: 1 }}
      animate={{ 
        scale: isFading ? 0 : (isBloomed ? 1.5 : 1),
        opacity: isFading ? 0 : 1,
        rotate: isFading ? 90 : 0
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        scale: { duration: isFading ? 0.6 : 0.4, type: 'spring', stiffness: 200 },
        opacity: { duration: 0.4 },
        rotate: { duration: 0.6 }
      }}
      onAnimationComplete={() => {
        if (isFading && onRemove) {
          onRemove(id);
        }
      }}
      onClick={handleClick}
      onMouseEnter={() => !isFading && setIsBloomed(true)}
      onMouseLeave={() => !isFading && setIsBloomed(false)}
    >
      {/* Stem */}
      <motion.div
        className="w-1 h-12 bg-green-500 rounded-full origin-bottom"
        initial={{ height: 0 }}
        animate={{ height: 48 }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
      />
      
      {/* Petals */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.div
            key={angle}
            className="absolute w-4 h-8 rounded-full origin-bottom"
            style={{ 
              backgroundColor: color,
              rotate: angle,
              bottom: '50%',
              left: '50%',
              marginLeft: '-8px'
            }}
            animate={{ 
              scale: isBloomed ? 1.2 : 1,
              rotate: isBloomed ? angle + 10 : angle,
              y: isBloomed ? -5 : 0
            }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
        {/* Center */}
        <motion.div 
          className="absolute w-6 h-6 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: isBloomed ? 1.1 : 1 }}
        />
      </div>
    </motion.div>
  );
}
