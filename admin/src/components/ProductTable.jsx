import { FiStar, FiImage, FiVideo, FiEdit3, FiTrash2, FiChevronUp, FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const categoryBadge = {
  Freshwater: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  Saltwater: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Rare: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export default function ProductTable({
  products,
  selectedIds,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  sortField,
  sortDir,
  onSort,
}) {
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <FiChevronUp size={14} className="text-cyan-400" /> : <FiChevronDown size={14} className="text-cyan-400" />;
  };

  const allSelected = products.length > 0 && selectedIds.length === products.length;

  return (
    <div className="w-full">
      {/* Table for Desktop */}
      <div className="hidden lg:block glass-card overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-6 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500/30 cursor-pointer accent-cyan-500"
                  />
                </th>
                <th onClick={() => onSort('name')} className="px-6 py-6 cursor-pointer group">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                    <span>Asset Identity</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Classification</th>
                <th onClick={() => onSort('price')} className="px-6 py-6 cursor-pointer group">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                    <span>Value</span>
                    <SortIcon field="price" />
                  </div>
                </th>
                <th onClick={() => onSort('stock')} className="px-6 py-6 cursor-pointer group">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                    <span>Units</span>
                    <SortIcon field="stock" />
                  </div>
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Rating</th>
                <th className="sticky right-0 bg-[#0a0f1e] z-20 px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.5)]">Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <motion.tr 
                    layout
                    key={p.id} 
                    className={`group transition-colors ${isSelected ? 'bg-cyan-500/[0.03]' : 'hover:bg-white/[0.01]'}`}
                  >
                    <td className="px-6 py-5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(p.id)}
                        className="w-4 h-4 rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500/30 cursor-pointer accent-cyan-500"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="relative shrink-0">
                           <div className="absolute inset-0 bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                           <img
                            src={p.image || '/placeholder.png'}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover relative z-10 border border-white/10"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{p.name}</p>
                          <p className="text-[9px] text-slate-600 font-bold tracking-widest mt-1">ID: {p.id?.toString().substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${categoryBadge[p.category] || 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-white italic">₹{Number(p.price).toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs font-black ${p.stock < 10 ? 'text-red-500' : 'text-slate-300'}`}>
                          {p.stock} Units
                        </span>
                        {p.stock < 10 && <FiAlertCircle size={14} className="text-red-500 animate-pulse" />}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-1.5">
                        <FiStar size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-black text-slate-300">{p.avgRating > 0 ? p.avgRating.toFixed(1) : 'NEW'}</span>
                      </div>
                    </td>
                    <td className="sticky right-0 bg-[#0a0f1e]/80 backdrop-blur-md z-20 px-6 py-5 group-hover:bg-[#0a0f1e] transition-colors shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => onEdit(p)} 
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/10 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                          <FiEdit3 size={14} />
                          <span>Modify</span>
                        </button>
                        <button 
                          onClick={() => onDelete(p.id)} 
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500/10 border border-red-500/10 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                          <FiTrash2 size={14} />
                          <span>Purge</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* List for Mobile - NO HORIZONTAL SCROLL */}
      <div className="lg:hidden space-y-4">
        {products.map((p) => (
          <div key={p.id} className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <img src={p.image || '/placeholder.png'} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight italic">{p.name}</h3>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">{p.category}</p>
                  </div>
               </div>
               <input
                  type="checkbox"
                  checked={selectedIds.includes(p.id)}
                  onChange={() => onSelect(p.id)}
                  className="w-5 h-5 rounded bg-white/5 border-white/10 text-cyan-500 accent-cyan-500"
               />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
               <div className="space-y-1">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Market Value</p>
                  <p className="text-sm font-black text-cyan-400 italic">₹{Number(p.price).toLocaleString()}</p>
               </div>
               <div className="space-y-1 text-right">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Stock</p>
                  <p className={`text-sm font-black ${p.stock < 10 ? 'text-red-500' : 'text-white'}`}>{p.stock} Units</p>
               </div>
            </div>
            <div className="flex gap-2 pt-2">
               <button onClick={() => onEdit(p)} className="flex-1 py-4 bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl">Modify Asset</button>
               <button onClick={() => onDelete(p.id)} className="p-4 bg-red-500/10 text-red-400 rounded-xl"><FiTrash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-32 opacity-20">
           <FiPackage size={80} className="mx-auto mb-6" />
           <p className="text-xs font-black uppercase tracking-[0.4em]">Zero Assets Identified</p>
        </div>
      )}
    </div>
  );
}
