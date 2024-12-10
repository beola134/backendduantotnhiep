const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

//show trạng thái của sản phẩm
//http://localhost:5000/product/getProducts
router.get("/getProducts", productController.getProducts);

//bộ lọc sản phẩm đồng hồ
//http://localhost:5000/product/filtersanphamdongho
router.get("/filtersanphamdongho", productController.filtersanphamdongho);

//show sản phẩm mới nhất theo gioi_tinh nam limit 10
//http://localhost:5000/product/limit/gioitinh-nam
router.get("/limit/gioitinh-nam", productController.getNewLimitMale);

//show sản phẩm mới nhất theo gioi_tinh nam
//http://localhost:5000/product/new/gioitinh-nam
router.get("/new/gioitinh-nam", productController.getNewProductsMale);

//show sản phẩm theo giới tính nam
//http://localhost:5000/product/allsp/gioitinh-nam
router.get("/allsp/gioitinh-nam", productController.getMale);

//show sản phẩm theo giới tính nam10sp
//http://localhost:5000/product/allsp/gioitinh-nam10sp
router.get("/allsp/gioitinh-nam10sp", productController.getMale10sp);

//show sản phẩm mới nhất theo gioi_tinh nu limit 10
//http://localhost:5000/product/limit/gioitinh-nu
router.get("/limit/gioitinh-nu", productController.getNewLimitFeMale);

//show sản phẩm mới nhất theo gioi_tinh nữ
//http://localhost:5000/product/new/gioitinh-nu
router.get("/new/gioitinh-nu", productController.getNewProductsFeMale);

//show sản phẩm theo giới tính nữ
//http://localhost:5000/product/allsp/gioitinh-nu
router.get("/allsp/gioitinh-nu", productController.getFeMale);

//show sản phẩm theo giới tính nu10sp
//http://localhost:5000/product/allsp/gioitinh-nu10sp
router.get("/allsp/gioitinh-nu10sp", productController.getFeMale10sp);

//http://localhost:5000/product/allsp/doi
router.get("/allsp/doi", productController.getCouple);

//http://localhost:5000/product/allsp/doi10sp"
router.get("/allsp/doi10sp", productController.getCouple10sp);

//show sản phẩm mới nhất theo gioi_tinh doi limit 10
//http://localhost:5000/product/limit/doi
router.get("/limit/doi", productController.getNewLimitCouple);

//show sản phẩm mới nhất theo doi
//http://localhost:5000/product/new/doi
router.get("/new/doi", productController.getNewProductsCouple);

// show sản phẩm theo dây đồng hồ
//http://localhost:5000/product/filterDayDongHo"
router.get("/filterDayDongHo/:categoryId", productController.filterDayDongHo);

// show sản phẩm theo đồng hồ để bàn
//http://localhost:5000/product/filterDeBan"
router.get("/filterDeBan/:categoryId", productController.filterDeBan);

// show sản phẩm theo đồng hồ báo thức
//http://localhost:5000/product/filterBaoThuc"
router.get("/filterBaoThuc/:categoryId", productController.filterBaoThuc);

// show sản phẩm theo đồng hồ treo tuong
//http://localhost:5000/product/filterTreoTuong"
router.get("/filterTreoTuong/:categoryId", productController.filterTreoTuong);

// show sản phẩm thêm Xuất xứ TS
//http://localhost:5000/product/allsp/getXuatXuTS"
router.get("/allsp/getXuatXuTS", productController.getXuatXuTS);

// show sản phẩm thêm Xuất xứ TD
//http://localhost:5000/product/allsp/getXuatXuTD"
router.get("/allsp/getXuatXuTD", productController.getXuatXuTD);

// show sản phẩm thêm Xuất xứ NB
//http://localhost:5000/product/allsp/getXuatXuNB"
router.get("/allsp/getXuatXuNB", productController.getXuatXuNB);

// show sản phẩm thêm Xuất xứ Mỹ
//http://localhost:5000/product/allsp/getXuatXuMy"
router.get("/allsp/getXuatXuMy", productController.getXuatXuMy);


//http://localhost:5000/product/getProductByCate/:id
router.get("/getProductByCate/:id", productController.getProductByCate);

module.exports = router;
