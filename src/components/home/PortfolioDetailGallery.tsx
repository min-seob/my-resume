"use client";

import { useState } from "react";

import type { PortfolioProject } from "@/data/portfolio-gallery";
import { PortfolioScreenPreview } from "@/components/home/PortfolioScreenPreview";

export function PortfolioDetailGallery({ project }: { project: PortfolioProject }) {
  const [activeId, setActiveId] = useState(project.screens[0]?.id ?? "");
  const activeScreen = project.screens.find((screen) => screen.id === activeId);

  if (!activeScreen) {
    return null;
  }

  return (
    <section className="portfolio-detail-gallery" aria-label={`${project.title} 화면 갤러리`}>
      <div className="portfolio-detail-gallery__stage">
        <PortfolioScreenPreview screen={activeScreen} display="detail" />
        <p className="portfolio-detail-gallery__caption">{activeScreen.label}</p>
      </div>
      <div className="portfolio-detail-gallery__strip-wrap">
        <p className="portfolio-detail-gallery__strip-label">화면 둘러보기</p>
        <div className="portfolio-detail-gallery__strip" role="group" aria-label="상세 화면 선택">
          {project.screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              className={`portfolio-detail-gallery__thumb${screen.id === activeId ? " is-active" : ""}`}
              onClick={() => setActiveId(screen.id)}
              aria-label={`${screen.label} 크게 보기`}
              aria-pressed={screen.id === activeId}
            >
              <PortfolioScreenPreview screen={screen} display="thumbnail" />
              <span>{screen.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
