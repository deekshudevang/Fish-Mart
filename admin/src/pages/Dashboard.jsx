import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiPackage, FiDollarSign, FiStar, FiLayers, FiAlertTriangle, FiTrendingUp, FiEye, FiVideo, FiActivity } from 'react-icons/fi';

export default function Dashboard() {
  const { api } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/50">Decrypting Metrics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-32">
        <div className="inline-flex p-6 bg-red-500/10 rounded-[2rem] mb-6 border border-red-500/20">
          <FiAlertTriangle size={40} className="text-red-500" />
        </div>
        <p className="text-white font-black uppercase tracking-widest">Critical: Sync Failed</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'cyan' },
    { label: 'Market Value', value: `₹${Number(stats.totalRevenue).toLocaleString()}`, icon: FiDollarSign, color: 'emerald' },
    { label: 'Customer Reviews', value: stats.totalReviews, icon: FiStar, color: 'purple' },
    { label: 'Low Stock Alerts', value: stats.lowStock, icon: FiAlertTriangle, color: 'red' },
  ];

  return (
    <div className="max-w-full overflow-hidden space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight italic mb-2">Market<span className="text-cyan-400 not-italic">Intelligence</span></h1>
          <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Real-time Data Stream</span>
             </div>
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid - NO HORIZONTAL SCROLL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 group relative overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${card.color}-500/5 rounded-full blur-2xl group-hover:bg-${card.color}-500/10 transition-all`} />
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 bg-${card.color}-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={24} className={`text-${card.color}-400`} />
              </div>
              <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className={`h-full w-full bg-${card.color}-500/40`} 
                />
              </div>
            </div>
            <p className="text-3xl font-black text-white mb-2">{card.value}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Category Analytics - High Density */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3 glass-card p-10"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
              <FiTrendingUp size={22} className="text-cyan-400" />
              Category Breakdown
            </h2>
          </div>
          <div className="space-y-8">
            {Object.entries(stats.categoryBreakdown).map(([cat, data]) => {
              const pct = stats.totalProducts > 0 ? (data.count / stats.totalProducts) * 100 : 0;
              return (
                <div key={cat} className="group">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-black text-white uppercase tracking-widest">{cat}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{data.count} Units</span>
                    </div>
                    <span className="text-xs font-black text-cyan-400 italic">₹{Number(data.revenue).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Live Feed - Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-10"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
              <FiActivity size={22} className="text-magenta-400" />
              Live Activity
            </h2>
          </div>
          <div className="space-y-6">
            {stats.recentProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-5 p-4 bg-white/[0.01] border border-white/5 rounded-[1.5rem] group hover:bg-white/[0.03] transition-all duration-500">
                <div className="relative shrink-0">
                   <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   <img
                    src={p.images?.[0] || p.image || '/products/placeholder.png'}
                    alt={p.name}
                    className="w-14 h-14 rounded-2xl object-cover relative z-10"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white uppercase tracking-tight truncate group-hover:text-cyan-400 transition-colors">{p.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-emerald-400 italic">₹{Number(p.price).toLocaleString()}</span>
                    <div className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock < 10 ? 'text-red-500' : 'text-slate-500'}`}>
                      {p.stock} Stock
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
