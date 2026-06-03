import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "default" | "muted";
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span
      className={
        tone === "muted"
          ? "inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600"
          : "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
      }
    >
      {children}
    </span>
  );
}
