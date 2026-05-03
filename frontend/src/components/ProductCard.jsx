import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Container - Portrait and Dense */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <img 
          src={images[currentImageIndex] || '/products/arowana.png'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
          loading="lazy" 
        />
        
        {/* Wishlist Button - Minimal */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addToWishlist(product);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-all z-20 ${
            isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-black/20 text-white hover:bg-white/10'
          }`}
        >
          <Heart size={14} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content - Ultra Minimal Retail Style */}
      <div className="p-2 flex flex-col space-y-1.5">
        <h3 className="text-[10px] md:text-[11px] font-black text-white line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300 tracking-tight">
          {product.name}
        </h3>
        
        <div className="flex items-center text-yellow-500 space-x-1">
          <Star size={8} fill="currentColor" />
          <span className="text-[9px] font-black">{product.avgRating?.toFixed(1) || '5.0'}</span>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
          <span className="text-xs md:text-sm font-black text-white tracking-tighter">
            ₹{product.price?.toLocaleString()}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product)}
            className="p-1.5 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            <ShoppingCart size={11} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
