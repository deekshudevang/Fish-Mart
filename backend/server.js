require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./models/db');
const cookieParser = require('cookie-parser');

// Import all models so they are registered for sync
// We import them here once to ensure associations are established
require('./models/Admin');
require('./models/Review');
require('./models/Product');
require('./models/User');
require('./models/Order');
require('./models/Settings');

const app = express();

// ═══ SECURITY: Helmet for HTTP security headers ═══
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // disable CSP for dev — enable in production
}));

// ═══ SECURITY: Rate limiting on auth endpoints ═══
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased security: lower limit for auth
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ═══ SECURITY: General API rate limiter ═══
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' })); // Increased limit to 50mb to allow for base64 image uploads

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const settingsRoutes = require('./routes/settings');
const orderRoutes = require('./routes/orders');

app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (_) {
    /* stays disconnected */
  }
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware (Never leak internal error details)
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Global crash prevention
process.on('uncaughtException', (err) => {
  console.error('💀 UNCAUGHT EXCEPTION:', err);
  // Give the server time to finish requests before exiting
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 UNHANDLED REJECTION:', reason);
});

// Start server
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synced');

    app.listen(PORT, () => {
      console.log(`\n🐠 Exotic Fish Mart API running on http://localhost:${PORT}`);
      console.log(`   Health:   http://localhost:${PORT}/api/health`);
      console.log(`   Products: http://localhost:${PORT}/api/products`);
      console.log(`   Mode:     ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    console.log('💡 Make sure your database server (MySQL/MariaDB) is running.');
    console.log('   Check DATABASE_URL in your .env file.');
  }
}

start();

