/* ===========================================================================
   MINIMAL QR ENCODER  ,  byte mode, error-correction level M, versions 1-10.

   Why hand-rolled instead of `npm i qrcode`: the only thing this project ever
   needs to encode is a ~100-character UPI intent string. That fits in version
   6-7 with room to spare, and the whole spec-compliant encoder for that slice
   is smaller than the dependency's README. No install step, no bundle weight,
   works offline.

   Output is a boolean matrix , see components/QRCode.jsx for the SVG.
   If you ever need >213 characters, add rows to CAPACITY/BLOCKS/ALIGN.
   =========================================================================== */

/* --- GF(256) log tables, primitive polynomial 0x11d ---------------------- */
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = x;
  LOG[x] = i;
  x <<= 1;
  if (x & 0x100) x ^= 0x11d;
}
for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];

const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

/** Reed-Solomon generator polynomial of the given degree. */
function generator(degree) {
  let poly = [1];
  for (let d = 0; d < degree; d++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let i = 0; i < poly.length; i++) {
      next[i] ^= poly[i];
      next[i + 1] ^= mul(poly[i], EXP[d]);
    }
    poly = next;
  }
  return poly;
}

function ecCodewords(data, count) {
  const gen = generator(count);
  const res = new Array(count).fill(0);
  for (const byte of data) {
    const factor = byte ^ res[0];
    res.shift();
    res.push(0);
    for (let i = 0; i < count; i++) res[i] ^= mul(gen[i + 1], factor);
  }
  return res;
}

/* --- Version tables (level M only) --------------------------------------- */

/** Max byte-mode characters per version at EC level M. */
const CAPACITY = [14, 26, 42, 62, 84, 106, 122, 152, 180, 213];

/** [ecPerBlock, [ [blockCount, dataCodewords], ... ] ] */
const BLOCKS = [
  [10, [[1, 16]]],
  [16, [[1, 28]]],
  [26, [[1, 44]]],
  [18, [[2, 32]]],
  [24, [[2, 43]]],
  [16, [[4, 27]]],
  [18, [[4, 31]]],
  [
    22,
    [
      [2, 38],
      [2, 39],
    ],
  ],
  [
    22,
    [
      [3, 36],
      [2, 37],
    ],
  ],
  [
    26,
    [
      [4, 43],
      [1, 44],
    ],
  ],
];

/** Alignment-pattern centre coordinates per version. */
const ALIGN = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

const MASKS = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

/* --- Bit buffer ---------------------------------------------------------- */
const bits = () => {
  const out = [];
  return {
    out,
    push(value, length) {
      for (let i = length - 1; i >= 0; i--) out.push((value >> i) & 1);
    },
  };
};

/** UTF-8 bytes , UPI strings can carry names with non-ASCII characters. */
const utf8 = (str) => Array.from(new TextEncoder().encode(str));

/* --- Encode -------------------------------------------------------------- */

function encodeData(bytes, version) {
  const [ecPerBlock, groups] = BLOCKS[version - 1];
  const totalData = groups.reduce((n, [count, size]) => n + count * size, 0);

  const buf = bits();
  buf.push(0b0100, 4); // byte mode
  buf.push(bytes.length, version >= 10 ? 16 : 8);
  for (const b of bytes) buf.push(b, 8);

  // Terminator, then pad to a byte boundary, then alternating pad bytes.
  const capacity = totalData * 8;
  buf.push(0, Math.min(4, capacity - buf.out.length));
  while (buf.out.length % 8) buf.out.push(0);

  const codewords = [];
  for (let i = 0; i < buf.out.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | buf.out[i + j];
    codewords.push(byte);
  }
  for (let i = 0; codewords.length < totalData; i++) {
    codewords.push(i % 2 ? 0x11 : 0xec);
  }

  // Split into blocks, compute EC for each.
  const dataBlocks = [];
  const ecBlocks = [];
  let at = 0;
  for (const [count, size] of groups) {
    for (let b = 0; b < count; b++) {
      const block = codewords.slice(at, at + size);
      at += size;
      dataBlocks.push(block);
      ecBlocks.push(ecCodewords(block, ecPerBlock));
    }
  }

  // Interleave: column-wise across blocks, data first then EC.
  const result = [];
  const longest = Math.max(...dataBlocks.map((b) => b.length));
  for (let i = 0; i < longest; i++) {
    for (const block of dataBlocks) if (i < block.length) result.push(block[i]);
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const block of ecBlocks) result.push(block[i]);
  }
  return result;
}

/* --- Matrix -------------------------------------------------------------- */

function blankMatrix(size) {
  return {
    modules: Array.from({ length: size }, () => new Array(size).fill(false)),
    reserved: Array.from({ length: size }, () => new Array(size).fill(false)),
  };
}

function placeFinder(m, size, row, col) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
      const inSquare =
        (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
        (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
        (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      m.modules[rr][cc] = inSquare;
      m.reserved[rr][cc] = true;
    }
  }
}

function placeAlignment(m, version) {
  const centres = ALIGN[version - 1];
  for (const r of centres) {
    for (const c of centres) {
      if (m.reserved[r][c]) continue; // overlaps a finder
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          m.modules[r + dr][c + dc] =
            Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
          m.reserved[r + dr][c + dc] = true;
        }
      }
    }
  }
}

function placeTiming(m, size) {
  for (let i = 8; i < size - 8; i++) {
    if (!m.reserved[6][i]) {
      m.modules[6][i] = i % 2 === 0;
      m.reserved[6][i] = true;
    }
    if (!m.reserved[i][6]) {
      m.modules[i][6] = i % 2 === 0;
      m.reserved[i][6] = true;
    }
  }
}

function reserveFormat(m, size) {
  for (let i = 0; i < 9; i++) {
    if (!m.reserved[8][i]) m.reserved[8][i] = true;
    if (!m.reserved[i][8]) m.reserved[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    m.reserved[8][size - 1 - i] = true;
    m.reserved[size - 1 - i][8] = true;
  }
  // Dark module , always set, always reserved.
  m.modules[size - 8][8] = true;
  m.reserved[size - 8][8] = true;
}

function placeVersion(m, size, version) {
  if (version < 7) return;
  let rem = version << 12;
  for (let bit = 17; bit >= 12; bit--) {
    if (rem & (1 << bit)) rem ^= 0x1f25 << (bit - 12);
  }
  const value = (version << 12) | rem;
  for (let i = 0; i < 18; i++) {
    const bit = ((value >> i) & 1) === 1;
    const r = Math.floor(i / 3);
    const c = size - 11 + (i % 3);
    m.modules[r][c] = bit;
    m.reserved[r][c] = true;
    m.modules[c][r] = bit;
    m.reserved[c][r] = true;
  }
}

function placeFormat(m, size, mask) {
  const data = (0b00 << 3) | mask; // 00 = EC level M
  let rem = data << 10;
  for (let bit = 14; bit >= 10; bit--) {
    if (rem & (1 << bit)) rem ^= 0x537 << (bit - 10);
  }
  const value = ((data << 10) | rem) ^ 0x5412;
  const bit = (i) => ((value >> i) & 1) === 1;

  // Copy 1 , down the left of the top-right finder, then along the top-left.
  for (let i = 0; i <= 5; i++) m.modules[i][8] = bit(i);
  m.modules[7][8] = bit(6);
  m.modules[8][8] = bit(7);
  m.modules[8][7] = bit(8);
  for (let i = 9; i <= 14; i++) m.modules[8][14 - i] = bit(i);

  // Copy 2 , split across the bottom-left and top-right corners.
  for (let i = 0; i <= 7; i++) m.modules[8][size - 1 - i] = bit(i);
  for (let i = 8; i <= 14; i++) m.modules[size - 15 + i][8] = bit(i);
}

/** Zig-zag placement, two columns at a time, skipping the vertical timing line. */
function placeData(m, size, codewords) {
  let bit = 0;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let step = 0; step < size; step++) {
      const row = upward ? size - 1 - step : step;
      for (let c = 0; c < 2; c++) {
        const col = right - c;
        if (m.reserved[row][col]) continue;
        const byte = codewords[bit >> 3];
        m.modules[row][col] =
          byte !== undefined && ((byte >> (7 - (bit & 7))) & 1) === 1;
        bit++;
      }
    }
    upward = !upward;
  }
}

/* --- Mask scoring (ISO/IEC 18004 §8.8.2) --------------------------------- */

function penalty(modules, size) {
  let score = 0;

  const runScore = (line) => {
    let run = 1;
    for (let i = 1; i < size; i++) {
      if (line[i] === line[i - 1]) {
        run++;
      } else {
        if (run >= 5) score += run - 2;
        run = 1;
      }
    }
    if (run >= 5) score += run - 2;
  };

  for (let r = 0; r < size; r++) runScore(modules[r]);
  for (let c = 0; c < size; c++) runScore(modules.map((row) => row[c]));

  // Rule 2 , 2x2 blocks of one colour.
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = modules[r][c];
      if (
        v === modules[r][c + 1] &&
        v === modules[r + 1][c] &&
        v === modules[r + 1][c + 1]
      ) {
        score += 3;
      }
    }
  }

  /* Rule 3 , the finder-like 1:1:3:1:1 pattern with four light modules on one
     side. Matched as the two 11-module windows the spec names, 10111010000 and
     00001011101, so this scores the same way a scanner's reference decoder does. */
  const scanLine = (line) => {
    let window = 0;
    for (let i = 0; i < size; i++) {
      window = ((window << 1) & 0x7ff) | (line[i] ? 1 : 0);
      if (i >= 10 && (window === 0x5d0 || window === 0x05d)) score += 40;
    }
  };
  for (let r = 0; r < size; r++) scanLine(modules[r]);
  for (let c = 0; c < size; c++) scanLine(modules.map((row) => row[c]));

  // Rule 4 , deviation from a 50/50 dark ratio, in 5% steps.
  const dark = modules.flat().filter(Boolean).length;
  const ratio = (dark * 100) / (size * size);
  score += Math.abs(Math.ceil(ratio / 5) - 10) * 10;

  return score;
}

/* --- Public API ---------------------------------------------------------- */

/**
 * Encode a string as a QR matrix.
 * @returns {{ size: number, modules: boolean[][] }} true = dark module
 * @throws if the text is longer than version 10 at level M can hold (213 bytes)
 */
export function encodeQR(text) {
  const bytes = utf8(String(text));

  const version = CAPACITY.findIndex((cap) => bytes.length <= cap) + 1;
  if (!version) {
    throw new Error(
      `QR: ${bytes.length} bytes is more than this encoder holds`,
    );
  }

  const size = version * 4 + 17;
  const codewords = encodeData(bytes, version);

  const base = blankMatrix(size);
  placeFinder(base, size, 0, 0);
  placeFinder(base, size, 0, size - 7);
  placeFinder(base, size, size - 7, 0);
  placeAlignment(base, version);
  placeTiming(base, size);
  reserveFormat(base, size);
  placeVersion(base, size, version);
  placeData(base, size, codewords);

  // Try all eight masks, keep the least offensive.
  let best = null;
  for (let mask = 0; mask < 8; mask++) {
    const modules = base.modules.map((row, r) =>
      row.map((v, c) => (base.reserved[r][c] ? v : v !== MASKS[mask](r, c))),
    );
    const candidate = { modules, reserved: base.reserved };
    placeFormat(candidate, size, mask);
    const score = penalty(candidate.modules, size);
    if (!best || score < best.score) best = { score, modules };
  }

  return { size, modules: best.modules };
}

/**
 * Build a UPI payment intent string.
 * Scannable by any UPI app (GPay, PhonePe, Paytm, BHIM…).
 * See: https://www.npci.org.in/what-we-do/upi/product-overview (deep link spec)
 *
 * Built by hand rather than with URLSearchParams, which encodes a space as "+".
 * That's correct for form data and wrong here: several UPI apps take the query
 * literally and show the payee as "Business+4.0+Community". %20 is safe in all
 * of them.
 */
export function upiIntent({ vpa, name, amount, note, ref }) {
  const params = [
    ["pa", vpa],
    ["pn", name],
    ["cu", "INR"],
    ["am", amount ? Number(amount).toFixed(2) : null],
    ["tn", note],
    ["tr", ref],
  ];

  const query = params
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  return `upi://pay?${query}`;
}
