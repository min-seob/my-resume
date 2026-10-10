import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Section } from "@/components/ui/Section";
import { credentials, profile, skillGroups } from "@/data/portfolio";
import { careerHistory, personalProjects, recentProjects, stockmate } from "@/data/site";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[960px] px-6">
        <div className="flex flex-col gap-5 border-b border-ink pb-16 pt-20">
          <p className="text-sm font-bold tracking-[0.08em] text-accent">{profile.title}</p>
          <h1 className="text-[64px] font-extrabold leading-[1.1] tracking-[-0.04em]">{profile.name}</h1>
          <p className="text-[22px] font-medium text-body">{profile.tagline}</p>
          <div className="flex flex-wrap gap-3 pt-3">
            <Link
              href="/document"
              className="inline-flex min-h-12 items-center rounded-xl bg-accent px-[22px] text-[15px] font-bold text-white transition hover:opacity-90"
            >
              경력기술서 원본 보기
            </Link>
            <Link
              href="/#contact"
              className="inline-flex min-h-12 items-center rounded-xl border border-[#d5d9e0] px-[22px] text-[15px] font-bold transition hover:border-accent hover:text-accent"
            >
              연락처
            </Link>
          </div>
        </div>

        <Section label="요약">
          <p className="text-base leading-[1.9] text-body">{profile.summary}</p>
        </Section>

        <section id="recent" className="border-b border-line py-14">
          <h2 className="pb-5 text-2xl font-extrabold tracking-tight">최근 수행 프로젝트</h2>
          <ul className="border-t border-ink">
            {recentProjects.map((project) => (
              <li key={project.slug} className="border-b border-line">
                <Link
                  href={`/career/${project.slug}`}
                  className="flex flex-wrap gap-x-10 gap-y-1.5 py-[22px] transition hover:bg-surface"
                >
                  <span className="w-[180px] shrink-0 text-sm leading-7 text-muted">{project.period}</span>
                  <span className="min-w-0 flex-[1_1_440px]">
                    <span className="block text-[17px] font-bold text-ink">
                      {project.client} · {project.title}
                    </span>
                    <span className="block pt-1 text-sm leading-7 text-muted">{project.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Section label="개인 프로젝트">
          <ul className="flex flex-col gap-5">
            {personalProjects.map((p) => (
              <li key={p.title}>
                <Link href="/projects" className="group block">
                  <span className="text-base font-bold group-hover:text-accent">
                    {p.title} <span className="text-[13px] font-normal text-muted">{p.meta}</span>
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/projects#stockmate" className="group block">
                <span className="text-base font-bold group-hover:text-accent">
                  {stockmate.title} <span className="text-[13px] font-normal text-muted">{stockmate.meta}</span>
                </span>
              </Link>
            </li>
          </ul>
        </Section>

        <Section label="기술 스택">
          <dl className="flex flex-col gap-3.5 text-sm leading-7">
            {skillGroups.map((g) => (
              <div key={g.title} className="flex flex-wrap gap-x-6">
                <dt className="w-[130px] shrink-0 font-bold">{g.title}</dt>
                <dd className="min-w-0 flex-[1_1_280px] text-muted">{g.skills.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section label="경력 요약">
          <dl className="flex flex-col gap-3.5 text-sm leading-7">
            {careerHistory.map((h) => (
              <div key={h.period} className="flex flex-wrap gap-x-6">
                <dt className="w-[130px] shrink-0 text-muted">{h.period}</dt>
                <dd className="min-w-0 flex-[1_1_280px] font-medium">{h.title}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section label="학력 · 자격" last>
          <ul className="text-sm leading-8 text-body">
            {credentials
              .filter((c) => c.label === "학력" || c.label === "자격증")
              .map((c) => (
                <li key={c.label}>{c.value}</li>
              ))}
          </ul>
        </Section>
      </main>

      <section id="contact" className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-[960px] flex-wrap items-center gap-x-14 gap-y-4 px-6 py-14">
          <h2 className="w-[180px] shrink-0 text-[15px] font-bold">연락처</h2>
          <div className="flex min-w-0 flex-[1_1_440px] flex-wrap gap-3">
            <a
              href={profile.phoneHref}
              className="inline-flex min-h-12 items-center rounded-xl border border-[#d5d9e0] bg-white px-[22px] text-base font-bold transition hover:border-accent"
            >
              {profile.phone}
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-12 items-center rounded-xl border border-[#d5d9e0] bg-white px-[22px] text-base font-bold transition hover:border-accent"
            >
              {profile.email}
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
