// Lấy tất cả sản phẩm
const Product = require("../models/product");
const upload = require("../config/update");
const ThuongHieu = require("../models/thuonghieu");
const Users = require("../models/users");
const { Sequelize,Op } = require("sequelize");
const Cate = require("../models/danhmuc");

exports.getAllProducts = async (req, res) => {
  try {
    const { ten_san_pham, limit = 5, page = 1 } = req.query;
    let filter = {
      [Op.and]: [],
    };

    if (ten_san_pham) {
      filter[Op.and].push({ ten_san_pham: { [Op.substring]: ten_san_pham } });
    }

    const offset = (page - 1) * limit;
    const productCount = await Product.count({ where: filter });

    // nếu số lượng sản phẩm nhỏ hơn hoặc bằng 5 thì hiển thị tất cả sản phẩm không cần phân trang
    if (productCount <= 5) {
      const products = await Product.findAll({ where: filter,
        order: [["createdAt", "DESC"]],
      });
      return res.json({ products, totalProducts: productCount });
    }

    // nếu số lượng sản phẩm lớn hơn 5 thì phân trang
    const { rows: products, count: totalProducts } = await Product.findAndCountAll({
      where: filter,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    const totalPage = Math.ceil(totalProducts / limit);

    res.json({
      products,
      currentPage: parseInt(page),
      totalPage,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



  //show sản phẩm theo danh mục show lun thông tin danh mục sản phẩm
  exports.getProductsByThuongHieu = async (req, res) => {
    try {
      const products = await Product.findAll({
        where: {
          id_thuong_hieu: req.params.id,
          loai: {
            [Op.notIn]: ["Vòng Tay", "Trang Sức"],
          },
        },
      });

      const th = await ThuongHieu.findOne({ where: { _id: req.params.id } });
      res.json({ products, th });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Chi tiết sản phẩm theo id
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findOne({ where: { _id: req.params.id } });
      if (!product) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      }
      //show lun danh mục sản phẩm
      const th = await ThuongHieu.findOne({ where: { _id: product.id_thuong_hieu } });
      res.json({ product, th });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Thêm sản phẩm
  exports.addProduct = async (req, res) => {
    try {
      // Xử lý upload file
      upload.single("hinh_anh")(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });
        const {
          ten_san_pham,
          ten,
          gia_san_pham,
          gia_giam,
          mo_ta,
          ma_san_pham,
          do_chiu_nuoc,
          xuat_xu,
          gioi_tinh,
          so_luong,
          loai_may,
          loai,
          duong_kinh,
          chat_lieu_day,
          chat_lieu_vo,
          mat_kinh,
          mau_mat,
          phong_cach,
          kieu_dang,
          thuong_hieu,
          size_day,
          mau_day,
          do_dai_day,
          id_thuong_hieu: thuonghieuId,
          id_danh_muc: danhmucId,
        } = req.body;
        const hinh_anh = req.file ? req.file.originalname : "";
        // Kiểm tra danh mục
        if (!thuonghieuId || !(await ThuongHieu.findOne({ where: { _id: thuonghieuId } }))) {
          return res.status(400).json({ error: "ID thương hiệu không hợp lệ" });
        }
        if (danhmucId && !(await Cate.findOne({ where: { _id: danhmucId } }))) {
          return res.status(400).json({ error: "ID danh mục không hợp lệ" });
        }
        // Tạo và lưu sản phẩm
        const product = await Product.create({
          ten_san_pham,
          ten,
          gia_san_pham,
          gia_giam,
          hinh_anh,
          mo_ta,
          ma_san_pham,
          do_chiu_nuoc,
          xuat_xu,
          gioi_tinh,
          so_luong,
          loai_may,
          loai,
          duong_kinh,
          chat_lieu_day,
          chat_lieu_vo,
          mat_kinh,
          mau_mat,
          phong_cach,
          kieu_dang,
          thuong_hieu,
          size_day,
          mau_day,
          do_dai_day,
          id_thuong_hieu: thuonghieuId,
          id_danh_muc: danhmucId,

        });
        res.json({ product });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Xóa sản phẩm
  exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findOne({ where: { _id: req.params.id } });
      if (!product) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      }
      await product.destroy();
      res.json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //cập nhật sản phẩm
  exports.updateProduct = async (req, res) => {
    try {
      // Tìm sản phẩm theo ID
      const product = await Product.findOne({ where: { _id: req.params.id } });
      if (!product) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      }
      // Xử lý upload ảnh
      upload.single("hinh_anh")(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        const {
          ten_san_pham,
          ten,
          gia_san_pham,
          gia_giam,
          mo_ta,
          ma_san_pham,
          do_chiu_nuoc,
          xuat_xu,
          gioi_tinh,
          so_luong,
          loai_may,
          loai,
          duong_kinh,
          chat_lieu_day,
          chat_lieu_vo,
          mat_kinh,
          mau_mat,
          phong_cach,
          kieu_dang,
          thuong_hieu,
          size_day,
          mau_day,
          do_dai_day,
          id_thuong_hieu: thuonghieuId,
        } = req.body;
        const hinh_anh = req.file ? req.file.originalname : product.hinh_anh;
        // Kiểm tra thương hiệu
        if (!thuonghieuId || !(await ThuongHieu.findOne({ where: { _id: thuonghieuId } }))) {
          return res.status(400).json({ error: "ID thương hiệu không hợp lệ" });
        }
        // Cập nhật sản phẩm
        await product.update({
          ten_san_pham,
          ten,
          gia_san_pham,
          gia_giam,
          hinh_anh,
          mo_ta,
          ma_san_pham,
          do_chiu_nuoc,
          xuat_xu,
          gioi_tinh,
          so_luong,
          loai_may,
          loai,
          duong_kinh,
          chat_lieu_day,
          chat_lieu_vo,
          mat_kinh,
          mau_mat,
          phong_cach,
          kieu_dang,
          thuong_hieu,
          size_day,
          mau_day,
          do_dai_day,
          id_thuong_hieu: thuonghieuId,
        });
        res.json({ product });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //phân trang sản phẩm
  exports.getProductsByPage = async (req, res) => {
    try {
      const { page = 1, limit = 2 } = req.query;
      const products = await Product.findAndCountAll({
        limit: Number(limit),
        offset: (page - 1) * limit,
      });
      if (products.count === 0) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      res.json({ products });
    } catch (error) {
      console.error("Error fetching products:", error.message);
      res.status(500).json({ error: error.message });
    }
  };

  // Tìm kiếm sản phẩm
  exports.searchProducts = async (req, res) => {
    try {
      const { query } = req.body;
  
      // Tìm danh mục theo tên
      const th = await ThuongHieu.findAll({
        where: {
          thuong_hieu: {
            [Op.like]: `%${query}%`,
          },
        },
      });
      // Tìm sản phẩm theo tên hoặc theo danh mục
      const products = await Product.findAll({
        where: {
          [Op.or]: [
            { ten_san_pham: { [Op.like]: `%${query}%` } },
            { id_thuong_hieu: th.map((thu) => thu._id) }, // Tìm theo danh mục
          ],
        },
      });
  
      return res.json({ products });
    } catch (error) {
      console.error("Error searching products:", error);
      return res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm" });
    }
  };

//show sản phẩm liên quan theo danh mục ở trang chi tiết sản phẩm theo id show lun danh muc
exports.getRelatedProducts = async (req, res) => {
    try {
      const product = await Product.findOne({ where: { _id: req.params.id } });
      if (!product) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      }
      const products = await Product.findAll({
        where: {
          id_thuong_hieu: product.id_thuong_hieu,
          _id: {
            [Op.not]: product._id, 
          },
          loai: {
            [Op.notIn]: ["Vòng Tay", "Trang Sức"],
          }
        },
      });
      const th = await ThuongHieu.findOne({ where: { _id: product.id_thuong_hieu } });
      res.json({ products, th });
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  exports.checkProductQuantity = async (req, res) => {
    try {
      const product = await Product.findOne({ where: { _id: req.params.id } });
      if (!product) {
        return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      }
      if (product.so_luong === 0) {
        return res.status(400).json({ error: "Sản phẩm đã hết hàng" });
      }
  
      const requestedQuantity = parseInt(req.query.quantity, 10);
      if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
        return res.status(400).json({ error: "Số lượng yêu cầu không hợp lệ" });
      }
  
      if (requestedQuantity > product.so_luong) {
        return res.status(400).json({ error: "Số lượng sản phẩm không đủ" });
      }
  
      res.json({ product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
