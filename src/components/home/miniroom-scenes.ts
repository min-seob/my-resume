import type { Point, Polygon, RoomGeometry } from "./miniroom-engine";

export type RoomId = "coding" | "rest" | "loft";
export type SeatId = "sofa" | "coding-chair" | "gaming-chair" | "reading-chair" | "bed-bench";
type Rectangle = { x: number; y: number; width: number; height: number };
export type Seat = {
  id: SeatId;
  label: string;
  approach: Point;
  position: Point;
  anchor: Point;
  frame: number;
  depth: number;
  hitbox: Rectangle;
  hideForegrounds: readonly string[];
};
export type Foreground = { src: string; depth: number; frontEdge?: readonly Point[] };
export type RoomScene = RoomGeometry & {
  id: RoomId;
  name: string;
  description: string;
  background: string;
  initialPosition: Point;
  seats: readonly Seat[];
  display?: {
    hitbox: Rectangle;
    landscapePatch: Rectangle & { src: string };
    portraitForeground: string;
    landscapeForeground: string;
    depth: number;
  };
  stairs?: { to: RoomId; approach: Point; threshold: Point; hitbox: Rectangle };
  door: {
    kind?: "stairs";
    to: RoomId;
    approach: Point;
    threshold: Point;
    hitbox: { x: number; y: number; width: number; height: number };
    patch: { x: number; y: number; width: number; height: number; src: string };
  };
  foregrounds: readonly Foreground[];
};

const polygon = (vertices: number[][]): Polygon => vertices.map(([x, y]) => ({ x, y }));

export const ROOM_SCENES: Record<RoomId, RoomScene> = {
  coding: {
    id: "coding", name: "코딩방", width: 1536, height: 1024,
    description: "맥북과 외부 모니터 두 대, 태블릿, 별도의 듀얼 모니터 게임 책상. 통유리 앞 맥주용 미니냉장고와 소파 앞 이동식 화면, 공기청정기가 있는 작업실.",
    background: "/minihome/coding-room.webp",
    initialPosition: { x: 620, y: 610 },
    seats: [
      { id: "sofa", label: "소파", approach: { x: 680, y: 650 }, position: { x: 768, y: 820 }, anchor: { x: 35, y: 121 },
        frame: 10, depth: 900, hitbox: { x: 443, y: 697, width: 475, height: 277 },
        hideForegrounds: ["/minihome/coding-sofa-foreground.webp"] },
      { id: "coding-chair", label: "코딩 의자", approach: { x: 675, y: 523 }, position: { x: 677, y: 360 }, anchor: { x: 35, y: 121 },
        frame: 12, depth: 420, hitbox: { x: 588, y: 270, width: 132, height: 185 }, hideForegrounds: [] },
      { id: "gaming-chair", label: "게임 의자", approach: { x: 980, y: 607 }, position: { x: 1190, y: 535 }, anchor: { x: 35, y: 121 },
        frame: 12, depth: 600, hitbox: { x: 1080, y: 397, width: 187, height: 245 }, hideForegrounds: [] },
    ],
    display: {
      hitbox: { x: 768, y: 462, width: 163, height: 282 },
      landscapePatch: { x: 768, y: 462, width: 163, height: 282, src: "/minihome/coding-standbyme-landscape-patch.webp" },
      portraitForeground: "/minihome/coding-standbyme-foreground.webp",
      landscapeForeground: "/minihome/coding-standbyme-landscape-foreground.webp", depth: 734,
    },
    floor: polygon([[60, 617], [445, 410], [936, 405], [1490, 640], [834, 978]]),
    obstacles: [
      polygon([[310, 408], [460, 405], [485, 455], [317, 530]]), // Bookshelf.
      polygon([[490, 320], [919, 329], [938, 444], [641, 497], [475, 415]]), // Coding desk/chair.
      polygon([[1010, 433], [1405, 494], [1445, 625], [1239, 676], [1015, 550]]), // Gaming desk/chair.
      polygon([[906, 414], [1018, 402], [1025, 463], [923, 491]]), // Fridge.
      polygon([[813, 691], [891, 681], [914, 735], [824, 752]]), // Portable display base.
      polygon([[470, 706], [742, 691], [994, 799], [919, 977], [820, 990], [448, 824]]), // Sofa/table.
      polygon([[1120, 681], [1369, 639], [1399, 688], [1300, 791], [1121, 837]]), // Low shelf.
      polygon([[1428, 591], [1504, 576], [1517, 649], [1440, 678]]), // Purifier.
      polygon([[45, 551], [129, 530], [150, 602], [87, 644]]), // Plant beside doorway.
    ],
    door: {
      to: "rest", approach: { x: 225, y: 570 }, threshold: { x: 207, y: 521 },
      hitbox: { x: 96, y: 182, width: 180, height: 399 },
      patch: { x: 88, y: 172, width: 224, height: 454, src: "/minihome/coding-door-open.webp" },
    },
    foregrounds: [
      { src: "/minihome/coding-standbyme-foreground.webp", depth: 734 },
      { src: "/minihome/coding-sofa-foreground.webp", depth: 978 },
      { src: "/minihome/coding-sofa-front-foreground.webp", depth: 979 },
      { src: "/minihome/coding-chair-back-foreground.webp", depth: 455 },
      { src: "/minihome/gaming-chair-back-foreground.webp", depth: 650 },
    ],
  },
  rest: {
    stairs: { to: "loft", approach: { x: 490, y: 675 }, threshold: { x: 380, y: 610 },
      hitbox: { x: 45, y: 225, width: 400, height: 460 } },
    id: "rest", name: "침실", width: 1536, height: 1024,
    description: "킹사이즈 침대와 침대 앞 벤치, 옷장, 거울 달린 화장대, 왼쪽 벽의 목재 계단, 앞쪽 독서 의자와 작은 테이블·원형 러그가 있는 침실. 오른쪽 문을 열면 코딩방으로 돌아갈 수 있어요.",
    background: "/minihome/rest-v4-room.webp",
    initialPosition: { x: 1080, y: 720 },
    seats: [
      { id: "reading-chair", label: "침실 의자", approach: { x: 1000, y: 815 }, position: { x: 810, y: 720 }, anchor: { x: 48, y: 124 },
        frame: 13, depth: 810, hitbox: { x: 700, y: 605, width: 195, height: 200 },
        hideForegrounds: ["/minihome/rest-v4-chair-foreground.webp"] },
      { id: "bed-bench", label: "침대 앞 벤치", approach: { x: 507, y: 569 }, position: { x: 519, y: 478 }, anchor: { x: 48, y: 124 },
        frame: 13, depth: 554, hitbox: { x: 410, y: 405, width: 210, height: 140 },
        hideForegrounds: ["/minihome/rest-v2-bed-foreground.webp"] },
    ],
    floor: polygon([[42, 615], [418, 450], [958, 423], [1490, 651], [770, 970]]),
    obstacles: [
      polygon([[409, 355], [696, 203], [897, 267], [903, 434], [650, 553], [409, 480]]), // King bed.
      polygon([[414, 405], [616, 452], [616, 546], [503, 533], [414, 490]]), // Bed bench and its front legs.
      polygon([[868, 330], [963, 361], [963, 460], [868, 431]]), // Bedside table.
      polygon([[960, 420], [1156, 476], [1156, 539], [960, 473]]), // Wardrobe footprint.
      polygon([[1140, 445], [1304, 480], [1304, 577], [1140, 527]]), // Vanity footprint.
      polygon([[709, 702], [843, 663], [984, 709], [991, 789], [833, 817], [700, 761]]), // Reading chair/table.
      polygon([[303, 436], [375, 427], [398, 479], [335, 504]]), // Window plant.
      polygon([[55, 520], [285, 490], [440, 635], [320, 700], [60, 600]]), // Staircase footprint.
    ],
    door: {
      to: "coding", approach: { x: 1300, y: 674 }, threshold: { x: 1380, y: 607 },
      hitbox: { x: 1310, y: 268, width: 178, height: 368 },
      patch: { x: 1304, y: 256, width: 202, height: 432, src: "/minihome/rest-v2-door-open.webp" },
    },
    foregrounds: [
      { src: "/minihome/rest-v4-bed-foreground.webp", depth: 553,
        frontEdge: polygon([[400, 495], [503, 533], [616, 546], [650, 554], [903, 437]]) },
      { src: "/minihome/rest-v4-chair-foreground.webp", depth: 803 },
      { src: "/minihome/rest-v4-reading-table-foreground.webp", depth: 789 },
      { src: "/minihome/rest-v4-stairs-foreground.webp", depth: 680,
        frontEdge: polygon([[65, 605], [320, 683], [438, 643]]) },
    ],
  },
  loft: {
    id: "loft", name: "미미·꼬미 복층", width: 1536, height: 1024,
    description: "침실 위 고양이 복층. 화장실 2개, 자동급식기 2개, 식수기 2개와 잠자는 자리. 오른쪽 계단으로 침실에 내려가요.",
    background: "/minihome/cat-loft-room.png",
    initialPosition: { x: 930, y: 720 }, seats: [],
    floor: polygon([[45, 610], [760, 380], [1490, 650], [770, 970]]),
    obstacles: [
      polygon([[95, 440], [480, 355], [540, 490], [270, 610]]),
      polygon([[780, 350], [1340, 495], [1300, 595], [800, 480]]),
      polygon([[1100, 730], [1400, 630], [1440, 790], [1130, 915]]),
    ],
    door: {
      kind: "stairs", to: "rest", approach: { x: 920, y: 750 }, threshold: { x: 1040, y: 820 },
      hitbox: { x: 980, y: 660, width: 430, height: 220 },
      patch: { x: 0, y: 0, width: 1, height: 1, src: "/minihome/rest-v2-door-open.webp" },
    },
    foregrounds: [],
  },
};

export const MINIROOM_ASSETS = [...new Set([
  "/minihome/minimi-hoodie-actions-atlas.png",
  "/minihome/cats-atlas.png",
  "/minihome/cats-actions-atlas.png",
  ...Object.values(ROOM_SCENES).flatMap((scene) => [scene.background, scene.door.patch.src,
    ...scene.foregrounds.map((item) => item.src),
    ...(scene.display ? [scene.display.landscapePatch.src, scene.display.landscapeForeground] : []),
  ]),
])];

/** A seated avatar must return to the seat's valid floor approach before pathfinding. */
export function movementOrigin(scene: RoomScene, position: Point, seatId: SeatId | null): Point {
  return scene.seats.find((seat) => seat.id === seatId)?.approach ?? position;
}

/** Isometric furniture has a sloped front edge, not one global screen-Y depth. */
export function foregroundDepth(item: Foreground, point: Point): number {
  const edge = item.frontEdge;
  if (!edge?.length) return item.depth;
  if (point.x <= edge[0].x) return edge[0].y;
  for (let i = 1; i < edge.length; i++) {
    if (point.x <= edge[i].x) {
      const a = edge[i - 1], b = edge[i];
      return a.y + (b.y - a.y) * (point.x - a.x) / (b.x - a.x);
    }
  }
  return edge[edge.length - 1].y;
}
