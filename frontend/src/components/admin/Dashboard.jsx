import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit3, FiTrash2, FiLogOut, FiPackage, FiDollarSign, FiStar, FiGrid, FiSettings, FiActivity, FiSearch, FiLayout } from 'react-icons/fi';

const API = '/api/admin/products';
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: '', shipmentDate: '', category: 'Freshwater', stock: 50 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) { navigate('/admin'); return; }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API, getHeaders());
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('adminToken'); navigate('/admin'); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...formData, price: Number(formData.price), stock: Number(formData.stock) };
      if (editingId) {
        await axios.put(`${API}/${editingId}`, data, getHeaders());
      } else {
        await axios.post(API, data, getHeaders());
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    try {
      await axios.delete(`${API}/${id}`, getHeaders());
      fetchProducts();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleEdit = (p) => {
    setFormData({ name: p.name, description: p.description, price: p.price, images: p.images || (p.image ? [p.image] : []), shipmentDate: p.shipmentDate?.split('T')[0] || '', category: p.category || 'Freshwater', stock: p.stock || 50 });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', images: [], shipmentDate: '', category: 'Freshwater', stock: 50 });
    setEditingId(null);
  };

  const logout = () => { localStorage.removeItem('adminToken'); navigate('/'); };

  const totalRevenue = products.reduce((s, p) => s + (p.price || 0), 0);
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0a0f1e] border-r border-white/5 hidden lg:flex flex-col p-8 fixed h-full z-30">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <FiLayout className="text-white" size={20} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase italic">Control<span className="text-cyan-400 not-italic">Center</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: FiGrid, label: 'Inventory', active: true },
            { icon: FiActivity, label: 'Analytics' },
            { icon: FiSettings, label: 'Settings' }
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${item.active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={logout} className="mt-auto flex items-center space-x-3 px-5 py-4 text-slate-500 hover:text-red-400 transition-colors font-bold text-sm">
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 uppercase italic">Inventory <span className="text-cyan-400 not-italic">Management</span></h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Exotic Fish Mart • VIP Admin Dashboard</p>
          </div>
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-medium" 
            />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Listings', value: products.length, icon: FiPackage, color: 'cyan' },
            { label: 'Inventory Value', value: `₹${totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'emerald' },
            { label: 'Stock Units', value: totalStock, icon: FiActivity, color: 'purple' },
            { label: 'Market Sync', value: 'Live', icon: FiStar, color: 'yellow' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0f1e] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group"
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-all`} />
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-500/10 rounded-2xl text-${stat.color}-400`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-1 tracking-tighter">{stat.value}</p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] p-8 sticky top-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-tight italic">
                  {editingId ? 'Modify Asset' : 'Register New Asset'}
                </h2>
                {editingId && (
                  <button onClick={resetForm} className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Cancel</button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Product Name</label>
                  <input type="text" placeholder="e.g., Golden Arowana" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-white" required />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Detailed Description</label>
                  <textarea placeholder="Describe the rarity and temperament..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-medium text-slate-400 h-32 resize-none" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Price (₹)</label>
                    <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-white" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Stock Units</label>
                    <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-white" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Asset Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-white appearance-none">
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
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Launch Date</label>
                    <input type="date" value={formData.shipmentDate} onChange={e => setFormData({...formData, shipmentDate: e.target.value})} className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-bold text-white" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Asset Image (PNG/JPG)</label>
                  {formData.images && formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                          <img src={img} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="block w-full px-6 py-4 bg-cyan-500/5 border border-dashed border-cyan-500/30 rounded-2xl text-center cursor-pointer hover:bg-cyan-500/10 transition-all">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Upload Image</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files).filter(f => f.type === 'image/png' || f.type === 'image/jpeg');
                        if (files.length === 0) return alert('Only PNG and JPG allowed.');
                        const base64s = await Promise.all(
                          files.map(file => new Promise(resolve => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(file);
                          }))
                        );
                        setFormData({ ...formData, images: [...(formData.images || []), ...base64s] });
                      }}
                    />
                  </label>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all uppercase tracking-widest text-xs"
                >
                  {loading ? 'Processing...' : editingId ? 'Commit Changes' : 'Publish Asset'}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Asset List Panel */}
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] p-8 min-h-[70vh] flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Asset Inventory ({filteredProducts.length})</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 opacity-20 group">
                    <FiPackage size={80} className="mb-6 group-hover:scale-110 transition-transform duration-700" />
                    <p className="font-black uppercase tracking-[0.4em] text-[10px]">No assets currently registered</p>
                  </div>
                ) : filteredProducts.map(p => (
                  <motion.div 
                    layout
                    key={p.id} 
                    className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-6 bg-white/[0.01] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] group hover:bg-white/[0.03] hover:border-cyan-500/20 transition-all duration-500 w-full overflow-hidden"
                  >
                    <div className="relative shrink-0 mx-auto md:mx-0">
                      <div className="absolute inset-0 bg-cyan-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img src={p.image || '/products/placeholder.png'} alt={p.name} className="w-20 h-20 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-[1rem] md:rounded-[1.5rem] object-cover relative z-10 transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-white font-black text-sm md:text-base truncate tracking-tight">{p.name}</h3>
                        <div className="flex items-center space-x-1 px-2 py-0.5 bg-cyan-500/10 rounded-full shrink-0">
                           <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                           <span className="text-[7px] md:text-[8px] font-black text-cyan-400 uppercase tracking-widest">{p.category}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                        <span className="text-white">₹{p.price.toLocaleString()}</span>
                        <span className={`${p.stock < 10 ? 'text-red-500' : 'text-emerald-500'}`}>{p.stock} Units</span>
                        <span className="hidden sm:inline">★ {p.reviews?.length || 0} Ratings</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 w-full md:w-auto justify-end pt-2 md:pt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all transform md:translate-x-2 md:group-hover:translate-x-0">
                      <button onClick={() => handleEdit(p)} className="flex-1 md:flex-none flex items-center justify-center p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 hover:text-white transition-all"><FiEdit3 size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="flex-1 md:flex-none flex items-center justify-center p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"><FiTrash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
