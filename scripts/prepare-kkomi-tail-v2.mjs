import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetRoot = 'docs/worklog/2610/assets';

function insidePolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const crosses = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

async function makeTailTipVariant({ input, output, columns, regions }) {
  const inputPath = path.join(root, assetRoot, input);
  const outputPath = path.join(root, assetRoot, output);
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const cellWidth = info.width / columns;
  const cellHeight = info.height / 2;
  if (!Number.isInteger(cellWidth) || cellWidth !== cellHeight) {
    throw new Error(`Expected square sprite cells in ${input}`);
  }

  let changed = 0;
  for (const { column, tail, tip } of regions) {
    const left = column * cellWidth;
    const top = cellHeight;
    for (let y = 0; y < cellHeight; y++) {
      for (let x = 0; x < cellWidth; x++) {
        if (!insidePolygon(x, y, tail) || insidePolygon(x, y, tip)) continue;
        const index = ((top + y) * info.width + left + x) * 4;
        if (data[index + 3] <= 200) continue;

        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        if (red >= 115 || green >= 95 || blue >= 82) continue;

        // Lift the dark brown tail fur into Kkomi's warm gold range while
        // retaining the original shading and texture. Keep the black outline.
        data[index] = Math.min(235, red + 115);
        data[index + 1] = Math.min(190, green + 83);
        data[index + 2] = Math.min(140, blue + 42);
        changed++;
      }
    }
  }

  await sharp(data, { raw: info }).png().toFile(outputPath);
  console.log(`Prepared ${output} with ${changed.toLocaleString('en-US')} golden tail pixels and black tips.`);
}

const uprightBaseTail = [[22,40],[160,40],[160,196],[22,196]];
const uprightActionTail = [[70,70],[225,70],[225,248],[70,248]];
const sleepingTailArea = [[35,214],[194,214],[194,300],[35,300]];
const seatedTailArea = [[60,315],[270,315],[270,415],[60,415]];

const walkingTails = [
  {
    column: 0,
    tail: uprightBaseTail,
    tip: [[42,72],[43,61],[51,54],[65,49],[83,48],[99,56],[107,69],[103,75],[86,71],[68,69],[54,74]],
  },
  {
    column: 1,
    tail: uprightBaseTail,
    tip: [[34,72],[35,59],[44,50],[58,46],[76,44],[95,51],[106,67],[102,75],[84,70],[63,68],[46,74]],
  },
  {
    column: 2,
    tail: uprightBaseTail,
    tip: [[32,75],[33,62],[41,52],[56,47],[75,47],[94,55],[104,71],[100,78],[82,73],[61,71],[44,77]],
  },
  {
    column: 3,
    tail: uprightBaseTail,
    tip: [[35,70],[35,56],[44,45],[62,41],[82,43],[98,54],[106,67],[101,74],[83,69],[61,68],[44,73]],
  },
  {
    column: 4,
    tail: uprightBaseTail,
    tip: [[44,84],[44,69],[51,58],[65,53],[83,53],[101,62],[113,78],[108,87],[89,82],[68,82],[53,88]],
  },
];

const sleepingTail = [{
  column: 5,
  tail: sleepingTailArea,
  tip: [[158,253],[174,253],[184,263],[186,276],[178,286],[163,285],[156,273]],
}];

const actionTails = [
  {
    column: 0,
    tail: uprightActionTail,
    tip: [[100,119],[99,102],[111,91],[139,88],[162,91],[181,101],[194,116],[188,126],[167,121],[144,118],[121,123]],
  },
  {
    column: 1,
    tail: uprightActionTail,
    tip: [[94,89],[94,72],[102,63],[123,58],[144,61],[161,73],[173,89],[168,98],[149,94],[126,91],[108,96]],
  },
];

const seatedTail = [{
  column: 2,
  tail: seatedTailArea,
  tip: [[73,374],[76,352],[87,340],[101,334],[114,336],[122,344],[120,356],[114,368],[102,379],[87,381],[77,378]],
}];

await makeTailTipVariant({
  input: 'mimi-kkomi-sprites-v1.png',
  output: 'mimi-kkomi-sprites-v2.png',
  columns: 6,
  regions: [...walkingTails, ...sleepingTail],
});

await makeTailTipVariant({
  input: 'mimi-kkomi-actions-v1.png',
  output: 'mimi-kkomi-actions-v2.png',
  columns: 3,
  regions: [...actionTails, ...seatedTail],
});
