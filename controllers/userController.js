const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../config/update");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize"); // Import Op từ Sequelize
require("dotenv").config();


// API lấy thông tin người dùng theo id
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// API lấy thông tin tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpire = Date.now() + 2 * 60 * 1000;
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(resetPasswordExpire); //
    await user.save();

    const resetUrl = `http://localhost:3000/users/resetpassword/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "watchwristly@gmail.com",
        pass: "nebb uwva xdvb rvih",
      },
    });

    const mailOptions = {
      from: "nguyentantai612004@gmail.com",
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `
          <div style="border: 1px solid #ddd; padding: 20px; margin: 20px auto; max-width: 600px; border-radius: 10px;">
                  <div style="text-align: center;">
                  <img src="https://nhaantoan.com/wp-content/uploads/2017/02/reset-password.png" alt="GitLab" width="50" />
                  <h2>Xin chào, ${user.ten_dang_nhap}!</h2>
                  <p>Ai đó (có thể là bạn) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                  <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
                  <p>Nếu không, nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
                  <a href="${resetUrl}" style="padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
          </div>
          <div style="margin-top: 20px; text-align: center;">
                    <p>Mọi người đều có thể đóng góp</p>
                    <a href="https://about.gitlab.com/">GitLab Blog</a> · 
                    <a href="https://twitter.com/gitlab">Twitter</a> · 
                    <a href="https://facebook.com/gitlab">Facebook</a> · 
                    <a href="https://linkedin.com/company/gitlab">LinkedIn</a>
          </div>
      </div>

                  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi gửi email:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      console.log("Email đã được gửi: " + info.response);
      res.status(200).json({ message: "Email đã được gửi" });
    });
  } catch (error) {
    console.error("Lỗi máy chủ:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Đặt lại mật khẩu bằng email
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    const user = await Users.findOne({
      where: {
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    const { mat_khau } = req.body;
    if (!mat_khau) {
      return res.status(400).json({ message: "Mật khẩu không được để trống" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(mat_khau, salt);
    user.mat_khau = hashPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi máy chủ:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// login tài khoản bằng email và mật khẩu
exports.login = async (req, res) => {
  try {
    const { email, mat_khau } = req.body;
    // Kiểm tra xem email có tồn tại hay không
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }
    // Kiểm tra xem tài khoản có bị khóa không
    if (user.lock_until && user.lock_until > new Date()) {
      const remainingTime = Math.ceil((user.lock_until - new Date()) / 1000 / 60); 
      return res.status(400).json({
        message: `Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau ${remainingTime} phút.`,
      });
    }
    // Kiểm tra mật khẩu
    const validPass = await bcrypt.compare(mat_khau, user.mat_khau);
    if (!validPass) {
      // Tăng số lần thử đăng nhập thất bại
      user.login_attempts += 1;
      // Nếu quá số lần cho phép thì khóa tài khoản
      const maxLoginAttempts = 3; // Giới hạn số lần thử sai
      // Thời gian khóa là 60 giây
      const lockTime = 2 * 60 * 1000; // 2 phút
      // Nếu số lần thử đăng nhập vượt quá giới 
      if (user.login_attempts >= maxLoginAttempts) {
        user.lock_until = new Date(Date.now() + lockTime);
        await user.save();
      }
      await user.save();
      return res.status(400).json({ message: "Mật khẩu không hợp lệ" });
    }
    // Đặt lại số lần thử đăng nhập khi đăng nhập thành công
    user.login_attempts = 0;
    user.lock_until = null;
    await user.save();
    // Tạo token
    const token = jwt.sign({ _id: user._id, quyen: user.quyen }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    // Cài đặt cookie chứa token
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
    });
    // Thông tin người dùng trả về
    const userInfo = {
      _id: user._id,
      ten_dang_nhap: user.ten_dang_nhap,
      ho_ten: user.ho_ten,
      email: user.email,
      dia_chi: user.dia_chi,
      dien_thoai: user.dien_thoai,
      hinh_anh: user.hinh_anh,
      quyen: user.quyen,
    };
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: userInfo,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const { ten_dang_nhap, mat_khau, nhap_lai_mat_khau, email } = req.body;
    const hinh_anh = "219986.png";
    const quyen = req.body.quyen || "2";
    // Kiểm tra mật khẩu và nhập lại mật khẩu có khớp không
    if (mat_khau !== nhap_lai_mat_khau) {
      return res.status(400).json({
        message: "Mật khẩu và nhập lại mật khẩu không khớp",
      });
    }
    // Kiểm tra email đã tồn tại
    const emailExist = await Users.findOne({ where: { email } });
    if (emailExist) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }
    // Tạo mật khẩu bảo mật
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(mat_khau, salt);
    // Tạo mã OTP ngẫu nhiên
    const otp = crypto.randomInt(100000, 999999);
    // Tạo thời gian hết hạn cho mã OTP (3 phút)
    const otpExpires = Date.now() + 3 * 60 * 1000; // 
    const user = await Users.create({
      ten_dang_nhap,
      mat_khau: hashPassword,
      email,
      hinh_anh,
      quyen,
      otp,
      otpExpires,
    });

    // Cấu hình gửi email OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "watchwristly@gmail.com",
        pass: "nebb uwva xdvb rvih",
      },
    });

    const mailOptions = {
      from: "watchwristly@gmail.com",
      to: email,
      subject: "Mã OTP xác thực tài khoản",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <div style="text-align: center; padding: 20px 0; background-color: #000;">
               <h1 style="color: white;">ĐỒNG HỒ WRISTLY</h1>
          </div>
          <div style="padding: 20px; text-align: center; background-color: #f9f9f9;">
            <h2>Mã đăng ký của bạn</h2>
            <p style="font-size: 2em; font-weight: bold; margin: 20px 0;">${otp}</p>
            <p style="color: #555;">Mã này sẽ hết hạn trong 3 phút</p>
          </div>
          <div style="font-size: 0.875em; text-align: center; padding: 20px; color: #888;">
            <p>© WRISTLY </p>
            <p>Công viên phần mềm quang trung</p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để nhận mã OTP.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//kiểm tra mã otp và xác thực tài khoản
exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    // Tìm người dùng với mã OTP
    const user = await Users.findOne({ where: { otp } });
    if (!user) {
      return res.status(400).json({
        message: "Mã OTP không đúng",
      });
    }
    // Kiểm tra thời gian hết hạn của OTP
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "Mã OTP đã hết hạn",
      });
    }
    // Xác thực thành công, xóa mã OTP sau khi xác thực
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    res.status(200).json({
      message: "Xác thực OTP thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// API đổi mật khẩu theo email và mat_khau
exports.changePassword = async (req, res) => {
  try {
    const { email, mat_khau, mat_khau_moi,xac_nhan_mat_khau } = req.body;
    // Kiểm tra xem email đã được sử dụng chưa
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: "Email không tổn tại",
      });
    }
    // Kiểm tra mật khẩu cũ
    const validPass = await bcrypt.compare(mat_khau, user.mat_khau);
    if (!validPass) {
      return res.status(400).json({
        message: "Mật khẩu không hợp lệ",
      });
    }
    // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
    if (mat_khau_moi !== xac_nhan_mat_khau) {
      return res.status(400).json({
        message: "Mật khẩu mới và xác nhận mật khẩu mới không khớp",
      });
    }
    // Tạo mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(mat_khau_moi, salt);
    // Cập nhật mật khẩu mới
    user.mat_khau = hashPassword;
    await user.save();
    res.status(200).json({
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//cập nhật user hinh_anh dùng thư viện multer
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }
    const hinh_anh = req.file ? req.file.filename : user.hinh_anh;
    const { ten_dang_nhap, ho_ten, email, dia_chi, dien_thoai,quyen } = req.body;
    user.ten_dang_nhap = ten_dang_nhap || user.ten_dang_nhap;
    user.ho_ten = ho_ten || user.ho_ten;
    user.email = email || user.email;
    user.dia_chi = dia_chi || user.dia_chi;
    user.dien_thoai = dien_thoai || user.dien_thoai;
    user.quyen = quyen || user.quyen;
    user.hinh_anh = hinh_anh;
    await user.save();
    res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//xóa user
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }
    await user.destroy();
    res.status(200).json({
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể xóa người dùng do có đơn hàng liên quan", 
  });
  
  }
};


/////////////////////////////////////////////////////////////////////////////////
//thêm người dùng bên phía admin

// API thêm người dùng bên phía admin
exports.addUser = async (req, res) => {
  try {
    upload.single("hinh_anh")(req, res, async (err) => {
      const {
        ten_dang_nhap,
        mat_khau,
        email,
        ho_ten,
        dia_chi,
        dien_thoai,
        quyen,
      } = req.body;
      const hinh_anh = req.file ? req.file.originalname : "";
      // Kiểm tra email đã tồn tại
      const emailExist = await Users.findOne({ where: { email } });
      if (emailExist) {
        return res.status(400).json({
          message: "Email đã tồn tại.",
        });
      }
      // Kiểm tra mật khẩu
      if (!mat_khau || mat_khau.trim() === "") {
        return res.status(400).json({
          message: "Mật khẩu không được để trống.",
        });
      }
      // Băm mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(mat_khau, salt);
      // Tạo người dùng mới
      const newUser = await Users.create({
        ten_dang_nhap,
        mat_khau: hashPassword,
        email,
        ho_ten,
        dia_chi,
        dien_thoai,
        quyen,
        hinh_anh,
      });
      // Phản hồi thành công
      res.status(201).json({
        message: "Thêm người dùng thành công.",
        data: newUser,
      });
    });
  } catch (error) {
    // Xử lý lỗi máy chủ
    console.error("Lỗi máy chủ:", error);
    res.status(500).json({
      message: "Lỗi máy chủ.",
      error: error.message,
    });
  }
};


//api gửi mã otp về email
// API gửi mã OTP
exports.sendOTPquenmk = async (req, res) => {
  try {
    const { email } = req.body;
    // Kiểm tra email đã tồn tại trong cơ sở dữ liệu
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại",
      });
    }
    // Tạo mã OTP ngẫu nhiên
    const otp = crypto.randomInt(100000, 999999); // Tạo OTP 6 chữ số
    // Tạo thời gian hết hạn cho mã OTP (5 phút)
    const otpExpires = Date.now() + 5 * 60 * 1000;
    // Lưu mã OTP vào cơ sở dữ liệu
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    // Cấu hình gửi email OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "watchwristly@gmail.com",
        pass: "nebb uwva xdvb rvih",
      },
    });
    const mailOptions = {
      from: "watchwristly@gmail.com",
      to: email,
      subject: "Mã OTP xác thực tài khoản",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <div style="text-align: center; padding: 20px 0; background-color: #000;">
               <h1 style="color: white;">ĐỒNG HỒ WRISTLY</h1>
          </div>
          <div style="padding: 20px; text-align: center; background-color: #f9f9f9;">
            <h2>Mã đăng ký của bạn</h2>
            <p style="font-size: 2em; font-weight: bold; margin: 20px 0;">${otp}</p>
            <p style="color: #555;">Mã này sẽ hết hạn trong 3 phút</p>
          </div>
          <div style="font-size: 0.875em; text-align: center; padding: 20px; color: #888;">
            <p>© WRISTLY </p>
            <p>Công viên phần mềm quang trung</p>
          </div>
        </div>
      `,
    };
    // Gửi email
    await transporter.sendMail(mailOptions);
    // Phản hồi thành công
    res.status(200).json({
      message: "Mã OTP đã được gửi",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi gửi OTP",
      error: error.message,
    });
  }
};
// API đổi mật khẩu bằng mã OTP
exports.resetPasswordByOTP = async (req, res) => {
  try {
    const { email, otp, mat_khau_moi, xac_nhan_mat_khau } = req.body;
    // Kiểm tra xem email có tồn tại không
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại",
      });
    }
    // Kiểm tra mã OTP có đúng không và có hết hạn không
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Mã OTP không chính xác",
      });
    }
    // Kiểm tra thời gian hết hạn của mã OTP
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "Mã OTP đã hết hạn",
      });
    }
    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
    if (mat_khau_moi !== xac_nhan_mat_khau) {
      return res.status(400).json({
        message: "Mật khẩu xác nhận không khớp",
      });
    }
    // Mã hóa mật khẩu mới trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(mat_khau_moi, 10);
    // Cập nhật mật khẩu mới cho người dùng
    user.mat_khau = hashedPassword;
    user.otp = null; // Xóa OTP sau khi xác thực thành công
    user.otpExpires = '0000-00-00 00:00:00';
    await user.save();

    // Phản hồi thành công
    res.status(200).json({
      message: "Mật khẩu đã được cập nhật thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi đặt lại mật khẩu",
      error: error.message,
    });
  }
};