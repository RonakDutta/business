// Photos are picked in the browser, shrunk here, and only then sent to the
// server. A phone photo is 3-6 MB, which is slow to upload and wasteful to
// store, so we redraw it smaller on a canvas first.

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const SIZES = {
  header: { maxWidth: 1600, maxHeight: 1000, quality: 0.72 },
  gallery: { maxWidth: 1280, maxHeight: 1280, quality: 0.68 },
};

export async function readImageFile(file, sizeName = "gallery") {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not an image. Use JPG, PNG or WebP.`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${file.name} is too big to handle here.`);
  }

  const size = SIZES[sizeName] || SIZES.gallery;

  let picture;
  try {
    // "from-image" keeps phone photos the right way up.
    picture = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(`${file.name} could not be opened.`);
  }

  const scale = Math.min(
    1,
    size.maxWidth / picture.width,
    size.maxHeight / picture.height,
  );
  const width = Math.round(picture.width * scale);
  const height = Math.round(picture.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  // Fill white first, otherwise see-through PNGs turn black as JPEG.
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  context.drawImage(picture, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", size.quality);
  return { dataUrl, bytes: getDataUrlSize(dataUrl), width, height };
}

// Base64 uses 4 characters for every 3 bytes.
export function getDataUrlSize(dataUrl) {
  if (!isUploadedImage(dataUrl)) return 0;
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.round(base64.length * 0.75);
}

export function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// An image just picked in the browser, not yet uploaded.
export function isUploadedImage(value) {
  return typeof value === "string" && value.startsWith("data:");
}

// An address we can put straight into <img src>, rather than a bare filename.
export function isResolvedImage(value) {
  return typeof value === "string" && /^(data:|blob:|https?:|\/)/i.test(value);
}

// Converts a picked image into a file we can upload to the server.
export function dataUrlToBlob(dataUrl) {
  if (!isUploadedImage(dataUrl)) return null;

  const [header, base64] = dataUrl.split(",");
  const type = header.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type });
}
