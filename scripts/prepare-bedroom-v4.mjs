import sharp from 'sharp';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'doc/project-memory/assets/10-15/rest-room-v4-closed.png');
const output=path.join(root,'public/minihome');
await sharp(source).resize(1536,1024,{kernel:'nearest'}).webp({quality:96}).toFile(path.join(output,'rest-v4-room.webp'));
const foregrounds=[
  ['rest-v4-bed','<polygon points="400,360 680,191 904,266 963,344 965,462 652,599 409,488"/>'],
  ['rest-v4-chair','<polygon points="704,612 775,600 818,636 825,656 890,675 893,753 880,786 797,807 711,770 703,708"/>'],
  ['rest-v4-reading-table','<polygon points="892,685 941,678 977,700 981,739 968,782 894,784 886,725"/>'],
  ['rest-v4-stairs','<polygon points="65,245 112,235 151,270 165,299 184,299 188,323 215,334 215,355 244,363 247,392 270,404 276,426 305,436 315,458 335,477 350,500 365,534 383,551 385,570 410,589 410,615 434,628 434,644 318,681 66,600"/>'],
];
for(const[name,shapes]of foregrounds){
 const mask=Buffer.from(`<svg width="1536" height="1024"><g fill="white">${shapes}</g></svg>`);
 await sharp(source).resize(1536,1024,{kernel:'nearest'}).ensureAlpha().composite([{input:mask,blend:'dest-in'}]).webp({lossless:true}).toFile(path.join(output,`${name}-foreground.webp`));
}
console.log('Prepared bedroom v4 and furniture foreground layers.');
