const express = require("express");
const router = express.Router();
const ThongkeController = require("../controllers/thongkeController");

// đơn hàng theo id người dùng
//http://localhost:5000/thongke/getAllOrdersWithUserDetails
router.get("/getAllOrdersWithUserDetails",ThongkeController.getAllOrdersWithUserDetails);

// người dùng mới
//http://localhost:5000/thongke/getNewUsersToday
router.get("/getNewUsersToday", ThongkeController.getNewUsersToday);

//thống kế tổng sản phẩm
//http://localhost:5000/thongke/getTotalProducts
router.get("/getTotalProducts", ThongkeController.getTotalProducts);

//tổng số lượng sản phẩm
//http://localhost:5000/thongke/getTotalProductsCount
router.get("/getTotalProductsCount", ThongkeController.getTotalProductsCount)

//tổng thương hiệu
//http://localhost:5000/thongke/getTotalThuonghieu
router.get("/getTotalThuonghieu", ThongkeController.getTotalThuonghieu);

//tổng user
//http://localhost:5000/thongke/getTotalUsers
router.get("/getTotalUsers", ThongkeController.getTotalUsers);

//tổng đơn hàng
//http://localhost:5000/thongke/getTotalDonHang
router.get("/getTotalDonHang", ThongkeController.getTotalDonHang);

//tổng doanh thu
//http://localhost:5000/thongke/getTotalRevenue
router.get("/getTotalRevenue", ThongkeController.getDoanhThu);

//tổng doanh thu theo tháng getDoanhThuDonHangTheoThang
//http://localhost:5000/thongke/getTotalRevenueByMonth
router.get("/getTotalRevenueByMonth", ThongkeController.getDoanhThuDonHangTheoThang);

//thống kê sản phẩm bán chạy nhất theo biễu đồ cột
//http://localhost:5000/thongke/getTopProducts
router.get("/getTopProducts", ThongkeController.getSanPhamBanChayNhat);

module.exports = router;

