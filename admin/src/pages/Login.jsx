import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const { admin, login, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (admin) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      /* error shown via loginError */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen admin-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-magenta-500/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-12 w-full max-w-md relative z-10"
      >
        {/* VIP Branding */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/30"
          >
            <FiShield size={32} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight italic">
            Control<span className="text-cyan-400 not-italic">Center</span>
          </h1>
          <div className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 rounded-full">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em]">Authorized Access Only</p>
          </div>
        </div>

        {/* Status Alerts */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
          >
            {loginError}
          </motion.div>
        )}

        {/* Security Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Access Email</label>
            <div className="relative">
              <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-admin pl-14"
                placeholder="admin@exoticfishmart.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Security Key</label>
            <div className="relative">
              <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-admin pl-14"
                placeholder="••••••••••"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-black rounded-2xl transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-[0.3em] disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Authenticate</span>
                <FiArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.4em]">Exotic Fish Mart © 2024</p>
        </div>
      </motion.div>
    </div>
  );
}
