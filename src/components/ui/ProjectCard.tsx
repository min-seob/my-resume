import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/types/portfolio";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{project.period}</Badge>
        <Badge tone="muted">{project.client}</Badge>
        <Badge tone="muted">{project.category}</Badge>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <h3 className="text-xl font-bold leading-8 text-stone-950 sm:text-2xl">
            {project.title}
          </h3>
          <p className="mt-2 text-sm font-semibold text-emerald-900">{project.role}</p>
          <p className="mt-4 text-base leading-8 text-stone-600">{project.description}</p>

          <div className="mt-6 border-t border-stone-100 pt-5">
            <ButtonLink href={`/projects/${project.slug}`} variant="ghost" icon={ArrowUpRight}>
              자세히 보기
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-[#fbfaf7] p-5">
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} tone="muted">
                {tech}
              </Badge>
            ))}
          </div>

          <ul className="mt-5 space-y-2 text-sm leading-7 text-stone-600">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
