import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Simple clean bubble particles
function Bubbles() {
  const bubbles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1.5,
      left: Math.random() * 100,
      duration: Math.random() * 12 + 14,
      delay: Math.random() * 12,
      wobble: Math.random() * 25 - 12,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden opacity-25">
      {bubbles.map(b => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: '-5%',
            background: `radial-gradient(circle at 30% 30%, rgba(0,245,255,0.5), rgba(0,245,255,0.05))`,
            boxShadow: `0 0 ${b.size * 2}px rgba(0,245,255,0.15)`,
          }}
          animate={{
            y: [0, -window.innerHeight * 1.2],
            x: [0, b.wobble, -b.wobble * 0.5, 0],
            opacity: [0, 0.5, 0.3, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export default function Background3D() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#020810] overflow-hidden pointer-events-none">
      {/* Deep ocean gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020810] via-[#041020] to-[#020810]" />

      {/* Static hero fish (parallax only) */}
      <motion.div 
        className="absolute inset-0 w-[112%] h-[112%] -left-[6%] -top-[6%] bg-cover bg-center bg-no-repeat opacity-70 mix-blend-lighten"
        style={{
          backgroundImage: `url('/fighter-fish-bg.png')`,
          y: scrollY * 0.1,
        }}
        animate={{ 
          scale: [1, 1.03, 1],
          x: [0, -8, 0],
        }}
        transition={{ 
          duration: 30, 
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      />

      {/* Subtle rising bubbles */}
      <Bubbles />

      {/* Ambient vignettes */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020810] via-transparent to-[#020810]/50 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020810]/60 via-transparent to-[#020810]/40 opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 h-[25vh] bg-gradient-to-t from-[#020810] to-transparent" />
    </div>
  );
}
