import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { featuredProjects } from "@/data/portfolio";

export function FeaturedProjectsSection() {
  return (
    <section id="projects" className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Projects"
          title="대표 프로젝트"
          description="금융·결제 백엔드 프로젝트와 AI/개인 서비스 프로젝트를 함께 보여주는 1차 포트폴리오 구성입니다."
        />
        <div className="grid gap-5">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
