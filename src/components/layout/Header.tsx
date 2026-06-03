import Link from "next/link";

const navItems = [
  { label: "소개", href: "/#summary" },
  { label: "프로젝트", href: "/#projects" },
  { label: "경력", href: "/#career" },
  { label: "기술", href: "/#skills" },
  { label: "이력서", href: "/#resume" },
  { label: "연락", href: "/#contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="text-sm font-bold text-white sm:text-base">
          김민섭
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-stone-300 transition hover:text-emerald-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
