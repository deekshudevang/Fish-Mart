import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingCart, Heart, Star, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [exactMatches, setExactMatches] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setExactMatches([]);
      setRelatedProducts([]);
      setHasSearched(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Debounced search
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setExactMatches([]);
      setRelatedProducts([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const { data } = await axios.get(`/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setExactMatches(data.exactMatches || []);
      setRelatedProducts(data.relatedProducts || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(value), 350);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    performSearch(query);
  };

  const getImageSrc = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    if (product.image) return product.image;
    return '/products/arowana.png';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex flex-col"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto w-full px-4 md:px-8">
            
            {/* Header with Search Bar */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pt-6 md:pt-10 pb-6"
            >
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Input */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                  <Search 
                    size={20} 
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" 
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search for exotic fish, plants, accessories..."
                    className="w-full pl-14 pr-6 py-5 bg-white/[0.04] border border-white/10 rounded-2xl text-white text-lg font-medium placeholder:text-slate-600 outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300 focus:shadow-[0_0_40px_rgba(6,182,212,0.08)]"
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => { setQuery(''); setExactMatches([]); setRelatedProducts([]); setHasSearched(false); inputRef.current?.focus(); }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {/* Glow line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
              </form>

              {/* Quick hint */}
              {!hasSearched && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 mt-4 text-slate-600 text-xs"
                >
                  <Sparkles size={12} className="text-cyan-500/50" />
                  <span className="font-medium">Try: "Arowana", "Betta", "Neon Tetra", "Java Fern", "LED Light"</span>
                </motion.div>
              )}
            </motion.div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto pb-8 custom-scrollbar">
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Scanning inventory...</span>
                </motion.div>
              )}

              {!loading && hasSearched && exactMatches.length === 0 && relatedProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-white font-black text-xl mb-2 tracking-tight">No matches found</h3>
                  <p className="text-slate-500 text-sm font-medium max-w-md text-center">
                    We couldn't find "{query}" in our inventory. Try a different search term or browse our categories.
                  </p>
                </motion.div>
              )}

              {/* Exact Matches */}
              {!loading && exactMatches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                      {exactMatches.length === 1 ? 'Perfect Match' : `${exactMatches.length} Matches Found`}
                    </h3>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/20 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exactMatches.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="group relative flex gap-4 p-4 bg-white/[0.03] border border-cyan-500/20 rounded-2xl hover:border-cyan-500/40 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
                      >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Image */}
                        <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white/5">
                          <img
                            src={getImageSrc(product)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          {/* Match badge */}
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-cyan-500 text-black text-[7px] font-black uppercase tracking-wider rounded-md">
                            Match
                          </div>
                        </div>

                        {/* Info */}
                        <div className="relative flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-black text-cyan-400/60 uppercase tracking-wider px-2 py-0.5 bg-cyan-500/10 rounded-md">
                                {product.category}
                              </span>
                              <div className="flex items-center gap-0.5 text-yellow-500">
                                <Star size={9} fill="currentColor" />
                                <span className="text-[9px] font-bold">{product.avgRating?.toFixed(1) || '5.0'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-base font-black text-white tracking-tight">
                              ₹{product.price?.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); addToWishlist(product); }}
                                className={`p-1.5 rounded-lg transition-all ${
                                  isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                                }`}
                              >
                                <Heart size={12} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                className="p-1.5 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                              >
                                <ShoppingCart size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Related Products */}
              {!loading && relatedProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-blue-500 rounded-full" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                      You Might Also Like
                    </h3>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-blue-500/20 to-transparent" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {relatedProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-white/5">
                          <img
                            src={getImageSrc(product)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); addToWishlist(product); }}
                            className={`absolute top-2 right-2 p-1 rounded-md backdrop-blur-md transition-all ${
                              isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-black/30 text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <Heart size={11} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="p-2.5 flex flex-col gap-1.5">
                          <h4 className="text-[10px] font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors tracking-tight">
                            {product.name}
                          </h4>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                            {product.category}
                          </span>
                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <span className="text-xs font-black text-white tracking-tighter">
                              ₹{product.price?.toLocaleString()}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                              className="p-1 bg-cyan-500 text-black rounded-md hover:bg-cyan-400 transition-all"
                            >
                              <ShoppingCart size={10} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Custom scrollbar styles */}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.2); border-radius: 999px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.4); }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
