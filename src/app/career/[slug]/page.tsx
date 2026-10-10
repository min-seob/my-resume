import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { featuredProjects } from "@/data/portfolio";

type CareerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return featuredProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: CareerPageProps) {
  const { slug } = await params;
  const project = featuredProjects.find((item) => item.slug === slug);

  if (!project) {
    return { title: "경력 상세 | 김민섭" };
  }

  return {
    title: `${project.client} ${project.title} | 김민섭`,
    description: project.description,
  };
}

export default async function CareerDetailPage({ params }: CareerPageProps) {
  const { slug } = await params;
  const project = featuredProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const summary = [
    { label: "기간", value: project.period },
    { label: "고객사", value: project.client },
    ...(project.company !== "-" ? [{ label: "근무회사", value: project.company }] : []),
    { label: "역할", value: project.role },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[960px] px-6">
        <div className="flex flex-col gap-4 border-b border-ink pb-12 pt-14">
          <Link href="/#recent" className="text-sm text-muted transition hover:text-accent">
            ← 최근 수행 프로젝트
          </Link>
          <p className="text-sm font-bold tracking-[0.08em] text-accent">{project.client}</p>
          <h1 className="text-[40px] font-extrabold leading-tight tracking-[-0.03em]">{project.title}</h1>
          <p className="max-w-[720px] text-base leading-8 text-muted">{project.detailIntro}</p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 border-b border-line py-8 sm:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label} className="py-2">
              <dt className="text-[13px] text-muted">{item.label}</dt>
              <dd className="pt-1 text-[15px] font-bold">{item.value}</dd>
            </div>
          ))}
        </dl>

        <section className="flex flex-wrap gap-x-14 gap-y-4 border-b border-line py-12">
          <h2 className="w-[180px] shrink-0 text-[15px] font-bold">수행 업무</h2>
          <ul className="min-w-0 flex-[1_1_440px] space-y-3 text-[15px] leading-8 text-body">
            {project.detailBullets.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {project.aiUsage ? (
          <section className="border-b border-line py-12">
            <h2 className="pb-5 text-[15px] font-bold">AI 에이전트 기반 개발 생산성 향상 및 업무 자동화</h2>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface text-left text-[13px] text-muted">
                    <th className="px-5 py-3.5 font-bold">영역</th>
                    <th className="px-5 py-3.5 font-bold">활용 내용</th>
                    <th className="px-5 py-3.5 font-bold">업무상 효과</th>
                  </tr>
                </thead>
                <tbody>
                  {project.aiUsage.map((row) => (
                    <tr key={row.area} className="border-b border-line last:border-0 align-top leading-7">
                      <th scope="row" className="w-[140px] px-5 py-4 text-left font-bold">
                        {row.area}
                      </th>
                      <td className="px-5 py-4 text-body">{row.use}</td>
                      <td className="px-5 py-4 text-muted">{row.effect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="flex flex-wrap gap-x-14 gap-y-4 py-12">
          <h2 className="w-[180px] shrink-0 text-[15px] font-bold">기술</h2>
          <dl className="min-w-0 flex-[1_1_440px] space-y-3.5 text-sm leading-7">
            {project.detailTechStack.map((group) => (
              <div key={group.label} className="flex flex-wrap gap-x-6">
                <dt className="w-[130px] shrink-0 font-bold">{group.label}</dt>
                <dd className="min-w-0 flex-[1_1_280px] text-muted">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
