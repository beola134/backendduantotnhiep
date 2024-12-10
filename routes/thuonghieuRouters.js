const express = require("express");
const router = express.Router();
const thuonghieuController = require("../controllers/thuonghieuController");
//test sua lôi push cho son
//test sua loi push cho son 2

//show tất cả thương hiệu
//http://localhost:5000/cate/allcate
router.get("/allcate", thuonghieuController.getAllCates);

//show tất cả cate
//http://localhost:5000/thuonghieu/allthuonghieu
router.get("/allthuonghieu", thuonghieuController.getAllThuongHieu);

//show cate theo id
//http://localhost:5000/thuonghieu/allthuonghieu/:id
router.get("/allthuonghieu/:id", thuonghieuController.getthuonghieuById);

//thêm danh mục
//http://localhost:5000/thuonghieu/addThuongHieu
router.post("/addThuongHieu", thuonghieuController.addThuongHieu);

//xóa danh mục
//http://localhost:5000/thuonghieu/delete
router.delete("/delete/:id", thuonghieuController.deletethuonghieu);

//sửa danh mục
//http://localhost:5000/thuonghieu/updatethuonghieu
router.put("/updatethuonghieu/:id", thuonghieuController.updateThuongHieu);


module.exports = router;
