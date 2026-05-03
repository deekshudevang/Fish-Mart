import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsCartOpen(false)} 
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
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                  <ShoppingBag className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">My Cart</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{cart.length} Items Selected</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <ShoppingBag size={40} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white mb-2">Your cart is empty</p>
                    <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Explore our collection of exotic fish to fill it up!</p>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-8 py-3 bg-white text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all"
                  >
                    Go Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {cart.map((item) => (
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
                        <p className="text-cyan-400 font-black text-sm">₹{item.price.toLocaleString()}</p>
                        
                        <div className="flex items-center space-x-3 mt-3">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 transition-all border border-white/10"><Minus size={14} /></button>
                          <span className="text-white font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 transition-all border border-white/10"><Plus size={14} /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2.5 text-slate-600 hover:text-red-400 transition-colors bg-white/5 rounded-xl border border-white/5 hover:border-red-400/20"><Trash2 size={18} /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 bg-white/[0.02] border-t border-white/5 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-slate-400 text-sm font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-sm font-bold uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-emerald-400">Free</span>
                  </div>
                  <div className="h-[1px] bg-white/5 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white uppercase tracking-tighter">Total Amount</span>
                    <span className="text-3xl font-black text-cyan-400">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  className="group w-full py-5 bg-white text-black font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:bg-cyan-400 hover:text-white transition-all duration-500 uppercase tracking-widest text-sm"
                >
                  Confirm Checkout
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
                
                <button onClick={clearCart} className="w-full py-2 text-[10px] font-bold text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.2em]">Clear My Cart</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
