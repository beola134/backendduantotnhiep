const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");
const upload = require("../config/update");
const crypto = require("crypto");
const googleLogin = require("../controllers/logingoogleController");



// thêm người dùng
//http://localhost:5000/users/addUser
router.post("/addUser", usersController.addUser);

// Lấy thông tin người dùng theo id
//http://localhost:5000/users/:id
router.get("/:id", usersController.getUserById);

//show tất cả người dùng
//http://localhost:5000/users
router.get("/", usersController.getAllUsers);

// Đăng ký tài khoản
//http://localhost:5000/users/register
router.post("/register", usersController.register);

//kiểm tra mã otp có đúng không
//http://localhost:5000/users/verifyotp
router.post("/verifyotp", usersController.verifyOtp);

// Đăng nhập tài khoản
//http://localhost:5000/users/login
// {
//     "email": "nguyentai12a72122@gmail.com",
//     "mat_khau": "1111111111"
// }
router.post("/login", usersController.login);

//quên mật khẩu
//http://localhost:5000/users/forgotpassword
router.post("/forgotpassword", usersController.forgotPassword);

//đặt lại mật khẩu
//http://localhost:5000/users/resetpassword/:resetToken
router.put("/resetpassword/:resetToken", usersController.resetPassword);

//đổi mật khẩu
//http://localhost:5000/users/changepassword
router.put("/changepassword", usersController.changePassword);

//cap nhat thong tin nguoi dung
//http://localhost:5000/users/update/:id
router.put("/update/:id", upload.single("hinh_anh"), usersController.updateUser);

//api gửi mã về số điện thoại
//http://localhost:5000/users/sendotp
// router.post('/sendotp', usersController.sendOTP);

//api đăng nhập bằng google
//http://localhost:5000/users/auth/google
router.post("/auth/google", googleLogin.googleLogin);

//xóa người dùng
//http://localhost:5000/users/delete/:id
router.delete("/delete/:id", usersController.deleteUser);

//api quên mật khẩu gửi mã otp
//http://localhost:5000/users/sendOTPquenmk
router.post("/sendOTPquenmk", usersController.sendOTPquenmk);
//api đổi mật khẩu quên mật khẩu resetPasswordByOTP
//http://localhost:5000/users/resetPasswordByOTP
router.post("/resetPasswordByOTP", usersController.resetPasswordByOTP);
module.exports = router;
