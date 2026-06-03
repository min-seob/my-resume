type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  theme?: "light" | "dark";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  theme = "light",
}: SectionTitleProps) {
  const isDark = theme === "dark";

  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow ? (
        <p
          className={`mb-3 text-sm font-semibold uppercase tracking-[0.18em] ${
            isDark ? "text-emerald-200" : "text-emerald-800"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-2xl font-bold sm:text-3xl ${isDark ? "text-white" : "text-stone-950"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-7 ${isDark ? "text-stone-300" : "text-stone-600"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
