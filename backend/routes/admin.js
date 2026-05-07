const express = require('express');
const { Op } = require('sequelize');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

// H1 FIX: Only accept Base64 images or URLs — NO local file paths
const processAndSaveImages = (images) => {
  if (!images || !Array.isArray(images)) return images;
  
  const frontendDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'products');
  const adminDir = path.join(__dirname, '..', '..', 'admin', 'public', 'products');
  
  // Ensure directories exist
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });
  if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });

  return images.map(img => {
    if (typeof img !== 'string') return img;

    // Allow existing URL paths (already uploaded images)
    if (img.startsWith('http') || img.startsWith('/products/')) {
      return img;
    }

    try {
      // Only accept Base64 encoded images
      if (img.startsWith('data:image/')) {
        const matches = img.match(/^data:image\/(jpeg|jpg|png|gif|webp);base64,(.+)$/);
        if (!matches) return img; // Invalid format, skip
        
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        
        // L2: Validate file size (max 2MB per image)
        if (buffer.length > 2 * 1024 * 1024) {
          console.warn('Image too large, skipping (max 2MB)');
          return img;
        }
        
        const filename = `upload_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
        fs.writeFileSync(path.join(frontendDir, filename), buffer);
        fs.writeFileSync(path.join(adminDir, filename), buffer);
        return `/products/${filename}`;
      }
    } catch (e) {
      console.error('Failed to process image:', e.message);
    }
    
    // Reject anything else (local file paths, etc.)
    return img;
  });
};

// H2 FIX: Whitelist allowed product fields — no mass assignment
const sanitizeProductInput = (body) => {
  const allowed = ['name', 'description', 'price', 'stock', 'category', 'images', 'videoUrl', 'specs', 'careLevel', 'temperament', 'size'];
  const sanitized = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      sanitized[key] = body[key];
    }
  }
  return sanitized;
};

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
      if (category === 'Fishes') {
        where.category = { [Op.in]: ['Freshwater', 'Saltwater', 'Rare Findings'] };
      } else {
        where.category = category;
      }
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
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
      const data = sanitizeProductInput(req.body); // H2 FIX
      if (data.images) {
        data.images = processAndSaveImages(data.images);
      }
      const product = await Product.create(data);
      const full = await Product.findByPk(product.id, {
        include: [{ model: Review, as: 'reviews' }],
      });
      res.status(201).json(full.toJSONWithRating());
    } catch (error) {
      console.error('Admin create product error:', error);
      res.status(400).json({ error: 'Failed to create product. Check your input.' });
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

      const data = sanitizeProductInput(req.body); // H2 FIX
      if (data.images) {
        data.images = processAndSaveImages(data.images);
      }

      await product.update(data);
      const full = await Product.findByPk(product.id, {
        include: [{ model: Review, as: 'reviews' }],
      });
      res.json(full.toJSONWithRating());
    } catch (error) {
      console.error('Admin update product error:', error);
      res.status(400).json({ error: 'Failed to update product. Check your input.' });
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
// M3 FIX: Exclude sensitive fields from user listing
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'passwordHash', 'refreshToken'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error('Admin fetch users error:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

module.exports = router;
