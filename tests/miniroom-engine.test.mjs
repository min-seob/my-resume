import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Compile the pure geometry modules with the project's existing TypeScript dependency.
async function loadModule(filename) {
  const source = await readFile(new URL(`../src/components/home/${filename}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
}
const [{ findPath, isWalkable, segmentIsWalkable }, { ROOM_SCENES, movementOrigin, foregroundDepth }] = await Promise.all([
  loadModule("miniroom-engine.ts"), loadModule("miniroom-scenes.ts"),
]);
const polygon = (points) => points.map(([x, y]) => ({ x, y }));

function assertSafeRoute(room, from, to, route) {
  assert.ok(route.length, "Target must be reachable");
  assert.deepEqual(route.at(-1), to);
  let previous = from;
  for (const point of route) {
    assert.ok(segmentIsWalkable(room, previous, point), "Every simplified segment must avoid furniture and walls");
    previous = point;
  }
}

test("both room spawns and doorway approaches are reachable on valid floor", () => {
  for (const scene of Object.values(ROOM_SCENES)) {
    assert.ok(isWalkable(scene, scene.initialPosition));
    assert.ok(isWalkable(scene, scene.door.approach));
    assertSafeRoute(scene, scene.initialPosition, scene.door.approach,
      findPath(scene, scene.initialPosition, scene.door.approach));
    const destination = ROOM_SCENES[scene.door.to];
    assert.ok(destination.door.to === scene.id || destination.stairs?.to === scene.id, "Exits must have a return door or staircase");
  }
});

test("ordinary walking paths never enter furniture footprints or the outside wall", () => {
  const targets = [
    [ROOM_SCENES.coding, { x: 660, y: 420 }],
    [ROOM_SCENES.coding, { x: 855, y: 720 }],
    [ROOM_SCENES.coding, { x: 1000, y: 200 }],
    [ROOM_SCENES.rest, { x: 650, y: 410 }],
    [ROOM_SCENES.rest, { x: 250, y: 600 }],
  ];
  for (const [room, point] of targets) {
    assert.equal(isWalkable(room, point), false);
    assert.deepEqual(findPath(room, room.initialPosition, point), []);
  }
});

test("walking across the coding room detours around the portable display", () => {
  const room = ROOM_SCENES.coding;
  const from = { x: 700, y: 660 };
  const to = { x: 1000, y: 760 };
  assert.equal(segmentIsWalkable(room, from, to), false);
  const route = findPath(room, from, to);
  assert.ok(route.length > 1, "Straight-line walking would pass through the appliance");
  assertSafeRoute(room, from, to, route);
});

test("diagonal corners with no clearance cannot be used as a passage", () => {
  const room = {
    width: 256, height: 256,
    floor: polygon([[0, 0], [256, 0], [256, 256], [0, 256]]),
    obstacles: [
      polygon([[128, 0], [256, 0], [256, 128], [128, 128]]),
      polygon([[0, 128], [128, 128], [128, 256], [0, 256]]),
    ],
  };
  assert.deepEqual(findPath(room, { x: 60, y: 60 }, { x: 200, y: 200 }), []);
});

test("wall and furniture boundaries include foot clearance", () => {
  const room = {
    width: 256, height: 256,
    floor: polygon([[0, 0], [256, 0], [256, 256], [0, 256]]),
    obstacles: [polygon([[100, 100], [156, 100], [156, 156], [100, 156]])],
  };
  assert.equal(isWalkable(room, { x: 5, y: 50 }), false);
  assert.equal(isWalkable(room, { x: 95, y: 120 }), false);
  assertSafeRoute(room, { x: 40, y: 40 }, { x: 210, y: 210 },
    findPath(room, { x: 40, y: 40 }, { x: 210, y: 210 }));
});

test("all five seats can be approached, left for another seat, and left for the door", () => {
  let seats = 0;
  for (const room of Object.values(ROOM_SCENES)) for (const seat of room.seats) {
    seats++;
    assert.equal(isWalkable(room, seat.position), false, "Furniture seat is not general walking floor");
    assert.ok(isWalkable(room, seat.approach), "A seat must have a reachable standing position");
    assertSafeRoute(room, room.initialPosition, seat.approach, findPath(room, room.initialPosition, seat.approach));
    const origin = movementOrigin(room, seat.position, seat.id);
    assertSafeRoute(room, origin, room.door.approach, findPath(room, origin, room.door.approach));
    for (const nextSeat of room.seats) {
      assertSafeRoute(room, origin, nextSeat.approach, findPath(room, origin, nextSeat.approach));
    }
    assert.ok(seat.frame >= 10 && seat.frame < 14, "Use a seated pose from the action atlas");
  }
  assert.equal(seats, 5);
});

test("new bedroom furniture blocks its footprints while the rug and doorway remain walkable", () => {
  const bedroom = ROOM_SCENES.rest;
  for (const point of [{ x: 1050, y: 490 }, { x: 1210, y: 520 }, { x: 510, y: 485 }]) {
    assert.equal(isWalkable(bedroom, point), false);
  }
  const rug = { x: 620, y: 700 };
  assertSafeRoute(bedroom, bedroom.door.approach, rug, findPath(bedroom, bedroom.door.approach, rug));
});

test("bed-front floor stays in front of the furniture layer and upward movement cannot enter the bed", () => {
  const bedroom = ROOM_SCENES.rest;
  const bed = bedroom.foregrounds.find((item) => item.frontEdge);
  for (const position of [{ x: 500, y: 550 }, { x: 507, y: 569 }, { x: 650, y: 590 }]) {
    assert.ok(isWalkable(bedroom, position));
    assert.ok(foregroundDepth(bed, position) < position.y, "Standing in front of the bed must show the whole avatar");
    assert.deepEqual(findPath(bedroom, position, { x: position.x, y: position.y - 72 }), [], "Up key cannot enter the bed/bench footprint");
  }
  assert.equal(isWalkable(bedroom, { x: 500, y: 530 }), false, "Bench legs and their clearance block entry");
});
