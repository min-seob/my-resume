import type { NextConfig } from "next";

/** 경력 상세가 /projects/[slug] 에서 /career/[slug] 로 이동했습니다. */
const legacyCareerSlugs = [
      "danal-payment-framework-migration",
      "hyundai-mobis-enterprise-ai-ui",
      "samsung-card-monimo-open-app-card",
      "hyundai-card-bluepay",
      "nhcard-nhpay",
      "woori-bank-ib-sales-system",
      "kb-star-platform-gspay",
      "nh-portal-social-contribution",
      "daegu-bank-e-revenue-expenditure",
      "ex-highway-sales-info-maintenance",
      "ex-highway-settlement-systems",
      "public-safety-disaster-management-2017",
      "namsan-high-school-points-system",
      "daegu-fire-119-control-system",
      "public-safety-disaster-system-phase-2",
      "fire-disaster-integrated-safety-system-phase-1",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...legacyCareerSlugs.map((slug) => ({
        source: `/projects/${slug}`,
        destination: `/career/${slug}`,
        permanent: true,
      })),
      {
        source: "/projects/ai-tarot-stock-news",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
