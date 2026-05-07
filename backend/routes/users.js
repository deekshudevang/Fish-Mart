const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET must be set in environment variables.');
  process.exit(1);
}

// Middleware to verify Customer JWT
async function customerAuthMiddleware(req, res, next) {
  try {
    // Check for token in cookie first, then fall back to header
    const token = req.cookies.customer_token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// POST /api/users/google-login
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      console.error('Login attempt without credential');
      return res.status(400).json({ error: 'Missing Google credential.' });
    }

    // Verify the Google ID Token
    console.log('Verifying Google Token...');
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('Google Token verified for:', payload.email);
    
    // Find or create the user in our database
    let user = await User.findOne({ where: { googleId: payload.sub } });
    
    if (!user) {
      console.log('Creating new user:', payload.email);
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        lastLogin: new Date(),
      });
    } else {
      console.log('Updating existing user:', payload.email);
      await user.update({ lastLogin: new Date() });
    }

    // Issue our own application JWT
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set secure cookie
    res.cookie('customer_token', accessToken, {
      httpOnly: true,
      secure: false, // Set to false for local HTTP development
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('✅ JWT issued and cookie set for:', user.email);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('❌ Google verification failed:', error.message);
    res.status(401).json({ error: 'Authentication failed. Please try again.' });
  }
});

// POST /api/users/logout
router.post('/logout', (req, res) => {
  res.clearCookie('customer_token');
  res.json({ message: 'Logged out successfully' });
});

// GET /api/users/me — Get current customer profile
router.get('/me', customerAuthMiddleware, async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
  });
});

module.exports = router;
