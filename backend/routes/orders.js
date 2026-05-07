const express = require('express');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — Create a new order (public, from checkout)
router.post('/', async (req, res) => {
  try {
    const { address, paymentMethod, items, subtotal, shippingCost, codCharge, grandTotal, delivery } = req.body;

    if (!address || !paymentMethod || !items || !items.length) {
      return res.status(400).json({ error: 'Missing required order fields.' });
    }

    // 🛡️ SECURITY: Verify prices from database (Code Strength Enhancement)
    const Product = require('../models/Product');
    const productIds = items.map(i => i.id);
    const dbProducts = await Product.findAll({ where: { id: productIds } });
    
    let calculatedSubtotal = 0;
    items.forEach(item => {
      // Use == to handle string/number comparison safely
      const dbProd = dbProducts.find(p => p.id == item.id);
      if (dbProd) {
        calculatedSubtotal += dbProd.price * item.quantity;
      }
    });

    if (Math.abs(calculatedSubtotal - subtotal) > 1) {
      return res.status(400).json({ error: 'Price mismatch detected. Please refresh your cart.' });
    }

    const orderId = 'EFM' + Date.now().toString(36).toUpperCase();

    const order = await Order.create({
      orderId,
      customerName: address.name,
      customerPhone: address.phone,
      customerEmail: address.email || null,
      addressLine1: address.line1,
      addressLine2: address.line2 || null,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || null,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: Array.isArray(i.images) ? i.images[0] : i.image })),
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
      subtotal,
      shippingCost: shippingCost || 0,
      codCharge: codCharge || 0,
      grandTotal,
      deliveryType: delivery?.type || 'Standard',
      estimatedDays: delivery?.days || '5-7',
      estimatedDate: delivery?.date ? new Date(delivery.date) : null,
      status: 'confirmed',
    });

    res.status(201).json({ success: true, orderId: order.orderId, id: order.id });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// GET /api/orders/track/:orderId — Track order (public)
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ where: { orderId: req.params.orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({
      orderId: order.orderId,
      status: order.status,
      estimatedDate: order.estimatedDate,
      deliveryType: order.deliveryType,
      city: order.city,
      createdAt: order.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track order.' });
  }
});

// ═══ ADMIN ROUTES (protected) ═══

// GET /api/orders/admin/all — List all orders
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const { status, sort } = req.query;
    const where = {};
    if (status && status !== 'all') where.status = status;

    let order = [['createdAt', 'DESC']];
    if (sort === 'oldest') order = [['createdAt', 'ASC']];
    if (sort === 'total-high') order = [['grandTotal', 'DESC']];

    const orders = await Order.findAll({ where, order });
    res.json(orders);
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// GET /api/orders/admin/stats — Order stats for dashboard
router.get('/admin/stats', authMiddleware, async (req, res) => {
  try {
    const all = await Order.findAll();
    const totalOrders = all.length;
    const totalRevenue = all.reduce((s, o) => s + (o.grandTotal || 0), 0);
    const pending = all.filter(o => o.status === 'confirmed' || o.status === 'processing').length;
    const shipped = all.filter(o => o.status === 'shipped').length;
    const delivered = all.filter(o => o.status === 'delivered').length;
    const cancelled = all.filter(o => o.status === 'cancelled').length;

    // Recent orders
    const recent = all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    res.json({ totalOrders, totalRevenue, pending, shipped, delivered, cancelled, recentOrders: recent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order stats.' });
  }
});

// PUT /api/orders/admin/:id/status — Update order status
router.put('/admin/:id/status', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const { status } = req.body;
    const validStatuses = ['pending','confirmed','processing','shipped','delivered','cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    await order.update({
      status,
      ...(status === 'delivered' ? { deliveredAt: new Date() } : {}),
    });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order.' });
  }
});

// GET /api/orders/admin/:id — Get single order details
router.get('/admin/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

module.exports = router;
