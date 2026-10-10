export type ButtonVariant = "primary" | "secondary" | "ghost";

export type ResumeLink = {
  label: string;
  placeholder: string;
  href?: string;
  target?: "_blank";
  download?: boolean;
  variant: ButtonVariant;
};

export type ProjectCategory = "금융·결제" | "기업형 AI" | "개인 서비스" | "금융·공공" | "공공·재난안전" | "교육·공공" | "충전 플랫폼";

export type Project = {
  title: string;
  period: string;
  client: string;
  company: string;
  role: string;
  category: ProjectCategory;
  description: string;
  techStack: string[];
  highlights: string[];
  detailIntro: string;
  detailBullets: string[];
  detailTechStack: {
    label: string;
    items: string[];
  }[];
  links?: {
    label: string;
    href: string;
    note?: string;
  }[];
  aiUsage?: {
    area: string;
    use: string;
    effect: string;
  }[];
  slug: string;
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

export type Credential = {
  label: string;
  value: string;
};

export type TrainingCourse = {
  title: string;
  period: string;
  institution: string;
};

