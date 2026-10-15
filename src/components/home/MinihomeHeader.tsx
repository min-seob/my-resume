"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MinihomeNavPage = "minimi" | "miniroom";

type MinihomeNavItem = {
  label: string;
  href: string;
  homeAnchor?: string;
  activePage?: MinihomeNavPage;
};

const navItems: MinihomeNavItem[] = [
  { label: "내소개", href: "#about", homeAnchor: "about" },
  { label: "개발 블로그", href: "#blog", homeAnchor: "blog" },
  { label: "방명록", href: "#guestbook", homeAnchor: "guestbook" },
  { label: "미니미", href: "/minihome/minimi", activePage: "minimi" },
  { label: "미니룸", href: "/minihome/miniroom", activePage: "miniroom" },
];

export function MinihomeHeader({
  activePortfolio = false,
  activeMiniPage,
}: {
  activePortfolio?: boolean;
  activeMiniPage?: "minimi" | "miniroom";
}) {
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
          {navItems.map((item) => {
            const href = item.homeAnchor
              ? isMinihome ? `#${item.homeAnchor}` : `/minihome#${item.homeAnchor}`
              : item.href;
            const isCurrentPage = item.activePage === activeMiniPage;

            return (
              <Link
                key={item.label}
                href={href}
                className={`mini-nav__item${isCurrentPage ? " mini-nav__item--active" : ""}`}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
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
