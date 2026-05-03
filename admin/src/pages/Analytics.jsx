import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiPieChart, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PIE_COLORS = ['#06b6d4', '#d946ef', '#f59e0b', '#10b981'];

export default function Analytics() {
  const { api } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [api]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/50">Computing Neural Analytics...</p>
      </div>
    );
  }

  if (!stats) return (
     <div className="text-center py-32">
        <div className="inline-flex p-6 bg-red-500/10 rounded-[2rem] mb-6 border border-red-500/20">
          <FiPieChart size={40} className="text-red-500" />
        </div>
        <p className="text-white font-black uppercase tracking-widest">Failed to retrieve datasets</p>
      </div>
  );

  const catData = Object.entries(stats?.categoryBreakdown || {}).map(([name, d]) => ({
    name: name.toUpperCase(),
    products: d.count,
    revenue: d.revenue,
  }));

  const stockData = (stats?.recentProducts || []).map((p) => ({
    name: p.name?.toUpperCase().slice(0, 12) || 'UNKNOWN',
    stock: p.stock || 0,
    price: p.price || 0,
  }));

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tight italic mb-2">Neural<span className="text-cyan-400 not-italic">Analytics</span></h1>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Deep Intelligence Synthesis</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Category Distribution Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 relative overflow-hidden">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />
          <h2 className="text-xl font-black text-white mb-10 flex items-center gap-3 uppercase tracking-tighter italic">
            <FiPieChart size={22} className="text-cyan-400" />
            Inventory Volume
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={catData} 
                  dataKey="products" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60}
                  outerRadius={100} 
                  strokeWidth={0} 
                  paddingAngle={8}
                >
                  {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#060a14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem', color: '#f8fafc' }} 
                  itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue by Category Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-10 relative overflow-hidden">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-magenta-500/5 rounded-full blur-3xl" />
          <h2 className="text-xl font-black text-white mb-10 flex items-center gap-3 uppercase tracking-tighter italic">
            <FiBarChart2 size={22} className="text-magenta-400" />
            Revenue Streams
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: '#060a14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem', color: '#f8fafc' }} 
                  formatter={(v) => `₹${Number(v).toLocaleString()}`}
                />
                <Bar dataKey="revenue" fill="url(#colorRev)" radius={[10, 10, 0, 0]} />
                <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                   </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stock Levels */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-10 lg:col-span-2">
          <h2 className="text-xl font-black text-white mb-10 flex items-center gap-3 uppercase tracking-tighter italic">
            <FiTrendingUp size={22} className="text-emerald-400" />
            Stock Density (Recent Assets)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} fontWeight={900} width={100} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: '#060a14', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem', color: '#f8fafc' }} 
                />
                <Bar dataKey="stock" fill="#10b981" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
