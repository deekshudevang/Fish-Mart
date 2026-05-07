import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiImage, FiVideo, FiCalendar, FiBox, FiDollarSign } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductForm({ product, prefilledCategory, onSave, onClose }) {
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
    } else if (prefilledCategory) {
      setForm(prev => ({
        ...prev,
        category: prefilledCategory
      }));
    }
  }, [product, prefilledCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Ensure category is not empty string, fallback to Freshwater
    const finalCategory = form.category && form.category.trim() !== '' ? form.category : 'Freshwater';

    try {
      const payload = {
        ...form,
        category: finalCategory,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
      };

      if (!payload.shipmentDate) {
        delete payload.shipmentDate;
      }

      await onSave(payload);
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#060a14]/90 backdrop-blur-md" 
        onClick={onClose} 
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        className="relative glass-card p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <FiPlus className={product ? "rotate-45 text-cyan-400" : "text-cyan-400"} />
              </div>
              {product ? 'Modify Asset' : 'Deploy New Asset'}
            </h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Registry Subdivision Protocol</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
            Critical: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Subdivision 1: Biological Classification */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Biological Classification</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-cyan-500/30 transition-all text-xs font-black text-white appearance-none uppercase tracking-widest cursor-pointer"
                  >
                    <optgroup label="Fishes" className="bg-[#060a14] text-cyan-400">
                      <option value="Freshwater" className="bg-[#060a14] text-white">Fresh Water</option>
                      <option value="Saltwater" className="bg-[#060a14] text-white">Salt Water</option>
                      <option value="Rare Findings" className="bg-[#060a14] text-white">Rare Findings</option>
                    </optgroup>
                    <optgroup label="Other Assets" className="bg-[#060a14] text-magenta-400">
                      <option value="Aquarium Plants" className="bg-[#060a14] text-white">Aquarium Plants</option>
                      <option value="Fish Food" className="bg-[#060a14] text-white">Fish Food</option>
                      <option value="Aquarium Accessories" className="bg-[#060a14] text-white">Aquarium Accessories</option>
                    </optgroup>
                  </select>
               </div>
            </div>
          </div>

          {/* Subdivision 2: Asset Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-magenta-500 rounded-full" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Asset Identity</h3>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="input-admin"
                    placeholder="Enter full asset designation..."
                    required
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Biological & Technical Data</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    className="input-admin h-32 resize-none leading-relaxed"
                    placeholder="Provide detailed specifications..."
                    required
                  />
               </div>
            </div>
          </div>

          {/* Subdivision 3: Market Metrics */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Market Metrics</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
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
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
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
            </div>
          </div>

          {/* Subdivision 4: Visual Documentation */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Visual Documentation</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-wrap gap-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                      <img 
                        src={img} 
                        alt="Upload preview" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                      />
                      <button
                        type="button"
                        onClick={() => set('images', form.images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <label className="flex-1 p-5 rounded-2xl bg-cyan-500/5 border border-dashed border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-3">
                    <FiPlus size={20} />
                    <span>Upload Media (PNG/JPG only)</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        
                        // Validate file types just in case
                        const validFiles = files.filter(f => f.type === 'image/png' || f.type === 'image/jpeg');
                        if (validFiles.length !== files.length) {
                          setError("Some files were rejected. Only PNG and JPG are allowed.");
                        }

                        const base64s = await Promise.all(
                          validFiles.map((file) => new Promise((resolve) => {
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

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
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
            </div>
          </div>

          {/* Subdivision 5: Deployment Logistics */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Deployment Logistics</h3>
            </div>
            
            <div className="space-y-2 max-w-xs">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FiCalendar size={10} /> Estimated Delivery
               </label>
               <input
                 type="date"
                 value={form.shipmentDate}
                 onChange={(e) => set('shipmentDate', e.target.value)}
                 className="input-admin"
               />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="flex-1 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black rounded-2xl transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-[0.3em] disabled:opacity-50 flex items-center justify-center"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                product ? 'Commit Registry Update' : 'Initialize Asset Deployment'
              )}
            </motion.button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-10 py-5 bg-white/[0.02] border border-white/5 text-[10px] font-black text-slate-500 hover:text-white rounded-2xl uppercase tracking-widest transition-all"
            >
              Abort Protocol
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
