import {
  BrainCircuit,
  Building2,
  DatabaseZap,
  FileDown,
  FileText,
  Landmark,
  Mail,
  Newspaper,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type {
  ContactLink,
  Project,
  ResumeLink,
  SkillGroup,
  Strength,
  TimelineItem,
} from "@/types/portfolio";

export const profile = {
  name: "김민섭",
  headline: "금융·결제·AI 서비스 백엔드 개발자 김민섭",
  summary:
    "Java/Spring 기반 금융·결제 시스템 개발 경험과 기업형 AI 서비스, React/Next.js 기반 개인 서비스 개발 경험을 함께 보유한 개발자입니다.",
  positioning:
    "백엔드 중심의 금융/결제 도메인 경험을 바탕으로, AI 서비스와 개인 프로덕트까지 직접 기획·개발·배포할 수 있는 개발자입니다.",
  emailPlaceholder: "painseob12@gmail.com",
  secondaryEmailPlaceholder: "painseob11@naver.com",
  phoneNumber: "010-9639-2198",
};

export const resumeLinks: ResumeLink[] = [
  {
    label: "이력서 PDF 보기",
    placeholder: "",
    href: "https://drive.google.com/file/d/1OjhtQdk-4ErDnXp9DVofUIvPo0ws0fvX/view?usp=drive_link",
    target: "_blank",
    variant: "primary",
  },
  {
    label: "이력서 DOCX 다운로드",
    placeholder: "",
    href: "https://docs.google.com/document/d/1vyChVaVXAowSt8rdoj7dkKO5b2ahi-faaGxObvLwXX4/export?format=docx",
    download: true,
    variant: "secondary",
  },
];

export const strengths: Strength[] = [
  {
    title: "금융·결제 백엔드",
    description:
      "카드사, 은행, PG, 간편결제, 인증, 정산, 배치, 전문 연계 흐름을 이해하고 구현합니다.",
    icon: Landmark,
  },
  {
    title: "Java/Spring 기반 구현력",
    description:
      "Spring Boot, JPA, QueryDSL, MyBatis, Batch, REST API를 활용해 운영 가능한 서버 구조를 만듭니다.",
    icon: DatabaseZap,
  },
  {
    title: "AI 서비스 확장성",
    description:
      "기업형 AI UI, LLM API, RAG, SSE Streaming, Agent UI 연계를 고려한 서비스 개발 경험을 쌓고 있습니다.",
    icon: BrainCircuit,
  },
];

export const featuredProjects: Project[] = [
  {
    title: "다날 상품권·결제 프레임워크 전환",
    period: "2026.03 ~ 2026.06",
    client: "다날",
    role: "설계/개발",
    category: "금융·결제",
    description:
      "상품권 발행·결제 승인 영역의 분산된 AS-IS 레포지토리를 분석하고 TO-BE 프레임워크로 이관한 프로젝트입니다.",
    techStack: ["Java 21", "Spring Boot", "JPA", "QueryDSL", "Oracle", "Gradle"],
    highlights: [
      "상품권 발행·결제 승인 AS-IS 레포 분석 및 TO-BE 프레임워크 이관",
      "결제 흐름별 상태관리와 전문 통합을 고려한 확장 구조 적용",
      "생성형 AI 기반 개발 보조 환경을 Instruction/Skill 설정으로 활용",
    ],
    detailIntro:
      "다날 상품권 발행 및 결제 승인 업무의 기존 레포 구조를 분석하고, 운영 확장성을 고려한 TO-BE 프레임워크로 개선·이관하는 백엔드 개발을 수행했습니다.",
    detailBullets: [
      "상품권 발행, 결제 승인 영역의 AS-IS 레포지토리 구조 분석 및 TO-BE 프레임워크 이관 개발",
      "결제 흐름별 상태관리, 전문 통합, 운영 확장성을 고려한 서버 구조 적용",
      "Java 21, JPA, QueryDSL 기반의 결제 도메인 개발 환경에서 설계/개발 수행",
      "Copilot, Claude, GPT 모델을 Instruction/Skill 설정과 함께 활용해 개발 생산성 보조",
      "Confluence, Jira 기반 협업 프로세스 참여",
    ],
    detailTechStack: [
      { label: "Backend", items: ["Java 21", "Spring Boot", "JPA", "QueryDSL", "Gradle"] },
      { label: "Database", items: ["Oracle"] },
      { label: "Tools", items: ["Git", "IntelliJ", "Postman", "VSCode", "Confluence", "Jira"] },
    ],
    pendingItems: ["[성과/수치 보완 필요]", "[링크 추가 예정]"],
    slug: "danal-payment-framework-migration",
  },
  {
    title: "AI 타로 리딩 플랫폼 / AI 주식 뉴스 정보 서비스",
    period: "2026.01 ~ 현재",
    client: "Side Project",
    role: "개인 서비스 기획·백엔드·프론트엔드 개발",
    category: "개인 서비스",
    description:
      "AI 타로 리딩 플랫폼과 AI 주식 뉴스 서비스를 직접 기획·설계·개발·배포하며 LLM API와 자동화 흐름을 검증한 개인 서비스입니다.",
    techStack: ["Next.js", "React", "TypeScript", "Firebase", "LLM API", "Vercel", "Google Cloud Scheduler"],
    highlights: [
      "LLM API 연동형 서비스 구조 설계부터 개발·배포까지 전 과정 수행",
      "RSS 뉴스 수집·가공·서비스 및 채팅 서비스 개발",
      "디스코드·인스타·스레드 자동 업로드 전송 시스템 개발",
    ],
    detailIntro:
      "AI 타로 리딩 플랫폼과 AI 주식 뉴스 정보 서비스를 직접 기획·설계·개발·배포하며, LLM API 연동과 자동화 기반 개인 서비스 운영 경험을 쌓았습니다.",
    detailBullets: [
      "AI 타로 리딩 플랫폼에서 하네스 엔지니어링 및 LLM 응답 품질 개선 수행",
      "Claude Code, Codex, Gemini 등을 활용한 바이브코딩 기반 개발 경험 축적",
      "LLM API 연동형 구조 설계와 서비스 기획, 설계, 개발, 배포 전 과정 수행",
      "AI 주식 뉴스 정보 서비스에서 RSS 뉴스 수집, 가공, 서비스 흐름 개발",
      "채팅 서비스 개발",
      "디스코드, 인스타, 스레드 자동 업로드 전송 시스템 개발",
      "Dart Open API 연계",
      "MCP와 Skill을 활용한 개발 자동화 실험",
    ],
    detailTechStack: [
      { label: "Frontend", items: ["React", "TypeScript", "Next.js"] },
      { label: "Backend/Data", items: ["Firebase", "RSS", "Dart Open API"] },
      { label: "AI/Automation", items: ["LLM API", "Claude Code", "GPT Codex", "Gemini", "MCP", "Skill"] },
      { label: "Infra", items: ["Vercel", "Google Cloud Scheduler", "Git"] },
    ],
    pendingItems: ["[성과/수치 보완 필요]"],
    links: [
      {
        label: "AI 타로 에즈아르카나",
        href: "https://asarcana.com/",
        note: "개발중",
      },
      {
        label: "AI 주식 뉴스",
        href: "https://stockmate-mu.vercel.app/brief",
      },
    ],
    slug: "ai-tarot-stock-news",
  },
  {
    title: "현대모비스 기업형 AI 특화 UI",
    period: "2025.10 ~ 2026.01",
    client: "현대모비스",
    role: "설계/개발",
    category: "기업형 AI",
    description:
      "NotebookLM 방식의 기업형 AI 에이전트 서비스에서 지식 관리, 소스 요약, 특화 UI와 백엔드 연계 구조를 설계·개발했습니다.",
    techStack: ["Java", "Spring Boot", "React", "TypeScript", "Tailwind CSS", "OpenSearch", "MongoDB", "PostgreSQL"],
    highlights: [
      "NotebookLM 기능을 구현하는 현대모비스 전용 AI 에이전트 서비스 구축",
      "S3·SharePoint·서비스 지식·텍스트 통합 지식 관리 아키텍처 설계",
      "LLM 연계 소스 요약 파이프라인 및 API 구현",
    ],
    detailIntro:
      "현대모비스 전용 기업형 AI 에이전트 서비스에서 NotebookLM 방식의 지식 활용 UI와 백엔드 데이터 흐름, 소스 요약 파이프라인을 설계·개발했습니다.",
    detailBullets: [
      "현대모비스 전용 AI 에이전트 서비스 구축 및 NotebookLM 기능 구현",
      "기업 내부 지식 활용을 위한 AI 에이전트 서비스 구조 설계 및 핵심 기능 개발",
      "S3, SharePoint, 서비스 지식, 텍스트 등 다중 소스를 통합하는 지식 관리 아키텍처 설계",
      "Hive, OpenSearch 기반 어드민 데이터 관리 시스템 설계 및 개발",
      "React·TypeScript 기반 특화 UI와 백엔드 간 데이터 흐름 구조 설계",
      "LLM 연계 소스 요약 파이프라인 설계 및 API 구현",
      "DB 테이블 설계, ERD 작성, 운영 확장성을 고려한 구조 적용",
      "대시보드 현황판 개발 및 Confluence/Jira 기반 협업",
    ],
    detailTechStack: [
      { label: "Backend", items: ["Java", "Spring Boot", "JPA", "Gradle", "QueryDSL"] },
      { label: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
      { label: "Database/Search", items: ["Hive", "OpenSearch", "MongoDB", "PostgreSQL"] },
      { label: "Integration", items: ["AWS S3", "SharePoint Graph API", "LLM API"] },
      { label: "Tools", items: ["Git", "IntelliJ", "Postman", "Confluence", "Jira"] },
    ],
    pendingItems: ["[성과/수치 보완 필요]", "[링크 추가 예정]"],
    slug: "hyundai-mobis-enterprise-ai-ui",
  },
  {
    title: "삼성카드 모니모앱 오픈앱카드 연동",
    period: "2025.04 ~ 2025.09",
    client: "삼성카드",
    role: "결제 연동 개발",
    category: "금융·결제",
    description:
      "모니모앱 오픈앱카드 연동에서 카드 인증·등록·삭제·노출 제어와 카드사별 연계 API 개발을 수행했습니다.",
    techStack: ["Java", "Anyframe", "JSP", "EAI/MCI", "Oracle", "SVN"],
    highlights: [
      "다수 카드사 오픈앱카드 연계 구조 분석 및 API 개발",
      "카드 인증·등록·삭제·노출 제어 업무 흐름 구현",
      "대량 카드 데이터 처리를 위한 배치 프로세스 설계 및 안정화",
    ],
    detailIntro:
      "삼성카드 모니모앱의 오픈앱카드 연동을 위해 다수 카드사 연계 구조를 분석하고 인증·등록·노출 제어 관련 API와 배치 프로세스를 개발했습니다.",
    detailBullets: [
      "국민·신한·농협·비씨·하나·롯데 등 다수 카드사 오픈앱카드 연계 구조 분석 및 API 개발",
      "카드 인증, 등록, 삭제, 노출 제어 전반의 업무 흐름 설계 및 구현",
      "카드사별 설정을 통합 관리하는 어드민 공통속성 제어 구조 설계",
      "대량 카드 데이터 처리를 위한 배치 프로세스 설계 및 안정화",
      "EAI/MCI 전문 기반 외부 시스템 연계 개발 및 테스트",
    ],
    detailTechStack: [
      { label: "Backend", items: ["Java", "Samsung Card Anyframe", "JSP"] },
      { label: "Integration", items: ["EAI", "MCI", "Card API"] },
      { label: "Tools", items: ["Eclipse", "Postman", "Jira", "Confluence", "SVN", "Hiware"] },
    ],
    pendingItems: ["[성과/수치 보완 필요]", "[링크 추가 예정]"],
    slug: "samsung-card-monimo-open-app-card",
  },
  {
    title: "현대카드 블루페이 간편결제 구축 및 운영",
    period: "2024.12 ~ 2025.04",
    client: "현대카드",
    role: "간편결제 백엔드 개발/운영",
    category: "금융·결제",
    description:
      "현대카드 블루페이 간편결제 구축과 운영 과정에서 결제·인증·빌키 승인 흐름과 국내/해외 결제 연계를 개발했습니다.",
    techStack: ["Java", "Spring Boot", "PostgreSQL", "JUnit", "EAI", "API"],
    highlights: [
      "Spring 보안 취약점 대응 및 암호화 정책 개선 참여",
      "결제·빌키·인증 승인 간 데이터 정합성 개선 개발",
      "HMG-PAY 등 해외 연계를 고려한 API 확장 대응",
    ],
    detailIntro:
      "현대카드 블루페이 간편결제 서비스의 구축 및 운영을 담당하며 국내·해외 결제 흐름, 인증 승인, 운영 VOC 대응 개발을 수행했습니다.",
    detailBullets: [
      "라이브러리 변경과 Spring 보안 취약점 대응, 암호화 정책 개선 작업 참여",
      "대한항공 애플페이 국민·신한 확대 대응 개발",
      "결제·빌키·인증 승인 간 데이터 정합성 개선 개발",
      "비씨카드 개인/법인 구분 처리를 위한 배치 및 프로그램 개발",
      "결제정보통보 주유 관련 API 수정 개발 및 백오피스 운영 VOC 대응",
      "북미 해외 HMG-PAY 연계를 고려한 API 구조 설계 및 확장 대응",
      "EAI 통신 및 API 연계 개발",
    ],
    detailTechStack: [
      { label: "Backend", items: ["Java", "Spring Boot", "JUnit"] },
      { label: "Database", items: ["PostgreSQL", "Oracle"] },
      { label: "Tools", items: ["STS", "DB ever", "Git", "SVN", "Postman", "Redmine"] },
      { label: "Integration", items: ["EAI", "Payment API"] },
    ],
    pendingItems: ["[성과/수치 보완 필요]", "[링크 추가 예정]"],
    slug: "hyundai-card-bluepay",
  },
  {
    title: "NH농협카드 디지털플랫폼 NHPAY",
    period: "2024.03 ~ 2024.12",
    client: "농협은행",
    role: "업무공통 설계/개발",
    category: "금융·결제",
    description:
      "NH Pay, 카드, D-ARS를 통합하는 디지털플랫폼에서 인증·자금·배치·React 본인인증 화면 개발을 수행했습니다.",
    techStack: ["Java", "Batch", "React", "Oracle", "MS SQL", "MCI"],
    highlights: [
      "NH Pay·카드·D-ARS 통합 앱 업무 흐름 파악 및 업무공통 개발",
      "SMS·티머니·토스·공동/금융인증서 등 인증 업무 개발",
      "결제·정산·배치·이체 등 자금 관련 업무 개발",
    ],
    detailIntro:
      "NH Pay, 카드, D-ARS를 통합하는 디지털플랫폼의 업무공통 영역에서 인증, 자금, 배치, 프론트 본인인증 화면 개발을 수행했습니다.",
    detailBullets: [
      "NH Pay, 카드, D-ARS 통합 앱의 업무 흐름 이해 및 업무공통 개발",
      "PT-BT 구조 프레임워크 기반 개발 수행",
      "Java Batch의 chunk, tasklet 방식 개발",
      "MCI 전문 사용 방식 파악 및 계정계 연계 흐름 이해",
      "SMS인증, 티머니, 사용자 인증, 토스 인증, 공동/금융인증서 등 인증 업무 개발",
      "결제, 정산, 배치, 이체(송금) 등 자금 관련 업무 개발",
      "React 기반 본인인증 화면 개발",
    ],
    detailTechStack: [
      { label: "Backend", items: ["Java", "Batch", "MCI"] },
      { label: "Frontend", items: ["React"] },
      { label: "Database", items: ["Oracle", "MS SQL"] },
      { label: "Tools", items: ["Git", "Orange", "STS", "Postman", "오케스트라"] },
    ],
    pendingItems: ["[성과/수치 보완 필요]", "[링크 추가 예정]"],
    slug: "nhcard-nhpay",
  },
];

export const timeline: TimelineItem[] = [
  {
    period: "2014 ~ 2017",
    title: "공공/재난안전 시스템 개발",
    description: "공공 서비스와 재난안전 관련 시스템 개발 경험을 축적했습니다.",
  },
  {
    period: "2017 ~ 2021",
    title: "도로공사·지방세·세입세출 시스템 개발/운영",
    description: "행정/공공 도메인의 운영 안정성과 업무 흐름 이해도를 넓혔습니다.",
  },
  {
    period: "2021 ~ 2024",
    title: "NH포탈, KB GSPAY, 우리은행 IB 시스템 등 금융권 개발",
    description: "은행, 카드, 결제 서비스 중심의 금융권 백엔드 개발 경험을 쌓았습니다.",
  },
  {
    period: "2024.03 ~ 2026.06",
    title: "NH Pay, 현대카드, 삼성카드, 현대모비스 AI, 다날 PG/결제 개발",
    description:
      "간편결제, 카드 연동, PG/결제, 기업형 AI 서비스까지 영역을 확장하고 있습니다.",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend",
    skills: ["Java", "Spring Boot", "JPA", "QueryDSL", "MyBatis", "Batch", "REST API", "전문 연계"],
  },
  {
    title: "Frontend",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    title: "AI / Integration",
    skills: ["LLM API", "RAG", "SSE Streaming", "Agent UI", "OpenAI/Claude 연계 경험"],
  },
  {
    title: "Database / Infra",
    skills: ["Oracle", "PostgreSQL", "MS SQL", "MongoDB", "OpenSearch", "Firebase", "Vercel"],
  },
  {
    title: "Tools",
    skills: ["Git", "IntelliJ", "VSCode", "Postman", "Jira", "Confluence"],
  },
];

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    placeholder: profile.emailPlaceholder,
    href: `mailto:${profile.emailPlaceholder}`,
    icon: Mail,
  },
  {
    label: "Email 2",
    placeholder: profile.secondaryEmailPlaceholder,
    href: `mailto:${profile.secondaryEmailPlaceholder}`,
    icon: Mail,
  },
  {
    label: "Mobile",
    placeholder: profile.phoneNumber,
    href: "tel:+821096392198",
    icon: Phone,
  },
];

export const resumeNotes = [
  "PDF는 새 창에서 열고, DOCX는 다운로드 링크로 연결합니다.",
  "공개용 파일은 개인정보 노출 여부를 별도 확인합니다.",
];

export const domainSignals = [
  { label: "Finance", icon: Building2 },
  { label: "Payment", icon: ShieldCheck },
  { label: "Asarcana", icon: Sparkles },
  { label: "Stock News", icon: Newspaper },
  { label: "Resume", icon: FileText },
  { label: "Download", icon: FileDown },
];
