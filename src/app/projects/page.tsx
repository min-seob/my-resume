import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { personalProjects, stockmate } from "@/data/site";

export const metadata: Metadata = {
  title: "개인 프로젝트 | 김민섭",
  description: "에즈아르카나, 에즈아르카나 예약, StockMate 개인 프로젝트",
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[960px] px-6">
        <div className="flex flex-col gap-4 border-b border-ink pb-12 pt-16">
          <p className="text-sm font-bold tracking-[0.08em] text-accent">PROJECTS</p>
          <h1 className="text-[40px] font-extrabold tracking-[-0.03em]">개인 프로젝트</h1>
          <p className="max-w-[640px] text-base leading-8 text-muted">
            금융 백엔드에서 다룬 정합성, 보안, 배치 설계를 개인 서비스에도 적용했습니다. 기획, 설계, 구현, 배포까지 직접 진행했습니다.
          </p>
        </div>

        <ul>
          {personalProjects.map((p) => (
            <li key={p.title} className="border-b border-line py-10">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="text-2xl font-extrabold tracking-tight">{p.title}</h2>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {p.meta} ↗
                </a>
              </div>
              {p.period ? <p className="pt-1 text-[13px] text-muted">{p.period}</p> : null}
              <p className="pt-4 text-[15px] leading-[1.9] text-body">{p.description}</p>
              <p className="pt-3 text-[13px] leading-7 text-muted">{p.stack}</p>
            </li>
          ))}
        </ul>

        <section id="stockmate" className="py-14">
          <p className="text-sm font-bold text-accent">SIDE PROJECT</p>
          <h2 className="pt-2 text-2xl font-extrabold tracking-tight">
            {stockmate.title} <span className="text-lg font-medium text-muted">| {stockmate.meta}</span>
          </h2>
          <p className="max-w-[760px] pt-4 text-base leading-[1.9] text-body">{stockmate.description}</p>
          <ol className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {stockmate.steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-surface p-6">
                <span className="text-[13px] font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className="pt-2 text-[17px] font-bold">{s.title}</p>
                <p className="pt-2 text-sm leading-7 text-muted">{s.description}</p>
              </li>
            ))}
          </ol>
          <p className="pt-6 text-[13px] text-muted">{stockmate.stack}</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
