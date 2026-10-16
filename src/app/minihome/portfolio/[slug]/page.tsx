import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MinihomeFooter } from "@/components/home/MinihomeFooter";
import { MinihomeHeader } from "@/components/home/MinihomeHeader";
import { PortfolioDetailGallery } from "@/components/home/PortfolioDetailGallery";
import { getPortfolioProject, portfolioProjects } from "@/data/portfolio-gallery";

import "../../minihome.css";
import "../portfolio.css";

type PortfolioDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPortfolioProject(slug);

  if (!project) {
    return { title: "포트폴리오 | 김민섭의 미니홈" };
  }

  return {
    title: `${project.title} | 포트폴리오`,
    description: project.descriptionItems?.join(" · ") ?? project.description,
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const project = getPortfolioProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="minihome minihome-portfolio-root">
      <MinihomeHeader activePortfolio />
      <main className="mini-page portfolio-page portfolio-page--detail">
        <article className="portfolio-content">
          <Link href="/minihome/portfolio" className="portfolio-back-link">
            <span aria-hidden="true">←</span> 포트폴리오 목록
          </Link>
          <header className="portfolio-detail__intro">
            <p className="portfolio-page__eyebrow">{project.category}</p>
            <h1>{project.title}</h1>
            {project.descriptionItems?.length ? (
              <ul className="portfolio-detail__description-list">
                {project.descriptionItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{project.description}</p>
            )}
          </header>
          {project.screens.length > 0 ? <PortfolioDetailGallery project={project} /> : null}
        </article>
      </main>
      <MinihomeFooter />
    </div>
  );
}
