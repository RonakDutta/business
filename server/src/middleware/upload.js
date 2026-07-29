import multer from "multer";

// Keeps the uploaded file in memory so we can send it straight to Cloudinary.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) callback(null, true);
    else callback(new Error("Only images can be uploaded."));
  },
});
