import { ROUTES } from "./routes";

// 메인 네비게이션 링크
export const mainNavLinks = [
  { href: ROUTES.FILES, label: "파일 관리" },
  { href: ROUTES.ANALYTICS, label: "통계" },
  { href: ROUTES.SETTINGS, label: "세팅" },
] as const;

// Breadcrumb 자동 생성용 라우트 라벨
export const routeLabels: Record<string, string> = {
  [ROUTES.HOME]: "홈",
  [ROUTES.FILES]: "파일 관리",
  [ROUTES.ANALYTICS]: "통계",
  [ROUTES.SETTINGS]: "설정",
  [ROUTES.SETTINGS_LOGS]: "사용이력",
  [ROUTES.SEARCH]: "검색",
  [ROUTES.LOGIN]: "로그인",
};

// 외부 서비스 링크
export const externalLinks = [
  { href: "#", label: "MH Vector AI", external: true },
  { href: "#", label: "MH Ontology AI", external: true },
] as const;
