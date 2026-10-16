export type PortfolioScreen = {
  id: string;
  label: string;
  alt: string;
  src?: string;
  pending?: boolean;
  blur?: "soft" | "full";
  fit?: "cover" | "contain";
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  description: string;
  cover: PortfolioScreen;
  coverPair?: PortfolioScreen[];
  screens: PortfolioScreen[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "asarcana",
    title: "에즈아르카나",
    category: "AI 타로 리딩",
    description:
      "PICK·TALK·DEEP·ROOM 네 가지 리딩 흐름을 담은 AI 타로 서비스입니다. 카드 선택부터 대화형 리딩까지 이어지는 화면을 확인할 수 있습니다.",
    cover: {
      id: "hero",
      label: "PICK 카드 펼침",
      alt: "우측 상단 닉네임만 흐리게 처리한 에즈아르카나 카드 펼침 화면",
      src: "/portfolio/asarcana-card-fan.png",
    },
    screens: [
      {
        id: "pick-question",
        label: "PICK · 고민 입력",
        alt: "개인 입력 내용이 흐리게 처리된 PICK 고민 입력 화면",
        src: "/portfolio/asarcana-pick-question.png",
      },
      {
        id: "pick-suggestions",
        label: "PICK · 예시 질문",
        alt: "질문 내용이 흐리게 처리된 PICK 질문 선택 화면",
        src: "/portfolio/asarcana-pick-suggestions.png",
      },
      {
        id: "pick-shuffle",
        label: "PICK · 카드 선택",
        alt: "질문과 리딩 내용이 흐리게 처리된 PICK 카드 선택 화면",
        src: "/portfolio/asarcana-pick-shuffle.png",
      },
      {
        id: "pick-progress",
        label: "PICK · 리딩 중",
        alt: "리딩 진행 정보가 흐리게 처리된 PICK 처리 화면",
        src: "/portfolio/asarcana-pick-progress.png",
      },
      {
        id: "pick-result",
        label: "PICK · 결과",
        alt: "개인 질문과 리딩 결과가 흐리게 처리된 PICK 결과 화면",
        src: "/portfolio/asarcana-pick-result.png",
      },
      {
        id: "admin",
        label: "관리자 · 사용자 관리",
        alt: "관리자 왼쪽 메뉴만 선명하고 사용자 정보는 모두 흐린 화면",
        src: "/portfolio/asarcana-admin-users.png",
      },
      {
        id: "admin-payments",
        label: "관리자 · 결제 대시보드",
        alt: "관리자 왼쪽 메뉴만 선명하고 결제 정보는 모두 흐린 화면",
        src: "/portfolio/asarcana-admin-payments.png",
      },
    ],
  },
  {
    slug: "asarcana-reservation",
    title: "에즈아르카나 예약",
    category: "상담 예약·채팅",
    description:
      "상담 시간 선택부터 날짜·가능 시간 예약, 카드 리딩과 실시간 채팅까지 이어지는 모바일 예약 시스템입니다. 캡처에 표시된 날짜와 시간은 테스트 샘플입니다.",
    cover: {
      id: "date-time",
      label: "날짜·시간 선택",
      alt: "예약 달력과 가능한 상담 시간을 함께 보여주는 화면",
      src: "/portfolio/reservation-time.png",
    },
    coverPair: [
      {
        id: "date-cover",
        label: "날짜 선택",
        alt: "예약 날짜를 고르는 달력 화면",
        src: "/portfolio/reservation-date.png",
      },
      {
        id: "time-cover",
        label: "시간 선택",
        alt: "달력 아래 가능한 상담 시작 시간이 함께 표시된 화면",
        src: "/portfolio/reservation-time.png",
      },
    ],
    screens: [
      {
        id: "date-time",
        label: "날짜·시간 선택",
        alt: "예약 날짜 달력과 가능한 상담 시작 시간이 함께 표시된 화면",
        src: "/portfolio/reservation-time.png",
      },
      {
        id: "date",
        label: "날짜 선택",
        alt: "예약 날짜를 선택하는 달력 화면",
        src: "/portfolio/reservation-date.png",
      },
      {
        id: "duration",
        label: "리딩 시간 선택",
        alt: "30분과 50분 상담 시간을 고르는 예약 화면",
        src: "/portfolio/reservation-duration.png",
        blur: "soft",
      },
      {
        id: "complete",
        label: "예약 완료",
        alt: "샘플 예약 정보가 표시된 예약 완료 화면",
        src: "/portfolio/reservation-complete.png",
        blur: "soft",
      },
      {
        id: "chat",
        label: "채팅방",
        alt: "임의 대화 내용이 담긴 상담 채팅방 화면",
        src: "/portfolio/reservation-chat.png",
        blur: "soft",
      },
      {
        id: "card-result",
        label: "선택 카드",
        alt: "샘플 상담 대화와 선택된 카드 결과 화면",
        src: "/portfolio/reservation-card-result.png",
        blur: "soft",
      },
    ],
  },
  {
    slug: "coev",
    title: "코브원 충전 플랫폼",
    category: "백오피스·배치",
    description:
      "충전 플랫폼의 운영 백오피스와 배치 영역을 개발했습니다. 사용자 정보와 최근 방문·공지 목록을 가린 운영 홈 화면을 확인할 수 있습니다.",
    cover: {
      id: "coev-home",
      label: "운영 홈",
      alt: "사용자 정보와 최근 방문·공지 목록을 흐림 처리한 코브원 운영 홈 화면",
      src: "/portfolio/coev-home.png",
      fit: "contain",
    },
    screens: [
      {
        id: "coev-home",
        label: "운영 홈",
        alt: "사용자 정보와 최근 방문·공지 목록을 흐림 처리한 코브원 운영 홈 화면",
        src: "/portfolio/coev-home.png",
        fit: "contain",
      },
    ],
  },
  {
    slug: "stockmate",
    title: "StockMate",
    category: "AI 주식 브리핑",
    description:
      "뉴스 수집과 AI 요약을 일별 브리핑, 장중 뉴스, 실시간 채팅과 Discord 웹훅으로 이어주는 자동화 프로젝트입니다. 공개 화면에서 채팅 내용은 흐림 처리했습니다.",
    cover: {
      id: "market-view",
      label: "장중 시황",
      alt: "시황 카드와 배경 그래픽이 있는 StockMate 장중 화면",
      src: "/portfolio/stockmate-market.png",
    },
    screens: [
      {
        id: "daily-summary",
        label: "장전 브리핑",
        alt: "StockMate 장전 뉴스 요약과 주요 시장 지표 화면",
        src: "/portfolio/stockmate-daily.png",
      },
      {
        id: "live-news",
        label: "실시간 뉴스·채팅",
        alt: "실시간 뉴스 목록과 채팅 내용이 흐림 처리된 StockMate 화면",
        src: "/portfolio/stockmate-live-chat.png",
      },
      {
        id: "discord-webhook",
        label: "Discord 웹훅",
        alt: "StockMate 장전 브리핑 Discord 웹훅 메시지",
        src: "/portfolio/stockmate-discord.png",
      },
    ],
  },
  {
    slug: "freestyle",
    title: "프리스타일 리부트 라운지",
    category: "게임 커뮤니티",
    description:
      "신규·복귀 유저가 포지션별 공략을 읽고 질문을 나누는 커뮤니티입니다. 메인 화면, 자유게시판, 크리에이터 영상 목록을 담았습니다.",
    cover: {
      id: "home",
      label: "메인 페이지",
      alt: "프리스타일 리부트 라운지 메인 페이지",
      src: "/portfolio/freestyle-main-20261015.png",
      fit: "contain",
    },
    screens: [
      {
        id: "board-list",
        label: "게시글 목록",
        alt: "프리스타일 자유게시판 게시글 목록",
        src: "/portfolio/freestyle-board-list.png",
      },
      {
        id: "creator-videos",
        label: "크리에이터 영상 모음",
        alt: "게임 크리에이터별 영상 목록 화면",
        src: "/portfolio/freestyle-creator-videos.png",
      },
    ],
  },
  {
    slug: "money",
    title: "가계부",
    category: "개인 금융 관리",
    description:
      "월별 수입·지출과 고정비, 카테고리별 소비를 살펴보는 개인 가계부입니다. 공개용 화면에서는 금액과 고정지출 항목을 흐림 처리했습니다.",
    cover: {
      id: "dashboard",
      label: "대시보드",
      alt: "금액과 고정지출 항목을 흐림 처리한 가계부 대시보드",
      src: "/portfolio/money-dashboard.png",
    },
    screens: [
      { id: "stats", label: "통계", alt: "금액과 비율을 흐림 처리한 가계부 통계 화면", src: "/portfolio/money-stats.png" },
      { id: "settings", label: "계좌·카테고리 설정", alt: "계좌 잔액과 금액을 흐림 처리한 가계부 설정 화면", src: "/portfolio/money-settings.png" },
      { id: "skin", label: "스킨 선택", alt: "계좌와 잔액 정보를 흐림 처리한 스킨 선택 화면", src: "/portfolio/money-skin.png" },
      { id: "transaction-entry", label: "거래 입력", alt: "입력 금액을 흐림 처리한 가계부 거래 입력 화면", src: "/portfolio/money-transaction.png" },
    ],
  },
  {
    slug: "resume",
    title: "내 이력서",
    category: "개인 사이트",
    description:
      "경력기술서와 미니홈을 함께 둘러볼 수 있는 개인 사이트입니다. 미니룸에서는 캐릭터가 방을 이동하고 가구와 상호작용합니다.",
    cover: {
      id: "resume-home",
      label: "메인 페이지",
      alt: "김민섭 경력기술서 메인 랜딩페이지",
      src: "/portfolio/resume-home.png",
      fit: "contain",
    },
    screens: [
      {
        id: "resume-home",
        label: "메인 페이지",
        alt: "김민섭 경력기술서 메인 랜딩페이지",
        src: "/portfolio/resume-home.png",
        fit: "contain",
      },
      {
        id: "miniroom-coding",
        label: "미니룸 · 코딩방",
        alt: "검정 후드티 캐릭터가 있는 코딩방 미니룸",
        src: "/portfolio/resume-miniroom-coding.jpg",
      },
      {
        id: "miniroom-rest",
        label: "미니룸 · 침실",
        alt: "침대와 가구가 있는 침실 미니룸",
        src: "/portfolio/resume-miniroom-rest.jpg",
      },
    ],
  },
];

export function getPortfolioProject(slug: string) {
  return portfolioProjects.find((project) => project.slug === slug);
}
