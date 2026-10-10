import Link from "next/link";

const navItems = [
  { label: "경력 상세", href: "/#recent" },
  { label: "개인 프로젝트", href: "/projects" },
  { label: "문서 원본", href: "/document" },
];

export function Header() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex min-h-[68px] max-w-[960px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2">
        <Link href="/" className="text-[17px] font-extrabold tracking-tight text-ink">
          김민섭 <span className="font-medium text-muted">경력기술서</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-7 gap-y-1 text-[15px] font-medium text-muted">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-accent">
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="rounded-full bg-ink px-[18px] py-2.5 font-bold text-white transition hover:bg-accent"
          >
            연락처
          </Link>
        </nav>
      </div>
    </header>
  );
}
