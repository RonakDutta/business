/* ===========================================================================
   IMAGE INTAKE

   There's no upload server, so a picked file is decoded, resized and re-encoded
   in the browser, and the resulting data URL is stored on the meetup record
   like any other field. Everything that already renders `image`/`photos`
   renders these without knowing the difference.

   The resize isn't a nicety — it's the whole reason this works. A phone photo
   is 3-6MB, base64 inflates it by a third, and localStorage gives us about 5MB
   for the entire site. Downscaling to a sane width first is what keeps a
   meetup's worth of photos inside the budget.

   WHEN THE BACKEND LANDS: replace readImageFile with a POST that returns a URL.
   Nothing else has to change — the record just holds a shorter string.
   =========================================================================== */

/** Anything past this is a mistake or a RAW file — reject before decoding. */
const MAX_INPUT_BYTES = 25 * 1024 * 1024;

const PRESETS = {
  /* The cover fills a 440px-tall band on a wide screen, so it needs the pixels. */
  header: { maxW: 1600, maxH: 1000, quality: 0.72 },
  /* Gallery photos are viewed in a lightbox but there can be dozens of them. */
  gallery: { maxW: 1280, maxH: 1280, quality: 0.68 },
};

const isImage = (file) => /^image\/(jpeg|png|webp|gif|avif)$/i.test(file.type);

/**
 * Decode a picked file, downscale it to fit the preset, and return a JPEG data
 * URL. Always JPEG: PNG screenshots of photos are enormous for no benefit, and
 * we're not keeping transparency on a cover image.
 *
 * @returns {Promise<{ dataUrl: string, bytes: number, width: number, height: number }>}
 * @throws {Error} with a message meant to be shown to the person
 */
export async function readImageFile(file, preset = "gallery") {
  if (!isImage(file)) {
    throw new Error(`${file.name} isn't an image we can read — use JPG, PNG or WebP.`);
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(`${file.name} is ${mb(file.size)} — that's too big to handle here.`);
  }

  const { maxW, maxH, quality } = PRESETS[preset] ?? PRESETS.gallery;

  let bitmap;
  try {
    // from-image honours EXIF, so phone photos don't land on their side.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(`${file.name} looks corrupt — the browser couldn't decode it.`);
  }

  const scale = Math.min(1, maxW / bitmap.width, maxH / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  /* Flatten onto white — a transparent PNG would otherwise go black as JPEG. */
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { dataUrl, bytes: dataUrlBytes(dataUrl), width, height };
}

/** Rough decoded size of a data URL — base64 is 4 characters per 3 bytes. */
export const dataUrlBytes = (s) =>
  typeof s === "string" && s.startsWith("data:")
    ? Math.round((s.length - s.indexOf(",") - 1) * 0.75)
    : 0;

export const mb = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** An uploaded image, versus a filename sitting in public/. */
export const isUploaded = (s) => typeof s === "string" && s.startsWith("data:");
