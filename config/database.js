const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('btbemsqj96zftsigmco2', 'ukqlr76ulzopwjd3', 'VXV8Uth9yjdLoOcQlyEG', {
  host: 'btbemsqj96zftsigmco2-mysql.services.clever-cloud.com',
  port: 3306,

});

module.exports = sequelize;
