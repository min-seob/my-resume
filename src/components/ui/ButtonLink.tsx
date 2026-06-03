import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import type { ButtonVariant } from "@/types/portfolio";

type ButtonLinkProps = {
  href?: string;
  children: ReactNode;
  placeholder?: string;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  target?: "_blank";
  download?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-emerald-900 bg-emerald-900 text-white shadow-sm hover:bg-emerald-800",
  secondary:
    "border-stone-300 bg-white text-stone-900 shadow-sm hover:border-stone-400 hover:bg-stone-50",
  ghost:
    "border-transparent bg-transparent text-stone-700 hover:bg-stone-100",
};

export function ButtonLink({
  href,
  children,
  placeholder,
  variant = "secondary",
  icon: Icon,
  target,
  download,
}: ButtonLinkProps) {
  const content = (
    <>
      {Icon ? <Icon aria-hidden className="h-4 w-4 shrink-0" /> : null}
      <span className="whitespace-nowrap">{children}</span>
      {placeholder ? (
        <span className="ml-1 whitespace-nowrap text-[11px] font-medium opacity-70">
          {placeholder}
        </span>
      ) : null}
    </>
  );

  const className = `inline-flex min-h-11 w-full min-w-0 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition sm:w-auto ${variantClass[variant]}`;

  if (!href) {
    return (
      <span aria-disabled="true" className={`${className} cursor-not-allowed opacity-85`}>
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className={className} target={target} download={download}>
      {content}
    </Link>
  );
}
