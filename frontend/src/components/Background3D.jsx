import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Background3D() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[var(--bg-deep)] overflow-hidden pointer-events-none">
      {/* Background Image with Cinematic Pan and subtle Parallax */}
      <motion.div 
        className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] bg-cover bg-center bg-no-repeat opacity-90 mix-blend-lighten"
        style={{
          backgroundImage: `url('/fighter-fish-bg.png')`,
          y: scrollY * 0.15, // Subtle parallax
        }}
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.05, 1],
          x: [0, -15, 0],
          y: [0, 10, 0]
        }}
        transition={{ 
          duration: 20, 
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />

      {/* Floating Particles/Bubbles */}
      <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-40">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/20 blur-[1px]"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: '100%',
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: Math.random() * 100 - 50,
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Ambient Gradient Overlays for integration - Softened for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-transparent to-[var(--bg-deep)]/40 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-deep)]/80 via-transparent to-[var(--bg-deep)]/20 opacity-80" />
    </div>
  );
}
