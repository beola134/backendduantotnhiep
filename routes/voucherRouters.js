const express = require('express');
const router = express.Router();
const voucher = require('../controllers/voucherController');

//Thêm voucher
//http://localhost:5000/voucher
router.post('/', voucher.addVoucher);

////tìm kiếm voucher theo mã voucher để áp dụng cho đơn hàng dùng phương thức post
//http://localhost:5000/voucher/ma_voucher
router.post('/ma_voucher', voucher.getVoucherByCode);

//Show all cac vouchers
//http://localhost:5000/voucher/getAllVouchers
router.get("/getAllVouchers", voucher.getAllVouchers);

//Show voucher theo id
//http://localhost:5000/voucher/getVoucherById/:id
router.get("/getVoucherById/:id", voucher.getVoucherById);

//cập nhật voucher
//http://localhost:5000/voucher/updateVoucher/:id
router.put("/updateVoucher/:id", voucher.updateVoucher);


//Xóa voucher
//http://localhost:5000/voucher/deleteVouCher/:id
router.delete("/deleteVouCher/:id", voucher.deleteVouCher);

//getvoucher
//http://localhost:5000/voucher/getvoucher
router.get("/getvoucher", voucher.getvoucher);

//ẩn voucher và hiện voucher
//http://localhost:5000/voucher/getVoucherByStatus/:id
router.put("/getVoucherByStatus/:id", voucher.getVoucherByStatus);

module.exports = router;