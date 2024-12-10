const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const Product = sequelize.define('Product', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true
    },
    ten_san_pham: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ten: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    gia_san_pham: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    gia_giam: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    hinh_anh: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    mo_ta: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    do_chiu_nuoc: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    xuat_xu: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    gioi_tinh: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    so_luong: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    loai_may: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    loai:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    duong_kinh: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    chat_lieu_day: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    chat_lieu_vo: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    mat_kinh: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    mau_mat: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    phong_cach: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    kieu_dang: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ma_san_pham: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    thuong_hieu: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    size_day:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    mau_day:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    do_dai_day:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    id_thuong_hieu: {
        type: DataTypes.STRING(255),
        allowNull: false

    },
    id_danh_muc: {
        type: DataTypes.STRING(255),
        allowNull: true
    }

}, {
    tableName: 'san_pham',
    timestamps: false
});

module.exports = Product;
