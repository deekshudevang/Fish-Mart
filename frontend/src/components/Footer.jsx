import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer id="about" className="relative mt-8 scroll-mt-20 border-t border-white/5">
      <div id="contact" className="absolute -top-10" /> {/* Transparent anchor point */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🐠</span>
              <span className="text-xl font-display font-bold text-gradient-cyan">Exotic Fish Mart</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Premium aquarium fish sourced from the finest breeders worldwide. Live delivery guaranteed.</p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</Link></li>
              <li><a href="#collection" className="text-gray-400 hover:text-cyan-400 transition-colors">Shop</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          {/* Categories */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {['Freshwater Fish','Saltwater Fish','Rare Species','Aquarium Supplies'].map(l=><li key={l}><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">{l}</a></li>)}
            </ul>
          </div>
          {/* Support */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/policy/delivery-policy" className="text-gray-400 hover:text-cyan-400 transition-colors">Live Delivery Policy</Link></li>
              <li><Link to="/policy/returns-refunds" className="text-gray-400 hover:text-cyan-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/policy/shipping-info" className="text-gray-400 hover:text-cyan-400 transition-colors">Shipping Info</Link></li>
              <li><Link to="/policy/faq" className="text-gray-400 hover:text-cyan-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Exotic Fish Mart. All rights reserved.</p>
          <div className="flex space-x-4">
            {[FiTwitter,FiInstagram,FiGithub,FiMail].map((Icon,i)=>(
              <motion.a key={i} href="#" whileHover={{scale:1.2,y:-2}} className="p-2 text-gray-500 hover:text-cyan-400 transition-colors"><Icon size={20}/></motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
