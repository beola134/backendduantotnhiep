const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
//show tất cả bình luận
//http://localhost:5000/comment/showAll
router.get("/showAll", commentController.showAllComment);
//thêm bình luận
//http://localhost:5000/comment/add
router.post("/add", commentController.addComment);

//lấy tất cả bình luận theo _id sản phẩm
//http://localhost:5000/comment/getAll/:id_san_pham
router.get("/getAll/:id_san_pham", commentController.getAllComment);

//api ẩn hoặc hiện bình luận
//http://localhost:5000/comment/changeStatus/:id
router.put("/changeStatus/:id", commentController.toggleComment);


module.exports = router;
