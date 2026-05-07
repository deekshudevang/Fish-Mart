import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer id="about" className="relative mt-8 scroll-mt-20 border-t border-white/[0.04] overflow-hidden">
      <div id="contact" className="absolute -top-10" />

      {/* Aurora glow behind footer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-[#00f5ff]/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-[#d946ef]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-5"
            >
              <motion.span 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="text-3xl"
              >
                🐠
              </motion.span>
              <span className="text-xl font-black tracking-tighter text-white uppercase">
                Exotic <span className="text-[#00f5ff] not-italic">Fish Mart</span>
              </span>
            </motion.div>
            <p className="text-[#7a8ba8] text-sm leading-relaxed mb-6">
              Premium aquarium fish sourced from the finest breeders worldwide. Live delivery guaranteed.
            </p>
            {/* Newsletter */}
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email..." 
                className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f5ff]/30 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 bg-gradient-to-r from-[#00f5ff] to-[#06d6a0] rounded-xl text-[9px] font-black text-[#040812] uppercase tracking-wider"
              >
                Join
              </motion.button>
            </div>
          </div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop', href: '#collection' },
                { label: 'About Us', href: '#about' },
                { label: 'Contact', href: '#contact' },
              ].map((link, i) => (
                <motion.li key={i} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                  {link.to ? (
                    <Link to={link.to} className="text-[#7a8ba8] hover:text-[#00f5ff] transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#00f5ff]/30" />
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-[#7a8ba8] hover:text-[#00f5ff] transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#00f5ff]/30" />
                      {link.label}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-5">Categories</h4>
            <ul className="space-y-3 text-sm">
              {['Freshwater Fish', 'Saltwater Fish', 'Rare Species', 'Aquarium Supplies'].map((l, i) => (
                <motion.li key={l} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <a href="#collection" className="text-[#7a8ba8] hover:text-[#00f5ff] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#d946ef]/30" />
                    {l}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Live Delivery Policy', to: '/policy/delivery-policy' },
                { label: 'Returns & Refunds', to: '/policy/returns-refunds' },
                { label: 'Shipping Info', to: '/policy/shipping-info' },
                { label: 'FAQ', to: '/policy/faq' },
              ].map((link, i) => (
                <motion.li key={i} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Link to={link.to} className="text-[#7a8ba8] hover:text-[#00f5ff] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#06d6a0]/30" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-[#7a8ba8]/50 text-xs font-medium tracking-wide">
            &copy; {new Date().getFullYear()} Exotic Fish Mart. Crafted with 🩵 for aquatic life.
          </p>
          <div className="flex space-x-2">
            {[
              { Icon: FiTwitter, color: '#1DA1F2' },
              { Icon: FiInstagram, color: '#E1306C' },
              { Icon: FiGithub, color: '#fff' },
              { Icon: FiMail, color: '#00f5ff' },
            ].map(({ Icon, color }, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 text-white/30 hover:text-white rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all"
                style={{ '--hover-color': color }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
