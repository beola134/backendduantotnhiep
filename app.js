var createError = require('http-errors');
var express = require('express');
const cors = require("cors");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./config/database'); // Import sequelize instance
var thuonghieuRouter = require('./routes/thuonghieuRouters');
var productRouter = require('./routes/productRouters');
var userRouter = require('./routes/usersRouters');
var commentRouter = require('./routes/commentRouters');
var donhangRouter = require('./routes/donhangRouters');
var ptttRouter = require('./routes/ptttRouters');
var voucherRouter = require('./routes/voucherRouters');
var spRouter = require('./routes/spRouters');
var thongkeRouter = require('./routes/thongkeRouter');
var danhMucRouter = require('./routes/danhmucRouters');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/thuonghieu', thuonghieuRouter);
app.use('/product', productRouter);
app.use('/users', userRouter);
app.use('/comment', commentRouter);
app.use('/donhang', donhangRouter);
app.use('/pttt', ptttRouter);
app.use('/voucher', voucherRouter);
app.use('/product', spRouter);
app.use('/thongke', thongkeRouter);
app.use('/cate', danhMucRouter);


sequelize.authenticate()
  .then(() => {
    console.log('Kết nối đến cơ sở dữ liệu đã được thiết lập thành công.');

    // Đồng bộ các mô hình và khởi động server
    sequelize.sync()
      .then(() => {
        app.listen(3000, () => {
          console.log('Server đang chạy trên http://localhost:5000');
        });
      })
      .catch(err => {
        console.error('Không thể đồng bộ cơ sở dữ liệu:', err);
      });
  })
  .catch(err => {
    console.error('Không thể kết nối với cơ sở dữ liệu:', err);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
