const express = require('express');
const router = express.Router();
const ptttController = require('../controllers/ptttController');
//http://localhost:5000/pttt/add-pttt
router.post('/add-pttt', ptttController.addPttt);

//http://localhost:5000/pttt/thanh-toan-momo
router.post('/thanh-toan-momo', ptttController.thanhToanMomo);

//http://localhost:5000/pttt/zalo
router.post('/zalo', ptttController.zaloPay);

//http://localhost:5000/pttt/callback
router.post('/callback', ptttController.callback);
//http://localhost:5000/pttt/checkOrder/:ap
router.post('/checkOrder/:app_trans_id', ptttController.checkOrderStatus);

module.exports = router;