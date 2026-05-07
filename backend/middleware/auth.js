const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// C1 FIX: No hardcoded fallbacks — fail fast if secrets are missing
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.error('❌ FATAL: JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables.');
  console.error('   Create a .env file with strong random secrets.');
  process.exit(1);
}

// Full auth middleware — loads admin from DB
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Admin not found or inactive.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// Role-based authorization
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        error: `Role '${req.admin.role}' is not authorized for this action.`,
      });
    }
    next();
  };
}

// Lightweight legacy compat — used by old admin routes during transition
function adminAuth(req, res, next) {
  return authMiddleware(req, res, next);
}

module.exports = { authMiddleware, authorizeRoles, adminAuth, JWT_SECRET, JWT_REFRESH_SECRET };
