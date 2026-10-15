import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function prepareSheet(source,columns,output) {
  const {data,info}=await sharp(path.join(root,source)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let k=0;k<data.length;k+=4) {if(data[k+3]<=200)data.fill(0,k,k+4);else data[k+3]=255;}
  const bounds=[];
  for(let r=0;r<2;r++)for(let c=0;c<columns;c++) {
    let left=Infinity,top=Infinity,right=-1,bottom=-1;
    for(let y=Math.floor(r*info.height/2);y<Math.floor((r+1)*info.height/2);y++)for(let x=Math.floor(c*info.width/columns);x<Math.floor((c+1)*info.width/columns);x++) {
      if(data[(y*info.width+x)*4+3]>200){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
    }
    if(right<0)throw new Error('Missing action frame');
    bounds.push({left,top,width:right-left+1,height:bottom-top+1});
  }
  const scale=Math.min(88/Math.max(...bounds.map(b=>b.width)),78/Math.max(...bounds.map(b=>b.height)));
  const layers=await Promise.all(bounds.map(async(b,i)=>{
    const width=Math.round(b.width*scale),height=Math.round(b.height*scale);
    const input=await sharp(data,{raw:info}).extract(b).resize(width,height,{kernel:'nearest'}).png().toBuffer();
    return {input,left:i%columns*96+Math.round((96-width)/2),top:Math.floor(i/columns)*96+82-height};
  }));
  await sharp({create:{width:columns*96,height:192,channels:4,background:'#00000000'}}).composite(layers).png().toFile(path.join(root,output));
}
await prepareSheet('docs/worklog/2610/assets/mimi-kkomi-actions-v2.png',3,'public/minihome/cats-actions-atlas.png');
const stairs=await sharp(path.join(root,'docs/worklog/2610/assets/bedroom-stairs-v3.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let k=0;k<stairs.data.length;k+=4){if(stairs.data[k+3]<=200)stairs.data.fill(0,k,k+4);else stairs.data[k+3]=255;}
await sharp(stairs.data,{raw:stairs.info}).trim().resize(520,620,{fit:'contain',kernel:'nearest',background:'#00000000'}).png().toFile(path.join(root,'public/minihome/bedroom-stairs-v3.png'));
console.log('Prepared cat action frames and oak staircase.');
