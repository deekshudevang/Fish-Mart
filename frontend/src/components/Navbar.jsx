import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Fish, Search, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { GoogleLogin } from '@react-oauth/google';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlistCount, toggleCart, toggleWishlist } = useCart();
  const { user, loginWithGoogle, logout } = useUser();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`px-6 md:px-8 py-3 rounded-2xl flex items-center justify-between transition-all duration-700 ${
            scrolled 
              ? 'bg-[#040812]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] border border-white/[0.06]' 
              : 'bg-transparent border border-white/[0.03]'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative"
            >
              <Fish className="text-[#00f5ff] group-hover:drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]" size={22} />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-[#00f5ff] rounded-full"
              />
            </motion.div>
            <span className="text-lg font-black tracking-tighter text-white uppercase">
              Exotic <span className="text-[#00f5ff] not-italic font-black">Fish Mart</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.a 
                key={link.name} 
                href={link.href}
                whileHover={{ y: -1 }}
                className="relative text-[9px] font-black text-white/40 hover:text-white transition-colors tracking-[0.4em] uppercase group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00f5ff] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(true)}
              className="relative p-2.5 text-white/40 hover:text-[#00f5ff] transition-colors rounded-xl hover:bg-white/[0.03]"
              title="Search products"
            >
              <Search size={16} />
            </motion.button>

            {/* Wishlist */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              className="relative p-2.5 text-white/40 hover:text-red-400 transition-colors rounded-xl hover:bg-white/[0.03]"
            >
              <Heart size={16} />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cart */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCart}
              className="relative p-2.5 text-white/40 hover:text-[#00f5ff] transition-colors rounded-xl hover:bg-white/[0.03]"
            >
              <ShoppingCart size={16} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#00f5ff] text-[#040812] text-[7px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,245,255,0.5)]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            <div className="h-4 w-[1px] bg-white/[0.06] hidden md:block mx-2" />

            {/* Google Login / User Profile */}
            <div className="hidden md:block">
              {user ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-xl"
                >
                  {user.picture ? (
                    <img src={user.picture} alt="" className="w-5 h-5 rounded-full ring-1 ring-[#00f5ff]/30" />
                  ) : (
                    <User size={14} className="text-[#00f5ff]" />
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    onClick={logout}
                    className="p-1 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={13} />
                  </motion.button>
                </motion.div>
              ) : (
                <div className="scale-90 origin-right opacity-70 hover:opacity-100 transition-opacity">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => loginWithGoogle(credentialResponse.credential)}
                    onError={() => console.log('Login Failed')}
                    theme="filled_black"
                    shape="circle"
                    type="icon"
                  />
                </div>
              )}
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden p-2 text-white/50"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden absolute top-full left-0 w-full px-4 pt-3 z-40"
          >
            <div className="glass rounded-2xl p-6 border border-white/[0.06] flex flex-col space-y-4">
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMobileMenu(false)}
                  className="text-sm font-black text-white/50 hover:text-white transition-colors uppercase tracking-[0.2em] py-2"
                >
                  {link.name}
                </motion.a>
              ))}
              
              <div className="pt-4 border-t border-white/[0.04] flex justify-center">
                {user ? (
                  <div className="flex flex-col items-center space-y-3 w-full">
                    <div className="flex items-center space-x-3">
                      <img src={user.picture} alt="" className="w-8 h-8 rounded-full border border-[#00f5ff]/30" />
                      <span className="text-white font-bold text-sm">{user.name}</span>
                    </div>
                    <button 
                      onClick={logout}
                      className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold text-xs uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      loginWithGoogle(credentialResponse.credential);
                      setMobileMenu(false);
                    }}
                    theme="filled_black"
                    shape="pill"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
