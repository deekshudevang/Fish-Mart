import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiSave, FiBox } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function InventoryTable({ products, onRefresh }) {
  const { api, admin } = useAuth();
  const [thresholds, setThresholds] = useState({});
  const [saving, setSaving] = useState({});

  const canEdit = ['super-admin', 'product-manager'].includes(admin?.role);

  const handleThresholdChange = (id, value) => {
    setThresholds((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveThreshold = async (product) => {
    const newVal = thresholds[product.id];
    if (newVal === undefined || newVal === '') return;
    
    setSaving((prev) => ({ ...prev, [product.id]: true }));
    try {
      await api.put(`/admin/products/${product.id}`, { 
        lowStockThreshold: Number(newVal) 
      });
      toast.success(`Threshold updated for ${product.name}`);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update threshold');
    } finally {
      setSaving((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <FiBox size={40} className="mb-4 opacity-50" />
        <p className="text-[10px] font-black uppercase tracking-widest">No assets found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto glass-card border-white/10 rounded-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Name</th>
            <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</th>
            <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Initial Qty</th>
            <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Qty</th>
            <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Alert Threshold</th>
            <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
            <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const currentStock = p.stock || 0;
            const initialStock = p.initialStock ?? currentStock;
            const threshold = p.lowStockThreshold ?? 5;
            const isLowStock = currentStock <= threshold;

            const hasChanged = thresholds[p.id] !== undefined && Number(thresholds[p.id]) !== threshold;

            return (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={p.id} 
                className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${isLowStock ? 'bg-red-500/5' : ''}`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={p.image || '/placeholder.png'} 
                      alt={p.name} 
                      className="w-8 h-8 rounded-lg object-cover border border-white/10"
                    />
                    <span className="text-xs font-black text-white uppercase tracking-wider">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-xs font-bold text-slate-300">{p.category}</td>
                <td className="p-4 text-xs font-black text-white">{initialStock}</td>
                <td className={`p-4 text-xs font-black ${isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>
                  {currentStock}
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    min="0"
                    value={thresholds[p.id] !== undefined ? thresholds[p.id] : threshold}
                    onChange={(e) => handleThresholdChange(p.id, e.target.value)}
                    disabled={!canEdit}
                    className="w-20 bg-white/[0.05] border border-white/10 rounded-lg py-2 px-3 text-xs font-black text-white outline-none focus:border-cyan-500/50"
                  />
                </td>
                <td className="p-4 text-center">
                  {isLowStock ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest">
                      <FiAlertTriangle size={10} />
                      Low Stock
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                      <FiCheckCircle size={10} />
                      Healthy
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  {canEdit && hasChanged && (
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      onClick={() => handleSaveThreshold(p)}
                      disabled={saving[p.id]}
                      className="p-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-lg transition-colors inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider"
                    >
                      {saving[p.id] ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiSave size={12} />
                      )}
                      Save
                    </motion.button>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
