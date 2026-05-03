import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiAlertCircle, FiCheckCircle, FiGlobe, FiInfo, FiMail, FiFileText } from 'react-icons/fi';

export default function CMS() {
  const { api } = useAuth();
  const [settings, setSettings] = useState({
    hero_title: 'Exotic Fish Mart',
    hero_subtitle: 'Premium Store',
    hero_description: 'Discover the most majestic and rare aquatic life from around the globe.',
    about_us: 'Founded by passionate aquarists...',
    contact_email: 'support@exoticfishmart.com',
    delivery_policy: 'Live arrival guaranteed...',
    returns_refunds: 'Returns info...',
    shipping_info: 'Shipping details...',
    faq_content: 'FAQ info...'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put('/settings', { settings });
      setStatus({ type: 'success', message: 'Intelligence Grid Updated Successfully!' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Critical: Sync Failed. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/50">Pulling Remote Content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight italic mb-2">Content<span className="text-cyan-400 not-italic">Matrix</span></h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Global Storefront Configuration</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`p-6 rounded-[2rem] flex items-center gap-4 border shadow-2xl ${
                status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              <div className={`p-3 rounded-xl ${status.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {status.type === 'success' ? <FiCheckCircle size={24} /> : <FiAlertCircle size={24} />}
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{status.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Configuration */}
        <div className="glass-card p-10 space-y-8 relative overflow-hidden">
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px]" />
           <div className="flex items-center space-x-3 mb-4">
              <FiGlobe size={20} className="text-cyan-400" />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Hero Ecosystem</h2>
           </div>
          
           <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Primary Title</label>
                <input
                  type="text"
                  value={settings.hero_title}
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  className="input-admin"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Engagement Subtitle</label>
                <input
                  type="text"
                  value={settings.hero_subtitle}
                  onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                  className="input-admin"
                />
             </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Core Description (Learn More)</label>
              <textarea
                rows="4"
                value={settings.hero_description}
                onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                className="input-admin resize-none leading-relaxed"
              />
           </div>
        </div>

        {/* Brand Narrative */}
        <div className="glass-card p-10 space-y-8">
           <div className="flex items-center space-x-3 mb-4">
              <FiInfo size={20} className="text-magenta-400" />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Brand Narrative</h2>
           </div>
          
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">The EFM Story</label>
              <textarea
                rows="6"
                value={settings.about_us}
                onChange={(e) => setSettings({ ...settings, about_us: e.target.value })}
                className="input-admin resize-none leading-relaxed"
              />
           </div>
        </div>

        {/* Global Protocols */}
        <div className="glass-card p-10 space-y-8">
           <div className="flex items-center space-x-3 mb-4">
              <FiFileText size={20} className="text-amber-400" />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Global Protocols</h2>
           </div>
          
           <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Live Arrival Protocol</label>
                <textarea
                  rows="4"
                  value={settings.delivery_policy}
                  onChange={(e) => setSettings({ ...settings, delivery_policy: e.target.value })}
                  className="input-admin resize-none"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Resolution & Refunds</label>
                <textarea
                  rows="4"
                  value={settings.returns_refunds}
                  onChange={(e) => setSettings({ ...settings, returns_refunds: e.target.value })}
                  className="input-admin resize-none"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Logistic Data (Shipping)</label>
                <textarea
                  rows="4"
                  value={settings.shipping_info}
                  onChange={(e) => setSettings({ ...settings, shipping_info: e.target.value })}
                  className="input-admin resize-none"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Knowledge Base (FAQ)</label>
                <textarea
                  rows="4"
                  value={settings.faq_content}
                  onChange={(e) => setSettings({ ...settings, faq_content: e.target.value })}
                  className="input-admin resize-none"
                />
             </div>
           </div>
        </div>

        {/* Comms Channel */}
        <div className="glass-card p-10">
           <div className="flex items-center space-x-3 mb-6">
              <FiMail size={20} className="text-blue-400" />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Comms Channel</h2>
           </div>
           <div className="space-y-2 max-w-md">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Support Endpoint Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="input-admin"
              />
           </div>
        </div>

        {/* Global Save Trigger */}
        <div className="flex justify-end pt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-[2rem] tracking-[0.3em] uppercase text-xs shadow-2xl shadow-cyan-500/30 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {saving ? (
               <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
               <><FiSave size={20} /> Commit Changes</>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
