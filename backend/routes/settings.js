const express = require('express');
const Settings = require('../models/Settings');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();
const { authMiddleware, authorizeRoles, JWT_SECRET } = require('../middleware/auth');

// Admin Auth Middleware alias for settings (shared with admin routes)
const adminAuthMiddleware = authMiddleware;

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
