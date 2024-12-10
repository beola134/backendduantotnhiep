const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('freedb_duantotnghiep', 'freedb_user25', '679$Yha@ZrBMX35', {
  host: 'sql.freedb.tech',
  port: 3306,
  dialect: 'mysql',
});

module.exports = sequelize;
