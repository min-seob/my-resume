import Image from "next/image";

import type { PortfolioScreen } from "@/data/portfolio-gallery";

function PendingPreview({ screen }: { screen: PortfolioScreen }) {
  return (
    <div className="portfolio-pending-preview" role="img" aria-label={screen.alt}>
      <span className="portfolio-pending-preview__badge">실제 화면 캡처 대기</span>
      <div className="portfolio-pending-preview__message">
        <span className="portfolio-pending-preview__mark" aria-hidden="true">#</span>
        <div>
          <strong>{screen.label}</strong>
          <p>{screen.alt}</p>
        </div>
      </div>
    </div>
  );
}

export function PortfolioScreenPreview({
  screen,
  display,
  pairedScreens,
}: {
  screen: PortfolioScreen;
  display: "cover" | "detail" | "thumbnail";
  pairedScreens?: PortfolioScreen[];
}) {
  const visiblePair = pairedScreens?.filter(
    (pairedScreen): pairedScreen is PortfolioScreen & { src: string } => Boolean(pairedScreen.src),
  ) ?? [];
  const className = [
    "portfolio-screen-preview",
    `portfolio-screen-preview--${display}`,
    screen.blur ? `portfolio-screen-preview--blur-${screen.blur}` : "",
    visiblePair.length > 0 ? "portfolio-screen-preview--paired" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      role={visiblePair.length > 0 ? "img" : undefined}
      aria-label={visiblePair.length > 0 ? visiblePair.map((pairedScreen) => pairedScreen.alt).join(". ") : undefined}
    >
      {visiblePair.length > 0 ? (
        <div className="portfolio-screen-preview__pair">
          {visiblePair.map((pairedScreen) => (
            <div className="portfolio-screen-preview__pair-device" key={pairedScreen.id}>
              <Image
                src={pairedScreen.src}
                alt=""
                fill
                sizes="(max-width: 700px) 15vw, 6vw"
                className="portfolio-screen-preview__pair-image"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="portfolio-screen-preview__viewport">
          {screen.src ? (
            <Image
              src={screen.src}
              alt={screen.alt}
              fill
              sizes={display === "cover" ? "(max-width: 700px) 90vw, 31vw" : "(max-width: 700px) 90vw, 70vw"}
              className={`portfolio-screen-preview__image${screen.fit === "contain" ? " portfolio-screen-preview__image--contain" : ""}`}
            />
          ) : null}
          {screen.pending ? <PendingPreview screen={screen} /> : null}
        </div>
      )}
    </div>
  );
}
