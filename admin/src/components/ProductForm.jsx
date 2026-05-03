import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiImage, FiVideo, FiCalendar, FiBox, FiDollarSign } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Freshwater', 'Saltwater', 'Rare'];

export default function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
    videoUrl: '',
    category: 'Freshwater',
    stock: 50,
    shipmentDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        images: product.images || (product.image ? [product.image] : []),
        videoUrl: product.videoUrl || '',
        category: product.category || 'Freshwater',
        stock: product.stock ?? 50,
        shipmentDate: product.shipmentDate ? product.shipmentDate.split('T')[0] : '',
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Cinematic Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#060a14]/90 backdrop-blur-md" 
        onClick={onClose} 
      />

      {/* Deployment Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative glass-card p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        {/* Header Protocol */}
        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                {product ? <FiPlus className="rotate-45 text-cyan-400" /> : <FiPlus className="text-cyan-400" />}
              </div>
              {product ? 'Asset Modification' : 'Asset Deployment'}
            </h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Registry Entry Protocol</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
          >
            Critical: {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Asset Identity (Name)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className="input-admin"
                  placeholder="Registry Name..."
                  required
                />
             </div>

             <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Core Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  className="input-admin h-32 resize-none leading-relaxed"
                  placeholder="Technical specifications and biological data..."
                  required
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                   <FiDollarSign size={10} /> Market Value (₹)
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  className="input-admin"
                  required
                  min="0"
                  step="0.01"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                   <FiBox size={10} /> Unit Density (Stock)
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  className="input-admin"
                  min="0"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Biological Classification</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-cyan-500/30 transition-all text-xs font-black text-white appearance-none uppercase tracking-widest cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#060a14]">{c}</option>
                  ))}
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                   <FiCalendar size={10} /> Deployment Schedule
                </label>
                <input
                  type="date"
                  value={form.shipmentDate}
                  onChange={(e) => set('shipmentDate', e.target.value)}
                  className="input-admin"
                  required
                />
             </div>
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
               <FiImage size={10} /> Visual Documentation (Gallery)
            </label>
            
            <div className="grid grid-cols-1 gap-4">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="relative flex-1">
                     <FiImage className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                     <input
                      type="url"
                      value={img}
                      onChange={(e) => {
                        const newImages = [...form.images];
                        newImages[idx] = e.target.value;
                        set('images', newImages);
                      }}
                      className="input-admin pl-14"
                      placeholder="Remote URL..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => set('images', form.images.filter((_, i) => i !== idx))}
                    className="p-4 rounded-2xl text-red-500 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => set('images', [...form.images, ''])}
                  className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-3"
                >
                  <FiPlus /> Add URL Data
                </button>
                
                <label className="flex-1 p-5 rounded-2xl bg-cyan-500/5 border border-dashed border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/10 transition-all cursor-pointer flex items-center justify-center gap-3">
                  <FiPlus /> Local Upload
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      const base64s = await Promise.all(
                        files.map((file) => new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result);
                          reader.readAsDataURL(file);
                        }))
                      );
                      set('images', [...form.images, ...base64s]);
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Visual Stream Preview */}
            <AnimatePresence>
               {form.images.some(img => img) && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="flex gap-4 overflow-x-auto pb-4 no-scrollbar pt-4"
                 >
                   {form.images.filter(img => img).map((img, i) => (
                     <motion.div 
                       key={i} 
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="relative shrink-0 w-28 h-28 rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                     >
                       <img src={img} alt="Preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                     </motion.div>
                   ))}
                 </motion.div>
               )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
               <FiVideo size={10} /> Motion Stream (Optional)
            </label>
            <div className="relative">
               <FiVideo className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
               <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => set('videoUrl', e.target.value)}
                className="input-admin pl-14"
                placeholder="Video endpoint URL..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="flex-1 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-black rounded-2xl transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-[0.3em] disabled:opacity-50 flex items-center justify-center"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                product ? 'Commit Changes' : 'Initialize Deployment'
              )}
            </motion.button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-10 py-5 bg-white/[0.02] border border-white/5 text-[11px] font-black text-slate-500 hover:text-white rounded-2xl uppercase tracking-widest transition-all"
            >
              Abort
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
