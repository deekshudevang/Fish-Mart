import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Truck, Shield, Clock, Droplets, Thermometer, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, isOpen, onClose }) {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
  const hasMultipleImages = images.length > 1;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const nextImage = () => setCurrentImageIndex(i => (i + 1) % images.length);
  const prevImage = () => setCurrentImageIndex(i => (i - 1 + images.length) % images.length);

  // Parse specs from product or use defaults
  const specs = product.specs || {};
  const care = product.care || {};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0a1628]/95 border border-white/[0.06] backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)]"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"
            >
              <X size={18} />
            </motion.button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Image Gallery */}
              <div className="relative aspect-square md:aspect-auto md:h-full bg-gradient-to-br from-[#060d1a] to-[#0a1628] overflow-hidden">
                {/* Main Image */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex] || '/products/arowana.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>

                {/* Image Navigation */}
                {hasMultipleImages && (
                  <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-xl rounded-full text-white/70 hover:text-white transition-all hover:bg-black/60">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-xl rounded-full text-white/70 hover:text-white transition-all hover:bg-black/60">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Thumbnail Strip */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          i === currentImageIndex ? 'border-[#00f5ff] shadow-[0_0_10px_rgba(0,245,255,0.3)]' : 'border-white/10 opacity-50 hover:opacity-80'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#00f5ff]/10 border border-[#00f5ff]/20 rounded-full backdrop-blur-xl">
                  <span className="text-[9px] font-black text-[#00f5ff] uppercase tracking-[0.2em]">
                    {product.category || 'Exotic'}
                  </span>
                </div>
              </div>

              {/* Right: Product Info */}
              <div className="p-6 md:p-8 flex flex-col">
                {/* Title + Rating */}
                <div className="mb-4">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={14} className={i < Math.floor(product.avgRating || 5) ? 'text-amber-400' : 'text-white/10'} fill={i < Math.floor(product.avgRating || 5) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="text-sm text-white/40 font-medium">{product.avgRating?.toFixed(1) || '5.0'}</span>
                    <span className="text-xs text-white/20">({product.reviewCount || 0} reviews)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.stock > 0 ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg">
                      In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-lg">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-4 bg-white/[0.02] rounded-xl p-1">
                  {['details', 'specs', 'care'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                        activeTab === tab
                          ? 'bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/20'
                          : 'text-white/30 hover:text-white/50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 mb-6 min-h-[120px]">
                  <AnimatePresence mode="wait">
                    {activeTab === 'details' && (
                      <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <p className="text-[#7a8ba8] text-sm leading-relaxed whitespace-pre-wrap">
                          {product.details || product.description || 'This exotic specimen is hand-selected from the finest breeders. Known for its stunning coloration and active personality, this fish will be the centerpiece of any aquarium.'}
                        </p>
                      </motion.div>
                    )}
                    {activeTab === 'specs' && (
                      <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 gap-3">
                        {[
                          { icon: Ruler, label: 'Size', value: specs.size ? `${specs.size} inches` : 'Not Specified' },
                          { icon: Thermometer, label: 'Temp', value: specs.temp ? `${specs.temp}°C` : 'Not Specified' },
                          { icon: Droplets, label: 'pH Level', value: specs.ph || 'Not Specified' },
                          { icon: Clock, label: 'Lifespan', value: specs.lifespan ? `${specs.lifespan} years` : 'Not Specified' },
                        ].map((spec, i) => (
                          <div key={i} className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                            <spec.icon size={14} className="text-[#00f5ff] mb-1.5" />
                            <div className="text-[9px] text-white/30 font-black uppercase tracking-wider">{spec.label}</div>
                            <div className="text-sm text-white font-bold">{spec.value}</div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                    {activeTab === 'care' && (
                      <motion.div key="care" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                        {[
                          { label: 'Care Level', value: care.careLevel || 'Not Specified', color: care.careLevel === 'Easy' ? 'emerald' : care.careLevel === 'Expert' ? 'red' : care.careLevel === 'Moderate' ? 'amber' : 'white' },
                          { label: 'Temperament', value: care.temperament || 'Not Specified', color: care.temperament === 'Peaceful' ? 'emerald' : care.temperament === 'Aggressive' ? 'red' : care.temperament === 'Semi-Aggressive' ? 'amber' : 'white' },
                          { label: 'Diet', value: care.diet || 'Not Specified' },
                          { label: 'Tank Size', value: care.tankSize ? `${care.tankSize} gallons` : 'Not Specified' },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                            <span className="text-xs text-white/40 font-bold">{item.label}</span>
                            <span className={`text-xs font-black ${item.color ? `text-${item.color}-400` : 'text-white'}`}>{item.value}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quantity + Actions */}
                <div className="space-y-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-wider">Qty</span>
                    <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-xl">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-white/40 hover:text-white transition-colors font-bold">−</button>
                      <span className="px-4 py-2 text-white font-black text-sm min-w-[40px] text-center">{quantity}</span>
                      <button onClick={() => setQuantity(q => Math.min(product.stock || 10, q + 1))} className="px-3 py-2 text-white/40 hover:text-white transition-colors font-bold">+</button>
                    </div>
                    <span className="text-xs text-white/20">{product.stock} available</span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                        addedToCart
                          ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                          : product.stock === 0
                          ? 'bg-white/5 text-white/20 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#00f5ff] to-[#06d6a0] text-[#020810] hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]'
                      }`}
                    >
                      {addedToCart ? (
                        <>✓ Added to Cart</>
                      ) : (
                        <><ShoppingCart size={14} /> Add to Cart</>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToWishlist(product)}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isInWishlist(product.id)
                          ? 'bg-red-500/20 border-red-500/30 text-red-400'
                          : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-red-400 hover:border-red-500/20'
                      }`}
                    >
                      <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    </motion.button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/[0.04]">
                  {[
                    { icon: Truck, text: 'Free Express Shipping' },
                    { icon: Shield, text: 'Live Arrival Guarantee' },
                    { icon: Clock, text: '24/7 Expert Support' },
                  ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-2">
                      <badge.icon size={16} className="text-[#00f5ff]/50 mb-1.5" />
                      <span className="text-[8px] text-white/30 font-bold leading-tight">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
