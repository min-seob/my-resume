import Link from "next/link";

import { portfolioProjects } from "@/data/portfolio-gallery";
import { PortfolioScreenPreview } from "@/components/home/PortfolioScreenPreview";

export function PortfolioProjectGrid() {
  return (
    <ul className="portfolio-project-grid" aria-label="포트폴리오 프로젝트">
      {portfolioProjects.map((project) => (
        <li key={project.slug}>
          <Link
            href={`/minihome/portfolio/${project.slug}`}
            className="portfolio-project-card"
            aria-label={`${project.title} 화면 모아보기`}
          >
            <PortfolioScreenPreview screen={project.cover} display="cover" />
            <span className="portfolio-project-card__label">{project.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
