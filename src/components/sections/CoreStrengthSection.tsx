import { SectionTitle } from "@/components/ui/SectionTitle";
import { strengths } from "@/data/portfolio";

export function CoreStrengthSection() {
  return (
    <section className="bg-[#f8f3ea] px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Strength"
          title="핵심 강점"
          description="복잡한 금융/결제 흐름을 안정적으로 구현하고, AI 기반 서비스로 확장할 수 있는 실전형 역량을 지향합니다."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {strengths.map((strength) => {
            const Icon = strength.icon;
            return (
              <article key={strength.title} className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-emerald-900 text-white">
                  <Icon aria-hidden className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-stone-950">{strength.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{strength.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
