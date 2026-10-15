"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ROOM_SCENES, type RoomId, type RoomScene } from "@/components/home/miniroom-scenes";

const OBJECT_CROP_WIDTH = 300;
const OBJECT_CROP_HEIGHT = 200;

type RoomObject = {
  name: string;
  category: string;
  crop: { x: number; y: number };
};

const roomList = Object.values(ROOM_SCENES);

const roomObjects: Record<RoomId, RoomObject[]> = {
  coding: [
    { name: "코딩 책상", category: "작업", crop: { x: 545, y: 230 } },
    { name: "외부 모니터 2대", category: "기기", crop: { x: 620, y: 200 } },
    { name: "태블릿", category: "기기", crop: { x: 450, y: 265 } },
    { name: "게임 책상", category: "게임", crop: { x: 1060, y: 340 } },
    { name: "게임 모니터 2대", category: "기기", crop: { x: 1075, y: 275 } },
    { name: "게임 의자", category: "가구", crop: { x: 1085, y: 420 } },
    { name: "미니 냉장고", category: "생활", crop: { x: 875, y: 340 } },
    { name: "소파와 테이블", category: "휴식", crop: { x: 545, y: 700 } },
    { name: "스탠바이미", category: "기기", crop: { x: 770, y: 455 } },
    { name: "책장", category: "수납", crop: { x: 300, y: 170 } },
    { name: "화분", category: "장식", crop: { x: 0, y: 450 } },
    { name: "공기청정기", category: "생활", crop: { x: 1200, y: 455 } },
  ],
  rest: [
    { name: "킹사이즈 침대", category: "가구", crop: { x: 480, y: 235 } },
    { name: "침대 앞 벤치", category: "가구", crop: { x: 390, y: 405 } },
    { name: "옷장", category: "수납", crop: { x: 940, y: 290 } },
    { name: "화장대와 거울", category: "가구", crop: { x: 1110, y: 365 } },
    { name: "침대 옆 협탁", category: "가구", crop: { x: 825, y: 290 } },
    { name: "독서 의자", category: "휴식", crop: { x: 675, y: 635 } },
    { name: "작은 테이블", category: "가구", crop: { x: 835, y: 660 } },
    { name: "원형 러그", category: "장식", crop: { x: 600, y: 735 } },
    { name: "계단", category: "공간", crop: { x: 70, y: 350 } },
    { name: "화분", category: "장식", crop: { x: 260, y: 330 } },
  ],
  loft: [
    { name: "캣타워", category: "고양이", crop: { x: 45, y: 300 } },
    { name: "숨숨집", category: "고양이", crop: { x: 300, y: 300 } },
    { name: "고양이 화장실 2개", category: "고양이", crop: { x: 420, y: 300 } },
    { name: "자동급식기 2개", category: "고양이", crop: { x: 850, y: 320 } },
    { name: "식수기 2개", category: "고양이", crop: { x: 1080, y: 360 } },
    { name: "잠자리 쿠션", category: "고양이", crop: { x: 625, y: 220 } },
    { name: "창가 쉼터", category: "휴식", crop: { x: 610, y: 145 } },
    { name: "벽 선반", category: "수납", crop: { x: 270, y: 145 } },
    { name: "화분", category: "장식", crop: { x: 1180, y: 330 } },
  ],
};

function RoomObjectPreview({
  scene,
  crop,
}: {
  scene: RoomScene;
  crop: RoomObject["crop"];
}) {
  const scale = (scene.width / OBJECT_CROP_WIDTH) * 100;

  return (
    <span className="miniroom-object__preview" aria-hidden="true">
      <Image
        src={scene.background}
        alt=""
        width={scene.width}
        height={scene.height}
        sizes="240px"
        style={{
          width: `${scale}%`,
          height: `${scale}%`,
          left: `${(-crop.x / OBJECT_CROP_WIDTH) * 100}%`,
          top: `${(-crop.y / OBJECT_CROP_HEIGHT) * 100}%`,
        }}
      />
    </span>
  );
}

export function MinihomeMiniroomPage() {
  const [selectedRoom, setSelectedRoom] = useState<RoomId>("coding");
  const scene = ROOM_SCENES[selectedRoom];
  const objects = roomObjects[selectedRoom];

  return (
    <main className="mini-page mini-collection-page miniroom-library-page">
      <div className="mini-collection-content">
        <Link href="/minihome" className="mini-collection-back">
          <span aria-hidden="true">←</span> 미니홈
        </Link>
        <header className="mini-collection-intro miniroom-page-intro">
          <p className="mini-collection-eyebrow">MY MINIROOM</p>
          <h1>미니룸</h1>
        </header>

        <section className="miniroom-library" aria-label="미니룸과 오브젝트">
          <div className="miniroom-room-picker">
            <div className="miniroom-room-tabs" role="group" aria-label="미니룸 선택">
              {roomList.map((room) => (
                <button
                  type="button"
                  key={room.id}
                  className={`miniroom-room-tab${selectedRoom === room.id ? " is-selected" : ""}`}
                  aria-pressed={selectedRoom === room.id}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  {room.name}
                </button>
              ))}
            </div>
            <figure className="miniroom-room-stage" aria-labelledby="miniroom-stage-title">
              <Image
                src={scene.background}
                alt=""
                fill
                sizes="(max-width: 880px) 100vw, 58vw"
              />
              <figcaption id="miniroom-stage-title">{scene.name}</figcaption>
            </figure>
          </div>

          <section className="miniroom-detail" aria-labelledby="miniroom-detail-title">
            <div className="miniroom-detail__heading" aria-live="polite">
              <div>
                <p>선택한 방</p>
                <h2 id="miniroom-detail-title">{scene.name}</h2>
              </div>
              <span className="miniroom-detail__count">{objects.length}개</span>
            </div>
            <p className="miniroom-detail__caption">이 방에 놓인 오브젝트</p>
            <ul className="miniroom-object-list" aria-label={`${scene.name} 오브젝트 목록`}>
              {objects.map(({ name, category, crop }) => (
                <li className="miniroom-object" key={name}>
                  <RoomObjectPreview scene={scene} crop={crop} />
                  <span className="miniroom-object__text">
                    <strong>{name}</strong>
                    <small>{category}</small>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </main>
  );
}
