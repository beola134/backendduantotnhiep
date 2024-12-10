const DonHang = require('./donhang');
const ChiTietDonHang = require('./chitietdonhang');
const User = require('./users');
const Product = require('./product'); 
const PhuongThucThanhToan = require('./pttt');

// Định nghĩa quan hệ
DonHang.hasMany(ChiTietDonHang, {
    foreignKey: 'id_don_hang',
    as: 'chiTietDonHangs',
});

ChiTietDonHang.belongsTo(DonHang, {
    foreignKey: 'id_don_hang',
});

ChiTietDonHang.belongsTo(Product, {
    foreignKey: 'id_san_pham', 
    as: 'product', 
});

User.hasMany(DonHang, { foreignKey: 'id_nguoi_dung' });

DonHang.belongsTo(PhuongThucThanhToan, {
    foreignKey: 'id_phuong_thuc_thanh_toan',
    as: 'phuongThucThanhToan'
});
// Xuất tất cả các model
module.exports = {
    DonHang,
    ChiTietDonHang,
    User,
    Product,
};
