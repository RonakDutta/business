import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

/*
  Cloudinary holds every uploaded image (event covers, gallery photos, team
  portraits, payment proofs). We keep the API secret server-side and stream
  uploads through this module — the browser never sees the credentials.
*/

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

export const isCloudinaryConfigured = Boolean(
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret,
);

/**
 * Upload an in-memory file buffer (from multer) to Cloudinary.
 * `subfolder` nests under CLOUDINARY_FOLDER, e.g. "gallery/2026-07-18".
 * Resolves to { url, publicId }.
 */
export function uploadBuffer(buffer, subfolder = "") {
  const folder = [env.cloudinary.folder, subfolder].filter(Boolean).join("/");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

/** Remove an asset by its public_id (used when a photo/proof is deleted). */
export function destroyAsset(publicId) {
  if (!publicId) return Promise.resolve();
  return cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
