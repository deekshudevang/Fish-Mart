const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Review = require('./Review');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 },
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const val = this.getDataValue('images');
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch (e) {
            return [];
          }
        }
        return val || [];
      }
    },
    videoUrl: {
      type: DataTypes.TEXT,
      defaultValue: '',
      field: 'video_url',
    },
    category: {
      type: DataTypes.ENUM('Freshwater', 'Saltwater', 'Rare'),
      defaultValue: 'Freshwater',
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: { min: 0 },
    },
    shipmentDate: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      field: 'shipment_date',
    },
  },
  {
    tableName: 'products',
    underscored: true,
    timestamps: true,
  }
);

// One Product has many Reviews
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

// Helper: compute avgRating from included reviews
Product.prototype.toJSONWithRating = function () {
  const json = this.toJSON();
  if (json.reviews && json.reviews.length > 0) {
    const sum = json.reviews.reduce((acc, r) => acc + r.rating, 0);
    json.avgRating = sum / json.reviews.length;
  } else {
    json.avgRating = 0;
  }
  return json;
};

// Virtual for backward compatibility
Object.defineProperty(Product.prototype, 'image', {
  get() {
    return this.images && this.images.length > 0 ? this.images[0] : '';
  }
});

module.exports = Product;
