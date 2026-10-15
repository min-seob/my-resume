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
}: {
  screen: PortfolioScreen;
  display: "cover" | "detail" | "thumbnail";
}) {
  const className = [
    "portfolio-screen-preview",
    `portfolio-screen-preview--${display}`,
    screen.blur ? `portfolio-screen-preview--blur-${screen.blur}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
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
    </div>
  );
}
