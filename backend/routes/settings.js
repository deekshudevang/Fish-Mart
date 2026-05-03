const express = require('express');
const Settings = require('../models/Settings');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'exotic-fish-mart-secret-key-2024';

// Admin Auth Middleware (Shared with admin routes)
async function adminAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new Error('No token');

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) throw new Error('Admin not found');

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Admin access denied' });
  }
}

// GET /api/settings - Public
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findAll();
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.key] = s.value);
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/settings - Protected
router.put('/', adminAuthMiddleware, async (req, res) => {
  try {
    const { settings } = req.body; // Expects object { about_us: '...', hero_description: '...' }
    
    for (const key in settings) {
      await Settings.upsert({ key, value: settings[key] });
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
