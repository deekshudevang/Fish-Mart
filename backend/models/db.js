const { Sequelize } = require('sequelize');

const DATABASE_URL =
  process.env.DATABASE_URL || 'mysql://root:@localhost:3306/exotic_fish_mart';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
