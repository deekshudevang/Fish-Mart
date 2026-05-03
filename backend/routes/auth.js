const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { authMiddleware, JWT_SECRET, JWT_REFRESH_SECRET } = require('../middleware/auth');

const router = express.Router();

// Default Super Admin (created on first login attempt if no admins exist)
const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@exoticfishmart.com',
  password: process.env.ADMIN_PASSWORD || 'ExoticFish2024!',
  name: 'Super Admin',
  role: 'super-admin',
};

// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Auto-create default super admin if no admins exist
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create(DEFAULT_ADMIN);
      console.log('🔑 Default super admin created: admin@exoticfishmart.com');
    }

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ error: 'Account is deactivated.' });
    }

    // Validate password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: admin.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Update last login
    await admin.update({ lastLogin: new Date() });

    res.json({
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// POST /api/auth/admin/refresh
router.post('/admin/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required.' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const admin = await Admin.findByPk(decoded.id);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Invalid refresh token.' });
    }

    const accessToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
});

// GET /api/auth/admin/me — Get current admin profile
router.get('/admin/me', authMiddleware, async (req, res) => {
  res.json({
    id: req.admin.id,
    email: req.admin.email,
    name: req.admin.name,
    role: req.admin.role,
    lastLogin: req.admin.lastLogin,
  });
});

module.exports = router;
