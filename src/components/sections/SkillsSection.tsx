import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { skillGroups } from "@/data/portfolio";

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
      </div>
    </section>
  );
}
