import Link from "next/link";
import Image from "next/image";

import { MinihomeFooter } from "@/components/home/MinihomeFooter";
import { MinihomeHeader } from "@/components/home/MinihomeHeader";
import { Miniroom } from "@/components/home/Miniroom";
import { profile } from "@/data/portfolio";
import { personalProjects, recentProjects } from "@/data/site";

const diaryEntries = [
  {
    date: recentProjects[0]?.period ?? "최근",
    label: recentProjects[0]?.category ?? "작업 기록",
    title: recentProjects[0]?.title ?? "요즘의 작업",
    text: recentProjects[0]?.description ?? profile.summary,
  },
  {
    date: personalProjects[1]?.period ?? "개인 프로젝트",
    label: "사이드 프로젝트",
    title: personalProjects[1]?.title ?? personalProjects[0]?.title ?? "개인 프로젝트",
    text: personalProjects[1]?.description ?? personalProjects[0]?.description ?? profile.summary,
  },
];

export function Minihome() {
  return (
    <div className="minihome">
      <MinihomeHeader />
      <main className="mini-page">
        <div className="mini-shell">
          <aside className="mini-sidebar" aria-label="프로필과 미니미">
            <section id="about" className="mini-panel mini-profile">
              <div className="mini-panel__heading">
                <span>PROFILE</span>
                <span className="mini-panel__sparkle" aria-hidden="true">✳</span>
              </div>
              <div className="mini-profile__portrait" aria-hidden="true">
                <span className="mini-profile__portrait-face">민</span>
                <span className="mini-profile__portrait-label">MINI ME</span>
              </div>
              <h1 className="mini-profile__name">{profile.name}</h1>
              <p className="mini-profile__role">서버 개발자 · {profile.tagline}</p>
              <p className="mini-profile__summary">{profile.summary}</p>
              <div className="mini-profile__divider" />
              <p className="mini-profile__caption">경력 밖의 작업과 생각도 하나씩 적어둡니다.</p>
              <div className="mini-shortcuts">
                <Link href="/projects">프로젝트 구경하기 <span aria-hidden="true">↗</span></Link>
                <Link href="/document">경력기술서 보기 <span aria-hidden="true">↗</span></Link>
              </div>
            </section>

            <section id="minimi" className="mini-panel mini-minimi">
              <div className="mini-panel__heading">
                <span>MINIMI</span>
                <span className="mini-panel__label">나의 미니미</span>
              </div>
              <div className="mini-minimi__stage">
                <Image className="mini-minimi__sprite" src="/minihome/minimi-hoodie-idle.png"
                  alt="검정 후드티와 베이지 바지를 입은 도트 미니미" width={96} height={160} unoptimized />
                <span className="mini-minimi__bubble">안녕!</span>
              </div>
              <p>오늘도 천천히, 하나씩.</p>
            </section>

            <section className="mini-panel mini-room-panel">
              <div className="mini-panel__heading">
                <span>MINI ROOM</span>
                <span className="mini-panel__label">문 너머의 공간</span>
              </div>
              <p className="mini-room-panel__caption">코딩방에서 문을 열면 편안한 침실로 이어져요.</p>
              <div className="mini-shortcuts"><Link href="#miniroom">미니룸 들어가기 <span aria-hidden="true">→</span></Link></div>
            </section>
          </aside>

          <div className="mini-content">
            <section className="mini-welcome" aria-labelledby="welcome-title">
              <h2 id="welcome-title">기록은 조금 더<br className="mini-welcome__break" /> 나답게.</h2>
              <p>완성된 경력뿐 아니라, 요즘 만드는 것과 떠오른 생각도 두고 가는 곳.</p>
              <div className="mini-welcome__stamp">MINI<br />HOME</div>
              <span className="mini-welcome__doodle" aria-hidden="true">✳</span>
            </section>

            <Miniroom />

            <section id="feeling" className="mini-section mini-feeling">
              <div className="mini-section__head">
                <div>
                  <h2>요즘의 한마디</h2>
                </div>
              </div>
              <div className="mini-feeling__note">
                <span className="mini-feeling__pin" aria-hidden="true">✦</span>
                <p>이력서에는 다 못 담는 이야기들도 있지.<br />여기에는 작업하면서 든 생각을 편하게 남겨보려고 한다.</p>
                <span className="mini-feeling__sign">— 민섭</span>
              </div>
              <p className="mini-section__aside">오늘의 한 줄 · 경력 밖의 생각을 모으는 중</p>
            </section>

            <section id="diary" className="mini-section mini-diary">
              <div className="mini-section__head">
                <div>
                  <h2>다이어리</h2>
                </div>
              </div>
              <p className="mini-section__intro">일과 프로젝트를 하며 쌓인 기록을 남겨요.</p>
              <div className="mini-diary__list">
                {diaryEntries.map((entry) => (
                  <article className="mini-diary__entry" key={`${entry.date}-${entry.title}`}>
                    <div className="mini-diary__date">{entry.date}</div>
                    <div className="mini-diary__body">
                      <span className="mini-diary__label">{entry.label}</span>
                      <h3>{entry.title}</h3>
                      <p>{entry.text}</p>
                    </div>
                    <span className="mini-diary__corner" aria-hidden="true">↗</span>
                  </article>
                ))}
              </div>
              <Link href="/projects" className="mini-text-link">프로젝트 기록 더 보기 <span aria-hidden="true">→</span></Link>
            </section>

            <section id="guestbook" className="mini-section mini-guestbook">
              <div className="mini-section__head">
                <div>
                  <h2>방명록</h2>
                </div>
              </div>
              <div className="mini-guestbook__empty">
                <span className="mini-guestbook__stamp" aria-hidden="true">HELLO!</span>
                <div>
                  <h3>다녀간 흔적을 남겨주세요.</h3>
                  <p>첫 인사는 이메일로 받을게요. 반갑게 읽겠습니다.</p>
                </div>
                <a href={`mailto:${profile.email}`} className="mini-guestbook__button">인사 남기기 <span aria-hidden="true">↗</span></a>
              </div>
            </section>

            <div className="mini-bottom-note">여기까지 천천히 둘러봐줘서 고마워요 <span aria-hidden="true">☺</span></div>
          </div>
        </div>
      </main>
      <MinihomeFooter />
    </div>
  );
}
