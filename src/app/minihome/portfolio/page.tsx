import type { Metadata } from "next";
import Link from "next/link";

import { MinihomeFooter } from "@/components/home/MinihomeFooter";
import { MinihomeHeader } from "@/components/home/MinihomeHeader";
import { PortfolioProjectGrid } from "@/components/home/PortfolioProjectGrid";

import "../minihome.css";
import "./portfolio.css";

export const metadata: Metadata = {
  title: "포트폴리오 | 김민섭의 미니홈",
  description: "김민섭이 만든 프로젝트 화면을 모아 보여줍니다.",
};

export default function PortfolioPage() {
  return (
    <div className="minihome minihome-portfolio-root">
      <MinihomeHeader activePortfolio />
      <main className="mini-page portfolio-page">
        <div className="portfolio-content">
          <Link href="/minihome" className="portfolio-back-link">
            <span aria-hidden="true">←</span> 미니홈
          </Link>
          <header className="portfolio-page__intro">
            <p className="portfolio-page__eyebrow">PORTFOLIO · 07 PROJECTS</p>
            <h1>만들어 온 화면들</h1>
            <p>프로젝트를 선택해 화면과 이야기를 둘러보세요.</p>
          </header>
          <PortfolioProjectGrid />
        </div>
      </main>
      <MinihomeFooter />
    </div>
  );
}
