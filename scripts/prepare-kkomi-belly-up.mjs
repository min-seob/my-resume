import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'docs/worklog/2610/assets/mimi-kkomi-belly-up-v1.png');
const output = path.join(root, 'public/minihome/kkomi-belly-up.png');
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

let left = info.width, top = info.height, right = -1, bottom = -1;
for (let index = 0; index < data.length; index += 4) {
  const pixel = index / 4;
  const x = pixel % info.width;
  const y = Math.floor(pixel / info.width);
  if (data[index + 3] > 200) {
    data[index + 3] = 255;
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x); bottom = Math.max(bottom, y);
  } else {
    data[index + 3] = 0;
  }
}

if (right < left || bottom < top) throw new Error('The Kkomi belly-up sprite is empty.');

await sharp(data, { raw: info })
  .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
  .resize(96, 96, {
    fit: 'contain', kernel: 'nearest',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png().toFile(output);

console.log('Prepared the transparent 96×96 Kkomi belly-up sleeping sprite.');
