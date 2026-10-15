import Link from "next/link";
import Image from "next/image";

import { MinihomeFooter } from "@/components/home/MinihomeFooter";
import { MinihomeHeader } from "@/components/home/MinihomeHeader";
import { MinihomeCommunity } from "@/components/home/MinihomeCommunity";
import { Miniroom } from "@/components/home/Miniroom";
import { profile } from "@/data/portfolio";

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
              <div className="mini-profile__portrait">
                <Image className="mini-profile__minimi" src="/minihome/minimi-hoodie-idle.png"
                  alt="검정 후드티와 베이지 바지를 입은 현재 미니미" width={96} height={160} unoptimized />
                <span className="mini-profile__portrait-bubble" aria-hidden="true">안녕!</span>
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
          </aside>

          <div className="mini-content">
            <Miniroom />
            <MinihomeCommunity />

            <div className="mini-bottom-note">여기까지 천천히 둘러봐줘서 고마워요 <span aria-hidden="true">☺</span></div>
          </div>
        </div>
      </main>
      <MinihomeFooter />
    </div>
  );
}
