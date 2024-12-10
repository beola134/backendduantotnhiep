const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const checkFile = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|webp|gif|avif)$/)) {
    return cb(new Error("vui long nhap file hình ảnh"));
  }
  cb(null, true);
};

module.exports = multer({ storage: storage, fileFilter: checkFile });
