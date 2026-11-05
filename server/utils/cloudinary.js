const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

function uploadImage(fileBuffer, folderName) {
  const mainFolder = process.env.CLOUDINARY_FOLDER || "business4";
  const folder = `${mainFolder}/${folderName}`;

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      },
    );

    upload.end(fileBuffer);
  });
}

async function deleteImage(publicId) {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Could not delete image:", err.message);
  }
}

module.exports = { isCloudinaryConfigured, uploadImage, deleteImage };
