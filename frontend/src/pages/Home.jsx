import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import Products from '../components/Products';
import ProductModal from '../components/ProductModal';
import Footer from '../components/Footer';

// Floating particle system
function FloatingParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      color: ['#00f5ff', '#d946ef', '#06d6a0', '#ffd700'][Math.floor(Math.random() * 4)],
    })), []
  );

  return (
    <div className="particles-bg">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Animated counter
function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const num = parseInt(value) || 0;
    if (num === 0) return;
    
    let start = 0;
    const increment = num / 40;
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const [settings, setSettings] = useState({
    hero_title: 'Exotic Fish',
    hero_subtitle: 'Mart',
    hero_description: 'Discover the world\'s most stunning exotic fish. Hand-picked, live-delivered, with a satisfaction guarantee.',
  });
  const [showCollection, setShowCollection] = useState(false);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    fetchSettings();
    
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#collection' || hash === '#rare') {
        setShowCollection(true);
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/settings');
      // API returns an object { key: value } directly
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setSettings(prev => ({ ...prev, ...data }));
      } else if (Array.isArray(data)) {
        const settingsMap = {};
        data.forEach(s => settingsMap[s.key] = s.value);
        setSettings(prev => ({ ...prev, ...settingsMap }));
      }
    } catch (error) {
      // Settings API may not be available — use defaults silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Floating Particles */}
      <FloatingParticles />

      {/* Bioluminescent Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="orb orb-cyan w-[500px] h-[500px] -top-32 -right-32" style={{ animationDelay: '0s' }} />
        <div className="orb orb-magenta w-[400px] h-[400px] top-1/3 -left-48" style={{ animationDelay: '2s' }} />
        <div className="orb orb-emerald w-[350px] h-[350px] bottom-20 right-1/4" style={{ animationDelay: '4s' }} />
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
      >
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 z-5 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020810]/30 via-transparent to-[#020810]/80 z-10 pointer-events-none" />
        
        {/* Hero Content */}
        <div className="relative z-20 w-full flex flex-col justify-center items-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-5xl"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center px-5 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full mb-8 backdrop-blur-xl"
            >
              <div className="relative mr-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <div className="w-2 h-2 bg-emerald-400 rounded-full absolute inset-0 animate-ping" />
              </div>
              <span className="text-white/50 font-black text-[9px] tracking-[0.4em] uppercase">
                Premium Selection 2026
              </span>
            </motion.div>

            {/* Main Title with Stagger */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: 120 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl sm:text-8xl md:text-[7.5rem] font-black leading-[0.85] tracking-tighter"
              >
                <span className="text-white block">{settings.hero_title}</span>
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: 120 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl sm:text-8xl md:text-[7.5rem] font-black leading-[0.85] tracking-tighter"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#06d6a0] to-[#d946ef] animate-gradient">
                  {settings.hero_subtitle}
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-sm md:text-base text-[#7a8ba8] mb-12 max-w-xl mx-auto leading-relaxed font-medium tracking-wide"
            >
              {settings.hero_description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                onClick={() => {
                  setShowCollection(true);
                  setTimeout(() => {
                    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-12 py-4 bg-gradient-to-r from-[#00f5ff] to-[#06d6a0] text-[#040812] text-[11px] font-black rounded-full transition-all uppercase tracking-[0.3em] overflow-hidden"
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#06d6a0] to-[#00f5ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: '0 0 40px rgba(0,245,255,0.4), 0 0 80px rgba(6,214,160,0.2)' }} />
              </motion.button>
              
              <motion.a
                href="#about"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="px-12 py-4 text-[11px] font-black text-white/80 border border-white/[0.08] rounded-full backdrop-blur-xl hover:bg-white/[0.03] hover:border-white/[0.15] transition-all uppercase tracking-[0.3em]"
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] font-black text-white/20 tracking-[0.4em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-5 h-8 border border-white/10 rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-white/30 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ STATS SECTION with Animated Counters ═══ */}
      <section className="py-16 px-6 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 border border-white/[0.04] animate-glow-pulse">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { value: '500', suffix: '+', label: 'Exotic Species', icon: '🐠' },
                { value: '24', suffix: 'h', label: 'Live Delivery', icon: '🚀' },
                { value: '99', suffix: '%', label: 'Satisfaction', icon: '⭐' },
                { value: '10', suffix: 'K+', label: 'Happy Buyers', icon: '💎' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    className="text-2xl mb-2"
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tighter">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[#7a8ba8] text-[8px] font-black uppercase tracking-[0.3em]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section className="py-16 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
              Why Choose <span className="text-gradient-cyan">Us</span>
            </h2>
            <p className="text-[#7a8ba8] text-sm max-w-lg mx-auto">Premium care from tank to doorstep.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: '🧬', 
                title: 'DNA Verified', 
                desc: 'Every rare species comes with genetic verification for authenticity and health assurance.',
                gradient: 'from-[#00f5ff]/10 to-transparent'
              },
              { 
                icon: '🌊', 
                title: 'Live Guarantee', 
                desc: 'Proprietary oxygenated packaging ensures 99.9% live arrival. Or your money back.',
                gradient: 'from-[#06d6a0]/10 to-transparent'
              },
              { 
                icon: '👨‍🔬', 
                title: 'Expert Support', 
                desc: 'Marine biologists on call 24/7. Free tank setup consultation with every order.',
                gradient: 'from-[#d946ef]/10 to-transparent'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className={`glass-card aurora-border p-8 rounded-2xl bg-gradient-to-br ${feature.gradient}`}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                  className="text-4xl mb-5"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-black text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-[#7a8ba8] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COLLECTION ═══ */}
      <AnimatePresence>
        {showCollection && (
          <motion.section 
            id="collection-reveal" 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-20"
          >
            <div id="rare" className="absolute top-0" />
            <Products />
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══ FAQ SECTION ═══ */}
      <section id="faq" className="py-24 px-6 relative z-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
              Frequently Asked <span className="text-gradient-cyan">Questions</span>
            </h2>
            <p className="text-[#7a8ba8] text-sm">Everything you need to know about our premium delivery and care.</p>
          </motion.div>

          <div className="space-y-4">
            {(settings.faqs ? JSON.parse(settings.faqs) : [
              { q: "How do you ensure live delivery?", a: "We use professional-grade oxygenated bags, insulated thermal packaging, and 24-hour express shipping to ensure your fish arrive healthy." },
              { q: "What is your satisfaction guarantee?", a: "If your fish doesn't arrive alive or healthy, we offer a 100% refund or replacement. Just send us a photo within 2 hours of delivery." },
              { q: "Do you ship internationally?", a: "Currently, we focus on providing the best possible care within our primary regions to maintain our live-delivery guarantee." },
              { q: "How do I acclimate my new fish?", a: "Every order comes with a detailed acclimation guide. We recommend the drip method for our rare and sensitive species." }
            ]).map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ x: 6 }}
                className="glass-card p-6 rounded-2xl border border-white/[0.04] hover:border-[#00f5ff]/20 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00f5ff]/20 to-[#d946ef]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-black text-[#00f5ff]">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2 text-sm group-hover:text-[#00f5ff] transition-colors">{faq.q}</h4>
                    <p className="text-[#7a8ba8] text-xs leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
