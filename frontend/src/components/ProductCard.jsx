import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const cardRef = useRef(null);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1200);
  };

  const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/[0.04] hover:border-[#00f5ff]/20 transition-all duration-500 bg-[#060d1a]/80 backdrop-blur-lg cursor-pointer"
      whileHover={{ z: 30 }}
      onClick={() => onQuickView && onQuickView(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#060d1a]">
        <motion.img 
          src={images[currentImageIndex] || '/products/arowana.png'} 
          alt={product.name} 
          className="w-full h-full object-cover" 
          loading="lazy"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        />
        
        {/* Hover Gradient Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-[#020810] via-transparent to-transparent"
        />

        {/* Shimmer effect on hover */}
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: isHovered ? '100%' : '-100%', opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        />
        
        {/* Wishlist Button */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToWishlist(product);
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.85 }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-xl transition-all z-20 ${
            isInWishlist(product.id) 
              ? 'bg-red-500/80 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
              : 'bg-black/30 text-white/80 hover:bg-[#00f5ff]/20 hover:text-[#00f5ff]'
          }`}
        >
          <Heart size={14} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Quick View Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-3 left-3 right-3 z-20"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView && onQuickView(product);
                }}
                className="w-full py-2.5 bg-[#00f5ff]/10 border border-[#00f5ff]/20 backdrop-blur-xl rounded-xl text-[9px] font-black text-[#00f5ff] uppercase tracking-[0.3em] hover:bg-[#00f5ff]/20 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,245,255,0.1)]"
              >
                <Eye size={12} />
                Quick View
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg backdrop-blur-xl">
            <span className="text-[8px] font-black text-amber-400 uppercase tracking-wider">
              Only {product.stock} left
            </span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-xl">
            <span className="text-[8px] font-black text-red-400 uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col space-y-2 flex-grow relative">
        {/* Category Tag */}
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-black text-[#00f5ff]/60 uppercase tracking-[0.3em] bg-[#00f5ff]/[0.06] px-2 py-0.5 rounded-md">
            {product.category || 'Exotic'}
          </span>
        </div>

        <h3 className="text-[11px] md:text-xs font-black text-white line-clamp-1 group-hover:text-[#00f5ff] transition-colors duration-300 tracking-tight">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i} 
                size={8} 
                className={i < Math.floor(product.avgRating || 5) ? 'text-amber-400' : 'text-white/10'} 
                fill={i < Math.floor(product.avgRating || 5) ? 'currentColor' : 'none'} 
              />
            ))}
          </div>
          <span className="text-[9px] font-bold text-white/40">{product.avgRating?.toFixed(1) || '5.0'}</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] mt-auto">
          <div>
            <span className="text-sm md:text-base font-black text-white tracking-tighter">
              ₹{product.price?.toLocaleString()}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleAddToCart}
            className={`relative p-2 rounded-xl transition-all duration-300 overflow-hidden ${
              addedToCart 
                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                : 'bg-[#00f5ff]/10 text-[#00f5ff] hover:bg-[#00f5ff]/20 hover:shadow-[0_0_15px_rgba(0,245,255,0.2)]'
            }`}
          >
            {addedToCart ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[10px] font-black"
              >
                ✓
              </motion.span>
            ) : (
              <ShoppingCart size={13} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
