const multer = require("multer");

const fileFilter = (req, file, callBack) => {
  if (
    file.mimetype.includes("jpeg") ||
    file.mimetype.includes("png") ||
    file.mimetype.includes("jpg")
  ) {
    return callBack(null, true);
  }
  callBack(null, false);
};

const upload = multer({ fileFilter: fileFilter });

module.exports = upload;
