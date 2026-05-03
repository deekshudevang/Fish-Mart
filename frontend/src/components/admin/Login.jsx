import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiArrowLeft, FiShield } from 'react-icons/fi';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/admin/login', credentials);
      localStorage.setItem('adminToken', res.data.accessToken);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication Denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      {/* Back button */}
      <motion.button 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={() => navigate('/')} 
        className="absolute top-10 left-10 flex items-center space-x-3 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em]"
      >
        <FiArrowLeft size={16} /><span>Return to Store</span>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
        className="bg-[#0a0f1e] border border-white/5 rounded-[3rem] p-12 w-full max-w-md shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
            className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] mb-6 shadow-xl"
          >
            <FiShield size={32} className="text-cyan-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight italic">Control<span className="text-cyan-400 not-italic">Center</span></h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Access Email</label>
            <div className="relative">
              <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="email" placeholder="admin@exoticfish.com" value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-white placeholder:text-slate-700" required />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Security Key</label>
            <div className="relative">
              <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="password" placeholder="••••••••" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-white placeholder:text-slate-700" required />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            disabled={loading} 
            type="submit" 
            className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-[0.2em] disabled:opacity-50"
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate Access'}
          </motion.button>
        </form>

      </motion.div>
    </div>
  );
}
