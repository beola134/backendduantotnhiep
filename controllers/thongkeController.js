const ThuongHieu = require("../models/thuonghieu");
const CMT = require('../models/comment');
const Product = require('../models/product');
const Users = require("../models/users");
const voucher = require("../models/voucher");
const PhuongThucThanhToan = require("../models/pttt");
const Voucher = require("../models/voucher");
const ChiTietDonHang = require("../models/chitietdonhang");
const DonHang = require("../models/donhang");
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get newest users created today
exports.getNewUsersToday = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day

    const usersToday = await Users.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    if (usersToday.length === 0) {
     console.log(usersToday, "Không có người dùng mới hôm");
     
    }

    res.status(200).json({ usersToday });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Hiển thị tất cả đơn hàng với hình ảnh và tên người dùng
exports.getAllOrdersWithUserDetails = async (req, res) => {
  try {
    const orders = await DonHang.findAll({});
    const result = await Promise.all(
      orders.map(async (order) => {
        const user = await Users.findOne({ where: { _id: order.id_nguoi_dung } });
        return {
          ...order. dataValues,
          user: user
            ? {
              _id: user._id,
              ho_ten: user.ho_ten,
              email: user.email,
              hinh_anh: user.hinh_anh,
            }
            : null,
        }
      })
    );
    res.status(200).json({ orders: result });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};





// Thống kê tổng số sản phẩm
exports.getTotalProducts = async (req, res) => {
    try {
    const getTotalProducts = await Product.count();

    res.json({ getTotalProducts });
    } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
    }
};

//thống kê số lượng sản phẩm
exports.getTotalProductsCount = async (req, res) => {
  try {
    const totalProductsCount = await Product.sum("so_luong");
    res.json({ totalProductsCount });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

// Thống kê tổng thương hiệu sản phẩm
exports.getTotalThuonghieu = async (req, res) => {
  try {
    const totalThuonghieu = await ThuongHieu.count();

    res.json({ totalThuonghieu });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
}

// Tính tổng số người dùng dành cho admin
exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await Users.count();

    res.json({ totalUsers });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};
// Tính tổng số đơn hàng dành cho admin
exports.getTotalDonHang = async (req, res) => {
  try {
    const totalOrders = await DonHang.count();

    res.json({ totalOrders });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

// thống kê doanh thu
exports.getDoanhThu = async (req, res) => {
  try {
    const doanhThu = await DonHang.sum("tong_tien", {
      where: {
        trang_thai: "Giao hàng thành công",
      },
    });
    res.json({ doanhThu });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

//thông kê dooanh thu donhang theo tháng bằng sơ đồ cột theo 12 tháng
exports.getDoanhThuDonHangTheoThang = async (req, res) => {
  try {
    // Lấy doanh thu theo tháng từ database
    const doanhThuDonHangTheo = await DonHang.findAll({
      attributes: [
        // Lấy tháng từ thời gian tạo đơn hàng
        [sequelize.fn("month", sequelize.col("thoi_gian_tao")), "month"], 
        // Tính tổng doanh thu của các đơn hàng
        [sequelize.fn("sum", sequelize.col("tong_tien")), "total"],
      ],
      where: {
        trang_thai: "Giao hàng thành công", 
      },
      group: [sequelize.fn("month", sequelize.col("thoi_gian_tao"))],
    });

    // Tạo mảng tháng từ 1 đến 12, với doanh thu mặc định là 0
    const doanhThuThang = new Array(12).fill(0);

    // Cập nhật doanh thu cho các tháng có dữ liệu từ kết quả trả về
    doanhThuDonHangTheo.forEach(item => {
      const month = item.get("month") - 1
      const totalRevenue = item.get("total") || 0;
      doanhThuThang[month] = totalRevenue;
    });

    // Trả về kết quả với doanh thu cho tất cả 12 tháng
    const result = doanhThuThang.map((totalRevenue, index) => ({
      month: index + 1,
      totalRevenue,
    }));

    res.json({ doanhThuDonHangTheo: result });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

//thống kê sản phẩm bán chạy nhất theo biễu đồ cột và trạng thái là giao hàng thành công
exports.getSanPhamBanChayNhat = async (req, res) => {
  try {
    const topProducts = await ChiTietDonHang.findAll({
      attributes: [
        "id_san_pham",
        [sequelize.fn("sum", sequelize.col("so_luong")), "total"],
      ],
      include: [
        {
          model: DonHang,
          as: "DonHang",
          attributes: [],
          where: {
            trang_thai: "Giao hàng thành công",
          },
        },
      ],
      group: ["id_san_pham"],
      order: [[sequelize.literal("total"), "DESC"]],
      limit: 5,
    });

    const result = await Promise.all(
      topProducts.map(async (product) => {
        const productDetail = await Product.findByPk(product.id_san_pham);
        return {
          id_san_pham: product.id_san_pham,
          ten_san_pham: productDetail.ten_san_pham,
          total: product.get("total"),
        };
      })
    );

    res.json({ topProducts: result });
    
  } catch (error) {
    
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
}







