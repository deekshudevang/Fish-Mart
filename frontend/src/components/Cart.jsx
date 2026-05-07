import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Checkout from './Checkout';

export default function Cart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" 
            />

            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 30, stiffness: 300 }} 
              className="fixed top-0 right-0 w-full max-w-md h-full bg-[#020810]/95 backdrop-blur-2xl z-[101] border-l border-white/[0.06] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#00f5ff]/10 rounded-xl flex items-center justify-center border border-[#00f5ff]/20">
                    <ShoppingBag className="text-[#00f5ff]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">My Cart</h2>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{cart.length} Items</p>
                  </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-white/40 hover:text-white transition-all border border-white/[0.06]">
                  <X size={16} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-5">
                    <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center border border-white/[0.06]">
                      <ShoppingBag size={32} className="text-white/10" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white mb-1">Your cart is empty</p>
                      <p className="text-white/30 text-xs max-w-[200px] mx-auto">Explore our collection of exotic fish!</p>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className="px-6 py-2.5 bg-[#00f5ff] text-[#020810] font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#06d6a0] transition-colors">
                      Go Shopping
                    </button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div key={item.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30 }} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl group hover:bg-white/[0.04] transition-all">
                        <img src={Array.isArray(item.images) ? item.images[0] : item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-white/[0.06]" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold truncate text-sm">{item.name}</h4>
                          <p className="text-[#00f5ff] font-black text-xs">₹{item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 bg-white/[0.04] rounded-lg hover:bg-white/[0.08] text-white/40 transition-all border border-white/[0.06]"><Minus size={12} /></button>
                            <span className="text-white font-black text-xs w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 bg-white/[0.04] rounded-lg hover:bg-white/[0.08] text-white/40 transition-all border border-white/[0.06]"><Plus size={12} /></button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-white mb-2">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-white/10 hover:text-red-400 transition-colors bg-white/[0.03] rounded-lg border border-white/[0.04] hover:border-red-400/20"><Trash2 size={14} /></button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-5 bg-white/[0.01] border-t border-white/[0.04] space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/30 font-bold uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/30 font-bold uppercase tracking-widest">
                      <span>Shipping</span>
                      <span className="text-emerald-400">Free</span>
                    </div>
                    <div className="h-px bg-white/[0.04] my-1" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-white uppercase tracking-tight">Total</span>
                      <span className="text-2xl font-black text-[#00f5ff]">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                    onClick={() => { setIsCartOpen(false); setCheckoutOpen(true); }}
                    className="group w-full py-4 bg-gradient-to-r from-[#00f5ff] to-[#06d6a0] text-[#020810] font-black rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,245,255,0.25)] transition-all uppercase tracking-widest text-xs"
                  >
                    Confirm Checkout
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <button onClick={clearCart} className="w-full py-1.5 text-[9px] font-bold text-white/15 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Clear Cart</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <Checkout isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
