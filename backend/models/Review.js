const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user: {
      type: DataTypes.STRING,
      defaultValue: 'Anonymous',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
    },
  },
  {
    tableName: 'reviews',
    underscored: true,
    timestamps: true,
  }
);

module.exports = Review;
