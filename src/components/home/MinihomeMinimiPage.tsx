import Image from "next/image";
import Link from "next/link";

import { MinihomeFooter } from "@/components/home/MinihomeFooter";
import { MinihomeHeader } from "@/components/home/MinihomeHeader";

export function MinihomeMinimiPage() {
  return (
    <div className="minihome">
      <MinihomeHeader activeMiniPage="minimi" />
      <main className="mini-page mini-collection-page">
        <div className="mini-collection-content">
          <Link href="/minihome" className="mini-collection-back">
            <span aria-hidden="true">←</span> 미니홈
          </Link>
          <header className="mini-collection-intro">
            <p className="mini-collection-eyebrow">MY MINIMI</p>
            <h1>미니미</h1>
          </header>

          <section className="mini-minimi-library" aria-label="현재 선택된 미니미">
            <article className="mini-minimi-card" aria-label="현재 선택된 후드티 미니미">
              <div className="mini-minimi-card__stage">
                <div className="mini-minimi-card__lineup">
                  <span className="mini-minimi-card__cat mini-minimi-card__cat--mimi" role="img" aria-label="미미" />
                  <Image
                    className="mini-minimi-card__character"
                    src="/minihome/minimi-hoodie-idle.png"
                    alt="검정 후드티와 베이지 바지를 입은 도트 미니미"
                    width={96}
                    height={160}
                    unoptimized
                  />
                  <span className="mini-minimi-card__cat mini-minimi-card__cat--kkomi" role="img" aria-label="꼬미" />
                </div>
                <div className="mini-minimi-card__name">
                  <h2>후드티 미니미</h2>
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
      <MinihomeFooter />
    </div>
  );
}
