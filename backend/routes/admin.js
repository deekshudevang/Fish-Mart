const express = require('express');
const { Op } = require('sequelize');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication
router.use(authMiddleware);

// GET /api/admin/stats — Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalReviews = await Review.count();
    const products = await Product.findAll({
      include: [{ model: Review, as: 'reviews' }],
    });

    const totalRevenue = products.reduce((s, p) => s + (p.price || 0) * (p.stock || 0), 0);
    const categories = [...new Set(products.map((p) => p.category))];
    const lowStock = products.filter((p) => p.stock < 10).length;
    const videoProducts = products.filter((p) => p.videoUrl && p.videoUrl.trim() !== '').length;

    // Category breakdown
    const categoryBreakdown = {};
    products.forEach((p) => {
      if (!categoryBreakdown[p.category]) {
        categoryBreakdown[p.category] = { count: 0, revenue: 0 };
      }
      categoryBreakdown[p.category].count++;
      categoryBreakdown[p.category].revenue += p.price * p.stock;
    });

    // Recent products (last 5)
    const recentProducts = products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((p) => p.toJSONWithRating());

    res.json({
      totalProducts,
      totalReviews,
      totalRevenue,
      totalCategories: categories.length,
      lowStock,
      videoProducts,
      categoryBreakdown,
      recentProducts,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// GET /api/admin/products — List all products
router.get('/products', async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const where = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'price-asc') order = [['price', 'ASC']];
    else if (sort === 'price-desc') order = [['price', 'DESC']];
    else if (sort === 'name-asc') order = [['name', 'ASC']];
    else if (sort === 'name-desc') order = [['name', 'DESC']];
    else if (sort === 'stock-asc') order = [['stock', 'ASC']];

    const products = await Product.findAll({
      where,
      include: [{ model: Review, as: 'reviews' }],
      order,
    });

    res.json(products.map((p) => p.toJSONWithRating()));
  } catch (error) {
    console.error('Admin fetch products error:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// POST /api/admin/products — Create product
router.post(
  '/products',
  authorizeRoles('super-admin', 'product-manager'),
  async (req, res) => {
    try {
      const product = await Product.create(req.body);
      const full = await Product.findByPk(product.id, {
        include: [{ model: Review, as: 'reviews' }],
      });
      res.status(201).json(full.toJSONWithRating());
    } catch (error) {
      console.error('Admin create product error:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

// PUT /api/admin/products/:id — Update product
router.put(
  '/products/:id',
  authorizeRoles('super-admin', 'product-manager'),
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found.' });

      await product.update(req.body);
      const full = await Product.findByPk(product.id, {
        include: [{ model: Review, as: 'reviews' }],
      });
      res.json(full.toJSONWithRating());
    } catch (error) {
      console.error('Admin update product error:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE /api/admin/products/:id — Delete product (super-admin only)
router.delete(
  '/products/:id',
  authorizeRoles('super-admin'),
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found.' });

      await product.destroy();
      res.json({ success: true, message: 'Product deleted.' });
    } catch (error) {
      console.error('Admin delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product.' });
    }
  }
);

// POST /api/admin/products/bulk-delete — Bulk delete (super-admin only)
router.post(
  '/products/bulk-delete',
  authorizeRoles('super-admin'),
  async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Product IDs array is required.' });
      }

      const deleted = await Product.destroy({ where: { id: ids } });
      res.json({ success: true, message: `${deleted} product(s) deleted.` });
    } catch (error) {
      console.error('Bulk delete error:', error);
      res.status(500).json({ error: 'Failed to delete products.' });
    }
  }
);

// GET /api/admin/users — List all registered users
const User = require('../models/User');

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error('Admin fetch users error:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

module.exports = router;
