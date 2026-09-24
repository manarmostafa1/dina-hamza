import { readFileSync } from "node:fs";

/** Minimal intrinsic-size reader for JPEG / PNG / WebP / GIF headers. */
export function imageSize(file) {
  let b;
  try {
    b = readFileSync(file);
  } catch {
    return null;
  }

  // PNG
  if (b.length > 24 && b.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  }

  // GIF
  if (b.length > 10 && b.subarray(0, 3).toString("ascii") === "GIF") {
    return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
  }

  // WebP (VP8X / VP8 / VP8L)
  if (b.length > 30 && b.subarray(8, 12).toString("ascii") === "WEBP") {
    const fmt = b.subarray(12, 16).toString("ascii");
    if (fmt === "VP8X") return { w: (b.readUIntLE(24, 3) & 0xffffff) + 1, h: (b.readUIntLE(27, 3) & 0xffffff) + 1 };
    if (fmt === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  }

  // JPEG — walk the segment chain to the SOF marker.
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let o = 2;
    while (o < b.length - 8) {
      if (b[o] !== 0xff) {
        o++;
        continue;
      }
      const marker = b[o + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { w: b.readUInt16BE(o + 7), h: b.readUInt16BE(o + 5) };
      }
      o += 2 + b.readUInt16BE(o + 2);
    }
  }

  return null;
}
