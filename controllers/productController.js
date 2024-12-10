const Product = require("../models/product");
const upload = require("../config/update");
const ThuongHieu = require("../models/thuonghieu");
const { Sequelize, Op } = require("sequelize");
const { ChiTietDonHang, DonHang } = require("../models");
const Cate = require("../models/danhmuc");

// Bộ lọc sản phẩm đồng hồ
exports.filtersanphamdongho = async (req, res) => {
  try {
    const {
      gioi_tinh,
      muc_gia,
      khuyenmai,
      loai_may,
      duong_kinh,
      chat_lieu_day,
      chat_lieu_vo,
      mat_kinh,
      mau_mat,
      phong_cach,
      kieu_dang,
      xuat_xu,
      thuong_hieu,
      limit = 20,
      page = 1,
    } = req.query;
    console.log(req.query);

    let filter = {
      [Op.and]: [],
    };
    filter[Op.and].push({ id_danh_muc: null });

    if (gioi_tinh) {
      switch (gioi_tinh) {
        case "Nam":
          filter.gioi_tinh = "Nam";
          break;
        case "Nữ":
          filter.gioi_tinh = "Nữ";
          break;
        case "Đôi":
          filter.gioi_tinh = "Đôi";
          break;
        default:
          filter.gioi_tinh = gioi_tinh;
          break;
      }
    }
    if (mat_kinh) {
      switch (mat_kinh) {
        case "Sapphire":
          filter.mat_kinh = "Sapphire";
          break;
        case "Mặt kính cứng":
          filter.mat_kinh = "Mặt kính cứng";
          break;
        case "Hardlex Crystal":
          filter.mat_kinh = "Hardlex Crystal";
          break;
        case "Mica":
          filter.mat_kinh = "Mica";
          break;
        case "Kinh Nhựa":
          filter.mat_kinh = "Kinh Nhựa";
          break;
        default:
          filter.mat_kinh = mat_kinh;
          break;
      }
    }

    if (mau_mat) {
      switch (mau_mat) {
        case "Trắng":
          filter.mau_mat = "Trắng";
          break;
        case "Xám":
          filter.mau_mat = "Xám";
          break;
        case "Xanh lam":
          filter.mau_mat = "Xanh lam";
          break;
        case "Khảm trai":
          filter.mau_mat = "Khảm trai";
          break;
        case "Da Cam":
          filter.mau_mat = "Da Cam";
          break;
        case "Nâu":
          filter.mau_mat = "Nâu";
          break;
        case "Hồng":
          filter.mau_mat = "Hồng";
          break;
        case "Đen":
          filter.mau_mat = "Đen";
          break;
        case "Vàng":
          filter.mau_mat = "Vàng";
          break;
        case "Đỏ":
          filter.mau_mat = "Đỏ";
          break;
        case "Xanh Lá":
          filter.mau_mat = "Xanh Lá";
          break;
        default:
          filter.mau_mat = mau_mat;
          break;
      }
    }
    if (loai_may) {
      switch (loai_may) {
        case "Automatic":
          filter.loai_may = "Automatic (Máy cơ tự động)";
          break;
        case "Quartz":
          filter.loai_may = "Quartz (Máy pin - điện tử)";
          break;
        case "Eco-Drive":
          filter.loai_may = "Eco-Drive (Năng lượng ánh sáng)";
          break;
        case "Quartz Chronograph":
          filter.loai_may = "Quartz Chronograph (Máy pin bấm giờ thể thao)";
          break;
        case "Automatic Chronometer":
          filter.loai_may = "Automatic Chronometer (Máy cơ tự động chuẩn COSC)";
          break;
        case "Quartz Chronometer":
          filter.loai_may = "Quartz Chronometer (Máy pin chuẩn COSC)";
          break;
        case "Automatic Chronograph":
          filter.loai_may =
            "Automatic Chronograph (Máy cơ tự động bấm giờ thể thao)";
          break;
        case "Quartz Solar":
          filter.loai_may = "Quartz Solar (Năng lượng ánh sáng)";
          break;
        case "Manual winding":
          filter.loai_may = "Manual winding (Đồng hồ cơ lên dây cót bằng tay)";
          break;
        default:
          filter.loai_may = loai_may;
          break;
      }
    }

    if (duong_kinh) {
      switch (duong_kinh) {
        case "Dưới 25mm":
          filter.duong_kinh = { [Op.lt]: 25 };
          break;
        case "25mm đến 30mm":
          filter.duong_kinh = { [Op.between]: [25, 30] };
          break;
        case "30mm đến 35mm":
          filter.duong_kinh = { [Op.between]: [30, 35] };
          break;
        case "35mm đến 38mm":
          filter.duong_kinh = { [Op.between]: [35, 38] };
          break;
        case "38mm đến 40mm":
          filter.duong_kinh = { [Op.between]: [38, 40] };
          break;
        case "40mm đến 42mm":
          filter.duong_kinh = { [Op.between]: [40, 42] };
          break;
        case "42mm đến 45mm":
          filter.duong_kinh = { [Op.between]: [42, 45] };
          break;
        case "Từ 45mm trở lên":
          filter.duong_kinh = { [Op.gt]: 45 };
          break;
        default:
          break;
      }
    }
    if (chat_lieu_day) {
      switch (chat_lieu_day) {
        case "Dây da":
          filter.chat_lieu_day = "Dây da";
          break;
        case "Thép không gỉ 316L mạ vàng công nghệ PVD":
          filter.chat_lieu_day = "Thép không gỉ 316L mạ vàng công nghệ PVD";
          break;
        case "Thép không gỉ 316L dạng lưới":
          filter.chat_lieu_day = "Thép không gỉ 316L dạng lưới";
          break;
        case "Thép không gỉ 316L dạng lắc":
          filter.chat_lieu_day = "Thép không gỉ 316L dạng lắc";
          break;
        case "Dây vải":
          filter.chat_lieu_day = "Dây vải";
          break;
        case "Thép không gỉ 316L/ Vàng 18K":
          filter.chat_lieu_day = "Thép không gỉ 316L/ Vàng 18K";
          break;
        case "Thép không gỉ 316L/ Ceramic":
          filter.chat_lieu_day = "Thép không gỉ 316L/ Ceramic";
          break;
        case "Dây cao su":
          filter.chat_lieu_day = "Dây cao su";
          break;
        case "Dây dù":
          filter.chat_lieu_day = "Dây dù";
          break;
        case "Thép không gỉ 316L":
          filter.chat_lieu_day = "Thép không gỉ 316L";
          break;
        case "Thép không gỉ mạ công nghệ PVD":
          filter.chat_lieu_day = "Thép không gỉ mạ công nghệ PVD";
          break;
        case "Titanium":
          filter.chat_lieu_day = "Titanium";
          break;
        case "Titanium mạ vàng công nghệ PVD":
          filter.chat_lieu_day = "Titanium mạ vàng công nghệ PVD";
          break;
        case "Nhựa":
          filter.chat_lieu_day = "Nhựa";
          break;
        default:
          filter.chat_lieu_day = chat_lieu_day;
          break;
      }
    }
    if (chat_lieu_vo) {
      filter.chat_lieu_vo = chat_lieu_vo;
    }
    if (mat_kinh) {
      switch (mat_kinh) {
        case "Sapphire":
          filter.mat_kinh = "Sapphire";
          break;
        case "Mặt kính cứng":
          filter.mat_kinh = "Mặt kính cứng";
          break;
        case "Hardlex Crystal":
          filter.mat_kinh = "Hardlex Crystal";
          break;
        case "Mica":
          filter.mat_kinh = "Mica";
          break;
        case "Kinh Nhựa":
          filter.mat_kinh = "Kinh Nhựa";
          break;
        default:
          filter.mat_kinh = mat_kinh;
          break;
      }
      filter.mat_kinh = mat_kinh;
    }
    if (mau_mat) {
      switch (mau_mat) {
        case "Trắng":
          filter.mau_mat = "Trắng";
          break;
        case "Xám":
          filter.mau_mat = "Xám";
          break;
        case "Xanh lam":
          filter.mau_mat = "Xanh lam";
          break;
        case "Khảm trai":
          filter.mau_mat = "Khảm trai";
          break;
        case "Da Cam":
          filter.mau_mat = "Da Cam";
          break;
        case "Nâu":
          filter.mau_mat = "Nâu";
          break;
        case "Hồng":
          filter.mau_mat = "Hồng";
          break;
        case "Đen":
          filter.mau_mat = "Đen";
          break;
        case "Vàng":
          filter.mau_mat = "Vàng";
          break;
        case "Đỏ":
          filter.mau_mat = "Đỏ";
          break;
        case "Xanh Lá":
          filter.mau_mat = "Xanh Lá";
          break;
        default:
          filter.mau_mat = mau_mat;
          break;
      }
    }
    if (phong_cach) {
      switch (phong_cach) {
        case "Sang trọng":
          filter.phong_cach = "Sang trọng";
          break;
        case "Thể thao":
          filter.phong_cach = "Thể thao";
          break;
        case "Thể thao sang trọng":
          filter.phong_cach = "Thể thao sang trọng";
          break;
        case "Quân đội":
          filter.phong_cach = "Quân đội";
          break;
        case "Thời trang":
          filter.phong_cach = "Thời trang";
          break;
        case "Hiện đại":
          filter.phong_cach = "Hiện đại";
          break;
        default:
          filter.phong_cach = phong_cach;
          break;
      }
    }
    if (kieu_dang) {
      switch (kieu_dang) {
        case "Mặt vuông":
          filter.kieu_dang = "Mặt vuông";
          break;
        case "Mặt tròn":
          filter.kieu_dang = "Mặt tròn";
          break;
        case "Mặt chữ nhật":
          filter.kieu_dang = "Mặt chữ nhật";
          break;
        case "Mặt Oval":
          filter.kieu_dang = "Mặt Oval";
          break;
        default:
          filter.kieu_dang = kieu_dang;
          break;
      }
    }
    if (xuat_xu) {
      switch (xuat_xu) {
        case "Nhật Bản":
          filter.xuat_xu = "Nhật Bản";
          break;
        case "Mỹ":
          filter.xuat_xu = "Mỹ";
          break;
        default:
          filter.xuat_xu = xuat_xu;
          break;
      }
    }
    if (thuong_hieu) {
      const thuonghieu = await ThuongHieu.findOne({
        where: { thuong_hieu: thuong_hieu },
      });
      console.log("ThuongHieu result", thuonghieu);
      if (thuonghieu) {
        filter.id_thuong_hieu = thuonghieu._id;
      } else {
        return res.status(404).json({ message: "Thương hiệu không tồn tại" });
      }
    }
    if (muc_gia) {
      let priceRange;
      switch (muc_gia) {
        case "Dưới 2 triệu":
          priceRange = { [Op.lt]: 2000000 };
          break;
        case "Từ 2 triệu đến 5 triệu":
          priceRange = { [Op.between]: [2000000, 5000000] };
          break;
        case "Từ 5 triệu đến 10 triệu":
          priceRange = { [Op.between]: [5000000, 10000000] };
          break;
        case "Từ 10 triệu đến 20 triệu":
          priceRange = { [Op.between]: [10000000, 20000000] };
          break;
        case "Từ 20 triệu đến 30 triệu":
          priceRange = { [Op.between]: [20000000, 30000000] };
          break;
        case "Từ 30 triệu đến 50 triệu":
          priceRange = { [Op.between]: [30000000, 50000000] };
          break;
        case "Từ 50 triệu đến 100 triệu":
          priceRange = { [Op.between]: [50000000, 100000000] };
          break;
        case "Trên 100 triệu":
          priceRange = { [Op.gte]: 100000000 };
          break;
        default:
          priceRange = null;
          break;
      }
      if (priceRange) {
        filter[Op.or] = [
          {
            gia_giam: { ...priceRange, [Op.gt]: 0 },
          },
          {
            [Op.and]: [
              {
                gia_giam: {
                  [Op.or]: [0, null],
                },
              },
              {
                gia_san_pham: priceRange,
              },
            ],
          },
        ];
      }
    }
    if (khuyenmai) {
      const discount = req.query.khuyenmai
        .replace("Giảm ", "")
        .replace("%", "");
      filter[Op.and].push(
        { gia_giam: { [Op.ne]: null } },
        { gia_giam: { [Op.ne]: 0 } },
        Sequelize.literal(
          `ROUND(((gia_san_pham - gia_giam) / gia_san_pham ) * 100, 0) = ${discount}`
        )
      );
    }
    const productsCount = await Product.count({ where: filter });
    //sp nhỏ hơn = 20nthif không phần trang
    if (productsCount <= 20) {
      const products = await Product.findAll({ where: filter });
      return res.json({ products, totalProducts: productsCount });
    }
    //nếu sp lớn 20 thì phân trang
    const offset = (page - 1) * limit;
    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: filter,
        limit,
        offset,
      });
    // hàm nếu sp lớn hơn thì phân trang
    const totalPages = Math.ceil(totalProducts / limit);
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

// API lấy danh sách sản phẩm với phân trang, lọc, tìm kiếm và tình trạng hàng hóa
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const searchCondition = search
      ? { ten_san_pham: { [Op.like]: `%${search}%` } }
      : {};

    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: searchCondition,
        offset,
        limit: parseInt(limit),
        attributes: [
          "_id",
          "hinh_anh",
          "ten_san_pham",
          "hinh_anh",
          "ma_san_pham",
          "so_luong",
          "gia_san_pham",
        ],
      });

    const productsWithSales = await Promise.all(
      products.map(async (product) => {
        const soldQuantity = await ChiTietDonHang.sum("so_luong", {
          where: {
            id_san_pham: product._id,
          },
          include: {
            model: DonHang,
            where: { trang_thai: "Giao hàng thành công" },
          },
        });

        return {
          ...product.dataValues,
          da_ban: soldQuantity || 0,
          trang_thai: product.so_luong > 0 ? "Còn hàng" : "Hết hàng",
        };
      })
    );

    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      currentPage: parseInt(page),
      totalPages,
      totalProducts,
      products: productsWithSales,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// xử lí lọc them dây đồng hồ
exports.filterDayDongHo = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Cate.findOne({
      where: { _id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    const {
      size_day,
      mau_day,
      thuong_hieu,
      chat_lieu_day,
      limit = 20,
      page = 1,
    } = req.query;
    console.log(req.query);

    let filter = {
      [Op.and]: [{ id_danh_muc: category._id }],
    };
    if (size_day) {
      switch (size_day) {
        case "Size 26-24mm":
          filter.size_day = { [Op.between]: [24, 26] };
          break;
        case "Size 26-22mm":
          filter.size_day = { [Op.between]: [22, 26] };
          break;
        case "Size 24-22mm":
          filter.size_day = { [Op.between]: [22, 24] };
          break;
        case "Size 24-20mm":
          filter.size_day = { [Op.between]: [20, 24] };
          break;
        case "Size 22-20mm":
          filter.size_day = { [Op.between]: [20, 22] };
          break;
        case "Size 21-18mm":
          filter.size_day = { [Op.between]: [18, 21] };
          break;
        case "Size 20-18mm":
          filter.size_day = { [Op.between]: [18, 20] };
          break;
        case "Size 19-18mm":
          filter.size_day = { [Op.between]: [18, 19] };
          break;
        case "Size 18-16mm":
          filter.size_day = { [Op.between]: [16, 18] };
          break;
        case "Size 16-14mm":
          filter.size_day = { [Op.between]: [14, 16] };
          break;
        case "Size 14-12mm":
          filter.size_day = { [Op.between]: [12, 14] };
          break;
        case "Size 12-10mm":
          filter.size_day = { [Op.between]: [10, 12] };
          break;
        default:
          filter.size_day = size_day;
          break;
      }
    }

    if (mau_day) {
      switch (mau_day) {
        case "Nâu (Brown)":
          filter.mau_day = "Nâu";
          break;
        case "Nâu (Tan)":
          filter.mau_day = "Nâu (Tan)";
          break;
        case "Xanh (Green)":
          filter.mau_day = "Xanh Lá";
          break;
        case "Xanh (Navy)":
          filter.mau_day = "Xanh (Navy)";
          break;
        case "Đen":
          filter.mau_day = "Đen";
          break;
        default:
          filter.mau_day = mau_day;
          break;
      }
    }
    if (thuong_hieu) {
      switch (thuong_hieu) {
        case "ZRC-Rochet":
          filter.thuong_hieu = "ZRC-Rochet";
          break;
        case "Longines":
          filter.thuong_hieu = "Longines";
          break;
        case "Seiko":
          filter.thuong_hieu = "Seiko";
          break;
        case "Tissot":
          filter.thuong_hieu = "Tissot";
          break;
        case "Daniel Wellington":
          filter.thuong_hieu = "Daniel Wellington";
          break;
        default:
          filter.thuong_hieu = thuong_hieu;
          break;
      }
    }
    if (chat_lieu_day) {
      switch (chat_lieu_day) {
        case "Dây cao su":
          filter.chat_lieu_day = "Dây cao su";
          break;
        case "Dây da":
          filter.chat_lieu_day = "Dây da";
          break;
        case "Dây Silicone":
          filter.chat_lieu_day = "Dây Silicone";
          break;
        case "Dây dù":
          filter.chat_lieu_day = "Dây dù";
          break;
        default:
          filter.chat_lieu_day = chat_lieu_day;
          break;
      }
    }
    const productsCount = await Product.count({ where: filter });
    //sp nhỏ hơn = 20nthif không phần trang
    if (productsCount <= 20) {
      const products = await Product.findAll({ where: filter });
      return res.json({ products, totalProducts: productsCount });
    }
    //nếu sp lớn 20 thì phân trang
    const offset = (page - 1) * limit;
    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: filter,
        limit,
        offset,
      });
    // hàm nếu sp lớn hơn thì phân trang
    const totalPages = Math.ceil(totalProducts / limit);
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};
// xử lí lọc them đồng hồ để bàn
exports.filterDeBan = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Cate.findOne({
      where: { _id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    const { thuong_hieu, chat_lieu_vo, limit = 20, page = 1 } = req.query;
    console.log(req.query);

    let filter = {
      [Op.and]: [{ id_danh_muc: category._id }],
    };

    if (thuong_hieu) {
      switch (thuong_hieu) {
        case "SEIKO":
          filter.thuong_hieu = "SEIKO";
          break;
        case "RHYTHM":
          filter.thuong_hieu = "RHYTHM";
          break;
        default:
          filter.thuong_hieu = thuong_hieu;
          break;
      }
    }
    if (chat_lieu_vo) {
      switch (chat_lieu_vo) {
        case "Nhựa":
          filter.chat_lieu_vo = "Nhựa";
          break;
        case "Gỗ tự nhiên":
          filter.chat_lieu_vo = "Gỗ tự nhiên";
          break;
        case "Nhôm":
          filter.chat_lieu_vo = "Nhôm";
          break;
        case "Gỗ":
          filter.chat_lieu_vo = "Gỗ";
          break;
        default:
          filter.chat_lieu_vo = chat_lieu_vo;
          break;
      }
    }
    const productsCount = await Product.count({ where: filter });
    //sp nhỏ hơn = 20nthif không phần trang
    if (productsCount <= 20) {
      const products = await Product.findAll({ where: filter });
      return res.json({ products, totalProducts: productsCount });
    }
    //nếu sp lớn 20 thì phân trang
    const offset = (page - 1) * limit;
    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: filter,
        limit,
        offset,
      });
    // hàm nếu sp lớn hơn thì phân trang
    const totalPages = Math.ceil(totalProducts / limit);
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

// xử lí lọc them đồng hồ báo thức
exports.filterBaoThuc = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Cate.findOne({
      where: { _id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    const { thuong_hieu, chat_lieu_vo, limit = 20, page = 1 } = req.query;
    console.log(req.query);
    let filter = {
      [Op.and]: [{ id_danh_muc: category._id }],
    };

    if (thuong_hieu) {
      switch (thuong_hieu) {
        case "SEIKO":
          filter.thuong_hieu = "SEIKO";
          break;
        case "RHYTHM":
          filter.thuong_hieu = "RHYTHM";
          break;
        default:
          filter.thuong_hieu = thuong_hieu;
          break;
      }
    }
    if (chat_lieu_vo) {
      switch (chat_lieu_vo) {
        case "Nhựa":
          filter.chat_lieu_vo = "Nhựa";
          break;
        case "Nhôm":
          filter.chat_lieu_vo = "Nhôm";
          break;
        default:
          filter.chat_lieu_vo = chat_lieu_vo;
          break;
      }
    }
    const productsCount = await Product.count({ where: filter });
    //sp nhỏ hơn = 20nthif không phần trang
    if (productsCount <= 20) {
      const products = await Product.findAll({ where: filter });
      return res.json({ products, totalProducts: productsCount });
    }
    //nếu sp lớn 20 thì phân trang
    const offset = (page - 1) * limit;
    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: filter,
        limit,
        offset,
      });
    // hàm nếu sp lớn hơn thì phân trang
    const totalPages = Math.ceil(totalProducts / limit);
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

// xử lí lọc them đồng hồ TREO TƯỜNG
exports.filterTreoTuong = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Cate.findOne({
      where: { _id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    const {
      thuong_hieu,
      muc_gia,
      chat_lieu_vo,
      kieu_dang,
      mau_mat,
      phong_cach,
      limit = 20,
      page = 1,
    } = req.query;
    console.log(req.query);

    let filter = {
      [Op.and]: [{ id_danh_muc: category._id }],
    };

    if (thuong_hieu) {
      switch (thuong_hieu) {
        case "SEIKO":
          filter.thuong_hieu = "SEIKO";
          break;
        case "RHYTHM":
          filter.thuong_hieu = "RHYTHM";
          break;
        default:
          filter.thuong_hieu = thuong_hieu;
          break;
      }
    }
    if (muc_gia) {
      let priceRange;
      switch (muc_gia) {
        case "Dưới 2 triệu":
          priceRange = { [Op.lt]: 2000000 };
          break;
        case "Từ 2 triệu đến 5 triệu":
          priceRange = { [Op.between]: [2000000, 5000000] };
          break;
        case "Trên 5 triệu":
          priceRange = { [Op.gte]: 5000000 };
          break;
        default:
          priceRange = null;
          break;
      }
      if (priceRange) {
        filter[Op.or] = [
          {
            gia_giam: { ...priceRange, [Op.gt]: 0 },
          },
          {
            [Op.and]: [
              {
                gia_giam: {
                  [Op.or]: [0, null],
                },
              },
              {
                gia_san_pham: priceRange,
              },
            ],
          },
        ];
      }
    }
    if (chat_lieu_vo) {
      switch (chat_lieu_vo) {
        case "Thủy Tinh":
          filter.chat_lieu_vo = "Thủy Tinh";
          break;
        case "Nhựa":
          filter.chat_lieu_vo = "Nhựa";
          break;
        case "Gỗ":
          filter.chat_lieu_vo = "Gỗ";
          break;
        default:
          filter.chat_lieu_vo = chat_lieu_vo;
          break;
      }
    }
    if (kieu_dang) {
      switch (kieu_dang) {
        case "Mặt vuông":
          filter.kieu_dang = "Mặt vuông";
          break;
        case "Mặt tròn":
          filter.kieu_dang = "Mặt tròn";
          break;
        case "Mặt chữ nhật":
          filter.kieu_dang = "Mặt chữ nhật";
          break;
        case "Mặt Oval":
          filter.kieu_dang = "Mặt Oval";
          break;
        default:
          filter.kieu_dang = kieu_dang;
          break;
      }
    }
    if (mau_mat) {
      switch (mau_mat) {
        case "Trắng":
          filter.mau_mat = "Trắng";
          break;
        case "Đen":
          filter.mau_mat = "Đen";
          break;
        case "Xanh lam":
          filter.mau_mat = "Xanh lam";
          break;
        case "Vàng":
          filter.mau_mat = "Vàng";
          break;
        case "Đỏ":
          filter.mau_mat = "Đỏ";
          break;
        case "Nâu":
          filter.mau_mat = "Nâu";
          break;
        default:
          filter.mau_mat = mau_mat;
          break;
      }
    }
    if (phong_cach) {
      switch (phong_cach) {
        case "Quả Lắc":
          filter.phong_cach = "Quả Lắc";
          break;
        default:
          filter.phong_cach = phong_cach;
          break;
      }
    }
    const productsCount = await Product.count({ where: filter });
    //sp nhỏ hơn = 20nthif không phần trang
    if (productsCount <= 20) {
      const products = await Product.findAll({ where: filter });
      return res.json({ products, totalProducts: productsCount });
    }
    //nếu sp lớn 20 thì phân trang
    const offset = (page - 1) * limit;
    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: filter,
        limit,
        offset,
      });
    // hàm nếu sp lớn hơn thì phân trang
    const totalPages = Math.ceil(totalProducts / limit);
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};
// show sản phẩm mới nhất Nam
exports.getNewProductsMale = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        gioi_tinh: "Nam",
        id_danh_muc: null,
      },
      order: [["createdAt", "DESC"]],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// show sản phẩm mới nhất nu
exports.getNewProductsFeMale = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        gioi_tinh: "Nữ",
        id_danh_muc: null,
      },
      order: [["createdAt", "DESC"]],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// show sản phẩm mới nhất Đôi
exports.getNewProductsCouple = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        gioi_tinh: "Đồng Hồ Đôi",
        id_danh_muc: null,
      },
      order: [["createdAt", "DESC"]],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// show sản phẩm mới nhất Nam giới hạn 10 sp
exports.getNewLimitMale = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        gioi_tinh: "Nam",
        id_danh_muc: null,
      },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// show sản phẩm mới nhất nu giới hạn 10 sp
exports.getNewLimitFeMale = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        gioi_tinh: "Nữ",
        id_danh_muc: null,
      },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// show sản phẩm mới nhất Đôi giới hạn 10 sp
exports.getNewLimitCouple = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        gioi_tinh: "Đồng Hồ Đôi",
        id_danh_muc: null,
      },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh mục theo giới tính "Nam"
exports.getMale = async (req, res) => {
  try {
    let { limit = 20, page = 1 } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
      return res.status(400).json({ message: "Itham số không hợp lệ" });
    }
    const offset = (page - 1) * limit;

    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: { gioi_tinh: "Nam", id_danh_muc: null },
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });
    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    const totalPages = Math.ceil(totalProducts / limit);
    if (page > totalPages) {
      return res.status(404).json({ message: "Trang không tồn tại" });
    }
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh mục theo giới tính "Nam" 10sp
exports.getMale10sp = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { gioi_tinh: "Nam", id_danh_muc: null },
      limit: 10,
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh mục theo giới tính "Nữ"
exports.getFeMale = async (req, res) => {
  try {
    let { limit = 20, page = 1 } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
      return res.status(400).json({ message: "Itham số không hợp lệ" });
    }
    const offset = (page - 1) * limit;
    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: {
          gioi_tinh: "Nữ",
          id_danh_muc: null,
        },
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });
    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    const totalPages = Math.ceil(totalProducts / limit);
    if (page > totalPages) {
      return res.status(404).json({ message: "Trang không tồn tại" });
    }
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh mục theo giới tính "Nữ"10sp
exports.getFeMale10sp = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        gioi_tinh: "Nữ",
        id_danh_muc: null,
      },
      limit: 10,
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh mục theo "Đôi"
exports.getCouple = async (req, res) => {
  try {
    let { limit = 20, page = 1 } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
      return res.status(400).json({ message: "Itham số không hợp lệ" });
    }
    const offset = (page - 1) * limit;
    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where: { gioi_tinh: "Đồng Hồ Đôi", id_danh_muc: null },
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });
    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    const totalPages = Math.ceil(totalProducts / limit);
    if (page > totalPages) {
      return res.status(404).json({ message: "Trang không tồn tại" });
    }
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh mục theo giới tính "đồng hồ đôi"
exports.getCouple10sp = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { gioi_tinh: "Đồng Hồ Đôi", id_danh_muc: null },
      limit: 10,
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy lọc theo Đồng hồ báo Thức
exports.getBaoThuc = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { loai: "Đồng hồ báo thức" },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy lọc theo Đồng hồ để bàn
exports.getDeBan = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { loai: "Đồng hồ để bàn" },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy lọc theo Đồng hồ treo tường
exports.getTreoTuong = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { loai: "Đồng hồ treo tường" },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh mục theo xuatxuTS
exports.getXuatXuTS = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        xuat_xu: "Thụy Sỹ",
        id_danh_muc: null,
      },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Lấy danh mục theo xuatxuTD
exports.getXuatXuTD = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        xuat_xu: "Thụy Điển",
        id_danh_muc: null,
      },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Lấy danh mục theo xuatxuNB
exports.getXuatXuNB = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        xuat_xu: "Nhật Bản",
        id_danh_muc: null,
      },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Lấy danh mục theo xuatxuMy
exports.getXuatXuMy = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { xuat_xu: "Mỹ", id_danh_muc: null },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Show sản phẩm theo id   vòng tay trang sức
exports.getProductByCate = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findAll({
      where: {
        id_danh_muc: id,
      },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
