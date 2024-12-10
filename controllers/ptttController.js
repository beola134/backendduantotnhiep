// ptttController.js
const Pttt = require("../models/pttt");
const DonHang = require("../models/donhang"); // Assuming you have an Order model
const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const Product = require("../models/product");
const ChiTietDonHang = require("../models/chitietdonhang");
//them phuong thuc thanh toan
exports.addPttt = async (req, res) => {
  try {
    const { _id, ten_phuong_thuc } = req.body;
    if (!ten_phuong_thuc) {
      return res.status(400).json({ message: "không tìm thấy tên pttt" });
    }
    const pttt = await Pttt.create({ _id, ten_phuong_thuc });
    res.status(201).json({ pttt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// này là config cho ZaloPay
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
// ZaloPay Callback
exports.callback = async (req, res) => {
  const result = {};
  try {
    const { data: dataStr, mac: reqMac } = req.body;
    // Tính toán MAC để kiểm tra tính hợp lệ
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("Generated MAC:", mac);
    if (reqMac !== mac) {
      // Callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // Parse dữ liệu từ ZaloPay
      const dataJson = JSON.parse(dataStr);
      const appTransId = dataJson["app_trans_id"];
      // Tìm đơn hàng dựa trên app_trans_id
      const order = await DonHang.findOne({ where: { app_trans_id: appTransId } });
      if (order) {
        // Cập nhật trạng thái đơn hàng
        order.trang_thai_thanh_toan = "Đã thanh toán";
        order.thanh_toan = true;
        await order.save();
        console.log(`Order ${appTransId} status updated to success.`);
        result.return_code = 1;
        result.return_message = "success";
      } else {
        result.return_code = -2;
        result.return_message = "Order not found";
      }
    }
  } catch (error) {
    console.error("Error in callback:", error.message);
    result.return_code = 0;
    result.return_message = error.message;
  }
  res.json(result);
  console.log("response sent:", result);
};

// ZaloPay Payment
exports.zaloPay = async (req, res) => {
  const { amount, orderDetails } = req.body;
  //Xác thực chi tiết đơn hàng và số tiền
  if (!orderDetails || !orderDetails.id_nguoi_dung || !orderDetails.chi_tiet_don_hang || amount <= 0) {
    return res.status(400).json({ message: "Invalid order details or amount" });
  }
  // Tạo mã giao dịch ngẫu nhiên
  const transID = Math.floor(Math.random() * 1000000);
  const app_trans_id = `${moment().format("YYMMDD")}_${transID}`;

  try {
    const order = await DonHang.create({
      app_trans_id,
      id_nguoi_dung: orderDetails.id_nguoi_dung,
      dia_chi: orderDetails.dia_chi || "",
      tong_tien: amount,
      trang_thai: "Chờ xác nhận",
      trang_thai_thanh_toan: "Chưa thanh toán",
      thanh_toan: false,
      id_phuong_thuc_thanh_toan: "3",
      ghi_chu: orderDetails.ghi_chu || "",
      phi_ship: orderDetails.phi_ship || "Miễn phí",
    });
    const chiTietPromises = orderDetails.chi_tiet_don_hang.map(async (ct) => {
      const product = await Product.findByPk(ct.id_san_pham);
      if (product) {
        await ChiTietDonHang.create({
          gia_san_pham: product.gia_giam > 0 ? product.gia_giam : product.gia_san_pham,
          ten_san_pham: product.ten_san_pham,
          so_luong: ct.so_luong,
          id_don_hang: order._id,
          id_san_pham: ct.id_san_pham,
        });
      }
    });
    const embed_data = {
      redirecturl: "http://localhost:3001",
    };

    const paymentData = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
      app_user: orderDetails.id_nguoi_dung,
      app_time: Date.now(),
      item: JSON.stringify(orderDetails.chi_tiet_don_hang),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      description: `Payment for order #${transID}`,
      bank_code: "",
      callback_url: "https://97cc-171-243-48-82.ngrok-free.app/pttt/callback",
    };

    const data = `${config.app_id}|${paymentData.app_trans_id}|${paymentData.app_user}|${paymentData.amount}|${paymentData.app_time}|${paymentData.embed_data}|${paymentData.item}`;
    paymentData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: paymentData });

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Payment initiation failed" });
  }
};

//KIEM TRA TRANG THAI DON HANG
exports.checkOrderStatus = async (req, res) => {
  const app_trans_id = req.params.app_trans_id;
  let postData = {
    app_id: config.app_id,
    app_trans_id: app_trans_id,
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "	https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };
  try {
    const result = await axios(postConfig);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error.message);
  }
};

//thanh toán momo
exports.thanhToanMomo = async (req, res) => {
  const { amount, orderId } = req.body;
  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const orderInfo = "pay with MoMo";
  const partnerCode = "MOMO";
  const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  const requestType = "payWithMethod";
  const requestId = orderId || partnerCode + new Date().getTime();
  const extraData = "";
  const orderGroupId = "";
  const autoCapture = true;
  const lang = "vi";

  // tạo chuỗi chữ ký
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  // Log raw signature
  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);

  // Generate signature
  const crypto = require("crypto");
  const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  // JSON object to send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  // Axios options
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    console.log(result);
    res.status(200).json({ message: "success", data: result.data });
  } catch (error) {
    console.error("Error during MoMo payment:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};
