import { motion } from 'framer-motion';
import { FiShoppingCart, FiClock, FiTruck, FiBox } from 'react-icons/fi';

export default function Orders() {
  return (
    <div className="space-y-10 max-w-full overflow-hidden">
      <div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tight italic mb-2">Trade<span className="text-amber-400 not-italic">Logs</span></h1>
        <div className="flex items-center space-x-3">
           <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 rounded-full">
              <FiBox size={12} className="text-amber-400" />
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.2em]">Transaction Tracking Protocol</span>
           </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="glass-card p-20 text-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-amber-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10">
          <div className="w-24 h-24 mx-auto rounded-[2.5rem] bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/10">
            <FiShoppingCart size={40} className="text-amber-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Operational Readiness</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-10 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed">
            Trade execution and logistics fulfillment protocols are currently being synchronized. Deployment scheduled for Phase 3.
          </p>
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/[0.03] border border-white/5 rounded-full">
             <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Development in Progress</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
