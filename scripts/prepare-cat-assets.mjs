import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'docs/worklog/2610/assets/mimi-kkomi-sprites-v2.png');
const {data, info} = await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
// Pixel sprites use binary coverage so generated semi-transparent edge colors
// cannot bleed between atlas frames when the browser samples the texture.
for (let k = 0; k < data.length; k += 4) {
  if (data[k + 3] <= 200) data.fill(0, k, k + 4);
  else data[k + 3] = 255;
}
const cell = info.width / 6, rowHeight = info.height / 2;
const bounds = [];
for(let row=0;row<2;row++) for(let col=0;col<6;col++) {
  let x1=Infinity,y1=Infinity,x2=-1,y2=-1;
  for(let y=Math.floor(row*rowHeight);y<Math.floor((row+1)*rowHeight);y++) for(let x=Math.floor(col*cell);x<Math.floor((col+1)*cell);x++) {
    if(data[(y*info.width+x)*4+3] > 200) {x1=Math.min(x1,x);y1=Math.min(y1,y);x2=Math.max(x2,x);y2=Math.max(y2,y);}
  }
  if(x2<0) throw new Error(`Missing cat frame ${row}, ${col}`);
  bounds.push({left:x1,top:y1,width:x2-x1+1,height:y2-y1+1});
}
const scale = Math.min(88/Math.max(...bounds.map(b=>b.width)),78/Math.max(...bounds.map(b=>b.height)));
const layers = await Promise.all(bounds.map(async(b,i)=>{
  const width=Math.round(b.width*scale),height=Math.round(b.height*scale);
  const input=await sharp(data,{raw:info}).extract(b).resize(width,height,{kernel:'nearest'}).png().toBuffer();
  return {input,left:(i%6)*96+Math.round((96-width)/2),top:Math.floor(i/6)*96+82-height};
}));
await sharp({create:{width:576,height:192,channels:4,background:'#00000000'}}).composite(layers).png().toFile(path.join(root,'public/minihome/cats-atlas.png'));
console.log('Prepared 12 cat frames with consistent scale and foot baseline.');
