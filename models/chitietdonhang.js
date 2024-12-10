const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid'); // Import UUID v4

const ChiTietDonHang = sequelize.define('ChiTietDonHang', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true
    },
    gia_san_pham: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    ten_san_pham: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    so_luong: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_don_hang: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    id_san_pham: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    tableName: 'chi_tiet_don_hang',
    timestamps: false
});

module.exports = ChiTietDonHang;
