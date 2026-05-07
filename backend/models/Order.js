const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.ENUM('pending','confirmed','processing','shipped','delivered','cancelled'), defaultValue: 'confirmed' },

  // Customer info
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerPhone: { type: DataTypes.STRING, allowNull: false },
  customerEmail: { type: DataTypes.STRING },

  // Shipping address
  addressLine1: { type: DataTypes.STRING, allowNull: false },
  addressLine2: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  pincode: { type: DataTypes.STRING, allowNull: false },
  landmark: { type: DataTypes.STRING },

  // Payment
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  paymentStatus: { type: DataTypes.ENUM('pending','paid','failed','refunded'), defaultValue: 'paid' },

  // Order items (stored as JSON)
  items: { type: DataTypes.JSON, allowNull: false },
  itemCount: { type: DataTypes.INTEGER, defaultValue: 0 },

  // Pricing
  subtotal: { type: DataTypes.FLOAT, allowNull: false },
  shippingCost: { type: DataTypes.FLOAT, defaultValue: 0 },
  codCharge: { type: DataTypes.FLOAT, defaultValue: 0 },
  grandTotal: { type: DataTypes.FLOAT, allowNull: false },

  // Delivery
  deliveryType: { type: DataTypes.STRING },
  estimatedDays: { type: DataTypes.STRING },
  estimatedDate: { type: DataTypes.DATE },
  deliveredAt: { type: DataTypes.DATE },

  // Notes
  notes: { type: DataTypes.TEXT },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
