const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');

const { Op } = require('sequelize');

const router = express.Router();

// GET /api/products/search?q=... — Smart search with exact + related results (public)
// Must be BEFORE /:id to avoid route conflict
router.get('/search', async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query) {
      return res.json({ exactMatches: [], relatedProducts: [] });
    }

    const allProducts = await Product.findAll({
      include: [{ model: Review, as: 'reviews' }],
      order: [['createdAt', 'DESC']],
    });
    const all = allProducts.map(p => p.toJSONWithRating());

    const qLower = query.toLowerCase();
    const qWords = qLower.split(/\s+/).filter(w => w.length > 0);

    // Score each product for relevance
    const scored = all.map(product => {
      const name = (product.name || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      const cat = (product.category || '').toLowerCase();
      let score = 0;

      // Exact name match (case-insensitive)
      if (name === qLower) score += 100;
      // Name starts with the query
      else if (name.startsWith(qLower)) score += 80;
      // Name contains the full query
      else if (name.includes(qLower)) score += 60;

      // Every individual word that appears in the name
      qWords.forEach(word => {
        if (name.includes(word)) score += 20;
      });

      // Description contains the full query
      if (desc.includes(qLower)) score += 15;

      // Every individual word in description
      qWords.forEach(word => {
        if (desc.includes(word)) score += 5;
      });

      // Category matches
      if (cat.includes(qLower)) score += 10;
      qWords.forEach(word => {
        if (cat.includes(word)) score += 5;
      });

      return { ...product, _score: score };
    });

    // Exact matches: products with strong relevance (score >= 20 means at least one word matched in name)
    const exactMatches = scored
      .filter(p => p._score >= 20)
      .sort((a, b) => b._score - a._score)
      .map(({ _score, ...p }) => p);

    // Related products: same categories as exact matches, or lower-scored items
    const matchedCategories = [...new Set(exactMatches.map(p => p.category))];
    
    const exactIds = new Set(exactMatches.map(p => p.id));
    const relatedProducts = scored
      .filter(p => !exactIds.has(p.id)) // exclude exact matches
      .filter(p => {
        // Include if: same category as a match, or has any relevance score
        return matchedCategories.includes(p.category) || p._score > 0;
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, 12) // limit related results
      .map(({ _score, ...p }) => p);

    res.json({ exactMatches, relatedProducts });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

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
