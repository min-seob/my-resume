import { SectionTitle } from "@/components/ui/SectionTitle";
import { timeline } from "@/data/portfolio";

export function CareerTimelineSection() {
  return (
    <section id="career" className="bg-[#f8f3ea] px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          eyebrow="Career"
          title="커리어 타임라인"
          description="프로젝트 전체를 나열하기보다 도메인 확장 흐름이 보이도록 요약했습니다."
        />
        <div className="space-y-4">
          {timeline.map((item) => (
            <article
              key={item.period}
              className="grid gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-[180px_1fr]"
            >
              <p className="text-sm font-bold text-emerald-900">{item.period}</p>
              <div>
                <h3 className="text-lg font-bold text-stone-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-stone-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
