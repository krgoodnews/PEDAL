export interface PedalStep {
  letter: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  details: string[];
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
  gridSpan: "normal" | "wide" | "tall";
  accent: "cyan" | "purple" | "pink";
}

export interface TerminalLine {
  type: "command" | "comment" | "output";
  text: string;
}

export const PEDAL_STEPS: PedalStep[] = [
  {
    letter: "P",
    title: "Plan",
    subtitle: "목표와 범위를 정의한다",
    description:
      "기능의 목표, 범위, 요구사항, 리스크를 문서화합니다. 크로스 리뷰로 맹점을 제거합니다.",
    icon: "Map",
    color: "#00d4ff",
    details: [
      "기능 목표 및 성공 기준 정의",
      "In Scope / Out of Scope 명확화",
      "리스크 식별 및 완화 전략",
      "Gemini CLI 크로스 리뷰",
    ],
  },
  {
    letter: "E",
    title: "Engineering",
    subtitle: "어떻게 만들지 설계한다",
    description:
      "아키텍처, API, UI 의도를 상세히 명세합니다. 구현 전 설계를 검증합니다.",
    icon: "Cpu",
    color: "#8b5cf6",
    details: [
      "컴포넌트 다이어그램 및 데이터 플로우",
      "API 명세 및 데이터 모델",
      "ASCII Art UI 레이아웃",
      "구현 순서 및 컨벤션 정의",
    ],
  },
  {
    letter: "D",
    title: "Do",
    subtitle: "Engineering 문서 기반으로 구현한다",
    description:
      "설계 문서를 청사진 삼아 코드를 작성합니다. 별도 PEDAL 문서 없이 코드만 산출합니다.",
    icon: "Code2",
    color: "#ec4899",
    details: [
      "Engineering 문서 기반 구현",
      "Self-Review Criteria 내부 검증",
      "하드코딩 없는 클린 코드",
      "타입 에러 / 린트 경고 제거",
    ],
  },
  {
    letter: "A",
    title: "Analyze",
    subtitle: "설계 vs 구현 갭을 분석한다",
    description:
      "Engineering 문서와 실제 구현을 비교합니다. Severity-Weighted Scoring으로 품질을 측정합니다.",
    icon: "BarChart3",
    color: "#00d4ff",
    details: [
      "설계 vs 구현 갭 분석",
      "Critical / Warning / Info 분류",
      "Severity-Weighted Match Rate 계산",
      "90% 미만 또는 Critical → Iterate 강제",
    ],
  },
  {
    letter: "L",
    title: "Learn",
    subtitle: "지식을 Wiki에 축적한다",
    description:
      "검증된 사실을 Wiki에 통합합니다. 다음 사이클의 컨텍스트가 됩니다.",
    icon: "BookOpen",
    color: "#8b5cf6",
    details: [
      "Wiki SSOT 업데이트",
      "Bug Pattern Registry 추가",
      "완료 보고서 작성",
      "PR 생성 및 사이클 종료",
    ],
  },
];

export const FEATURES: Feature[] = [
  {
    title: "크로스 리뷰",
    description:
      "Cursor(Claude)가 문서를 작성하면 Gemini CLI가 리뷰합니다. 같은 모델이 자기 결과물을 검증할 때의 에코 챔버 편향을 제거합니다.",
    icon: "GitPullRequest",
    gridSpan: "wide",
    accent: "cyan",
  },
  {
    title: "Wiki SSOT",
    description:
      "Learn 단계마다 검증된 사실을 Wiki에 축적합니다. Agent가 다음 사이클에서 처음부터 파악하는 비효율이 사라집니다.",
    icon: "Database",
    gridSpan: "normal",
    accent: "purple",
  },
  {
    title: "Severity Scoring",
    description:
      "Critical(×3) / Warning(×2) / Info(×1) 가중치로 품질을 수치화합니다. Critical 이슈는 무조건 Iterate를 강제합니다.",
    icon: "Gauge",
    gridSpan: "normal",
    accent: "pink",
  },
  {
    title: "Human Approval Gate",
    description:
      "Engineering 완료 후, Analyze 완료 후 두 번의 게이트에서 사람이 승인합니다. AI가 독단적으로 전체 사이클을 수행하지 않습니다.",
    icon: "ShieldCheck",
    gridSpan: "normal",
    accent: "cyan",
  },
  {
    title: "체급이 낮은 Agent도 OK",
    description:
      "Plan과 Engineering 문서가 명확한 가이드라인을 제공하므로, 고가의 최상위 모델이 아니어도 좋은 결과를 냅니다.",
    icon: "Zap",
    gridSpan: "normal",
    accent: "purple",
  },
  {
    title: "도구 무관 (Tool-Agnostic)",
    description:
      "Cursor, Gemini CLI 어디서든 동일한 워크플로를 실행합니다. 팀의 도구 선택에 제약이 없습니다.",
    icon: "Layers",
    gridSpan: "wide",
    accent: "pink",
  },
];

export const TERMINAL_LINES: TerminalLine[] = [
  { type: "comment", text: "# 1. .pedal/ 디렉토리를 프로젝트에 복사" },
  { type: "command", text: "cp -r .pedal/ your-project/" },
  { type: "comment", text: "# 2. Cursor 규칙 또는 GEMINI.md 설정" },
  {
    type: "command",
    text: "cp .cursor/rules/pedal.mdc your-project/.cursor/rules/",
  },
  { type: "comment", text: "# 3. 첫 번째 사이클 시작" },
  { type: "command", text: "/pedal plan user-auth" },
  { type: "output", text: "✓ Plan phase started for user-auth" },
];

export interface HeroStat {
  value: string;
  label: string;
  accent: "cyan" | "purple" | "pink";
}

export interface SiteContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    workflowLabel: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    stats: HeroStat[];
  };
  steps: PedalStep[];
  features: Feature[];
  terminal: TerminalLine[];
  getStarted: {
    title: string;
    description: string;
    githubCta: string;
  };
  footer: {
    license: string;
    links: { label: string; href: string }[];
  };
}

export const SITE_META = {
  githubUrl: "https://github.com/krgoodnews/PEDAL",
  license: "Apache License 2.0",
};

export const HERO_CONTENT = {
  badge: "AI Agent 개발 워크플로",
  title: "PEDAL",
  workflowLabel: "Plan → Engineering → Do → Analyze → Learn",
  subtitle: "크로스 리뷰와 Wiki SSOT로 AI Agent의 품질을 보장하는 구조화된 워크플로",
  ctaPrimary: { label: "GitHub에서 시작하기", href: SITE_META.githubUrl },
  ctaSecondary: { label: "더 알아보기", href: "#what-is-pedal" },
  stats: [
    { value: "5", label: "단계 워크플로", accent: "cyan" as const },
    { value: "2", label: "AI 크로스 리뷰", accent: "purple" as const },
    { value: "90%", label: "품질 임계값", accent: "pink" as const },
  ],
};
