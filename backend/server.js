const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./models/db');

// Import all models so they are registered for sync
require('./models/Admin');
require('./models/Review');
require('./models/Product');
require('./models/User');

const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Routes
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const settingsRoutes = require('./routes/settings');

app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);

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
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');

    // Sync models (creates tables if they don't exist)
    await sequelize.sync();
    console.log('✅ Database tables synced');

    app.listen(PORT, () => {
      console.log(`\n🐠 Exotic Fish Mart API running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   Products: http://localhost:${PORT}/api/products`);
      console.log(`   Auth: http://localhost:${PORT}/api/auth/admin/login\n`);
    });
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    console.log('💡 Make sure PostgreSQL is running.');
    console.log('   Install from https://www.postgresql.org/download/');
    console.log('   Or set DATABASE_URL in .env');
  }
}

start();
