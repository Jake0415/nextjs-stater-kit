"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Database,
  Info,
  History,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ROUTES } from "@/lib/routes";
import { mockTemplates, currentUser } from "@/lib/mock";

// 탭 정의
const tabs = [
  { id: "profile", label: "사용자 프로필" },
  { id: "template", label: "템플릿 관리" },
  { id: "data", label: "데이터 관리" },
  { id: "logs", label: "사용이력" },
  { id: "version", label: "버전 정보" },
] as const;

type TabId = (typeof tabs)[number]["id"];

// 변경 이력 데이터
const changelog = [
  {
    version: "v2.4.0",
    current: true,
    items: [
      "필기체 인식 정확도 15% 개선",
      "다중 열 PDF 레이아웃 지원 추가",
      "검색 쿼리 속도 향상을 위한 MongoDB 인덱싱 최적화",
      "템플릿 관리 시스템 도입",
    ],
  },
  {
    version: "v2.3.5",
    current: false,
    items: [
      "배치 처리의 메모리 누수 수정",
      "Minio S3 연결에 대한 보안 업데이트",
    ],
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateCode, setTemplateCode] = useState("");

  // 프로필 폼 상태
  const [username, setUsername] = useState("alex_chen_admin");
  const [email, setEmail] = useState("alex.chen@enterprise.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="mx-auto max-w-[1280px] px-10 py-10">
      {/* 페이지 헤더 */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-[36px] font-black tracking-tight text-slate-900">
          설정 및 템플릿
        </h1>
        <p className="text-base text-slate-500">
          계정, 추출 템플릿 및 시스템 데이터, 이력을 관리합니다.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-8 border-b border-slate-200 bg-slate-50">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-3 py-4 text-sm font-bold tracking-wide transition-colors ${
                activeTab === tab.id
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex flex-col gap-12">
        {/* === 사용자 프로필 섹션 === */}
        <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 px-6 py-6">
            <h2 className="text-xl font-bold text-slate-900">사용자 프로필</h2>
            <p className="text-sm text-slate-500">
              개인 정보 및 로그인 자격 증명을 업데이트합니다.
            </p>
          </div>
          <div className="flex flex-col gap-6 p-6">
            {/* 사용자명/이메일 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">사용자명</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">이메일 주소</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* 비밀번호 변경 */}
            <div className="border-t border-slate-200 pt-4">
              <h3 className="mb-4 text-base font-bold text-slate-900">
                비밀번호 변경
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">현재 비밀번호</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">새 비밀번호</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    새 비밀번호 확인
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end bg-slate-50 px-6 py-4">
            <Button className="bg-brand hover:bg-brand/90">
              변경 사항 저장
            </Button>
          </div>
        </Card>

        {/* === 템플릿 관리 섹션 === */}
        <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="size-6 text-brand" />
                <h2 className="text-xl font-bold text-slate-900">
                  템플릿 관리
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                문서 파싱 템플릿을 생성하고 구성합니다.
              </p>
            </div>
            <Dialog
              open={templateDialogOpen}
              onOpenChange={setTemplateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 bg-brand hover:bg-brand/90">
                  <Plus className="size-5" />
                  새 템플릿 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>템플릿 추가</DialogTitle>
                  <DialogDescription>
                    새로운 문서 파싱을 위한 정보를 입력해 주세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5 py-4">
                  <div className="space-y-2">
                    <Label className="font-bold">템플릿 명</Label>
                    <Input
                      placeholder="예: 표준 영수증"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">코드 번호</Label>
                    <Input
                      placeholder="예: TMP-001"
                      value={templateCode}
                      onChange={(e) => setTemplateCode(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 -mx-6 -mb-6 px-6 py-4">
                  <Button
                    variant="ghost"
                    onClick={() => setTemplateDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    className="bg-brand hover:bg-brand/90"
                    onClick={() => setTemplateDialogOpen(false)}
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {mockTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/30 p-5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
                      <FileText className="size-6 text-brand" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="rounded-full p-2 hover:bg-slate-100">
                        <Pencil className="size-5 text-slate-500" />
                      </button>
                      <button className="rounded-full p-2 hover:bg-slate-100">
                        <Trash2 className="size-5 text-slate-500" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    최종 수정일: {tpl.createdAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* === 데이터 관리 섹션 === */}
        <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-2">
              <Database className="size-6 text-brand" />
              <h2 className="text-xl font-bold text-slate-900">데이터 관리</h2>
            </div>
            <p className="text-sm text-slate-500">
              소스 파일, 추출된 메타데이터 및 애플리케이션 로그를 관리합니다.
            </p>
          </div>
          <div className="flex flex-col gap-6 p-6">
            {/* 경고 배너 */}
            <div className="flex gap-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="size-6 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-bold text-red-800">심각한 경고</p>
                <p className="text-sm text-red-600">
                  데이터 초기화를 수행하면 업로드된 모든 소스 PDF 파일과 추출된
                  모든 메타데이터/로그가 영구적으로 삭제됩니다. 이 작업은 취소할
                  수 없습니다.
                </p>
                <p className="mt-1 text-xs font-bold text-red-800">
                  해당 내용은 관리자 권한을 가진 사용자만 실행할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 데이터 현황 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-base font-bold text-slate-900">
                  소스 PDF 파일 (Minio)
                </p>
                <p className="text-sm text-slate-500">
                  1,248개 파일 (4.2 GB)
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-base font-bold text-slate-900">
                  추출된 메타데이터 (MongoDB)
                </p>
                <p className="text-sm text-slate-500">
                  15.2k 레코드 / 85.4k 로그 이벤트
                </p>
              </div>
            </div>

            {/* 삭제 버튼 */}
            <Button
              variant="destructive"
              className="w-full gap-2 py-3 opacity-80"
              disabled={currentUser.role !== "admin"}
            >
              <Trash2 className="size-6" />
              모든 사용자 업로드 및 추출된 데이터 삭제 (관리자 전용)
            </Button>
          </div>
        </Card>

        {/* === 사용이력 섹션 === */}
        <Card className="rounded-xl border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-6">
            <div>
              <div className="flex items-center gap-2">
                <History className="size-6 text-brand" />
                <h2 className="text-xl font-bold text-slate-900">사용이력</h2>
              </div>
              <p className="text-sm text-slate-500">
                시스템에 대한 주요 사용 이력을 확인합니다.
              </p>
            </div>
            <Button className="bg-brand hover:bg-brand/90" asChild>
              <Link href={ROUTES.SETTINGS_LOGS}>이력 확인</Link>
            </Button>
          </div>
        </Card>

        {/* === 버전 정보 섹션 === */}
        <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-2">
              <Info className="size-6 text-brand" />
              <h2 className="text-xl font-bold text-slate-900">버전 정보</h2>
            </div>
          </div>
          <div className="flex gap-8 p-6">
            {/* 좌측: 버전 정보 */}
            <div className="flex w-[300px] shrink-0 flex-col gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  앱 버전
                </p>
                <p className="text-2xl font-black text-slate-900">
                  v2.4.0-stable
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  빌드 날짜
                </p>
                <p className="text-base font-medium text-slate-900">
                  2023년 10월 27일
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  엔진
                </p>
                <p className="text-base font-medium text-slate-900">
                  Tesseract OCR v5.3
                </p>
              </div>
            </div>

            {/* 우측: 변경 이력 */}
            <div className="flex-1">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                변경 이력
              </p>
              <div className="flex max-h-[200px] flex-col gap-4 overflow-y-auto pr-4">
                {changelog.map((log) => (
                  <div
                    key={log.version}
                    className={`border-l-2 py-1 pl-5 ${
                      log.current
                        ? "border-brand"
                        : "border-slate-200"
                    }`}
                  >
                    <p
                      className={`text-sm font-bold ${
                        log.current ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {log.version}
                    </p>
                    <ul className="mt-1 space-y-1">
                      {log.items.map((item) => (
                        <li
                          key={item}
                          className="text-xs text-slate-500"
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
