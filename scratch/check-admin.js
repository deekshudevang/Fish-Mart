const path = require('path');
const Admin = require('../backend/models/Admin');
const sequelize = require('../backend/models/db');

async function check() {
  try {
    await sequelize.authenticate();
    const admins = await Admin.findAll();
    console.log('Admins in DB:', admins.map(a => a.email));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
