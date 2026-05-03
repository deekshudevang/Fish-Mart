import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiShield, FiBell, FiMenu, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const roleBadge = {
  'super-admin': { label: 'Master Admin', cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  'product-manager': { label: 'Inventory Mgr', cls: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  'order-manager': { label: 'Trade Mgr', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

export default function AdminNavbar() {
  const { admin, logout } = useAuth();

  if (!admin) return null;

  const badge = roleBadge[admin.role] || { label: admin.role, cls: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };

  return (
    <header className="sticky top-0 z-40 h-24 bg-[#060a14]/80 backdrop-blur-2xl border-b border-white/5 transition-all duration-500">
      <div className="h-full flex items-center justify-between px-6 lg:px-12">
        {/* Search / Global Tools */}
        <div className="hidden md:flex items-center space-x-6 flex-1">
           <div className="relative group max-w-md w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Global Search Control..." 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 outline-none focus:border-cyan-500/30 transition-all text-xs font-bold text-white placeholder:text-slate-700"
              />
           </div>
        </div>

        {/* Brand Mobile Logo */}
        <div className="flex lg:hidden items-center space-x-3">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FiShield size={20} className="text-white" />
           </div>
        </div>

        {/* Admin Command Deck */}
        <div className="flex items-center space-x-6">
          {/* Status Indicators */}
          <div className="hidden sm:flex items-center space-x-2">
             <button className="relative p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white transition-all group">
                <FiBell size={20} />
                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full" />
             </button>
          </div>

          {/* User Profile Hook */}
          <div className="flex items-center space-x-4 pl-6 border-l border-white/5">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-black text-white uppercase tracking-wider mb-1 italic">{admin.name}</p>
              <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${badge.cls}`}>
                {badge.label}
              </div>
            </div>
            
            <div className="relative group">
               <div className="absolute inset-0 bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-white text-sm font-black relative z-10 shadow-xl">
                 {admin.name?.charAt(0)?.toUpperCase() || 'A'}
               </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={logout}
              className="p-3.5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all shadow-lg"
              title="Terminate Session"
            >
              <FiLogOut size={20} />
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-500">
             <FiMenu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
