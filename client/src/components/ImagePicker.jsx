import { useRef, useState } from "react";
import { readImageFile, mb } from "../lib/image.js";
import { ImageIcon, PlusIcon } from "./icons.jsx";

/**
 * Drop a file, or click to browse. Handles the resize and hands back data URLs.
 *
 * Deliberately dumb about where the result goes — the form owns the value. All
 * this does is turn files into strings the record can hold, and say so when it
 * can't.
 */
export default function ImagePicker({
  onAdd,
  onError,
  preset = "gallery",
  multiple = false,
  label = "Drop an image here",
  hint,
}) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(0);

  const take = async (fileList) => {
    const files = [...fileList].filter(Boolean);
    if (!files.length) return;

    const picked = multiple ? files : files.slice(0, 1);
    setBusy(picked.length);
    onError?.("");

    const done = [];
    for (const file of picked) {
      try {
        const { dataUrl } = await readImageFile(file, preset);
        done.push(dataUrl);
      } catch (err) {
        /* One bad file shouldn't drop the other nine. */
        onError?.(err.message);
      }
    }

    setBusy(0);
    if (done.length) onAdd(done);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files);
      }}
      className={`rounded-card border border-dashed p-6 text-center transition-colors duration-200 ${
        over ? "accent-border accent-tint" : "border-line-strong bg-[#fafbfc]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          take(e.target.files);
          e.target.value = ""; // so picking the same file twice still fires
        }}
      />

      <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
        {busy ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        ) : (
          <ImageIcon className="h-5 w-5" />
        )}
      </span>

      <p className="mt-3 text-[13.5px] font-bold text-ink">
        {busy ? `Processing ${busy} image${busy > 1 ? "s" : ""}…` : label}
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={Boolean(busy)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-btn border border-line-strong bg-white px-4 py-2 text-[13px] font-bold text-ink transition-colors duration-200 hover:border-ink disabled:opacity-50"
      >
        <PlusIcon className="h-3.5 w-3.5" />
        {multiple ? "Choose files" : "Choose a file"}
      </button>

      {hint && (
        <p className="mx-auto mt-3 max-w-[320px] text-[11.5px] leading-relaxed text-subtle">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Shown under a picker once there's something to weigh. */
export function SizeNote({ bytes, budget = 4 * 1024 * 1024 }) {
  if (!bytes) return null;
  const over = bytes > budget * 0.6;

  return (
    <p
      className={`text-[11.5px] leading-relaxed ${over ? "font-semibold text-red-600" : "text-subtle"}`}
    >
      {mb(bytes)} of images on this meetup.
      {over
        ? " Getting close to what this browser will hold — trim some, or wait for the backend."
        : " Stored in this browser until the backend lands."}
    </p>
  );
}
