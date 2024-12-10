const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid'); 

const User = sequelize.define('User', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true
    },
    ten_dang_nhap: {
        type: DataTypes.STRING(255),
        allowNull: false

    },
    mat_khau: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ho_ten: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    dia_chi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dien_thoai: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    hinh_anh: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    quyen: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '2'
    },
    googleId:{
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    otp: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    otpExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lock_until: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
}, {
    tableName: 'nguoi_dung',
    timestamps: false,
});

module.exports = User;
