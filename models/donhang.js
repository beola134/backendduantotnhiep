const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database')
const { v4: uuidv4 } = require('uuid'); // Import UUID v4

const DonHang = sequelize.define('DonHang', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true
    },
    dia_chi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tong_tien: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    trang_thai: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    trang_thai_thanh_toan: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    thanh_toan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    phi_ship: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Miễn phí'
    },
    thoi_gian_tao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    id_nguoi_dung: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    id_phuong_thuc_thanh_toan: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ghi_chu: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    id_voucher: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    app_trans_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true}, 
}, {
    tableName: 'don_hang',
    timestamps: false
});

module.exports = DonHang;