const express = require('express');
const router = express.Router();
const donhangController = require('../controllers/donhangController');

//http://localhost:5000/donhang/donhang
router.post('/donhang',donhangController.addDonHang);

//show tất cả đơn hàng
//http://localhost:5000/donhang/showAll
router.get('/showAll',donhangController.getAllDonHang);

//cập nhật trạng thái đơn hàng
//http://localhost:5000/donhang/update/:id
router.put('/update/:id',donhangController.updateDonHang);

//show all don hang theo id_nguoi_dung khi login
//http://localhost:5000/donhang/show/:id_nguoi_dung
router.get('/show/:id_nguoi_dung',donhangController.getAllDonHangByUserId);

//xem lịch sử đơn hàng
//http://localhost:5000/donhang/history/:id_nguoi_dung
router.get('/history/:id_nguoi_dung', donhangController.getDonHangByUserId);

//xem chi tiết đơn hàng
//http://localhost:5000/donhang/getAllOrderDetails
router.get("/getAllOrderDetails", donhangController.getAllOrderDetails);

module.exports = router;