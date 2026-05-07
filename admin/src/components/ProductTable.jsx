import { FiStar, FiImage, FiVideo, FiEdit3, FiTrash2, FiChevronUp, FiChevronDown, FiAlertCircle, FiCalendar, FiPackage } from 'react-icons/fi';
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
                    <span>Product Identity</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Market Metrics</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Visual Assets</th>
                <th onClick={() => onSort('stock')} className="px-6 py-6 cursor-pointer group">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                    <span>Deployment Status</span>
                    <SortIcon field="stock" />
                  </div>
                </th>
                <th className="sticky right-0 bg-[#0a0f1e] z-20 px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.5)]">Registry Actions</th>
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
                        <div className="relative shrink-0 group/img">
                           <div className="absolute inset-0 bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                           <img
                            src={p.image || (p.images?.[0]) || '/placeholder.png'}
                            alt={p.name}
                            className="w-14 h-14 rounded-xl object-cover relative z-10 border border-white/10 group-hover/img:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-1">{p.name}</p>
                          <p className="text-[9px] text-slate-600 font-bold tracking-widest mt-1">SN: {p.id?.toString().substring(0, 12).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="space-y-1">
                          <p className="text-sm font-black text-emerald-400 italic">₹{Number(p.price).toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${p.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.stock} In Reserve</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                             {(p.images || []).slice(0, 3).map((img, i) => (
                               <div key={i} className="w-8 h-8 rounded-lg border-2 border-[#0a0f1e] overflow-hidden bg-white/5">
                                  <img src={img} className="w-full h-full object-cover" />
                               </div>
                             ))}
                             {(p.images?.length > 3) && (
                               <div className="w-8 h-8 rounded-lg border-2 border-[#0a0f1e] bg-white/5 flex items-center justify-center text-[8px] font-black text-slate-500">
                                  +{p.images.length - 3}
                               </div>
                             )}
                          </div>
                          {p.videoUrl && <FiVideo size={14} className="text-cyan-400 ml-2" />}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <FiCalendar size={12} className="text-slate-500" />
                             <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                {p.shipmentDate ? new Date(p.shipmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'}
                             </p>
                          </div>
                          <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Deployment Schedule</p>
                       </div>
                    </td>
                    <td className="sticky right-0 bg-[#0a0f1e]/80 backdrop-blur-md z-20 px-6 py-5 group-hover:bg-[#0a0f1e] transition-colors shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => onEdit(p)} 
                          className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                          title="Modify Asset"
                        >
                          <FiEdit3 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(p.id)} 
                          className="p-3 rounded-xl bg-red-500/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          title="Purge Asset"
                        >
                          <FiTrash2 size={16} />
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
