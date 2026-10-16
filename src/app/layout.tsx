import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "경력기술서 | 김민섭",
  description:
    "2014년부터 공공, 은행, 카드, PG, 충전 플랫폼 시스템을 개발해 온 12년차 개발자 김민섭의 경력기술서입니다.",
  icons: { icon: "/favicons/resume-minimi.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
