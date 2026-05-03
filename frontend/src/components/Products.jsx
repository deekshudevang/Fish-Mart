import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from './ProductCard';

const CATEGORIES = ['All', 'Freshwater', 'Saltwater', 'Rare'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

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

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="collection" className="py-8 px-4 max-w-7xl mx-auto relative z-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        className="text-center mb-12"
      >
        <span className="text-cyan-400 font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Our Curated Tanks</span>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
          Exotic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Collection</span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-transparent mx-auto mb-8 rounded-full" />
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          Discover the world's most stunning aquatic life, hand-picked for their vibrant colors and healthy temperament.
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-12 px-4">
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl max-w-full">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-white text-black shadow-xl shadow-white/10' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
            <div key={i} className="glass-card p-0 overflow-hidden animate-pulse">
              <div className="aspect-[4/5] bg-white/5" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-8 bg-white/5 rounded-xl mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🐟</p>
          <p className="text-white font-black uppercase tracking-widest">No results found</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((product, i) => (
            <motion.div key={product.id} layout transition={{ delay: i * 0.05 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
