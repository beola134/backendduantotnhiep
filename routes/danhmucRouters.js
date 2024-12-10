const express = require("express");
const router = express.Router();
const danhmucController = require("../controllers/danhmucController");

///tất cả các api liên quan đến danh mục
//show tất cả danh mục
//http://localhost:5000/cate/allcate
router.get("/allcate", danhmucController.getAlldk);

//show danh mục theo id
//http://localhost:5000/cate/allcate/:id
router.get("/allcate/:id", danhmucController.getCateById);

//thêm danh mục
//http://localhost:5000/cate/addcate
router.post("/addcate", danhmucController.addCate);

//xóa danh mục
//http://localhost:5000/cate/deletecate/:id", danhmucController.deleteCate);
router.delete("/deletecate/:id", danhmucController.deleteCate);

//sửa danh mục
//http://localhost:5000/cate/updatecate/:id", danhmucController.updateCate);
router.put("/updatecate/:id", danhmucController.updateCate);

////////////////////////////////header//////////////////////
//http://localhost:5000/cate/danhmuc
router.get('/danhmuc', danhmucController.getdanhmuc);

//getSanPhamKhac
//http://localhost:5000/cate/getSanPhamKhac
router.get('/getSanPhamKhac', danhmucController.getSanPhamKhac);
module.exports = router;