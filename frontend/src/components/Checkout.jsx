import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CreditCard, Truck, CheckCircle, ChevronRight, ChevronLeft, Clock, Shield, Package, Smartphone, Building2, Wallet, Banknote, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Delivery estimation algorithm
function estimateDelivery(pincode) {
  if (!pincode || pincode.length < 6) return null;
  const p = parseInt(pincode.substring(0, 3));
  // Metro cities: 1-2 days
  const metro = [110,400,500,600,700,560,380,411,226,302];
  // Tier-2: 3-4 days
  const tier2 = [201,208,211,248,250,282,301,303,305,313,324,342,360,361,362,388,390,395,403,410,412,413,414,416,422,431,440,441,442,444,450,452,462,473,482,492,495,502,503,504,505,506,515,516,517,518,520,521,522,530,531,533,534,535,560,571,572,573,574,575,576,577,580,581,583,585,590,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,620,621,622,623,624,625,626,627,628,629,630,631,632,636,637,638,639,641,642,643,670,680,682,683,686,689,690,695,700,712,713,721,731,741,751,753,755,756,760,781,782,786,788,793,795];
  if (metro.includes(p)) {
    const d = new Date(); d.setDate(d.getDate() + 2);
    return { days: '1-2', date: d, type: 'Express', cost: 0 };
  }
  if (tier2.includes(p)) {
    const d = new Date(); d.setDate(d.getDate() + 4);
    return { days: '3-4', date: d, type: 'Standard', cost: 0 };
  }
  const d = new Date(); d.setDate(d.getDate() + 7);
  return { days: '5-7', date: d, type: 'Standard', cost: 49 };
}

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone, color: '#06d6a0' },
  { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay', icon: CreditCard, color: '#00f5ff' },
  { id: 'netbanking', name: 'Net Banking', desc: 'All major banks supported', icon: Building2, color: '#818cf8' },
  { id: 'wallet', name: 'Wallets', desc: 'Paytm, Mobikwik, FreeCharge', icon: Wallet, color: '#fbbf24' },
  { id: 'cod', name: 'Cash on Delivery', desc: '₹30 COD charges apply', icon: Banknote, color: '#f97316' },
];

const STEPS = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Confirm', icon: CheckCircle },
];

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry'];

export default function Checkout({ isOpen, onClose }) {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  // Address state
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: 'Tamil Nadu', pincode: '', landmark: '' });
  const [addressErrors, setAddressErrors] = useState({});

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const delivery = useMemo(() => estimateDelivery(address.pincode), [address.pincode]);
  const codCharge = paymentMethod === 'cod' ? 30 : 0;
  const shippingCost = delivery?.cost || 0;
  const grandTotal = cartTotal + codCharge + shippingCost;

  const validateAddress = () => {
    const e = {};
    if (!address.name.trim()) e.name = 'Required';
    if (!address.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit number';
    if (!address.line1.trim()) e.line1 = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.pincode.match(/^\d{6}$/)) e.pincode = 'Valid 6-digit pincode';
    setAddressErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateAddress()) return;
    if (step === 2) {
      if (!paymentMethod) return;
      if (paymentMethod === 'upi' && !selectedUpiApp) {
        toast.error('Please select a UPI app');
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const generateUpiLink = () => {
    const vpa = 'exoticfishmart@okicici';
    const name = 'Exotic Fish Mart';
    const note = `Order for ${address.name}`;
    const amount = grandTotal.toFixed(2);
    
    // Standard UPI URI scheme
    let link = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    // App specific intents for better reliability
    if (selectedUpiApp === 'gpay') link = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&mode=02&orgid=000000`;
    if (selectedUpiApp === 'phonepe') link = `phonepe://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
    if (selectedUpiApp === 'paytm') link = `paytmmp://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
    
    return link;
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        address,
        paymentMethod,
        upiApp: selectedUpiApp,
        items: cart,
        subtotal: cartTotal,
        shippingCost,
        codCharge,
        grandTotal,
        delivery
      };
      
      const { data } = await axios.post('/api/orders', payload);
      
      if (paymentMethod === 'upi') {
        const upiLink = generateUpiLink();
        // Redirect to UPI app
        window.location.href = upiLink;
        
        // Give time for the app to open before showing success
        setTimeout(() => {
          setOrderId(data.orderId);
          setOrderPlaced(true);
          clearCart();
        }, 2000);
      } else {
        setOrderId(data.orderId);
        setOrderPlaced(true);
        clearCart();
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200]">
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 250 }} onClick={e => e.stopPropagation()} className="absolute bottom-0 left-0 right-0 md:inset-4 md:m-auto md:max-w-3xl md:max-h-[90vh] bg-[#0a1628]/98 backdrop-blur-2xl rounded-t-3xl md:rounded-3xl border border-white/[0.06] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              {step > 1 && !orderPlaced && (
                <button onClick={() => setStep(step - 1)} className="p-2 bg-white/[0.04] rounded-xl text-white/40 hover:text-white"><ChevronLeft size={16}/></button>
              )}
              <h2 className="text-lg font-black text-white uppercase tracking-tight">{orderPlaced ? 'Order Placed!' : 'Checkout'}</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white/[0.04] rounded-xl text-white/40 hover:text-white"><X size={16}/></button>
          </div>

          {/* Progress Steps */}
          {!orderPlaced && (
            <div className="flex items-center justify-center gap-2 py-3 px-6">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${step >= s.id ? 'bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/20' : 'text-white/20 border border-white/[0.04]'}`}>
                    <s.icon size={12}/> {s.label}
                  </div>
                  {i < STEPS.length - 1 && <div className={`w-8 h-[1px] ${step > s.id ? 'bg-[#00f5ff]/30' : 'bg-white/[0.06]'}`}/>}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            <AnimatePresence mode="wait">
              {orderPlaced ? (
                <motion.div key="success" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="flex flex-col items-center text-center py-10 space-y-5">
                  <motion.div animate={{scale:[1,1.1,1]}} transition={{repeat:Infinity,duration:2}} className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle size={40} className="text-emerald-400"/>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">Order Confirmed!</h3>
                    <p className="text-white/30 text-sm">Order ID: <span className="text-[#00f5ff] font-bold">{orderId}</span></p>
                  </div>
                  {delivery && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 w-full max-w-sm space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400"><Truck size={16}/><span className="text-xs font-black uppercase tracking-wider">Estimated Delivery</span></div>
                      <p className="text-2xl font-black text-white">{delivery.date.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</p>
                      <p className="text-xs text-white/30">{delivery.type} Delivery • {delivery.days} business days</p>
                      <div className="flex items-center gap-2 mt-2"><MapPin size={12} className="text-white/20"/><span className="text-xs text-white/40">{address.line1}, {address.city} - {address.pincode}</span></div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button onClick={onClose} className="px-6 py-3 bg-[#00f5ff] text-[#020810] rounded-xl text-xs font-black uppercase tracking-wider">Continue Shopping</button>
                  </div>
                </motion.div>
              ) : step === 1 ? (
                <motion.div key="address" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4"><MapPin size={16} className="text-[#00f5ff]"/><h3 className="text-sm font-black text-white uppercase tracking-wider">Shipping Address</h3></div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{k:'name',l:'Full Name',ph:'John Doe',full:false},{k:'phone',l:'Phone',ph:'9876543210',full:false},{k:'line1',l:'Address Line 1',ph:'House no, Street name',full:true},{k:'line2',l:'Address Line 2 (Optional)',ph:'Apartment, suite, floor',full:true},{k:'city',l:'City',ph:'Chennai',full:false},{k:'pincode',l:'Pincode',ph:'600001',full:false},{k:'landmark',l:'Landmark (Optional)',ph:'Near park',full:true}].map(f=>(
                      <div key={f.k} className={f.full?'col-span-2':''}>
                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">{f.l}</label>
                        <input value={address[f.k]} onChange={e=>setAddress({...address,[f.k]:e.target.value})} placeholder={f.ph} className={`w-full px-3 py-2.5 bg-white/[0.03] border rounded-xl text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-[#00f5ff]/30 transition-colors ${addressErrors[f.k]?'border-red-500/40':'border-white/[0.06]'}`}/>
                        {addressErrors[f.k]&&<p className="text-[9px] text-red-400 mt-0.5">{addressErrors[f.k]}</p>}
                      </div>
                    ))}
                    <div>
                      <label className="block text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">State</label>
                      <div className="relative group">
                        <select value={address.state} onChange={e=>setAddress({...address,state:e.target.value})} className="w-full px-3 py-2.5 bg-[#00f5ff]/10 border border-[#00f5ff]/20 rounded-xl text-sm font-black text-white focus:outline-none focus:border-[#00f5ff]/50 transition-all appearance-none cursor-pointer">
                          {INDIAN_STATES.map(s=><option key={s} value={s} className="bg-[#0a1628] text-white">{s}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#00f5ff]/40 group-hover:text-[#00f5ff] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  {delivery && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mt-4 p-4 bg-emerald-500/[0.05] border border-emerald-500/10 rounded-xl flex items-center gap-3">
                      <Truck size={18} className="text-emerald-400 shrink-0"/>
                      <div>
                        <p className="text-xs font-black text-emerald-400">{delivery.type} Delivery — {delivery.days} days</p>
                        <p className="text-[10px] text-white/30">Est. by {delivery.date.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}{delivery.cost>0?` • Shipping ₹${delivery.cost}`:' • FREE Shipping'}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : step === 2 ? (
                <motion.div key="payment" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4"><CreditCard size={16} className="text-[#00f5ff]"/><h3 className="text-sm font-black text-white uppercase tracking-wider">Payment Method</h3></div>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map(pm=>(
                      <motion.button key={pm.id} whileTap={{scale:0.98}} onClick={()=>setPaymentMethod(pm.id)} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${paymentMethod===pm.id?'bg-white/[0.04] border-[#00f5ff]/20 shadow-[0_0_15px_rgba(0,245,255,0.05)]':'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.03]'}`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${pm.color}15`,border:`1px solid ${pm.color}30`}}>
                          <pm.icon size={18} style={{color:pm.color}}/>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">{pm.name}</p>
                          <p className="text-[10px] text-white/30">{pm.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod===pm.id?'border-[#00f5ff] bg-[#00f5ff]':'border-white/10'}`}/>
                      </motion.button>
                    ))}
                  </div>
                  {/* Payment details */}
                  <AnimatePresence mode="wait">
                    {paymentMethod==='upi'&&(
                      <motion.div key="upi" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl space-y-4">
                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-wider mb-2">Select Payment App</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {id:'gpay', name:'Google Pay', color:'#4285F4'},
                            {id:'phonepe', name:'PhonePe', color:'#5f259f'},
                            {id:'paytm', name:'Paytm', color:'#00baf2'}
                          ].map(app => (
                            <button 
                              key={app.id}
                              onClick={() => setSelectedUpiApp(app.id)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selectedUpiApp === app.id ? 'bg-white/10 border-white/20 ring-1 ring-white/10' : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05]'}`}
                            >
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px]" style={{background:`${app.color}20`, color:app.color, border:`1px solid ${app.color}40`}}>
                                {app.id === 'gpay' ? 'G' : app.id === 'phonepe' ? 'P' : 'Py'}
                              </div>
                              <span className="text-[10px] font-bold text-white/60">{app.name}</span>
                            </button>
                          ))}
                        </div>
                        <div className="h-px bg-white/[0.04] my-2"/>
                        <p className="text-[9px] text-white/20 text-center font-medium">You will be redirected to the selected app to complete payment.</p>
                      </motion.div>
                    )}
                    {paymentMethod==='card'&&(
                      <motion.div key="card" initial={{opacity:0}} animate={{opacity:1}} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl space-y-3">
                        <div><label className="block text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">Card Number</label><input value={cardNum} onChange={e=>setCardNum(e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim())} maxLength={19} placeholder="1234 5678 9012 3456" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-[#00f5ff]/30 font-mono"/></div>
                        <div className="grid grid-cols-3 gap-3">
                          <div><label className="block text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">Expiry</label><input value={cardExp} onChange={e=>setCardExp(e.target.value)} placeholder="MM/YY" maxLength={5} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-[#00f5ff]/30 font-mono"/></div>
                          <div><label className="block text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">CVV</label><input value={cardCvv} onChange={e=>setCardCvv(e.target.value)} type="password" placeholder="•••" maxLength={4} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-[#00f5ff]/30 font-mono"/></div>
                          <div><label className="block text-[9px] font-black text-white/30 uppercase tracking-wider mb-1">Name</label><input value={cardName} onChange={e=>setCardName(e.target.value)} placeholder="Name" className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-[#00f5ff]/30"/></div>
                        </div>
                      </motion.div>
                    )}
                    {paymentMethod==='netbanking'&&(
                      <motion.div key="nb" initial={{opacity:0}} animate={{opacity:1}} className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-wider mb-1.5">Select Bank</label>
                        <div className="relative group">
                          <select value={selectedBank} onChange={e=>setSelectedBank(e.target.value)} className="w-full px-3 py-2.5 bg-[#00f5ff]/10 border border-[#00f5ff]/20 rounded-xl text-sm font-black text-white focus:outline-none focus:border-[#00f5ff]/50 transition-all appearance-none cursor-pointer">
                            <option value="" className="bg-[#0a1628] text-white">Choose your bank</option>
                            {['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra','Bank of Baroda','Punjab National Bank','Canara Bank','Indian Bank','Union Bank'].map(b=><option key={b} value={b} className="bg-[#0a1628] text-white">{b}</option>)}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#00f5ff]/40 group-hover:text-[#00f5ff] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div key="confirm" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Order Summary</h3>
                  {/* Items */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {cart.map(item=>(
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                        <img src={Array.isArray(item.images)?item.images[0]:item.image} alt="" className="w-10 h-10 rounded-lg object-cover"/>
                        <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">{item.name}</p><p className="text-[10px] text-white/30">Qty: {item.quantity}</p></div>
                        <span className="text-xs font-black text-white">₹{(item.price*item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  {/* Address Summary */}
                  <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="flex items-center gap-2 mb-2"><MapPin size={12} className="text-[#00f5ff]"/><span className="text-[9px] font-black text-white/30 uppercase tracking-wider">Deliver To</span></div>
                    <p className="text-sm font-bold text-white">{address.name}</p>
                    <p className="text-xs text-white/40">{address.line1}{address.line2?', '+address.line2:''}</p>
                    <p className="text-xs text-white/40">{address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-xs text-white/30 mt-1">📞 {address.phone}</p>
                  </div>
                  {/* Payment Summary */}
                  <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="flex items-center gap-2 mb-2"><CreditCard size={12} className="text-[#00f5ff]"/><span className="text-[9px] font-black text-white/30 uppercase tracking-wider">Payment</span></div>
                    <p className="text-sm font-bold text-white">{PAYMENT_METHODS.find(p=>p.id===paymentMethod)?.name}</p>
                    {paymentMethod==='upi'&&upiId&&<p className="text-xs text-white/40">{upiId}</p>}
                    {paymentMethod==='card'&&cardNum&&<p className="text-xs text-white/40">•••• {cardNum.slice(-4)}</p>}
                  </div>
                  {/* Delivery */}
                  {delivery&&(
                    <div className="p-4 bg-emerald-500/[0.05] rounded-xl border border-emerald-500/10">
                      <div className="flex items-center gap-2"><Truck size={14} className="text-emerald-400"/><span className="text-xs font-black text-emerald-400">Est. {delivery.date.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})} ({delivery.days} days)</span></div>
                    </div>
                  )}
                  {/* Price Breakdown */}
                  <div className="space-y-2 p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <div className="flex justify-between text-xs text-white/40"><span>Subtotal</span><span className="text-white">₹{cartTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-xs text-white/40"><span>Shipping</span><span className={shippingCost===0?'text-emerald-400':'text-white'}>{shippingCost===0?'FREE':'₹'+shippingCost}</span></div>
                    {codCharge>0&&<div className="flex justify-between text-xs text-white/40"><span>COD Charges</span><span className="text-white">₹{codCharge}</span></div>}
                    <div className="h-px bg-white/[0.06] my-1"/>
                    <div className="flex justify-between"><span className="text-sm font-black text-white">Total</span><span className="text-xl font-black text-[#00f5ff]">₹{grandTotal.toLocaleString()}</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer CTA */}
          {!orderPlaced && (
            <div className="p-5 border-t border-white/[0.04]">
              {step < 3 ? (
                <motion.button whileHover={{scale:1.01}} whileTap={{scale:0.99}} onClick={handleNext} disabled={step===2&&!paymentMethod} className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${(step===2&&!paymentMethod)?'bg-white/5 text-white/20 cursor-not-allowed':'bg-gradient-to-r from-[#00f5ff] to-[#06d6a0] text-[#020810] hover:shadow-[0_0_25px_rgba(0,245,255,0.25)]'}`}>
                  Continue <ChevronRight size={14}/>
                </motion.button>
              ) : (
                <motion.button disabled={loading} whileHover={{scale:1.01}} whileTap={{scale:0.99}} onClick={placeOrder} className={`w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}>
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Shield size={16}/>} 
                  {loading ? 'Processing...' : `Place Order — ₹${grandTotal.toLocaleString()}`}
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
