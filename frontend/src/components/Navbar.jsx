import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Fish } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { cartCount, wishlistCount, toggleCart, toggleWishlist } = useCart();
  const { user, loginWithGoogle, logout } = useUser();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collection', href: '#collection' },
    { name: 'Rare Finds', href: '#rare' },
    { name: 'About', href: '#about' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled ? 'py-2' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className={`px-8 py-3 rounded-full flex items-center justify-between transition-all duration-700 backdrop-blur-2xl ${
          scrolled ? 'bg-[#020617]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10' : 'bg-transparent border border-white/5'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <Fish className="text-cyan-400 group-hover:rotate-12 transition-transform" size={24} />
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              Exotic <span className="text-cyan-400 not-italic">Fish Mart</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-[9px] font-black text-slate-400 hover:text-white transition-colors tracking-[0.4em] uppercase"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1.5 md:space-x-3">
            <button 
              onClick={toggleWishlist}
              className="relative p-2 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={toggleCart}
              className="relative p-2 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-cyan-500 text-black text-[8px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className="h-4 w-[1px] bg-white/10 hidden md:block mx-2" />

            {/* Google Login / User Profile */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center space-x-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                  {user.picture ? (
                    <img src={user.picture} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <User size={14} className="text-cyan-400" />
                  )}
                  <button 
                    onClick={logout}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <div className="scale-90 origin-right opacity-80 hover:opacity-100 transition-opacity">
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

            <button 
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 text-slate-300"
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full px-4 pt-4 z-40"
          >
            <div className="glass rounded-[3rem] p-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="text-lg font-black text-slate-400 hover:text-white transition-colors text-center uppercase tracking-[0.2em]"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="pt-4 flex justify-center">
                {user ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-3">
                      <img src={user.picture} alt="" className="w-10 h-10 rounded-full border border-cyan-400" />
                      <span className="text-white font-bold">{user.name}</span>
                    </div>
                    <button 
                      onClick={logout}
                      className="w-full py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-bold uppercase tracking-widest"
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
    </nav>
  );
}
