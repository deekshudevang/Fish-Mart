import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUsers, FiMail, FiCalendar, FiClock, FiShield } from 'react-icons/fi';

export default function Users() {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/50">Mapping User Ecosystem...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-full overflow-hidden">
      <div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tight italic mb-2">User<span className="text-cyan-400 not-italic">Intelligence</span></h1>
        <div className="flex items-center space-x-3">
           <div className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-500/10 rounded-full">
              <FiUsers size={12} className="text-cyan-400" />
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em]">{users.length} Registered Customers</span>
           </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass-card overflow-hidden border-white/10 shadow-2xl"
      >
        <div className="overflow-x-auto no-scrollbar hidden lg:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Citizen Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Access Channel</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Registration</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        {u.picture ? (
                          <img src={u.picture} alt={u.name} className="w-12 h-12 rounded-[1rem] object-cover relative z-10 border border-white/10" />
                        ) : (
                          <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-400 flex items-center justify-center font-black text-lg relative z-10 border border-white/10">
                            {u.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{u.name}</span>
                        <p className="text-[9px] text-slate-600 font-bold tracking-widest mt-0.5">UID: {u.id?.toString()?.substring(0, 10) || 'N/A'}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <div className="flex items-center gap-2 mb-1">
                          <FiMail size={12} className="text-slate-500" />
                          <span className="text-xs font-black text-slate-300 italic">{u.email}</span>
                       </div>
                       {u.googleId && (
                         <div className="flex items-center gap-2">
                            <FiShield size={10} className="text-cyan-500" />
                            <span className="text-[9px] font-black text-cyan-500/50 uppercase tracking-widest">Google Authorized</span>
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400">
                       <FiCalendar size={14} />
                       <span className="text-xs font-bold">{new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400">
                       <FiClock size={14} className={u.lastLogin ? 'text-emerald-500' : 'text-slate-600'} />
                       <span className="text-xs font-bold">
                         {u.lastLogin ? new Date(u.lastLogin).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
                       </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - No Horizontal Scroll */}
        <div className="lg:hidden divide-y divide-white/5">
          {Array.isArray(users) && users.map((u) => (
            <div key={u.id} className="p-6 flex flex-col space-y-4">
               <div className="flex items-center gap-4">
                  {u.picture ? (
                    <img src={u.picture} alt={u.name} className="w-12 h-12 rounded-xl border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center font-black">{u.name.charAt(0)}</div>
                  )}
                  <div>
                    <h3 className="text-sm font-black text-white uppercase italic">{u.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold">{u.email}</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                     <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Joined</p>
                     <p className="text-[11px] font-bold text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Last Active</p>
                     <p className="text-[11px] font-bold text-slate-400">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '—'}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-40 opacity-20">
             <FiUsers size={60} className="mx-auto mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">User Ecosystem is Vacant</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
