const express = require("express");
const router = express.Router();
const productController = require("../controllers/spController");

//show tất cả sản phẩm
//http://localhost:5000/product/allsp
router.get("/allsp", productController.getAllProducts);

//show sản phẩm theo thuong hieu
//http://localhost:5000/product/thuonghieu/:id
router.get("/thuonghieu/:id", productController.getProductsByThuongHieu);

//chi tiết sản phẩm theo id
//http://localhost:5000/product/chitietsp/:id
router.get("/chitietsp/:id", productController.getProductById);

//thêm sản phẩm
//http://localhost:5000/product/themsp
router.post("/themsp", productController.addProduct);

//xóa sản phẩm
//http://localhost:5000/product/xoasp/:id
router.delete("/xoasp/:id", productController.deleteProduct);

//sửa sản phẩm
//http://localhost:5000/product/capnhatsp/:id
router.put("/capnhatsp/:id", productController.updateProduct);

//phân trang sản phẩm
//http://localhost:5000/product/phantrang?page=1&limit=5
router.get("/phantrang", productController.getProductsByPage);

//api tìm kiếm sản phẩm bằng cách nhập tên sản phẩm và tên danh mục
//http://localhost:5000/product/timkiem
router.post("/timkiem", productController.searchProducts);

//show sản phẩm liên quan theo danh mục ở trang chi tiết sản phẩm theo id show lun danh muc
//http://localhost:5000/product/related/:id
router.get("/related/:id", productController.getRelatedProducts);

//kiểm tra số lượng sản phẩm còn lại
//http://localhost:5000/product/check/:id
router.get("/check/:id", productController.checkProductQuantity);

module.exports = router;
