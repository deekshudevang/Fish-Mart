import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Products from '../components/Products';
import Footer from '../components/Footer';

export default function Home() {
  const [settings, setSettings] = useState({
    hero_title: 'Exotic Fish',
    hero_subtitle: 'Mart',
    hero_description: 'Discover the world\'s most stunning exotic fish. Hand-picked, live-delivered, with a satisfaction guarantee.',
  });
  const [showCollection, setShowCollection] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    
    // Check if we should show collection from hash (for Navbar links)
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
      const settingsMap = {};
      data.forEach(s => settingsMap[s.key] = s.value);
      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Subtle Vignette for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 pointer-events-none" />
        
        {/* Hero Content */}
        <div className="relative z-20 w-full flex flex-col justify-center items-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md"
            >
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse mr-2" />
              <span className="text-white/60 font-black text-[9px] tracking-[0.3em] uppercase">
                Premium Selection 2024
              </span>
            </motion.div>

            <motion.h1
              className="text-6xl sm:text-8xl md:text-[6.5rem] font-black mb-6 leading-[0.9] tracking-tight"
            >
              <span className="text-white block">{settings.hero_title}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {settings.hero_subtitle}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-base text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed font-medium tracking-wide"
            >
              {settings.hero_description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-row gap-5 justify-center"
            >
              <motion.button
                onClick={() => {
                  setShowCollection(true);
                  setTimeout(() => {
                    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-cyan-500 text-black text-[11px] font-black rounded-full transition-all hover:bg-cyan-400 shadow-xl shadow-cyan-500/20 uppercase tracking-widest"
              >
                Explore Collection
              </motion.button>
              <motion.a
                href="#about"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 text-[11px] font-black text-white border border-white/10 rounded-full backdrop-blur-md hover:bg-white/5 transition-all uppercase tracking-widest"
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-4 pb-16 px-6 relative z-20">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { value: '500+', label: 'Exotic Species' },
            { value: '24h', label: 'Live Delivery' },
            { value: '99.9%', label: 'Satisfaction' },
            { value: 'VIP', label: 'Support' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tighter italic">{stat.value}</div>
              <div className="text-slate-500 text-[8px] font-black uppercase tracking-[0.3em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products - Collapsed by default */}
      <AnimatePresence>
        {showCollection && (
          <motion.section 
            id="collection-reveal" 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-20"
          >
            <div id="rare" className="absolute top-0" />
            <Products />
          </motion.section>
        )}
      </AnimatePresence>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 relative z-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter">Frequently Asked <span className="text-cyan-400">Questions</span></h2>
            <p className="text-slate-400 text-sm">Everything you need to know about our premium delivery and care.</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: "How do you ensure live delivery?", a: "We use professional-grade oxygenated bags, insulated thermal packaging, and 24-hour express shipping to ensure your fish arrive healthy." },
              { q: "What is your satisfaction guarantee?", a: "If your fish doesn't arrive alive or healthy, we offer a 100% refund or replacement. Just send us a photo within 2 hours of delivery." },
              { q: "Do you ship internationally?", a: "Currently, we focus on providing the best possible care within our primary regions to maintain our live-delivery guarantee." },
              { q: "How do I acclimate my new fish?", a: "Every order comes with a detailed acclimation guide. We recommend the drip method for our rare and sensitive species." }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
              >
                <h4 className="text-white font-bold mb-2 text-sm">{faq.q}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{faq.a}</p>
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
