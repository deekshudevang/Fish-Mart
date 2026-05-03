const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('./db');

const Admin = sequelize.define(
  'Admin',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('super-admin', 'product-manager', 'order-manager'),
      defaultValue: 'product-manager',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    lastLogin: {
      type: DataTypes.DATE,
      field: 'last_login',
    },
  },
  {
    tableName: 'admins',
    underscored: true,
    timestamps: true,
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          admin.password = await bcrypt.hash(admin.password, 12);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 12);
        }
      },
    },
  }
);

// Instance method to compare passwords
Admin.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to return safe JSON (no password)
Admin.prototype.toSafeJSON = function () {
  const json = this.toJSON();
  delete json.password;
  return json;
};

module.exports = Admin;
