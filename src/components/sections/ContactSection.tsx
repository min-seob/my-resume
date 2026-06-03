import { contactLinks } from "@/data/portfolio";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function ContactSection() {
  return (
    <section id="contact" className="bg-[#f8f3ea] px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionTitle
          eyebrow="Contact"
          title="연락"
          description="프로젝트 문의와 협업 제안은 이메일로 받습니다."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {contactLinks.map((link) => {
            const Icon = link.icon;
            return (
              <article key={link.label} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <Icon aria-hidden className="h-6 w-6 text-emerald-900" />
                <h3 className="mt-4 text-base font-bold text-stone-950">{link.label}</h3>
                {link.href ? (
                  <a className="mt-2 block text-sm font-semibold text-stone-600 transition hover:text-emerald-900" href={link.href}>
                    {link.placeholder}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-stone-600">{link.placeholder}</p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
