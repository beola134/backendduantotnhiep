const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const ThuongHieu = sequelize.define('ThuongHieu', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true
    },
    thuong_hieu: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    mo_ta: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    hinh_anh: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    hinh_anh2:{
        type: DataTypes.STRING(255),
        allowNull: false

    }
}, {
    tableName: 'thuong_hieu',
    timestamps: false
});

module.exports = ThuongHieu;
