import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import InventoryBlock from '../components/InventoryBlock';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiRefreshCw, FiPackage, FiPlus } from 'react-icons/fi';

export default function Products() {
  const { api, admin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  // We no longer need bulk selection/sort variables for the new Block layout
  // But we keep the ProductForm logic for adding NEW assets
  const [showForm, setShowForm] = useState(false);
  const [prefilledCategory, setPrefilledCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const { data } = await api.get('/admin/products', { params });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [api, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = async (data) => {
    await api.post('/admin/products', data);
    fetchProducts();
  };

  const handleUpdate = async (data) => {
    await api.put(`/admin/products/${editingProduct.id}`, data);
    fetchProducts();
  };

  const handleOpenForm = (categoryFilter = '', product = null) => {
    setPrefilledCategory(categoryFilter);
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setPrefilledCategory('');
  };

  const canCreate = ['super-admin', 'product-manager'].includes(admin?.role);

  const categoriesToRender = [
    { 
      name: 'Fishes', 
      isGroup: true,
      subs: [
        { name: 'Freshwater', label: 'Fresh Water' },
        { name: 'Saltwater', label: 'Salt Water' },
        { name: 'Rare Findings', label: 'Rare Findings' }
      ]
    },
    { name: 'Aquarium Plants', label: 'Aquarium Plants' },
    { name: 'Fish Food', label: 'Fish Food' },
    { name: 'Aquarium Accessories', label: 'Aquarium Accessories' }
  ];

  const renderBlocks = () => {
    return categoriesToRender.map(group => {
      if (category !== 'All') {
        if (group.isGroup) {
          if (category !== group.name && !group.subs.some(sub => sub.name === category)) {
            return null;
          }
        } else {
          if (group.name !== category) {
            return null;
          }
        }
      }

      if (group.isGroup) {
        const subsToRender = category === 'All' || category === group.name
          ? group.subs
          : group.subs.filter(sub => sub.name === category);

        if (subsToRender.length === 0) return null;

        return (
          <div key={group.name} className="space-y-8 mb-16">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">{group.name}</h1>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="pl-0 lg:pl-6 space-y-12 border-l border-white/5">
              {subsToRender.map(sub => (
                <InventoryBlock 
                  key={sub.name}
                  title={sub.label}
                  categoryFilter={sub.name}
                  products={products}
                  onRefresh={fetchProducts}
                  onAddProduct={handleOpenForm}
                  onEditProduct={(p) => handleOpenForm('', p)}
                />
              ))}
            </div>
          </div>
        );
      }
      
      return (
        <div key={group.name} className="mb-16">
          <InventoryBlock 
            title={group.label}
            categoryFilter={group.name}
            products={products}
            onRefresh={fetchProducts}
            onAddProduct={handleOpenForm}
            onEditProduct={(p) => handleOpenForm('', p)}
          />
        </div>
      );
    });
  };

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
      </div>

      {/* Intelligence Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 border-white/10"
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
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
            <div className="relative flex-1 lg:flex-none">
              <FiFilter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full lg:w-48 bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-cyan-400 rounded-2xl py-4 pl-12 pr-10 outline-none focus:border-white transition-all text-xs font-black appearance-none uppercase tracking-widest cursor-pointer relative"
              >
                <option value="All" className="bg-[#060a14] text-white">All Categories</option>
                <option value="Fishes" className="bg-[#060a14] text-white">Fishes (All)</option>
                <option value="Freshwater" className="bg-[#060a14] text-white">Fresh Water</option>
                <option value="Saltwater" className="bg-[#060a14] text-white">Salt Water</option>
                <option value="Rare Findings" className="bg-[#060a14] text-white">Rare Findings</option>
                <option value="Aquarium Plants" className="bg-[#060a14] text-white">Aquarium Plants</option>
                <option value="Fish Food" className="bg-[#060a14] text-white">Fish Food</option>
                <option value="Aquarium Accessories" className="bg-[#060a14] text-white">Aquarium Accessories</option>
              </select>
            </div>

            <button 
              onClick={fetchProducts} 
              className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-all shadow-lg"
              title="Sync Inventory"
            >
              <FiRefreshCw size={18} className={loading ? 'animate-spin text-cyan-400' : ''} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Structured Inventory Blocks */}
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
          {renderBlocks()}
        </motion.div>
      )}

      {/* Full Deployment Form for NEW/EDIT products */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct} // Use the selected product or null
            prefilledCategory={prefilledCategory}
            onSave={editingProduct ? handleUpdate : handleCreate}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
