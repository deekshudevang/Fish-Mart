import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiTrash2, FiRefreshCw, FiGrid, FiList, FiPackage } from 'react-icons/fi';

export default function Products() {
  const { api, admin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (sortField) params.sort = `${sortField}-${sortDir}`;

      const { data } = await api.get('/admin/products', { params });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [api, search, category, sortField, sortDir]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === products.length ? [] : products.map((p) => p.id)
    );
  };

  const handleCreate = async (data) => {
    await api.post('/admin/products', data);
    fetchProducts();
  };

  const handleUpdate = async (data) => {
    await api.put(`/admin/products/${editingProduct.id}`, data);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently decommission this asset?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setSelectedIds((p) => p.filter((x) => x !== id));
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Permanently decommission ${selectedIds.length} assets?`)) return;
    try {
      await api.post('/admin/products/bulk-delete', { ids: selectedIds });
      setSelectedIds([]);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const canDelete = admin?.role === 'super-admin';
  const canCreate = ['super-admin', 'product-manager'].includes(admin?.role);

  return (
    <div className="space-y-10 max-w-full overflow-hidden">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight italic mb-2">Asset<span className="text-cyan-400 not-italic">Inventory</span></h1>
          <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-500/10 rounded-full">
                <FiPackage size={12} className="text-cyan-400" />
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em]">{products.length} Registered Units</span>
             </div>
          </div>
        </div>
        {canCreate && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)} 
            className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl tracking-[0.2em] uppercase text-[11px] shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3"
          >
            <FiPlus size={18} />
            Add New Asset
          </motion.button>
        )}
      </div>

      {/* Intelligence Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 border-white/10"
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
          {/* Search Shield */}
          <div className="relative flex-1 group">
            <FiSearch size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
            <input
              id="product-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-cyan-500/30 transition-all text-xs font-bold text-white placeholder:text-slate-700"
              placeholder="Search assets by name or ID..."
            />
          </div>

          <div className="flex items-center gap-4">
             {/* Category filter */}
            <div className="relative flex-1 lg:flex-none">
              <FiFilter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full lg:w-48 bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-10 outline-none focus:border-cyan-500/30 transition-all text-xs font-black text-white appearance-none uppercase tracking-widest cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Freshwater">Freshwater</option>
                <option value="Saltwater">Saltwater</option>
                <option value="Rare">Rare</option>
              </select>
            </div>

            {/* Refresh Signal */}
            <button 
              onClick={fetchProducts} 
              className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-all shadow-lg"
              title="Sync Inventory"
            >
              <FiRefreshCw size={18} className={loading ? 'animate-spin text-cyan-400' : ''} />
            </button>
          </div>
        </div>

        {/* Tactical Bulk Selection */}
        <AnimatePresence>
          {selectedIds.length > 0 && canDelete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                 <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">
                   {selectedIds.length} Targeted for Action
                 </span>
                 <button onClick={() => setSelectedIds([])} className="text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Abort Selection</button>
              </div>
              <button 
                onClick={handleBulkDelete} 
                className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black rounded-xl hover:bg-red-500/20 transition-all uppercase tracking-widest flex items-center gap-2"
              >
                <FiTrash2 size={14} />
                Bulk Decommission
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Intelligence List / Table */}
      {loading && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/50">Fetching Encrypted Data...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <ProductTable
            products={products}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
          />
        </motion.div>
      )}

      {/* Deploy Overlay - Form */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={editingProduct ? handleUpdate : handleCreate}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
