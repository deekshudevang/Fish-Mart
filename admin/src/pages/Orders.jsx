import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiSearch, FiFilter, FiCheckCircle, FiClock, FiTruck, FiXCircle, FiPackage, FiMapPin, FiCreditCard, FiUser, FiChevronDown, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Orders() {
  const { api } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/admin/all?status=${filter}`);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/admin/${id}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerPhone.includes(searchQuery)
  );

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      processing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      shipped: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    const icons = {
      pending: <FiClock size={12} />,
      confirmed: <FiCheckCircle size={12} />,
      processing: <FiPackage size={12} />,
      shipped: <FiTruck size={12} />,
      delivered: <FiCheckCircle size={12} />,
      cancelled: <FiXCircle size={12} />
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit ${styles[status]}`}>
        {icons[status]} {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Orders</h1>
          <p className="text-slate-400 text-sm font-medium">Manage and fulfill customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID, Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-500/50 appearance-none pr-8 cursor-pointer relative"
          >
            <option value="all" className="bg-[#0f172a]">All Orders</option>
            <option value="pending" className="bg-[#0f172a]">Pending</option>
            <option value="confirmed" className="bg-[#0f172a]">Confirmed</option>
            <option value="processing" className="bg-[#0f172a]">Processing</option>
            <option value="shipped" className="bg-[#0f172a]">Shipped</option>
            <option value="delivered" className="bg-[#0f172a]">Delivered</option>
            <option value="cancelled" className="bg-[#0f172a]">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No orders found.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="p-4">
                      <span className="text-cyan-400 font-bold text-sm">{order.orderId}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-bold text-sm">{order.customerName}</p>
                      <p className="text-slate-500 text-xs">{order.customerPhone}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-black">₹{order.grandTotal?.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row"
            >
              {/* Left sidebar - Actions & Status */}
              <div className="w-full md:w-1/3 bg-white/[0.02] border-r border-white/5 p-6 space-y-6 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Order ID</p>
                    <h2 className="text-xl font-black text-cyan-400">{selectedOrder.orderId}</h2>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white md:hidden"><FiX size={16}/></button>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Status</p>
                  <StatusBadge status={selectedOrder.status} />
                  <p className="text-xs text-slate-400 mt-2">Ordered on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Update Status</p>
                  <div className="space-y-2">
                    {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(selectedOrder.id, s)}
                        disabled={selectedOrder.status === s}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                          selectedOrder.status === s 
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500 cursor-not-allowed'
                            : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {s}
                        {selectedOrder.status === s && <FiCheckCircle size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right content - Details */}
              <div className="w-full md:w-2/3 p-6 space-y-6 overflow-y-auto">
                <div className="hidden md:flex justify-end">
                  <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white"><FiX size={16}/></button>
                </div>

                {/* Customer & Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3"><FiUser size={14} className="text-cyan-400"/><h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Customer</h3></div>
                    <p className="text-sm font-bold text-white">{selectedOrder.customerName}</p>
                    <p className="text-xs text-slate-400 mt-1">📞 {selectedOrder.customerPhone}</p>
                    {selectedOrder.customerEmail && <p className="text-[10px] text-slate-500 truncate mt-1">📧 {selectedOrder.customerEmail}</p>}
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3"><FiCreditCard size={14} className="text-cyan-400"/><h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Payment</h3></div>
                    <p className="text-sm font-bold text-white uppercase tracking-wider">{selectedOrder.paymentMethod}</p>
                    <p className="text-xs text-slate-400 mt-1">Status: <span className={selectedOrder.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}>{selectedOrder.paymentStatus.toUpperCase()}</span></p>
                  </div>

                  <div className="md:col-span-2 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3"><FiMapPin size={14} className="text-cyan-400"/><h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Shipping & Delivery</h3></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Address</p>
                        <p className="text-sm text-white">{selectedOrder.addressLine1}{selectedOrder.addressLine2 ? `, ${selectedOrder.addressLine2}` : ''}</p>
                        <p className="text-sm text-slate-400">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                        {selectedOrder.landmark && <p className="text-xs text-slate-500 mt-1">Landmark: {selectedOrder.landmark}</p>}
                      </div>
                      <div className="md:border-l md:border-white/5 md:pl-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Delivery Method</p>
                        <p className="text-sm text-white font-bold">{selectedOrder.deliveryType || 'Standard Shipping'}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Est. Delivery: {selectedOrder.estimatedDate ? new Date(selectedOrder.estimatedDate).toLocaleDateString() : (selectedOrder.estimatedDays || '5-7 days')}
                        </p>
                        {selectedOrder.deliveredAt && (
                          <p className="text-xs text-emerald-400 mt-1 font-bold">Delivered on {new Date(selectedOrder.deliveredAt).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div className="md:col-span-2 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Order Notes</p>
                      <p className="text-xs text-amber-200/70 italic">"{selectedOrder.notes}"</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Order Items ({selectedOrder.itemCount})</h3>
                  <div className="space-y-2">
                    {(() => {
                      let items = selectedOrder.items;
                      if (typeof items === 'string') {
                        try {
                          items = JSON.parse(items);
                        } catch (e) {
                          console.error("Failed to parse items:", e);
                          items = [];
                        }
                      }
                      return (items || []).map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center"><FiPackage size={20} className="text-slate-500" /></div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white line-clamp-1">{item.name}</p>
                            <p className="text-xs text-slate-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                          </div>
                          <p className="text-sm font-black text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Totals */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-sm text-slate-400"><span>Subtotal</span><span>₹{selectedOrder.subtotal?.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-slate-400"><span>Shipping</span><span className={selectedOrder.shippingCost === 0 ? 'text-emerald-400' : 'text-slate-400'}>{selectedOrder.shippingCost === 0 ? 'FREE' : `₹${selectedOrder.shippingCost}`}</span></div>
                  {selectedOrder.codCharge > 0 && <div className="flex justify-between text-sm text-slate-400"><span>COD Charges</span><span>₹{selectedOrder.codCharge}</span></div>}
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between text-lg"><span className="font-black text-white uppercase tracking-tight">Total</span><span className="font-black text-cyan-400">₹{selectedOrder.grandTotal?.toLocaleString()}</span></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
