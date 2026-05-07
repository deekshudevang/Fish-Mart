import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

const MAIN_CATEGORIES = ['All', 'Fishes', 'Aquarium Plants', 'Fish Food', 'Aquarium Accessories'];
const FISH_SUB_CATEGORIES = ['All Fishes', 'Freshwater', 'Saltwater', 'Rare Findings'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [activeMain, setActiveMain] = useState('All');
  const [activeSub, setActiveSub] = useState('All Fishes');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => {
    const category = (p.category || '').trim();
    const catLower = category.toLowerCase();
    const normalizedCat = catLower === 'rare' ? 'rare findings' : catLower;
    
    if (activeMain === 'All') return true;
    
    if (activeMain === 'Fishes') {
      if (activeSub === 'All Fishes') {
        return ['freshwater', 'saltwater', 'rare findings'].includes(normalizedCat);
      }
      return normalizedCat === activeSub.toLowerCase().trim();
    }
    
    return normalizedCat === activeMain.toLowerCase().trim();
  });

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price || 0) - (b.price || 0);
      case 'price-high': return (b.price || 0) - (a.price || 0);
      case 'rating': return (b.avgRating || 0) - (a.avgRating || 0);
      case 'name': return (a.name || '').localeCompare(b.name || '');
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <section id="collection" className="py-12 px-4 max-w-7xl mx-auto relative z-20">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className="text-center mb-12"
      >
        <span className="text-[#00f5ff] font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Our Curated Tanks</span>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
          Exotic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#06d6a0] to-[#d946ef] animate-gradient">Collection</span>
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-[#00f5ff] to-transparent mx-auto mb-8 rounded-full" />
        <p className="text-[#7a8ba8] text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Discover the world's most stunning aquatic life, hand-picked for their vibrant colors and healthy temperament.
        </p>
      </motion.div>

      {/* Main Category Tabs */}
      <div className="flex justify-center mb-6 px-4">
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/[0.02] backdrop-blur-xl border border-white/[0.04] rounded-2xl max-w-full">
          {MAIN_CATEGORIES.map(cat => (
            <motion.button 
              key={cat} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveMain(cat); setActiveSub('All Fishes'); }} 
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                activeMain === cat 
                  ? 'bg-[#00f5ff]/10 text-[#00f5ff] border-[#00f5ff]/20 shadow-[0_0_20px_rgba(0,245,255,0.15)]' 
                  : 'border-transparent text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sub Category Tabs for Fishes */}
      <AnimatePresence>
        {activeMain === 'Fishes' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-center mb-8 px-4 overflow-hidden"
          >
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-[#00f5ff]/[0.02] backdrop-blur-xl border border-[#00f5ff]/[0.08] rounded-2xl max-w-full">
              {FISH_SUB_CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveSub(cat)} 
                  className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                    activeSub === cat 
                      ? 'bg-[#00f5ff]/10 text-[#00f5ff] border-[#00f5ff]/20 shadow-[0_0_15px_rgba(0,245,255,0.2)]' 
                      : 'border-transparent text-white/30 hover:text-[#00f5ff]/60 hover:bg-[#00f5ff]/[0.03]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort + Count Bar */}
      <div className="flex items-center justify-between mb-6 px-2">
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">
          {sorted.length} {sorted.length === 1 ? 'item' : 'items'}
        </span>
        <div className="relative group">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-[#00f5ff]/10 border border-[#00f5ff]/20 rounded-xl px-4 pr-10 py-2.5 text-[10px] font-black text-white uppercase tracking-[0.2em] appearance-none cursor-pointer focus:outline-none focus:border-[#00f5ff]/50 shadow-[0_0_20px_rgba(0,245,255,0.05)] transition-all hover:bg-[#00f5ff]/20"
          >
            <option value="newest" className="bg-[#0a1628] text-white">Newest First</option>
            <option value="price-low" className="bg-[#0a1628] text-white">Price: Low → High</option>
            <option value="price-high" className="bg-[#0a1628] text-white">Price: High → Low</option>
            <option value="rating" className="bg-[#0a1628] text-white">Top Rated</option>
            <option value="name" className="bg-[#0a1628] text-white">Name A → Z</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#00f5ff]/40 group-hover:text-[#00f5ff] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-white/[0.02]">
              <div className="aspect-[4/5] bg-white/[0.03]" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-white/[0.04] rounded w-1/3" />
                <div className="h-4 bg-white/[0.04] rounded w-3/4" />
                <div className="h-3 bg-white/[0.04] rounded w-full" />
                <div className="h-8 bg-white/[0.04] rounded-xl mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-24"
        >
          <motion.p 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 3 }} 
            className="text-6xl mb-6"
          >
            🐟
          </motion.p>
          <p className="text-white font-black uppercase tracking-widest mb-2">No fish found</p>
          <p className="text-white/30 text-sm">Try a different category or check back later</p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sorted.map((product, i) => (
            <motion.div 
              key={product.id} 
              layout 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <ProductCard 
                product={product} 
                onQuickView={setSelectedProduct}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Product Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
