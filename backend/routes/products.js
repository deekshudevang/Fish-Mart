const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');

const router = express.Router();

// GET /api/products — List all products (public)
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.category) {
      where.category = req.query.category;
    }
    const products = await Product.findAll({
      where,
      include: [{ model: Review, as: 'reviews' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(products.map((p) => p.toJSONWithRating()));
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — Single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Review, as: 'reviews' }],
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product.toJSONWithRating());
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products/:id/reviews — Add a review (public)
router.post('/:id/reviews', async (req, res) => {
  try {
    const { rating, comment, user } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await Review.create({
      rating: Number(rating),
      comment,
      user: user || 'Anonymous',
      productId: product.id,
    });

    // Re-fetch with reviews to return updated product
    const updated = await Product.findByPk(product.id, {
      include: [{ model: Review, as: 'reviews' }],
    });
    res.json(updated.toJSONWithRating());
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

module.exports = router;
