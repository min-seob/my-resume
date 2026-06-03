import { profile } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 px-5 py-8 text-stone-300 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-white">{profile.name}</p>
        <p>Backend Developer · Finance · Payment · AI Service</p>
      </div>
    </footer>
  );
}
