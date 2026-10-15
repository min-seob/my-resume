export type Point = { x: number; y: number };
export type Polygon = readonly Point[];

export type RoomGeometry = {
  width: number;
  height: number;
  floor: Polygon;
  obstacles: readonly Polygon[];
};

const GRID_STEP = 16;
const FOOT_CLEARANCE = 12;

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function pointInPolygon(point: Point, polygon: Polygon): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if ((a.y > point.y) !== (b.y > point.y)
      && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

function edgeDistance(point: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1,
    ((point.x - a.x) * dx + (point.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
  return distance(point, { x: a.x + t * dx, y: a.y + t * dy });
}

function nearBoundary(point: Point, polygon: Polygon): boolean {
  return polygon.some((a, index) => edgeDistance(point, a, polygon[(index + 1) % polygon.length]) < FOOT_CLEARANCE);
}

export function isWalkable(room: RoomGeometry, point: Point): boolean {
  if (!pointInPolygon(point, room.floor) || nearBoundary(point, room.floor)) return false;
  return !room.obstacles.some((obstacle) => pointInPolygon(point, obstacle) || nearBoundary(point, obstacle));
}

export function segmentIsWalkable(room: RoomGeometry, from: Point, to: Point): boolean {
  const steps = Math.max(1, Math.ceil(distance(from, to) / 6));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    if (!isWalkable(room, { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t })) return false;
  }
  return true;
}

type Grid = { columns: number; points: Point[]; walkable: Uint8Array };
const grids = new WeakMap<RoomGeometry, Grid>();

function navigationGrid(room: RoomGeometry): Grid {
  const cached = grids.get(room);
  if (cached) return cached;
  const columns = Math.floor(room.width / GRID_STEP) + 1;
  const rows = Math.floor(room.height / GRID_STEP) + 1;
  const points = Array.from({ length: columns * rows }, (_, i) => ({
    x: (i % columns) * GRID_STEP, y: Math.floor(i / columns) * GRID_STEP,
  }));
  const walkable = Uint8Array.from(points, (point) => Number(isWalkable(room, point)));
  const grid = { columns, points, walkable };
  grids.set(room, grid);
  return grid;
}

function nearestNode(room: RoomGeometry, grid: Grid, point: Point): number {
  let best = -1;
  let bestDistance = GRID_STEP * 3;
  for (let i = 0; i < grid.points.length; i++) {
    if (!grid.walkable[i]) continue;
    const candidateDistance = distance(point, grid.points[i]);
    if (candidateDistance < bestDistance && segmentIsWalkable(room, point, grid.points[i])) {
      best = i;
      bestDistance = candidateDistance;
    }
  }
  return best;
}

/** Find a collision-safe path; never snap a furniture/wall click onto unrelated floor. */
export function findPath(room: RoomGeometry, from: Point, to: Point): Point[] {
  if (!isWalkable(room, from) || !isWalkable(room, to)) return [];
  if (segmentIsWalkable(room, from, to)) return [{ ...to }];
  const grid = navigationGrid(room);
  const start = nearestNode(room, grid, from);
  const goal = nearestNode(room, grid, to);
  if (start < 0 || goal < 0) return [];

  const parents = new Int32Array(grid.points.length).fill(-1);
  const queue = new Int32Array(grid.points.length);
  let read = 0;
  let write = 0;
  queue[write++] = start;
  parents[start] = start;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (read < write && parents[goal] === -1) {
    const current = queue[read++];
    for (const [dx, dy] of directions) {
      const next = current + dx + dy * grid.columns;
      if (next < 0 || next >= grid.points.length || parents[next] !== -1 || !grid.walkable[next]) continue;
      // Reject row wrapping and diagonal corner cuts around furniture.
      if (Math.abs(grid.points[next].x - grid.points[current].x) > GRID_STEP) continue;
      if (dx && dy && (!grid.walkable[current + dx] || !grid.walkable[current + dy * grid.columns])) continue;
      if (!segmentIsWalkable(room, grid.points[current], grid.points[next])) continue;
      parents[next] = current;
      queue[write++] = next;
    }
  }
  if (parents[goal] === -1) return [];
  const route: Point[] = [];
  for (let node = goal; ; node = parents[node]) {
    route.push(grid.points[node]);
    if (node === start) break;
  }
  route.reverse();
  const all = [from, ...route, to];
  const simplified: Point[] = [];
  for (let anchor = 0; anchor < all.length - 1; ) {
    let next = anchor + 1;
    for (let candidate = all.length - 1; candidate > next; candidate--) {
      if (segmentIsWalkable(room, all[anchor], all[candidate])) { next = candidate; break; }
    }
    simplified.push({ ...all[next] });
    anchor = next;
  }
  return simplified;
}
