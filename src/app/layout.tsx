import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "김민섭 | 금융·결제·AI 서비스 백엔드 개발자",
  description:
    "Java/Spring 기반 금융·결제 시스템과 AI 서비스 개발 경험을 보유한 김민섭 개발자 포트폴리오입니다.",
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
