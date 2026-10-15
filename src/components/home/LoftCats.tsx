"use client";

import { useEffect, useRef } from "react";
import { distance, findPath, isWalkable, segmentIsWalkable } from "./miniroom-engine";
import type { Point, RoomGeometry } from "./miniroom-engine";
import { ROOM_SCENES } from "./miniroom-scenes";

type Activity = "perching" | "hiding" | "toilet" | "cushion" | "eating" | "drinking";
type CatName = "미미" | "꼬미";
type Phase = "resting" | "walking" | "entering" | "activity" | "exiting";
type Station = { id: string; activity: Activity; approach: Point; position: Point; duration: number };
type Cat = {
  name: CatName; position: Point; path: Point[]; phase: Phase; until: number;
  mirrored: boolean; walkTime: number; blocked: number; station: Station | null;
  transition: { from: Point; to: Point; progress: number; duration: number; remaining: Point[] } | null;
  nextActivity: number; cushionVisits: number;
};
const SEPARATION = 120;
const STOPS: Point[] = [{x: 470, y: 630}, {x: 720, y: 600}, {x: 890, y: 650}, {x: 750, y: 790}, {x: 590, y: 730}, {x: 920, y: 720}];
const STATIONS: Station[] = [
  {id:"tower-top", activity:"perching", approach:{x:410,y:650}, position:{x:190,y:277}, duration:8000},
  {id:"tower-house", activity:"hiding", approach:{x:410,y:650}, position:{x:188,y:510}, duration:7000},
  {id:"litter-left", activity:"toilet", approach:{x:580,y:550}, position:{x:412,y:450}, duration:6500},
  {id:"litter-right", activity:"toilet", approach:{x:660,y:530}, position:{x:525,y:407}, duration:6500},
  {id:"cushion-green", activity:"cushion", approach:{x:710,y:520}, position:{x:700,y:355}, duration:12000},
  {id:"cushion-cream", activity:"cushion", approach:{x:870,y:550}, position:{x:845,y:375}, duration:12000},
  {id:"feeder-left", activity:"eating", approach:{x:970,y:590}, position:{x:925,y:475}, duration:7500},
  {id:"feeder-right", activity:"eating", approach:{x:1100,y:625}, position:{x:1000,y:500}, duration:7500},
  {id:"water-left", activity:"drinking", approach:{x:1100,y:640}, position:{x:1110,y:530}, duration:5500},
  {id:"water-right", activity:"drinking", approach:{x:1260,y:630}, position:{x:1200,y:558}, duration:5500},
];
const ACTIVITY_CYCLES: Record<CatName, Activity[]> = {
  "미미": ["perching", "cushion", "perching", "eating", "perching", "drinking", "hiding", "toilet"],
  "꼬미": ["cushion", "eating", "cushion", "perching", "cushion", "drinking", "hiding", "toilet"],
};
const LABELS: Record<Activity, string> = {perching:"캣타워 위",hiding:"숨숨집 안",toilet:"화장실 안",cushion:"쿠션에서 쉬기",eating:"밥 먹는 중",drinking:"물 마시는 중"};

// The other cat is a temporary obstacle, so rerouting also respects furniture.
function pathAroundCat(from: Point, to: Point, other: Cat): Point[] {
  const radius = Math.min(SEPARATION + 18, distance(from, other.position) - 16);
  if (radius < 1) return [];
  const obstacle = Array.from({length:12}, (_,i) => ({
    x:other.position.x + Math.cos(i*Math.PI/6)*radius,
    y:other.position.y + Math.sin(i*Math.PI/6)*radius,
  }));
  const room: RoomGeometry = {...ROOM_SCENES.loft, obstacles:[...ROOM_SCENES.loft.obstacles, obstacle]};
  return findPath(room, from, to);
}

export function LoftCats({ active }: { active: boolean }) {
  const elements = useRef<(HTMLDivElement | null)[]>([]);
  const cats = useRef<Cat[]>([
    {name:"미미",position:{x:660,y:620},path:[],phase:"resting",until:0,mirrored:false,walkTime:0,blocked:0,station:null,transition:null,nextActivity:0,cushionVisits:0},
    {name:"꼬미",position:{x:830,y:690},path:[],phase:"resting",until:0,mirrored:true,walkTime:0,blocked:0,station:null,transition:null,nextActivity:1,cushionVisits:0},
  ]);

  useEffect(() => {
    if (!active) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, previous = 0;
    const now = performance.now();
    cats.current.forEach((cat,i) => { if (!cat.until) cat.until = now + (i ? 5500 : 2000); });

    function plan(cat: Cat, other: Cat, time: number) {
      const cycle = ACTIVITY_CYCLES[cat.name];
      const activity = cycle[cat.nextActivity % cycle.length];
      const options = STATIONS.filter(station => station.activity === activity
        && station.id !== other.station?.id
        && distance(station.position, other.position) > SEPARATION + 20
        && distance(station.approach, other.position) > SEPARATION + 20
        && (!other.station || (distance(station.position,other.station.position) > SEPARATION + 20
          && distance(station.approach,other.station.approach) > SEPARATION + 20)));
      if (cat.name==="꼬미" && activity==="cushion") {
        const preferredCushion = cat.cushionVisits % 2 === 0 ? "cushion-cream" : "cushion-green";
        options.sort((a,b)=>Number(b.id===preferredCushion)-Number(a.id===preferredCushion));
      }
      for (const station of options) {
        const path = pathAroundCat(cat.position,station.approach,other);
        if (!path.length) continue;
        cat.station = station; cat.path = path; cat.phase = "walking";
        cat.walkTime = 0; cat.blocked = 0; cat.nextActivity++;
        if (station.activity === "cushion") cat.cushionVisits++;
        return;
      }
      // Take a free floor spot while waiting for a resource or blocked passage.
      for (const stop of [...STOPS].sort((a,b)=>distance(cat.position,a)-distance(cat.position,b))) {
        if (distance(stop,cat.position)<80 || distance(stop,other.position)<160
          || (other.path.length && distance(stop,other.path[other.path.length-1])<160)
          || (other.station && (distance(stop,other.station.approach)<160 || distance(stop,other.station.position)<160))) continue;
        const path = pathAroundCat(cat.position,stop,other);
        if (!path.length) continue;
        cat.station = null; cat.path = path; cat.phase = "walking"; cat.blocked = 0;
        return;
      }
      cat.phase = "resting"; cat.until = time + 2000;
    }

    function beginTransition(cat: Cat, target: Point, remaining: Point[] = []) {
      cat.blocked = 0;
      cat.transition = {from:{...cat.position},to:{...target},progress:0,
        duration:Math.max(650, distance(cat.position,target)/85*1000),remaining};
    }

    function yieldSpace(cat: Cat, other: Cat, time: number) {
      const length = distance(cat.position,other.position) || 1;
      const dx=(cat.position.x-other.position.x)/length, dy=(cat.position.y-other.position.y)/length;
      // A short retreat clears the other cat's route before another attempt.
      for (const [vx,vy] of [[dx,dy],[-dy,dx],[dy,-dx]]) {
        const target={x:cat.position.x+vx*180,y:cat.position.y+vy*180};
        if (!isWalkable(ROOM_SCENES.loft,target) || !segmentIsWalkable(ROOM_SCENES.loft,cat.position,target)) continue;
        if (distance(target,other.position)<SEPARATION+60) continue;
        cat.station=null;cat.transition=null;cat.path=[target];cat.phase="walking";cat.blocked=0;
        return;
      }
      cat.station=null;cat.transition=null;cat.path=[];cat.phase="resting";cat.blocked=0;cat.until=time+1800;
    }

    function animate(time: number) {
      const elapsed = previous ? Math.min(time-previous,50) : 0;
      previous = time;
      cats.current.forEach((cat,i) => {
        const other = cats.current[1-i];
        if (!document.hidden && !motion.matches) {
          if (cat.phase === "walking") {
            const next = cat.path[0];
            if (next) {
              const length = distance(cat.position,next), step = Math.min(length,elapsed*(i?100:85)/1000);
              const candidate = length ? {x:cat.position.x+(next.x-cat.position.x)/length*step,y:cat.position.y+(next.y-cat.position.y)/length*step} : next;
              if (distance(candidate,other.position) >= SEPARATION) {
                if (Math.abs(next.x-cat.position.x)>1) cat.mirrored = next.x<cat.position.x;
                cat.position = candidate; cat.walkTime += elapsed; cat.blocked = 0;
                if (step>=length) cat.path.shift();
              } else {
                cat.blocked += elapsed;
                if (cat.blocked > (i ? 1000 : 2500)) {
                  const target = cat.path[cat.path.length-1];
                  const reroute = pathAroundCat(cat.position,target,other);
                  if (reroute.length && distance(cat.position,other.position)>SEPARATION+35) {cat.path=reroute;cat.blocked=0;}
                  else yieldSpace(cat,other,time);
                }
              }
            }
            if (!cat.path.length) {
              if (cat.station) {
                cat.phase = "entering";
                if (cat.station.activity === "perching") {
                  beginTransition(cat,{x:190,y:575},[{x:165,y:475},{x:190,y:380},cat.station.position]);
                } else beginTransition(cat,cat.station.position);
              } else {cat.phase="resting";cat.until=time+3500;}
            }
          } else if (cat.phase === "entering" || cat.phase === "exiting") {
            const transition = cat.transition;
            if (transition) {
              const progress = Math.min(1,transition.progress + elapsed/transition.duration);
              const t = progress;
              const candidate = {x:transition.from.x+(transition.to.x-transition.from.x)*t,y:transition.from.y+(transition.to.y-transition.from.y)*t};
              if (distance(candidate,other.position)>=SEPARATION) {
                transition.progress=progress; cat.position=candidate; cat.walkTime+=elapsed; cat.blocked=0;
                cat.mirrored = transition.to.x < transition.from.x;
                if (progress>=1) {
                  if (transition.remaining.length) {
                    const [next,...remaining]=transition.remaining;
                    beginTransition(cat,next,remaining);
                    return;
                  }
                  cat.transition=null;
                  if (cat.phase==="entering") {
                    const preferredTowerNap = cat.name==="미미" && cat.station?.activity==="perching";
                    const preferredCushionNap = cat.name==="꼬미" && cat.station?.activity==="cushion";
                    const duration = preferredTowerNap ? 30000 : preferredCushionNap ? 18000 : cat.station?.duration ?? 5000;
                    cat.phase="activity";cat.until=time+duration;cat.mirrored=false;
                  }
                  else {cat.station=null;cat.phase="resting";cat.until=time+2200;}
                }
              } else {
                cat.blocked += elapsed;
                // Keep a furniture exit reserved; the floor cat yields instead.
                if (cat.blocked > 1800 && other.phase === "walking") yieldSpace(other,cat,time);
              }
            }
          } else if (time>=cat.until) {
            if (cat.phase==="activity" && cat.station) {
              cat.phase="exiting";
              if (cat.station.activity === "perching") {
                beginTransition(cat,{x:190,y:380},[{x:165,y:475},{x:190,y:575},cat.station.approach]);
              } else beginTransition(cat,cat.station.approach);
            } else plan(cat,other,time);
          }
        }
        const element=elements.current[i];
        if (!element) return;
        const sprite=element.querySelector<HTMLElement>(".miniroom-cat-sprite");
        const activity=cat.station?.activity;
        const inPlace=cat.phase==="activity";
        const consuming=inPlace && (activity==="eating" || activity==="drinking");
        const onCushion=inPlace && activity==="cushion";
        const cushionSleepDuration=cat.name==="꼬미"?12000:8000;
        const sleeping=inPlace && (
          (onCushion && cat.until-time<cushionSleepDuration)
          || (cat.name==="미미" && activity==="perching" && cat.until-time<24000)
        );
        const bellyUpSleeping=sleeping && cat.name==="꼬미" && cat.station?.id==="cushion-cream";
        const inHouse=inPlace && (activity==="hiding" || activity==="toilet");
        const moving = !motion.matches && !document.hidden && cat.blocked===0
          && (cat.phase==="walking" || cat.phase==="entering" || cat.phase==="exiting");
        const column=sleeping?5:moving?1+Math.floor(cat.walkTime/140)%4:0;
        const transition=cat.transition;
        const jumping=transition && activity==="perching" ? Math.sin(transition.progress*Math.PI)*12 : 0;
        element.style.left=`${cat.position.x/1536*100}%`;
        element.style.top=`${(cat.position.y-jumping)/1024*100}%`;
        element.style.zIndex=String(cat.station && cat.phase!=="walking" ? 700 : Math.round(cat.position.y));
        element.dataset.phase=cat.phase;
        element.dataset.activity=activity??"";
        const label=cat.phase==="walking"?(cat.blocked || motion.matches ?"길 양보 중":"산책 중"):inPlace&&activity?(sleeping?(bellyUpSleeping?"쿠션에서 배를 보이고 잠자는 중":activity==="perching"?"캣타워 위에서 잠자는 중":"쿠션에서 잠자는 중"):LABELS[activity]):cat.phase==="entering"?"자리로 들어가는 중":cat.phase==="exiting"?"나오는 중":"쉬는 중";
        element.setAttribute("aria-label",`${cat.name}, ${label}`);
        if (sprite) {
          sprite.style.backgroundImage=bellyUpSleeping ? 'url("/minihome/kkomi-belly-up.png")'
            : consuming || onCushion&&!sleeping ? 'url("/minihome/cats-actions-atlas.png")' : 'url("/minihome/cats-atlas.png")';
          sprite.style.backgroundSize=bellyUpSleeping ? "100% 100%" : consuming || onCushion&&!sleeping ? "300% 200%" : "600% 200%";
          sprite.style.backgroundPosition=bellyUpSleeping ? "50% 50%"
            : `${consuming?Math.floor(time/300)%2*50:onCushion&&!sleeping?100:column/5*100}% ${i*100}%`;
          sprite.style.transform=`scaleX(${cat.mirrored?-1:1})`;
          sprite.style.opacity=inHouse?"0":"1";
          // Step into the opening, rather than leaving a cat floating over its shell.
          sprite.style.clipPath=cat.phase==="entering" && (activity==="hiding" || activity==="toilet") && transition && transition.progress>0.5
            ? `inset(0 ${Math.round((transition.progress-0.5)*200)}% 0 0)` : "none";
        }
        const tag=element.querySelector<HTMLElement>(".miniroom-cat-name");
        if(tag) {
          const short = sleeping ? "zZ" : inPlace && activity ? ({perching:"캣타워",hiding:"숨숨집",toilet:"화장실",cushion:"쿠션",eating:"밥",drinking:"물"})[activity] : cat.phase==="walking" ? (cat.blocked || motion.matches ? "대기" : "산책") : "";
          tag.textContent=`${cat.name}${short ? ` · ${short}` : ""}`;
        }
      });
      frame=requestAnimationFrame(animate);
    }
    frame=requestAnimationFrame(animate);
    return()=>cancelAnimationFrame(frame);
  },[active]);

  return <div className="miniroom-cats" hidden={!active}>
    {["미미","꼬미"].map((name,i)=><div key={name} className="miniroom-cat" role="img" aria-label={name}
      ref={(element)=>{elements.current[i]=element;}}>
      <div className="miniroom-cat-sprite" />
      <span className="miniroom-cat-name">{name}</span>
    </div>)}
  </div>;
}
