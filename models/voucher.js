const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Voucher = sequelize.define('Voucher', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),  // Tạo UUID tự động
        allowNull: false,
        primaryKey: true
    },
    ma_voucher: {
        type: DataTypes.STRING(255),  
        allowNull: false
    },
    gia_tri: {
        type: DataTypes.INTEGER,  
        allowNull: true, 
    },
    phan_tram: {
        type: DataTypes.INTEGER,  
        allowNull: true, 
    },
    so_luong: {
        type: DataTypes.INTEGER,  
        allowNull: true, 
    },
    bat_dau: {
        type: DataTypes.DATE, 
        allowNull: false,
    },
    ket_thuc: {
        type: DataTypes.DATE,  
        allowNull: false,

    },
    mo_ta: {
        type: DataTypes.STRING(100),  
        allowNull: true,
    },
  
    don_hang_toi_thieu: {
        type: DataTypes.INTEGER,  
        allowNull: true,
    },
    mota2: {
        type: DataTypes.STRING(255),  
        allowNull: true,
    },
    trang_thai: {
        type: DataTypes.BOOLEAN,  
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'voucher',  
    timestamps: false  
});

module.exports = Voucher;
