import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit3, FiTrash2, FiSave, FiX, FiImage, FiVideo, FiDollarSign, FiBox, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function InventoryBlock({ title, categoryFilter, products, onRefresh, onAddProduct, onEditProduct }) {
  const { api } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const categoryProducts = products.filter(p => (p.category || '').trim() === categoryFilter);

  const handleEditClick = (product) => {
    if (editingId === product.id) {
      setEditingId(null);
    } else {
      setEditingId(product.id);
      setEditForm({
        price: product.price,
        stock: product.stock,
        shipmentDate: product.shipmentDate ? product.shipmentDate.split('T')[0] : '',
        images: product.images || [],
        videoUrl: product.videoUrl || ''
      });
    }
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      await api.put(`/admin/products/${id}`, {
        ...editForm,
        price: Number(editForm.price),
        stock: Number(editForm.stock)
      });
      setEditingId(null);
      onRefresh();
    } catch (err) {
      alert('Failed to save features.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        onRefresh();
      } catch (err) {
        alert('Failed to delete asset.');
      }
    }
  };

  const setForm = (key, val) => setEditForm(prev => ({ ...prev, [key]: val }));

  if (categoryProducts.length === 0) {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">{title}</h2>
          <button 
            onClick={() => onAddProduct(categoryFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
          >
            <FiPlus /> Add {title}
          </button>
        </div>
        <div className="glass-card p-10 text-center border border-white/5 opacity-50">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">No Inventory in this subdivision</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      {/* Subdivision Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-cyan-500 rounded-full" />
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">{title}</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{categoryProducts.length} Items</p>
          </div>
        </div>
        <button 
          onClick={() => onAddProduct(categoryFilter)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <FiPlus size={14} /> Add New Asset
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {categoryProducts.map(product => {
          const isEditing = editingId === product.id;
          return (
            <div key={product.id} className={`glass-card overflow-hidden transition-all duration-300 ${isEditing ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/10'}`}>
              
              {/* Product Row Summary */}
              <div className="p-4 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 relative group">
                  <img src={product.image || product.images?.[0] || '/placeholder.png'} className="w-20 h-20 rounded-xl object-cover border border-white/10 group-hover:scale-110 transition-transform duration-300" alt={product.name} />
                </div>
                
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{product.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">ID: {product.id}</p>
                </div>

                <div className="flex gap-8 text-center md:text-left">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Price</p>
                    <p className="text-sm font-black text-emerald-400">₹{Number(product.price).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Stock Level</p>
                    <p className={`text-sm font-black ${product.stock < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{product.stock} Units</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                  <button 
                    onClick={() => handleEditClick(product)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${isEditing ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                  >
                    {isEditing ? <FiX size={14} /> : <FiEdit3 size={14} />}
                    {isEditing ? 'Close Features' : 'Quick Edit'}
                  </button>
                  <button 
                    onClick={() => onEditProduct(product)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <FiEdit3 size={14} /> Full Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-3 bg-red-500/5 border border-red-500/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    title="Delete Asset"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Separate Block for Modifying Features */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 bg-white/[0.01]"
                  >
                    <div className="p-6 grid md:grid-cols-2 gap-8">
                      {/* Pricing & Stock Block */}
                      <div className="space-y-6 bg-[#060a14]/50 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                          <FiDollarSign className="text-emerald-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Price & Inventory</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Price (₹)</label>
                            <input 
                              type="number" 
                              value={editForm.price} 
                              onChange={(e) => setForm('price', e.target.value)}
                              className="input-admin"
                              min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Stock Units</label>
                            <input 
                              type="number" 
                              value={editForm.stock} 
                              onChange={(e) => setForm('stock', e.target.value)}
                              className="input-admin"
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 pt-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiCalendar /> Availability Date</label>
                          <input 
                            type="date" 
                            value={editForm.shipmentDate} 
                            onChange={(e) => setForm('shipmentDate', e.target.value)}
                            className="input-admin"
                          />
                        </div>
                      </div>

                      {/* Media Block */}
                      <div className="space-y-6 bg-[#060a14]/50 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                          <FiImage className="text-blue-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Images & Videos</h4>
                        </div>
                        
                        <div className="space-y-4">
                          {editForm.images.map((img, idx) => (
                            <div key={idx} className="flex gap-3">
                              <input 
                                type="url" 
                                value={img} 
                                onChange={(e) => {
                                  const newImgs = [...editForm.images];
                                  newImgs[idx] = e.target.value;
                                  setForm('images', newImgs);
                                }}
                                className="input-admin flex-1"
                                placeholder="Image URL..."
                              />
                              <button onClick={() => setForm('images', editForm.images.filter((_, i) => i !== idx))} className="px-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"><FiTrash2 size={14}/></button>
                            </div>
                          ))}
                          <button onClick={() => setForm('images', [...editForm.images, ''])} className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">+ Add Image Link</button>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-white/5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiVideo /> Video Stream URL</label>
                          <input 
                            type="url" 
                            value={editForm.videoUrl} 
                            onChange={(e) => setForm('videoUrl', e.target.value)}
                            className="input-admin"
                            placeholder="Video URL..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-6 bg-[#0a0f1e] border-t border-white/5 flex justify-end">
                      <button 
                        onClick={() => handleSave(product.id)}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all disabled:opacity-50"
                      >
                        {saving ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><FiSave size={14} /> Save Features</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
