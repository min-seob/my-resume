import { ArrowDown, Download, FileText, Mail, Phone } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { domainSignals, profile, resumeLinks } from "@/data/portfolio";

export function HeroSection() {
  const [pdfLink, docxLink] = resumeLinks;

  return (
    <section id="top" className="relative overflow-hidden border-b border-stone-800 bg-stone-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(16,185,129,0.2),transparent_30%),linear-gradient(135deg,rgba(37,99,235,0.16),transparent_34%)]" />
      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="relative">
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge>Java/Spring</Badge>
            <Badge>Finance & Payment</Badge>
            <Badge>AI Service</Badge>
          </div>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            {profile.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200">
            {profile.summary}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300">
            {profile.positioning}
          </p>

          <div className="mt-7 grid max-w-3xl gap-3 text-sm md:grid-cols-2">
            <a
              href={`mailto:${profile.emailPlaceholder}`}
              className="min-w-0 rounded-md border border-white/10 bg-white/[0.06] p-4 text-stone-200 transition hover:border-emerald-300/60 hover:bg-emerald-400/10"
            >
              <Mail aria-hidden className="mb-3 h-5 w-5 text-emerald-200" />
              <span className="block text-xs font-semibold uppercase text-stone-400">
                Email
              </span>
              <span className="mt-1 block break-all font-semibold">{profile.emailPlaceholder}</span>
            </a>
            <a
              href={`mailto:${profile.secondaryEmailPlaceholder}`}
              className="min-w-0 rounded-md border border-white/10 bg-white/[0.06] p-4 text-stone-200 transition hover:border-emerald-300/60 hover:bg-emerald-400/10"
            >
              <Mail aria-hidden className="mb-3 h-5 w-5 text-emerald-200" />
              <span className="block text-xs font-semibold uppercase text-stone-400">
                Email 2
              </span>
              <span className="mt-1 block break-all font-semibold">
                {profile.secondaryEmailPlaceholder}
              </span>
            </a>
            <a
              href="tel:+821096392198"
              className="min-w-0 rounded-md border border-white/10 bg-white/[0.06] p-4 text-stone-200 transition hover:border-emerald-300/60 hover:bg-emerald-400/10 md:col-span-2 xl:col-span-1"
            >
              <Phone aria-hidden className="mb-3 h-5 w-5 text-emerald-200" />
              <span className="block text-xs font-semibold uppercase text-stone-400">
                Mobile
              </span>
              <span className="mt-1 block font-semibold">{profile.phoneNumber}</span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              variant={pdfLink.variant}
              placeholder={pdfLink.placeholder}
              icon={FileText}
              href={pdfLink.href}
              target={pdfLink.target}
            >
              {pdfLink.label}
            </ButtonLink>
            <ButtonLink
              variant={docxLink.variant}
              placeholder={docxLink.placeholder}
              icon={Download}
              href={docxLink.href}
              download={docxLink.download}
            >
              {docxLink.label}
            </ButtonLink>
            <ButtonLink href="#projects" variant="secondary" icon={ArrowDown}>
              프로젝트 보기
            </ButtonLink>
          </div>
        </div>

        <div className="relative rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30">
          <div className="rounded-md border border-stone-200 bg-stone-950 p-5 text-stone-100">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-sm font-semibold">service-profile.ts</p>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                deploy-ready
              </span>
            </div>
            <div className="mt-5 space-y-4 font-mono text-sm leading-7 text-stone-300">
              <p>
                <span className="text-emerald-300">domain</span>: finance, payment, ai
              </p>
              <p>
                <span className="text-emerald-300">backend</span>: Java, Spring, Batch, API
              </p>
              <p>
                <span className="text-emerald-300">product</span>: Next.js, LLM, Vercel
              </p>
              <p>
                <span className="text-emerald-300">contact</span>: {profile.emailPlaceholder}
              </p>
              <p>
                <span className="text-emerald-300">mobile</span>: {profile.phoneNumber}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-5">
            {domainSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.label}
                  className="rounded-md border border-white/10 bg-white/[0.08] p-3 text-center"
                >
                  <Icon aria-hidden className="mx-auto h-5 w-5 text-emerald-200" />
                  <p className="mt-2 text-xs font-semibold text-stone-100">{signal.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
