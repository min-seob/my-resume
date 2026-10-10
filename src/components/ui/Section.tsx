import type { ReactNode } from "react";

type SectionProps = {
  label: string;
  children: ReactNode;
  id?: string;
  last?: boolean;
};

export function Section({ label, children, id, last }: SectionProps) {
  return (
    <section
      id={id}
      className={`flex flex-wrap gap-x-14 gap-y-4 py-14 ${last ? "" : "border-b border-line"}`}
    >
      <h2 className="w-[180px] shrink-0 text-[15px] font-bold">{label}</h2>
      <div className="min-w-0 flex-[1_1_440px]">{children}</div>
    </section>
  );
}
