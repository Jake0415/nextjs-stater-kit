import {
  CloudUpload,
  ScanSearch,
  BrainCircuit,
  Database,
  CheckCircle,
  Zap,
  Network,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const featureCards = [
  {
    icon: CloudUpload,
    title: "PDF 업로드",
    description:
      "오브젝트 스토리지를 활용하여 보안이 강화된 클라우드 저장소에 파일을 안전하게 업로드합니다.",
  },
  {
    icon: ScanSearch,
    title: "AI OCR 추출",
    description:
      "AI 에이전트가 복잡한 문서 내 텍스트, 테이블, 이미지를 정확하게 분류하여 정교하게 추출합니다.",
  },
  {
    icon: BrainCircuit,
    title: "LLM 정제",
    description:
      "OCR 결과물을 거대언어모델(LLM)로 정규화 및 가공하여 신뢰도 높은 정제 데이터를 생성합니다.",
  },
  {
    icon: Database,
    title: "메타데이터 저장",
    description:
      "페이지 정보 및 키워드 기반 색인을 생성하여 문서 검색 및 데이터 활용도를 극대화합니다.",
  },
];

const highlights = [
  {
    icon: CheckCircle,
    title: "AI 에이전트 자동화",
    subtitle: "지능형 자동 데이터 처리",
  },
  {
    icon: Zap,
    title: "벡터 데이터 전환",
    subtitle: "RAG 시스템 임베딩 지원",
  },
  {
    icon: Network,
    title: "청킹 최적화",
    subtitle: "LLM 기반 문맥 보존 분할",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        {/* 배경 블러 효과 */}
        <div className="pointer-events-none absolute -left-[5%] -top-[5%] bottom-[55%] right-[55%] rounded-full bg-brand/5 blur-[60px]" />
        <div className="pointer-events-none absolute -right-[5%] bottom-1/2 left-[65%] top-[10%] rounded-full bg-brand-light/5 blur-[50px]" />

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-20 text-center md:py-28">
          <h1 className="text-5xl font-black leading-tight tracking-tighter md:text-7xl lg:text-8xl">
            대규모 지능형
            <br />
            <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">
              데이터 추출
            </span>
          </h1>
          <p className="max-w-xl text-lg font-medium text-muted-foreground md:text-xl">
            비정형 PDF 문서를 최신 AI 기술을 통해 즉시 활용 가능한 정제된
            데이터로 변환하여 업무의 가치를 높이세요.
          </p>
        </div>
      </section>

      {/* 기능 카드 섹션 */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {featureCards.map((card) => (
            <Card
              key={card.title}
              className="group overflow-hidden border-border/40 bg-card/80 shadow-none transition-shadow hover:shadow-md"
            >
              <CardContent className="flex flex-col items-center px-8 py-10 text-center">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light shadow-lg shadow-brand/20">
                  <card.icon className="size-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-xl font-black tracking-tight">
                  {card.title}
                </h3>
                <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 하단 특장점 */}
      <section className="border-t border-border/40">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:flex-row sm:justify-center sm:gap-16 sm:px-6">
          {highlights.map((item) => (
            <div key={item.title} className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10">
                <item.icon className="size-7 text-brand" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-base font-bold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
