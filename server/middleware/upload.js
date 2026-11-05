const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      const err = new Error("Only images can be uploaded.");
      err.status = 400;
      callback(err);
    }
  },
});

module.exports = upload;
