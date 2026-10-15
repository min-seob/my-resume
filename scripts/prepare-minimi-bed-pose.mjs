import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'docs/worklog/2610/assets/minimi-bed-lying-v1.png');
const output = path.join(root, 'public/minihome/minimi-bed-lying.png');

const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let left = info.width, top = info.height, right = -1, bottom = -1;
for (let index = 0; index < data.length; index += 4) {
  const x = (index / 4) % info.width;
  const y = Math.floor(index / 4 / info.width);
  if (data[index + 3] > 200) {
    data[index + 3] = 255;
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x); bottom = Math.max(bottom, y);
  } else {
    data[index + 3] = 0;
  }
}
if (right < left || bottom < top) throw new Error('The bed-lying sprite is empty.');

await sharp(data, { raw: info })
  .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
  .resize(160, 140, {
    fit: 'contain', kernel: 'nearest',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png().toFile(output);

console.log('Prepared the transparent 160×140 bed-lying minimi sprite.');
