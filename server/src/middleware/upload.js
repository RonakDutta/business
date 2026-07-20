import multer from "multer";

/*
  Multipart image uploads land in memory (not on disk) so we can stream the
  buffer straight to Cloudinary — see config/cloudinary.js uploadBuffer().
  Routes that accept a file use `upload.single("image")` / ("proof").
*/

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image uploads are allowed."));
  },
});
