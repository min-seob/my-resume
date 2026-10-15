import { featuredProjects } from "@/data/portfolio";

export const recentProjects = featuredProjects.slice(0, 5);

/** 경력기술서 문서에서 접어서 보여주는 2014~2019 도로공사·공공 프로젝트 */
const collapsedSlugs = new Set([
  "ex-highway-sales-info-maintenance",
  "ex-highway-settlement-systems",
  "public-safety-disaster-management-2017",
  "namsan-high-school-points-system",
  "daegu-fire-119-control-system",
  "public-safety-disaster-system-phase-2",
  "fire-disaster-integrated-safety-system-phase-1",
]);

export const inventoryProjects = featuredProjects.filter((p) => !collapsedSlugs.has(p.slug));
export const collapsedProjects = featuredProjects.filter((p) => collapsedSlugs.has(p.slug));

export type PersonalProject = {
  title: string;
  meta: string;
  period?: string;
  description: string;
  stack: string;
  href?: string;
};

export const personalProjects: PersonalProject[] = [
  {
    title: "에즈아르카나",
    meta: "asarcana.com",
    period: "2026.01 ~ 현재 · 기획·설계·개발·배포",
    description:
      "AI 타로 리딩 플랫폼. Talk · Pick · Deep · Room 네 가지 리딩 흐름과 로그인, 마이페이지, 운영 API를 직접 만들었습니다. 웹과 관리자를 분리해 배포하고, 하네스 엔지니어링으로 LLM 응답 품질을 개선했으며 Git–Vercel 배포 자동화 흐름을 구성했습니다.",
    stack: "Next.js 16 · React 19 · Firebase Auth / Firestore · Anthropic SDK · OpenAI SDK · Vercel",
    href: "https://asarcana.com",
  },
  {
    title: "에즈아르카나 예약",
    meta: "spirit.asarcana.com",
    period: "2026.09 ~ 2026.10 · 기획·설계·개발·배포",
    description:
      "모바일 웹 1:1 실시간 채팅 상담 예약·상담 통합 플랫폼. 서버 시각 기준 입장·종료 제어, 30일 롤링 예약, 당일 변경·취소 제한, 소셜 로그인과 개인정보 암호화를 구현하고 듀얼 브라우저 E2E로 검증했습니다.",
    stack: "Next.js · Firebase Auth / Firestore · Firestore Rules · Playwright E2E",
    href: "https://spirit.asarcana.com",
  },
];

export const stockmate = {
  title: "StockMate",
  meta: "AI 주식 브리핑 자동화 · 운영 종료",
  description:
    "뉴스 크롤링부터 AI 요약, Discord 발송, 인스타·스레드 업로드까지 이어지는 자동화 파이프라인을 구축한 사이드 프로젝트입니다. 운영은 종료했고, 개발 과정에서 얻은 경험을 기록합니다.",
  steps: [
    { title: "크롤링", description: "RSS·네이버 뉴스 수집, 중복 제거, 중요도 점수화" },
    { title: "AI 요약", description: "Claude로 기사 요약, 오늘의 총평, 관련 종목 구조화" },
    {
      title: "자동 발송·업로드",
      description: "Discord 웹훅 발송, 인스타·스레드 자동 업로드, 캐러셀 카드 이미지 포맷 통일, DART open API 연계",
    },
    { title: "운영 대응", description: "예외 발생 시 Discord 웹훅 에러 알림으로 빠른 대응" },
  ],
  stack: "Next.js 16 · TypeScript · Firebase Functions · Claude API · Discord Webhook",
};

export const careerHistory = [
  { period: "2026 ~", title: "현대엔지니어링 충전플랫폼 MVP, PG/결제, 기업형 AI" },
  { period: "2024 ~ 2026", title: "NH Pay, 현대카드, 삼성카드 등 카드·간편결제" },
  { period: "2021 ~ 2024", title: "NH포탈, KB GSPAY, 우리은행 IB 등 금융권 개발" },
  { period: "2017 ~ 2021", title: "도로공사·지방세·세입세출 시스템 개발/운영" },
  { period: "2014 ~ 2017", title: "공공·재난안전 시스템 개발" },
];

export const careerTable = [
  { company: "코브원", period: "2026.06 ~ 현재", rank: "책임", work: "현대엔지니어링 전기차 충전플랫폼 MVP 개발" },
  { company: "다날", period: "2026.03 ~ 2026.06", rank: "과장", work: "다날 PG사 상품권 결제(승인) 업무 개발" },
  { company: "엣데브", period: "2025.10 ~ 2026.01", rank: "매니저", work: "현대모비스 기업특화 LLM 연계 (NotebookLM 방식) 개발" },
  { company: "알티시스템", period: "2025.04 ~ 2025.09", rank: "과장", work: "삼성카드 모니모앱 오픈앱카드 연동개발" },
  { company: "텐노드솔루션", period: "2024.12 ~ 2025.04", rank: "차장", work: "현대카드 간편결제 국내·해외 개발 및 운영" },
  { company: "상상그루", period: "2024.03 ~ 2024.12", rank: "과장", work: "농협 계정계 업무 NH PAY 업무 개발" },
  { company: "토라웨어", period: "2023.09 ~ 2024.02", rank: "과장", work: "IB 영업시스템 개발 및 테스트" },
  { company: "파일론시스템", period: "2023.01 ~ 2023.08", rank: "과장", work: "GSPAY 간편결제 승인업무 개발" },
  { company: "아울정보", period: "2021.09 ~ 2022.12", rank: "과장", work: "NH포탈, 사회공헌, Admin 페이지 개발 및 운영 (Vue, Java)" },
  { company: "다산시스템", period: "2019.04 ~ 2021.08", rank: "대리", work: "e세입세출 분석설계 및 개발/운영" },
  { company: "아이티포워드", period: "2017.09 ~ 2019.03", rank: "대리", work: "한국도로공사 하이패스, 영업관리시스템 개발 및 운영" },
  { company: "위니텍", period: "2014.09 ~ 2017.08", rank: "사원", work: "행정안전부(소방방재청) 개발 및 운영" },
];

export const specialSkills = [
  { items: "Java, Spring Boot, JPA, Gradle, Thymeleaf, SSE, AI AGENT", level: "상" },
  { items: "넥사크로, 웹스퀘어, IntelliJ, VSCode", level: "상" },
  { items: "Oracle, MS SQL, PostgreSQL, OpenSearch, MongoDB", level: "상" },
  { items: "Elastic, Git, SVN, AWS S3", level: "상" },
  { items: "React, TypeScript, Next.js", level: "중" },
];

export const education = [
  { label: "대곡고등학교 이과 졸업", date: "2009.02" },
  { label: "계명대학교 컴퓨터공학과 졸업", date: "2015.02" },
];
