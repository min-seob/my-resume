import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { credentials, skillGroups, trainingCourses } from "@/data/portfolio";

export function SkillsSection() {
  return (
    <section id="skills" className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Skills"
          title="기술 스택"
          description="금융/결제 백엔드 구현을 중심으로, 프론트엔드와 AI 연계 기술까지 확장하고 있습니다."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {skillGroups.map((group) => (
            <article key={group.title} className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-6">
              <h3 className="text-base font-bold text-stone-950">{group.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge key={skill} tone="muted">
                    {skill}
                  </Badge>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-950">자격 및 기본 정보</h3>
            <dl className="mt-5 space-y-4 text-sm">
              {credentials.map((item) => (
                <div key={item.label}>
                  <dt className="font-semibold text-stone-500">{item.label}</dt>
                  <dd className="mt-1 text-stone-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </article>
          <article className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-950">교육 이수</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {trainingCourses.map((course) => (
                <div key={course.title} className="rounded-md border border-stone-200 bg-[#fbfaf7] p-4">
                  <p className="text-sm font-bold leading-6 text-stone-950">{course.title}</p>
                  <p className="mt-2 text-xs font-semibold text-emerald-900">{course.period}</p>
                  <p className="mt-1 text-sm text-stone-600">{course.institution}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
