"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "내소개", anchor: "about" },
  { label: "한마디", anchor: "feeling" },
  { label: "다이어리", anchor: "diary" },
  { label: "방명록", anchor: "guestbook" },
  { label: "미니미", anchor: "minimi" },
  { label: "미니룸", anchor: "miniroom" },
];

export function MinihomeHeader({ activePortfolio = false }: { activePortfolio?: boolean }) {
  const pathname = usePathname();
  const isMinihome = pathname === "/minihome";

  return (
    <header className="mini-header">
      <div className="mini-header__inner">
        <div className="mini-header__masthead">
          <Link href="/minihome" className="mini-header__brand" aria-label="김민섭의 미니홈으로 이동">
            <span className="mini-header__brand-mark" aria-hidden="true">m</span>
            <span>
              <strong>김민섭의 미니홈</strong>
              <small>작업과 생각을 천천히 모으는 곳</small>
            </span>
          </Link>
          <Link href="/" className="mini-header__resume">경력기술서 홈 ↗</Link>
        </div>

        <nav className="mini-nav" aria-label="미니홈 메뉴">
          <Link href="/minihome" className="mini-nav__home">HOME</Link>
          {navItems.map((item) => (
            <Link
              key={item.anchor}
              href={isMinihome ? `#${item.anchor}` : `/minihome#${item.anchor}`}
              className="mini-nav__item"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/minihome/portfolio"
            className={`mini-nav__item${activePortfolio ? " mini-nav__item--active" : ""}`}
            aria-current={activePortfolio ? "page" : undefined}
          >
            포트폴리오
          </Link>
        </nav>
      </div>
    </header>
  );
}
