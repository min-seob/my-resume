import { SectionTitle } from "@/components/ui/SectionTitle";

export function SummarySection() {
  return (
    <section id="summary" className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          eyebrow="Profile"
          title="운영 가능한 백엔드와 제품 감각을 함께 갖춘 개발자"
          description="금융권 프로젝트에서 요구되는 안정성, 연계 정확성, 운영 관점을 바탕으로 AI 서비스와 개인 프로덕트 개발까지 확장하고 있습니다."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["금융·결제 도메인", "카드사, 은행, PG, 간편결제, 인증, 정산, 배치, 전문 연계 경험"],
            ["백엔드 중심 개발", "Java/Spring 기반 서버 개발, API 설계, 데이터 처리, 운영 대응"],
            ["AI·프론트 확장", "기업형 AI 서비스, LLM 연계, React/Next.js 기반 개인 서비스 개발"],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-6">
              <h3 className="text-base font-bold text-stone-950">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
