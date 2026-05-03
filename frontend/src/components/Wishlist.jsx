import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, addToCart } = useCart();

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsWishlistOpen(false)} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" 
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 30, stiffness: 300 }} 
            className="fixed top-0 right-0 w-full max-w-md h-full bg-[#020617]/95 backdrop-blur-2xl z-[101] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center border border-pink-500/20">
                  <Heart className="text-pink-400" size={24} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Wishlist</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{wishlist.length} Favorites Saved</p>
                </div>
              </div>
              <button 
                onClick={() => setIsWishlistOpen(false)} 
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <Heart size={40} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white mb-2">Your wishlist is empty</p>
                    <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Save the fish you love to keep an eye on them!</p>
                  </div>
                  <button 
                    onClick={() => setIsWishlistOpen(false)}
                    className="px-8 py-3 bg-white text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {wishlist.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, x: 20 }} 
                      className="flex items-center space-x-5 p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] group hover:bg-white/[0.06] transition-all"
                    >
                      <img src={Array.isArray(item.images) ? item.images[0] : item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold truncate text-lg">{item.name}</h4>
                        <p className="text-pink-400 font-black text-sm">₹{item.price.toLocaleString()}</p>
                        
                        <button 
                          onClick={() => {
                            addToCart(item);
                            removeFromWishlist(item.id);
                          }}
                          className="mt-3 flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-white transition-colors"
                        >
                          <ShoppingCart size={12} />
                          Move to Cart
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromWishlist(item.id)} 
                        className="p-2.5 text-slate-600 hover:text-red-400 transition-colors bg-white/5 rounded-xl border border-white/5 hover:border-red-400/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div className="p-8 bg-white/[0.02] border-t border-white/5">
                <button 
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-full py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
