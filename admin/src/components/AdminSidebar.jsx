import { NavLink, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingCart, FiUsers, FiSettings, FiExternalLink, FiChevronLeft, FiChevronRight, FiShield } from 'react-icons/fi';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { path: '/products', icon: FiPackage, label: 'Inventory' },
  { path: '/orders', icon: FiShoppingCart, label: 'Orders' },
  { path: '/users', icon: FiUsers, label: 'Users' },
  { path: '/cms', icon: FiSettings, label: 'Settings' },
  { path: 'http://localhost:3000', icon: FiExternalLink, label: 'Live Store', external: true },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 transition-all duration-500 ease-[0.23,1,0.32,1]
        ${collapsed ? 'w-[80px]' : 'w-72'}
        bg-[#060a14]/95 backdrop-blur-3xl border-r border-white/5 shadow-2xl shadow-black/50 hidden lg:block`}
    >
      {/* Premium Header */}
      <div className="h-24 flex items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center space-x-4 overflow-hidden">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 border border-white/10"
          >
            <FiShield size={24} className="text-white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                <h1 className="text-sm font-black text-white leading-tight uppercase tracking-tighter">Exotic Mart</h1>
                <p className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.3em] opacity-70">Control Center</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Ecosystem */}
      <nav className="mt-8 px-4 space-y-2">
        {navItems.map(({ path, icon: Icon, label, external }) => {
          const isActive = !external && location.pathname === path;
          
          const content = (
            <div className="flex items-center space-x-4 relative z-10">
              <div className={`p-2.5 rounded-xl transition-all duration-500 ${isActive ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40' : 'text-slate-500 group-hover:text-white'}`}>
                <Icon size={20} />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="text-[11px] font-black uppercase tracking-[0.2em]"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );

          if (external) {
            return (
              <a
                key={label}
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-3.5 rounded-2xl text-slate-500 hover:text-white hover:bg-white/[0.03] transition-all duration-300 group border border-transparent hover:border-white/5"
              >
                {content}
              </a>
            );
          }

          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `
                relative flex items-center px-4 py-3.5 rounded-2xl transition-all duration-500 group border
                ${isActive 
                  ? 'bg-white/[0.03] text-white border-white/10 shadow-xl' 
                  : 'text-slate-500 border-transparent hover:border-white/5 hover:bg-white/[0.02] hover:text-white'
                }
              `}
            >
              {content}
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* VIP Footer / Collapse */}
      <div className="absolute bottom-10 left-0 w-full px-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all duration-300 group shadow-lg"
        >
          {collapsed ? <FiChevronRight size={20} /> : <div className="flex items-center space-x-3"><FiChevronLeft size={20} /><span className="text-[9px] font-black uppercase tracking-widest">Collapse View</span></div>}
        </button>
      </div>
    </aside>
  );
}
