import { profile } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="bg-ink text-[13px] text-[#8a92a3]">
      <div className="mx-auto flex max-w-[960px] flex-wrap justify-between gap-2 px-6 py-6">
        <span>© 2026 {profile.name}</span>
        <span>{profile.title}</span>
      </div>
    </footer>
  );
}
