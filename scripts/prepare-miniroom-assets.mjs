import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "docs/worklog/2610/assets");
const output = path.join(root, "public/minihome");
await fs.mkdir(output, { recursive: true });

// Prepare the approved artwork for the game without changing the source sheets.
const { data, info } = await sharp(path.join(source, "minimi-black-hoodie-idle-walk-v1.png"))
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const cells = [
  [156, 0, 300, 520], [464, 0, 310, 520],
  [779, 0, 300, 520], [1080, 0, 320, 520],
  [0, 520, 290, 504], [290, 520, 250, 504], [540, 520, 240, 504],
  [780, 520, 248, 504], [1028, 520, 252, 504], [1280, 520, 256, 504],
];
const bounds = cells.map(([left, top, width, height]) => {
  let x1 = info.width, y1 = info.height, x2 = 0, y2 = 0;
  for (let y = top; y < top + height; y++) {
    for (let x = left; x < left + width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 200) {
        x1 = Math.min(x1, x); y1 = Math.min(y1, y);
        x2 = Math.max(x2, x); y2 = Math.max(y2, y);
      }
    }
  }
  if (x2 <= x1 || y2 <= y1) throw new Error("Empty sprite frame");
  if (x1 <= left || x2 >= left + width - 1) throw new Error("Sprite touches its extraction boundary");
  return { left: x1, top: y1, width: x2 - x1 + 1, height: y2 - y1 + 1 };
});
// Remove the generated translucent backdrop; use one scale and one foot baseline.
const clean = Buffer.from(data);
for (let i = 3; i < clean.length; i += 4) clean[i] = clean[i] > 200 ? 255 : 0;
const scale = 144 / Math.max(...bounds.map((b) => b.height));
const frames = [];
for (const boundsForFrame of bounds) {
  const width = Math.round(boundsForFrame.width * scale);
  const height = Math.round(boundsForFrame.height * scale);
  const pixels = await sharp(clean, { raw: info }).extract(boundsForFrame)
    .resize(width, height, { kernel: "nearest" }).png().toBuffer();
  const frame = await sharp({ create: { width: 96, height: 160, channels: 4, background: "transparent" } })
    .composite([{ input: pixels, left: Math.floor((96 - width) / 2), top: 154 - height }])
    .png().toBuffer();
  frames.push(frame);
}
const seatedSource = await sharp(path.join(source, "minimi-hoodie-seated-v1.png"))
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const seatedPixels = Buffer.from(seatedSource.data);
for (let i = 3; i < seatedPixels.length; i += 4) seatedPixels[i] = seatedPixels[i] > 200 ? 255 : 0;
const seatedBounds = Array.from({ length: 4 }, (_, index) => {
  const left = index * 384;
  let x1 = 1536, y1 = 1024, x2 = 0, y2 = 0;
  for (let y = 0; y < 1024; y++) for (let x = left; x < left + 384; x++) {
    if (seatedPixels[(y * 1536 + x) * 4 + 3]) {
      x1 = Math.min(x1, x); y1 = Math.min(y1, y);
      x2 = Math.max(x2, x); y2 = Math.max(y2, y);
    }
  }
  if (x2 <= x1 || y2 <= y1 || x1 === left || x2 === left + 383) throw new Error("Invalid seated sprite extraction");
  return { left: x1, top: y1, width: x2 - x1 + 1, height: y2 - y1 + 1 };
});
const seatedScale = Math.min(0.26, 148 / Math.max(...seatedBounds.map((b) => b.height)), 92 / Math.max(...seatedBounds.map((b) => b.width)));
for (const boundsForFrame of seatedBounds) {
  const width = Math.round(boundsForFrame.width * seatedScale);
  const height = Math.round(boundsForFrame.height * seatedScale);
  const pixels = await sharp(seatedPixels, { raw: seatedSource.info }).extract(boundsForFrame)
    .resize(width, height, { kernel: "nearest" }).png().toBuffer();
  frames.push(await sharp({ create: { width: 96, height: 160, channels: 4, background: "transparent" } })
    .composite([{ input: pixels, left: Math.floor((96 - width) / 2), top: 154 - height }]).png().toBuffer());
}
await sharp({ create: { width: frames.length * 96, height: 160, channels: 4, background: "transparent" } })
  .composite(frames.map((input, index) => ({ input, left: index * 96, top: 0 })))
  .png().toFile(path.join(output, "minimi-hoodie-actions-atlas.png"));
await fs.writeFile(path.join(output, "minimi-hoodie-idle.png"), frames[0]);
await fs.writeFile(path.join(source, "minimi-runtime-frames.json"), JSON.stringify({
  width: 96, height: 160, footBaseline: 154, scale, sourceBounds: bounds,
  frames: ["idle-front", "idle-diagonal", "idle-right", "idle-back", ...Array.from({ length: 6 }, (_, i) => `walk-${i}`)],
}, null, 2) + "\n");
await fs.writeFile(path.join(source, "minimi-runtime-actions.json"), JSON.stringify({
  width: 96, height: 160, footBaseline: 154, frameCount: frames.length,
  walkingScale: scale, seatedScale, seatedBounds,
  seatedFrames: ["sofa", "coding-chair", "gaming-chair", "reading-chair"],
}, null, 2) + "\n");

for (const [name, prefix, patch] of [
  ["coding-room-v2", "coding", { left: 88, top: 172, width: 224, height: 454 }],
  ["rest-room-v2", "rest-v2", { left: 1304, top: 256, width: 202, height: 432 }],
]) {
  await sharp(path.join(source, `${name}-closed.png`)).webp({ quality: 96 })
    .toFile(path.join(output, `${prefix}-room.webp`));
  await sharp(path.join(source, `${name}-open.png`)).extract(patch).webp({ quality: 96 })
    .toFile(path.join(output, `${prefix}-door-open.webp`));
}

await sharp(path.join(source, "coding-standbyme-landscape.png"))
  .extract({ left: 768, top: 462, width: 163, height: 282 }).webp({ quality: 96 })
  .toFile(path.join(output, "coding-standbyme-landscape-patch.webp"));

const foregrounds = [
  ["coding-standbyme", "coding-room-v2-closed.png", '<polygon points="807,474 882,496 883,645 808,625"/><rect x="844" y="623" width="24" height="96"/><ellipse cx="851" cy="721" rx="43" ry="19"/>'],
  ["coding-sofa", "coding-room-v2-closed.png", '<polygon points="489,692 610,696 695,747 741,705 841,724 953,784 985,855 1067,892 983,973 848,1010 435,837 455,751"/>'],
  ["coding-sofa-front", "coding-room-v2-closed.png", '<polygon points="443,756 505,725 553,745 577,765 635,793 720,830 760,861 786,895 870,920 871,986 823,1001 443,828"/><polygon points="491,697 548,712 585,742 615,780 598,876 496,841 477,756"/>'],
  ["coding-chair-back", "coding-room-v2-closed.png", '<polygon points="591,266 638,281 654,320 655,365 640,373 596,350 588,297"/><polygon points="674,329 700,326 715,339 715,347 679,354 670,345"/><rect x="696" y="344" width="6" height="44"/>'],
  ["gaming-chair-back", "coding-room-v2-closed.png", '<polygon points="1100,401 1129,406 1148,424 1158,467 1178,496 1175,537 1160,558 1119,551 1100,526 1089,472 1097,436"/><polygon points="1208,503 1238,498 1250,509 1250,518 1220,531 1208,520"/><rect x="1242" y="518" width="7" height="54"/>'],
  ["coding-standbyme-landscape", "coding-standbyme-landscape.png", '<polygon points="778,477 912,510 913,613 778,578"/><rect x="844" y="590" width="24" height="129"/><ellipse cx="851" cy="721" rx="43" ry="19"/>'],
  ["rest-v2-bed", "rest-room-v2-closed.png", '<polygon points="400,360 680,191 904,266 963,344 965,462 652,599 409,488"/>'],
  ["rest-v2-chair", "rest-room-v2-closed.png", '<polygon points="136,449 259,448 322,505 368,547 397,635 291,698 113,634 97,550"/>'],
  ["rest-v2-reading-table", "rest-room-v2-closed.png", '<polygon points="177,535 236,536 281,577 283,611 254,626 244,669 203,672 195,629 163,608 159,577"/>'],
];
for (const [name, filename, shapes] of foregrounds) {
  const mask = Buffer.from(`<svg width="1536" height="1024"><g fill="white">${shapes}</g></svg>`);
  await sharp(path.join(source, filename)).ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }]).webp({ lossless: true })
    .toFile(path.join(output, `${name}-foreground.webp`));
}
console.log("Prepared furnished bedroom, rotating screen patches and 14-frame walking/seated hoodie atlas.");

await import("./prepare-minimi-bed-pose.mjs");
await import("./prepare-kkomi-belly-up.mjs");

// Normalize the photo-derived cat animation sheet for the upstairs room.
await import("./prepare-kkomi-tail-v2.mjs");

await import("./prepare-cat-assets.mjs");

await import("./prepare-cat-actions.mjs");

await import("./prepare-bedroom-v4.mjs");
