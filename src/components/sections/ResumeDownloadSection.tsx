import { Download, FileText } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { resumeLinks, resumeNotes } from "@/data/portfolio";

const icons = [FileText, Download];

export function ResumeDownloadSection() {
  return (
    <section id="resume" className="bg-stone-950 px-5 py-20 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          eyebrow="Resume"
          title="이력서 다운로드"
          description="최신 공개용 이력서 파일은 추후 구글드라이브 공개 링크로 연결합니다."
          theme="dark"
        />
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex flex-wrap gap-3">
            {resumeLinks.map((link, index) => (
              <ButtonLink
                key={link.label}
                variant={index === 0 ? "primary" : "secondary"}
                placeholder={link.placeholder}
                icon={icons[index]}
                href={link.href}
                target={link.target}
                download={link.download}
              >
                {link.label}
              </ButtonLink>
            ))}
          </div>
          <ul className="mt-6 space-y-2 text-sm leading-7 text-stone-300">
            {resumeNotes.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
