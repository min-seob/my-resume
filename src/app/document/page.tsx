import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { credentials, profile, resumeLinks } from "@/data/portfolio";
import {
  careerTable,
  collapsedProjects,
  education,
  inventoryProjects,
  specialSkills,
} from "@/data/site";
import type { Project } from "@/types/portfolio";

export const metadata: Metadata = {
  title: "경력기술서 원본 | 김민섭",
  description: "개인 이력 카드와 SKILL INVENTORY 형식의 경력기술서 원본",
};

const th = "border border-black bg-[#e7e7e7] px-2.5 py-1.5 text-center font-bold";
const td = "border border-black px-2.5 py-1.5";

function Inventory({ project }: { project: Project }) {
  const env = project.detailTechStack.flatMap((g) => g.items).join(", ");

  return (
    <div className="mb-4 overflow-x-auto">
    <table className="w-full min-w-[520px] border-collapse text-[12.5px]">
      <tbody>
        <tr>
          <th colSpan={4} className="border border-black bg-[#e7e7e7] px-2.5 py-2 text-left text-[13.5px] font-bold">
            {project.client} · {project.title}
          </th>
        </tr>
        <tr>
          <th className={`${th} w-[88px] bg-[#f3f3f3] font-normal`}>참여기간</th>
          <td className={td}>{project.period}</td>
          <th className={`${th} w-[70px] bg-[#f3f3f3] font-normal`}>역할</th>
          <td className={`${td} w-[130px]`}>{project.role}</td>
        </tr>
        <tr>
          <th className={`${th} bg-[#f3f3f3] font-normal`}>고객사</th>
          <td className={td}>{project.client}</td>
          <th className={`${th} bg-[#f3f3f3] font-normal`}>소속</th>
          <td className={td}>{project.company}</td>
        </tr>
        <tr>
          <th className={`${th} bg-[#f3f3f3] font-normal`}>개발환경</th>
          <td colSpan={3} className={td}>
            {env}
          </td>
        </tr>
        <tr>
          <th className={`${th} bg-[#f3f3f3] font-normal`}>상세설명</th>
          <td colSpan={3} className={`${td} leading-[1.8]`}>
            <ul className="space-y-0.5">
              {project.detailBullets.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  );
}

export default function DocumentPage() {
  const pdf = resumeLinks.find((l) => l.target === "_blank");
  const docx = resumeLinks.find((l) => l.download);
  const certification = credentials.find((c) => c.label === "자격증");
  const grade = credentials.find((c) => c.label === "기술등급");

  return (
    <>
      <div className="no-print">
        <Header />
      </div>
      <main className="bg-[#dcdfe4] px-4 pb-14 pt-8">
        <div className="no-print mx-auto mb-6 flex max-w-[794px] flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] font-bold">김민섭 경력기술서.docx</p>
          <div className="flex flex-wrap gap-2.5">
            {docx?.href ? (
              <a
                href={docx.href}
                className="inline-flex min-h-10 items-center rounded-lg bg-accent px-[18px] text-sm font-bold text-white"
              >
                DOCX 다운로드
              </a>
            ) : null}
            {pdf?.href ? (
              <a
                href={pdf.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center rounded-lg border border-[#b9bfc9] bg-white px-[18px] text-sm font-bold"
              >
                PDF
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* 1쪽: 개인 이력 카드 */}
          <article className="doc-page w-full max-w-[794px] bg-white p-8 text-sm leading-relaxed text-black shadow-[0_2px_12px_rgba(14,17,22,0.18)] sm:min-h-[1123px] sm:px-16 sm:py-20">
            <h1 className="text-center text-2xl font-bold tracking-[0.15em] sm:text-[28px] sm:tracking-[0.4em]">개 인 이 력 카 드</h1>
            <p className="pb-8 pt-1.5 text-center text-[13px] text-[#444]">{profile.tagline}</p>

            <h2 className="pb-1.5 text-[15px] font-bold">1. 신상기록</h2>
            <table className="mb-6 w-full border-collapse text-[13px]">
              <tbody>
                <tr>
                  <th className={`${th} w-[110px]`}>성명</th>
                  <td className={td}>{profile.name}</td>
                </tr>
                <tr>
                  <th className={th}>기술등급</th>
                  <td className={td}>{grade?.value}</td>
                </tr>
                <tr>
                  <th className={th}>연락처</th>
                  <td className={td}>{profile.phone}</td>
                </tr>
                <tr>
                  <th className={th}>E-Mail</th>
                  <td className={`${td} break-all`}>{profile.email}</td>
                </tr>
              </tbody>
            </table>

            <div className="mb-6 flex flex-wrap gap-6">
              <div className="min-w-0 flex-[1_1_240px]">
                <h2 className="pb-1.5 text-[15px] font-bold">2. 학력</h2>
                <table className="w-full border-collapse text-[13px]">
                  <tbody>
                    {education.map((e) => (
                      <tr key={e.label}>
                        <td className={td}>{e.label}</td>
                        <td className={`${td} w-[90px] text-center`}>{e.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="min-w-0 flex-[1_1_240px]">
                <h2 className="pb-1.5 text-[15px] font-bold">3. 자격증</h2>
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr>
                      <th className={th}>자격증명</th>
                      <th className={`${th} w-[90px]`}>취득일</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={td}>정보처리기사</td>
                      <td className={`${td} text-center`}>{certification?.value.match(/\((.*)\)/)?.[1] ?? "2015.10"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h2 className="pb-1.5 text-[15px] font-bold">4. 경력</h2>
            <div className="mb-6 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-[12.5px]">
                <thead>
                  <tr>
                    <th className={`${th} w-[100px]`}>회사명</th>
                    <th className={`${th} w-[128px]`}>기간</th>
                    <th className={`${th} w-[52px]`}>직위</th>
                    <th className={th}>담당 업무</th>
                  </tr>
                </thead>
                <tbody>
                  {careerTable.map((c) => (
                    <tr key={`${c.company}-${c.period}`}>
                      <td className={`${td} text-center`}>{c.company}</td>
                      <td className={`${td} text-center`}>{c.period}</td>
                      <td className={`${td} text-center`}>{c.rank}</td>
                      <td className={td}>{c.work}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="pb-1.5 text-[15px] font-bold">5. 특수기술</h2>
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr>
                  <th className={th}>특수기술</th>
                  <th className={`${th} w-[70px]`}>숙련도</th>
                </tr>
              </thead>
              <tbody>
                {specialSkills.map((s) => (
                  <tr key={s.items}>
                    <td className={td}>{s.items}</td>
                    <td className={`${td} text-center`}>{s.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          {/* 2쪽: SKILL INVENTORY */}
          <article className="doc-page w-full max-w-[794px] bg-white p-8 text-sm leading-relaxed text-black shadow-[0_2px_12px_rgba(14,17,22,0.18)] sm:px-16 sm:py-20">
            <h2 className="pb-7 text-center text-2xl font-bold tracking-[0.2em]">SKILL INVENTORY</h2>
            {inventoryProjects.map((project) => (
              <Inventory key={project.slug} project={project} />
            ))}

            <details className="mt-6 border border-black">
              <summary className="bg-[#e7e7e7] px-3 py-2.5 text-[13.5px] font-bold">
                한국도로공사 · 공공/재난안전 프로젝트 {collapsedProjects.length}건 (2014 ~ 2019) 펼치기
              </summary>
              <div className="p-3">
                {collapsedProjects.map((project) => (
                  <Inventory key={project.slug} project={project} />
                ))}
              </div>
            </details>
          </article>
        </div>
      </main>
      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
