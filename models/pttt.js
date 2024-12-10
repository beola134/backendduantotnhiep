const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhuongThucThanhToan = sequelize.define('PhuongThucThanhToan', {
    _id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    },
    ten_phuong_thuc: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'phuong_thuc_thanh_toan',
    timestamps: false
});

module.exports = PhuongThucThanhToan;
