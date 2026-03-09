import Link from "next/link";
import {
  Blocks,
  Code2,
  Moon,
  Paintbrush,
  Smartphone,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Next.js 16",
    description: "App Router, 서버 컴포넌트, Turbopack으로 빠른 개발 환경",
  },
  {
    icon: Paintbrush,
    title: "TailwindCSS v4",
    description: "유틸리티 퍼스트 CSS 프레임워크로 빠른 스타일링",
  },
  {
    icon: Blocks,
    title: "ShadcnUI",
    description: "접근성을 고려한 재사용 가능한 컴포넌트 라이브러리",
  },
  {
    icon: Code2,
    title: "TypeScript",
    description: "엄격한 타입 검사로 안정적인 코드 작성",
  },
  {
    icon: Smartphone,
    title: "반응형 디자인",
    description: "모바일부터 데스크톱까지 완벽한 반응형 레이아웃",
  },
  {
    icon: Moon,
    title: "다크모드",
    description: "시스템 설정 연동 및 수동 전환 지원",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="flex flex-col items-center gap-8 px-4 py-24 text-center md:py-32">
        <Badge variant="secondary" className="text-sm">
          v0.1.0 — Next.js 16 + React 19
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          모던 웹 프로젝트를
          <br />
          빠르게 시작하세요
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
          Next.js, TailwindCSS, ShadcnUI가 사전 구성된 스타터킷으로 아이디어
          구현에만 집중하세요.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="#features">시작하기</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com">GitHub</Link>
          </Button>
        </div>
      </section>

      {/* 기능 카드 섹션 */}
      <section
        id="features"
        className="container mx-auto px-4 py-16 md:py-24"
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            포함된 기능
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            프로덕션 레벨의 웹 애플리케이션을 위한 핵심 구성 요소
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="text-primary mb-2 h-10 w-10" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section
        id="docs"
        className="bg-muted/50 flex flex-col items-center gap-6 px-4 py-16 text-center md:py-24"
      >
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          지금 바로 시작하세요
        </h2>
        <p className="text-muted-foreground max-w-xl text-lg">
          공식 문서를 참고하여 프로젝트를 확장해 보세요.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="https://nextjs.org/docs">Next.js 문서</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="https://ui.shadcn.com">ShadcnUI</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
