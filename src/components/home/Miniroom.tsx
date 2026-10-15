"use client";

import Image from "next/image";
import { LoftCats } from "./LoftCats";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";

import { distance, findPath, isWalkable } from "./miniroom-engine";
import type { Point } from "./miniroom-engine";
import { MINIROOM_ASSETS, ROOM_SCENES, movementOrigin, foregroundDepth } from "./miniroom-scenes";
import type { RoomId, SeatId } from "./miniroom-scenes";

type Phase = "idle" | "walking" | "approaching" | "opening" | "leaving" | "switching" | "arriving"
  | "seat-approach" | "sitting-down" | "sitting" | "standing-up";
type PoseTransition = { from: Point; to: Point; startedAt: number; duration: number; progress: number };
type Simulation = {
  roomId: RoomId;
  travelTo: RoomId | null;
  position: Point;
  path: Point[];
  phase: Phase;
  doorOpen: boolean;
  deadline: number;
  closeDoorAt: number;
  walkElapsed: number;
  mirrored: boolean;
  idleFrame: number;
  target: Point | null;
  seatId: SeatId | null;
  pendingSeatId: SeatId | null;
  transition: PoseTransition | null;
  resumePhase: "walking" | "approaching" | "seat-approach";
};
type RoomUI = Pick<Simulation, "roomId" | "phase" | "doorOpen" | "target" | "seatId" | "travelTo">;
const INITIAL_UI: RoomUI = { roomId: "coding", phase: "idle", doorOpen: false, target: null, seatId: null, travelTo: null };
const WALK_SPEED = 205;


const BUSY_PHASES: Phase[] = ["opening", "leaving", "switching", "arriving", "sitting-down", "standing-up"];

function positionStyle(point: Point): CSSProperties {
  return { left: `${point.x / 1536 * 100}%`, top: `${point.y / 1024 * 100}%` };
}

function rectangleStyle(rectangle: { x: number; y: number; width: number; height: number }): CSSProperties {
  return { ...positionStyle(rectangle), width: `${rectangle.width / 1536 * 100}%`, height: `${rectangle.height / 1024 * 100}%` };
}

function spriteTransform(point: Point, mirrored: boolean, anchor: Point = { x: 48, y: 154 }): string {
  return `translate3d(${(point.x - anchor.x) / 96 * 100}%, ${(point.y - anchor.y) / 160 * 100}%, 0) scaleX(${mirrored ? -1 : 1})`;
}

export function Miniroom() {
  const [ui, setUI] = useState<RoomUI>(INITIAL_UI);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [assetAttempt, setAssetAttempt] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [landscape, setLandscape] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const foregroundRefs = useRef(new Map<string, HTMLImageElement>());
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const readyRef = useRef(false);
  const pointerStartRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const reduceMotionRef = useRef(false);
  const simulationRef = useRef<Simulation>({
    ...INITIAL_UI, position: { ...ROOM_SCENES.coding.initialPosition }, path: [],
    deadline: 0, closeDoorAt: 0, walkElapsed: 0, mirrored: false, idleFrame: 0,
    pendingSeatId: null, transition: null, resumePhase: "walking",
  });

  const publish = useCallback(() => {
    const sim = simulationRef.current;
    setUI({ roomId: sim.roomId, phase: sim.phase, doorOpen: sim.doorOpen, target: sim.target, seatId: sim.seatId, travelTo: sim.travelTo });
  }, []);

  // Continuous coordinates stay in refs and the DOM; React only renders action changes.
  const paintSprite = useCallback(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;
    const sim = simulationRef.current;
    const seat = ROOM_SCENES[sim.roomId].seats.find((item) => item.id === sim.seatId);
    const progress = sim.transition?.progress ?? 1;
    const seated = seat && (sim.phase === "sitting"
      || (sim.phase === "sitting-down" && progress >= 0.5)
      || (sim.phase === "standing-up" && progress < 0.5));
    // Floor points use a foot anchor; seat points use a hip anchor. Never glide
    // between those different coordinate meanings across furniture.
    sprite.style.opacity = sim.transition ? String(Math.abs(progress * 2 - 1)) : "1";
    const walking = sim.path.length > 0 && !sim.transition && !reduceMotionRef.current;
    const frame = seated ? seat.frame : walking ? 4 + Math.floor(sim.walkElapsed / 105) % 6 : sim.idleFrame;
    sprite.style.backgroundPosition = `${frame / 13 * 100}% 0`;
    sprite.style.transform = spriteTransform(sim.position, seated ? false : sim.mirrored, seated ? seat.anchor : undefined);
    sprite.style.zIndex = String(seated ? seat.depth : Math.round(sim.position.y));
    sprite.dataset.frame = String(frame);
    sprite.dataset.seat = sim.seatId ?? "";
    sprite.dataset.position = `${Math.round(sim.position.x)},${Math.round(sim.position.y)}`;
    for (const item of ROOM_SCENES[sim.roomId].foregrounds) {
      const foreground = foregroundRefs.current.get(item.src);
      if (foreground) foreground.style.zIndex = String(Math.round(foregroundDepth(item, sim.position)));
    }
  }, []);

  const tick = useCallback(function animate(time: number) {
    frameRef.current = null;
    const sim = simulationRef.current;
    const elapsed = lastTimeRef.current ? Math.min(time - lastTimeRef.current, 50) : 16;
    lastTimeRef.current = time;
    let changed = false;

    if (sim.deadline && time >= sim.deadline) {
      sim.deadline = 0;
      if (sim.phase === "opening") {
        sim.phase = "leaving";
        const scene = ROOM_SCENES[sim.roomId];
        sim.path = [{ ...(scene.stairs && sim.travelTo === scene.stairs.to ? scene.stairs : scene.door).threshold }];
      } else if (sim.phase === "switching") {
        const sourceRoom = sim.roomId;
        sim.roomId = sim.travelTo ?? ROOM_SCENES[sourceRoom].door.to;
        const destination = ROOM_SCENES[sim.roomId];
        const entrance = destination.stairs?.to === sourceRoom ? destination.stairs : destination.door;
        sim.position = { ...entrance.threshold };
        sim.path = [{ ...entrance.approach }];
        sim.doorOpen = sourceRoom !== "loft" && sim.roomId !== "loft";
        sim.phase = "arriving";
        sim.walkElapsed = 0;
        sim.seatId = null;
        sim.pendingSeatId = null;
      }
      changed = true;
    }

    if (sim.transition) {
      const transition = sim.transition;
      const t = Math.min(1, (time - transition.startedAt) / transition.duration);
      transition.progress = t;
      sim.position = {...(t < 0.5 ? transition.from : transition.to)};
      if (t >= 1) {
        sim.transition = null;
        if (sim.phase === "sitting-down") {
          sim.phase = "sitting";
          sim.target = null;
        } else {
          sim.seatId = null;
          sim.phase = sim.resumePhase;
        }
        changed = true;
      }
    }

    if (!sim.transition && sim.path.length) {
      sim.walkElapsed += elapsed;
      let budget = reduceMotionRef.current ? Infinity : WALK_SPEED * elapsed / 1000;
      while (sim.path.length && budget > 0) {
        const next = sim.path[0];
        const remaining = distance(sim.position, next);
        const dx = next.x - sim.position.x;
        const dy = next.y - sim.position.y;
        if (Math.abs(dx) > 1) sim.mirrored = dx < 0;
        sim.idleFrame = dy < -Math.abs(dx) ? 3 : Math.abs(dy) > Math.abs(dx) ? 0 : 2;
        if (remaining <= budget) {
          sim.position = { ...next };
          sim.path.shift();
          budget -= remaining;
        } else {
          sim.position = { x: sim.position.x + dx / remaining * budget, y: sim.position.y + dy / remaining * budget };
          budget = 0;
        }
      }
      if (!sim.path.length) {
        if (sim.phase === "seat-approach") {
          const seat = ROOM_SCENES[sim.roomId].seats.find((item) => item.id === sim.pendingSeatId);
          if (seat) {
            sim.seatId = seat.id;
            sim.pendingSeatId = null;
            sim.phase = "sitting-down";
            sim.transition = { from: { ...sim.position }, to: { ...seat.position }, startedAt: time, progress: 0,
              duration: reduceMotionRef.current ? 100 : 240 };
          } else {
            sim.phase = "idle";
          }
        } else if (sim.phase === "approaching") {
          sim.phase = "opening";
          sim.doorOpen = ROOM_SCENES[sim.roomId].door.kind !== "stairs" && sim.travelTo !== ROOM_SCENES[sim.roomId].stairs?.to;
          sim.deadline = time + (reduceMotionRef.current ? 100 : 700);
          sim.idleFrame = 3;
        } else if (sim.phase === "leaving") {
          sim.phase = "switching";
          sim.deadline = time + (reduceMotionRef.current ? 100 : 300);
        } else {
          if (sim.phase === "arriving") sim.closeDoorAt = time + 700;
          sim.phase = "idle";
          sim.travelTo = null;
          sim.target = null;
        }
        changed = true;
      }
    }

    if (sim.closeDoorAt && time >= sim.closeDoorAt) {
      sim.closeDoorAt = 0;
      sim.doorOpen = false;
      changed = true;
    }
    paintSprite();
    if (changed) publish();
    if (sim.path.length || sim.deadline || sim.closeDoorAt || sim.transition) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      lastTimeRef.current = 0;
    }
  }, [paintSprite, publish]);

  const startLoop = useCallback(() => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    let active = true;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = query.matches;
    const handleMotionChange = (event: MediaQueryListEvent) => { reduceMotionRef.current = event.matches; };
    query.addEventListener("change", handleMotionChange);
    const images = MINIROOM_ASSETS.map((src) => {
      const image = new window.Image();
      image.src = src;
      return image;
    });
    Promise.all(images.map((image) => image.decode())).then(() => {
      if (!active) return;
      readyRef.current = true;
      setReady(true);
      setLoadError(false);
      paintSprite();
    }).catch(() => {
      if (!active) return;
      readyRef.current = false;
      setLoadError(true);
    });
    return () => {
      active = false;
      readyRef.current = false;
      query.removeEventListener("change", handleMotionChange);
    };
  }, [assetAttempt, paintSprite]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const moveTo = useCallback((point: Point, towardDoor = false, seatIntent: SeatId | null = null, travelTo: RoomId | null = null) => {
    const sim = simulationRef.current;
    if (!readyRef.current || BUSY_PHASES.includes(sim.phase)) return;
    const scene = ROOM_SCENES[sim.roomId];
    if (!isWalkable(scene, point)) {
      setFeedback("가구를 피해 바닥의 빈 공간을 눌러주세요.");
      return;
    }
    const origin = movementOrigin(scene, sim.position, sim.seatId);
    const path = findPath(scene, origin, point);
    if (!path.length) {
      setFeedback("이쪽으로는 길이 막혀 있어요. 다른 바닥을 눌러주세요.");
      return;
    }
    const wasWalking = sim.path.length > 0;
    sim.path = path;
    sim.pendingSeatId = seatIntent;
    sim.travelTo = towardDoor ? travelTo ?? scene.door.to : null;
    sim.resumePhase = towardDoor ? "approaching" : seatIntent ? "seat-approach" : "walking";
    if (sim.seatId) {
      sim.phase = "standing-up";
      sim.transition = { from: { ...sim.position }, to: { ...origin }, startedAt: performance.now(), progress: 0,
        duration: reduceMotionRef.current ? 100 : 240 };
    } else {
      sim.phase = sim.resumePhase;
    }
    sim.target = towardDoor || seatIntent ? null : point;
    if (!wasWalking) sim.walkElapsed = 0;
    sim.closeDoorAt = 0;
    if (!towardDoor) sim.doorOpen = false;
    setFeedback("");
    publish();
    startLoop();
  }, [publish, startLoop]);

  const activateDoor = useCallback(() => {
    const scene = ROOM_SCENES[simulationRef.current.roomId];
    moveTo(scene.door.approach, true, null, scene.door.to);
  }, [moveTo]);

  const activateStairs = useCallback(() => {
    const scene = ROOM_SCENES[simulationRef.current.roomId];
    if (scene.stairs) moveTo(scene.stairs.approach, true, null, scene.stairs.to);
  }, [moveTo]);

  const activateSeat = useCallback((id: SeatId) => {
    const sim = simulationRef.current;
    const seat = ROOM_SCENES[sim.roomId].seats.find((item) => item.id === id);
    if (!seat) return;
    if (sim.seatId === id && sim.phase === "sitting") {
      setFeedback(`${seat.label}에 앉아 있어요. 바닥을 누르면 일어나요.`);
      return;
    }
    moveTo(seat.approach, false, seat.id);
  }, [moveTo]);

  function rotateDisplay() {
    const sim = simulationRef.current;
    if (!readyRef.current || BUSY_PHASES.includes(sim.phase) || !ROOM_SCENES[sim.roomId].display) return;
    setLandscape(!landscape);
    setFeedback(`스탠바이미를 ${landscape ? "세로" : "가로"}로 돌렸어요.`);
  }

  function handlePointerStart(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    pointerStartRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function handleFloor(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start || start.id !== event.pointerId || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) return;
    if (event.target instanceof Element && event.target.closest("button")) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.focus({ preventScroll: true });
    moveTo({ x: (event.clientX - bounds.left) / bounds.width * 1536, y: (event.clientY - bounds.top) / bounds.height * 1024 });
  }

  function moveBy(dx: number, dy: number) {
    const sim = simulationRef.current;
    const position = movementOrigin(ROOM_SCENES[sim.roomId], sim.position, sim.seatId);
    moveTo({ x: position.x + dx, y: position.y + dy });
  }

  function handleKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const directions: Record<string, [number, number]> = { ArrowLeft: [-72, 0], ArrowRight: [72, 0], ArrowUp: [0, -72], ArrowDown: [0, 72] };
    if (directions[event.key]) {
      event.preventDefault();
      moveBy(...directions[event.key]);
    } else if (event.key === "Enter") {
      event.preventDefault();
      activateDoor();
    }
  }

  const scene = ROOM_SCENES[ui.roomId];
  const destination = ROOM_SCENES[ui.travelTo ?? scene.door.to];
  const usingStairs = scene.door.kind === "stairs" || ui.travelTo === scene.stairs?.to;
  const destinationDirection = `${destination.name}${destination.id === "rest" ? "로" : "으로"}`;
  const busy = BUSY_PHASES.includes(ui.phase);
  const occupiedSeat = scene.seats.find((seat) => seat.id === ui.seatId);
  const foregrounds = scene.foregrounds.filter((item) =>
    !occupiedSeat?.hideForegrounds.includes(item.src)
    && !(landscape && item.src === scene.display?.portraitForeground));
  const phaseText: Record<Phase, string> = {
    idle: "천천히 둘러보세요", walking: "걷는 중", approaching: usingStairs ? "계단 앞으로 가는 중" : "문 앞으로 가는 중",
    opening: usingStairs ? "계단으로 이동하는 중" : "문 여는 중", leaving: `${destinationDirection} 이동 중`,
    switching: "다음 방으로 이동 중", arriving: `${scene.name}에 들어오는 중`,
    "seat-approach": "앉을 자리로 가는 중", "sitting-down": "자리에 앉는 중",
    sitting: `${occupiedSeat?.label ?? "자리"}에 앉아 있어요 · 바닥을 누르면 일어나요`,
    "standing-up": "자리에서 일어나는 중",
  };

  return (
    <section id="miniroom" className="miniroom-card" aria-labelledby="miniroom-title">
      <div className="miniroom-heading">
        <div>
          <span className="miniroom-small-label">나의 미니룸</span>
          <h2 id="miniroom-title">{scene.name}</h2>
        </div>
        <span className="miniroom-room-count">코딩방 ↔ 침실 ↔ 복층</span>
      </div>
      <p id="miniroom-instructions" className="miniroom-instructions">바닥은 걷기, 소파·의자는 앉기, 스탠바이미는 화면 돌리기. 문은 다른 방으로, 침실 계단은 고양이 복층으로 이어져요.</p>

      <div ref={stageRef} className="miniroom-stage" role="group" tabIndex={0}
        aria-label={`${scene.name}의 움직이는 미니룸`} aria-describedby="miniroom-instructions"
        data-room={ui.roomId} data-phase={ui.phase} data-ready={ready} data-seat={ui.seatId ?? ""}
        data-display={scene.display ? landscape ? "landscape" : "portrait" : "none"}
        onPointerDown={handlePointerStart} onPointerUp={handleFloor}
        onPointerCancel={() => { pointerStartRef.current = null; }} onKeyDown={handleKeyboard}>
        <div className="miniroom-visual">
          <Image className="miniroom-background" src={scene.background} alt={scene.description}
            width={1536} height={1024} unoptimized draggable={false} preload />
          {scene.door.kind !== "stairs" ? <Image className={`miniroom-door-patch${ui.doorOpen && !usingStairs ? " is-open" : ""}`}
            src={scene.door.patch.src} alt="" width={scene.door.patch.width} height={scene.door.patch.height}
            style={rectangleStyle(scene.door.patch)} unoptimized draggable={false} /> : null}
          {scene.display ? <Image className={`miniroom-display-patch${landscape ? " is-landscape" : ""}`}
            src={scene.display.landscapePatch.src} alt="" width={scene.display.landscapePatch.width}
            height={scene.display.landscapePatch.height} unoptimized draggable={false}
            style={rectangleStyle(scene.display.landscapePatch)} /> : null}
          {ui.target ? <span className="miniroom-target" style={positionStyle(ui.target)} aria-hidden="true" /> : null}
          <div ref={spriteRef} className="miniroom-avatar" role="img" aria-label="검정 후드티를 입은 미니미"
            style={{ transform: spriteTransform(ROOM_SCENES.coding.initialPosition, false), zIndex: ROOM_SCENES.coding.initialPosition.y }} />
          <LoftCats active={ready && scene.id === "loft" && ui.phase !== "switching"} />
          {foregrounds.map((item) => <Image key={item.src} className="miniroom-foreground" src={item.src}
            ref={(image) => { if (image) foregroundRefs.current.set(item.src, image); else foregroundRefs.current.delete(item.src); }}
            alt="" width={1536} height={1024} unoptimized draggable={false} style={{ zIndex: item.depth }} />)}
          {scene.display && landscape ? <Image className="miniroom-foreground" src={scene.display.landscapeForeground}
            alt="" width={1536} height={1024} unoptimized draggable={false} style={{ zIndex: scene.display.depth }} /> : null}
        </div>
        {scene.seats.map((seat) => <button type="button" key={seat.id} className="miniroom-furniture"
          aria-label={`${seat.label}에 앉기`} aria-pressed={ui.seatId === seat.id} data-seat-id={seat.id}
          style={rectangleStyle(seat.hitbox)} disabled={!ready || busy}
          onPointerDown={(event) => event.stopPropagation()} onClick={() => activateSeat(seat.id)}>
          <span className="miniroom-furniture-label">{seat.label} · 앉기</span>
        </button>)}
        {scene.display ? <button type="button" className="miniroom-furniture miniroom-display-control"
          aria-label="스탠바이미 화면 회전" aria-pressed={landscape}
          aria-describedby="miniroom-display-description"
          style={rectangleStyle(scene.display.hitbox)} disabled={!ready || busy}
          onPointerDown={(event) => event.stopPropagation()} onClick={rotateDisplay}>
          <span id="miniroom-display-description" className="sr-only">현재 {landscape ? "가로" : "세로"} 화면. 누르면 {landscape ? "세로" : "가로"}로 돌아갑니다.</span>
          <span className="miniroom-furniture-label">{landscape ? "세로" : "가로"}로 돌리기</span>
        </button> : null}
        <button type="button" className="miniroom-door" aria-label={`${ROOM_SCENES[scene.door.to].name} 가는 ${scene.door.kind === "stairs" ? "계단" : "문"}`}
          style={rectangleStyle(scene.door.hitbox)} disabled={!ready || busy}
          data-open={ui.doorOpen} onPointerDown={(event) => event.stopPropagation()} onClick={activateDoor}>
          <span className="miniroom-door-label">{ROOM_SCENES[scene.door.to].name} <span aria-hidden="true">↗</span></span>
        </button>
        {scene.stairs ? <button type="button" className="miniroom-door" aria-label="고양이 복층으로 올라가는 계단"
          style={rectangleStyle(scene.stairs.hitbox)} disabled={!ready || busy}
          onPointerDown={(event) => event.stopPropagation()} onClick={activateStairs}>
          <span className="miniroom-door-label">미미·꼬미 복층 ↗</span>
        </button> : null}
        {!ready ? <div className="miniroom-loading" role="status">
          <span>{loadError ? "방을 불러오지 못했어요." : "방을 준비하고 있어요…"}</span>
          {loadError ? <button type="button" onPointerDown={(event) => event.stopPropagation()}
            onClick={() => { setLoadError(false); setReady(false); setAssetAttempt((attempt) => attempt + 1); }}>다시 불러오기</button> : null}
        </div> : null}
      </div>

      <div className="miniroom-toolbar">
        <div className="miniroom-status" role="status" aria-live="polite">
          <span className="miniroom-status-dot" aria-hidden="true" />
          {feedback || (ready ? phaseText[ui.phase] : loadError ? "새로 불러와 주세요" : "불러오는 중")}
        </div>
        <button type="button" className="miniroom-travel" disabled={!ready || busy} onClick={activateDoor}>
          {scene.door.kind === "stairs" ? "계단 내려가 침실로" : `문 열고 ${ROOM_SCENES[scene.door.to].name} 가기`} <span aria-hidden="true">→</span>
        </button>
      </div>
      {scene.stairs ? <button type="button" className="miniroom-travel miniroom-stairs-travel" disabled={!ready || busy}
        onClick={activateStairs}>계단 올라가 미미·꼬미 복층 가기 ↑</button> : null}
      {scene.id === "loft" ? <p className="miniroom-instructions">미미와 꼬미는 캣타워·숨숨집·화장실·쿠션을 오가며 쉬고, 밥과 물도 먹어요. 화장실·자동급식기·식수기는 각각 두 개씩 있어요.</p> : null}
      <div className="miniroom-furniture-controls" aria-label="가구 상호작용 버튼">
        {scene.seats.map((seat) => <button type="button" key={seat.id} disabled={!ready || busy}
          aria-pressed={ui.seatId === seat.id} onClick={() => activateSeat(seat.id)}>{seat.label} 앉기</button>)}
        {scene.display ? <button type="button" disabled={!ready || busy} aria-pressed={landscape}
          aria-label="스탠바이미 화면 회전 버튼"
          aria-describedby="miniroom-display-description"
          onClick={rotateDisplay}>스탠바이미: {landscape ? "가로" : "세로"} <span aria-hidden="true">↻</span></button> : null}
      </div>
      <div className="miniroom-controls" aria-label="미니미 이동 버튼">
        <span>방향키로도 움직일 수 있어요</span>
        {([[-72, 0, "왼쪽", "←"], [0, -72, "위쪽", "↑"], [0, 72, "아래쪽", "↓"], [72, 0, "오른쪽", "→"]] as const).map(([dx, dy, label, arrow]) => (
          <button key={label} type="button" aria-label={`${label}으로 걷기`} disabled={!ready || busy} onClick={() => moveBy(dx, dy)}>{arrow}</button>
        ))}
      </div>
    </section>
  );
}
