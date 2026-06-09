import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft, ExternalLink } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { featuredProjects } from "@/data/portfolio";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return featuredProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = featuredProjects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "프로젝트 상세 | 김민섭",
    };
  }

  return {
    title: `${project.title} | 김민섭`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = featuredProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="bg-[#f8f3ea]">
        <section className="border-b border-stone-800 bg-stone-950 px-5 py-14 text-white sm:px-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition hover:text-white"
            >
              <ArrowLeft aria-hidden className="h-4 w-4" />
              프로젝트 목록으로
            </Link>
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge>{project.period}</Badge>
              <Badge tone="muted">{project.client}</Badge>
              <Badge tone="muted">{project.category}</Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-stone-300">
              {project.description}
            </p>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
            <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-900">
                <AlertCircle aria-hidden className="h-4 w-4" />
                프로젝트 상세
              </div>

              <p className="mt-6 text-base leading-8 text-stone-700">{project.detailIntro}</p>

              <div className="mt-8">
                <h2 className="text-lg font-bold text-stone-950">상세 수행 업무</h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
                  {project.detailBullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </article>

            <aside className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-stone-950">프로젝트 요약</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-stone-500">기간</dt>
                  <dd className="mt-1 text-stone-900">{project.period}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-500">고객사</dt>
                  <dd className="mt-1 text-stone-900">{project.client}</dd>
                </div>
                {project.company !== "-" ? (
                  <div>
                    <dt className="font-semibold text-stone-500">근무회사</dt>
                    <dd className="mt-1 text-stone-900">{project.company}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-semibold text-stone-500">역할</dt>
                  <dd className="mt-1 text-stone-900">{project.role}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-500">분류</dt>
                  <dd className="mt-1 text-stone-900">{project.category}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-500">기술</dt>
                  <dd className="mt-3 space-y-4">
                    {project.detailTechStack.map((group) => (
                      <div key={group.label}>
                        <p className="mb-2 text-xs font-bold uppercase text-stone-500">
                          {group.label}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((tech) => (
                            <Badge key={`${group.label}-${tech}`} tone="muted">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </dd>
                </div>
              </dl>

              {project.links && project.links.length > 0 ? (
                <div className="mt-6 border-t border-stone-100 pt-5">
                  <div className="space-y-2">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-emerald-300 hover:bg-emerald-50"
                      >
                        <ExternalLink aria-hidden className="h-4 w-4" />
                        <span>{link.label}</span>
                        {link.note ? (
                          <span className="text-xs font-medium text-stone-500">({link.note})</span>
                        ) : null}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
