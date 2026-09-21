"use client";

import { useRef } from "react";
import { AdminLayoutIcon, AIIcon, CloudIcon, CodeIcon, LogicIcon, UserLayoutIcon } from "@/components/ui/icons/PortfolioSvg";
import { ArchDiagram, CheckList, DiagramPanel, OverviewCard, SectionTitle, StepFlow, TaskCard } from "@/components/portfolio/PortfolioKit";

const C = "#1a8f7a";

/* ---------------- 다이어그램 데이터 ---------------- */

const systemGroups = [
    {
        title: "CI/CD",
        nodes: [
            { label: "GitHub Actions", sub: "WIF 인증 · SSH 배포", tone: "dark" as const },
        ],
    },
    {
        title: "Compute Engine · PM2",
        boxed: true,
        grow: 1.6,
        nodes: [
            { label: "설문 웹 · 병원/B2B 웹", sub: "React SPA · Next.js", tone: "soft" as const },
            { label: "API 서버", sub: "NestJS 11 · Socket.IO · Bull", tone: "brand" as const },
        ],
    },
    {
        title: "데이터",
        nodes: [
            { label: "MySQL 8", sub: "Prisma 7" },
            { label: "Redis", sub: "캐시 · 세션 · 큐" },
        ],
    },
    {
        title: "분리 서비스 · 외부 연동",
        boxed: true,
        nodes: [
            { label: "Cloud Run", sub: "PDF · JPEG 렌더러", tone: "soft" as const },
            { label: "알림톡 · SMS", sub: "Aligo" },
            { label: "본인인증", sub: "PortOne" },
            { label: "검사기관 LIS", sub: "타액 분석 결과 수신" },
        ],
    },
];

const appGroups = [
    {
        title: "클라이언트",
        nodes: [
            { label: "설문 SPA", sub: "React 19 · Vite" },
            { label: "병원 · B2B 콘솔", sub: "Next.js App Router" },
        ],
    },
    {
        title: "NestJS API",
        boxed: true,
        grow: 1.8,
        nodes: [
            { label: "Guards", sub: "JWT · Roles · 외부 IP 허용", tone: "soft" as const },
            { label: "역할별 모듈", sub: "본사 · 총판 · 대리점 · 병원 · 검사기관 · 사용자", tone: "brand" as const },
            { label: "판정 로직", sub: "심리 척도 · 타액 호르몬 · 종합", tone: "soft" as const },
            { label: "공통 응답 · 감사 로그", sub: "Interceptor · ApiLog", tone: "ghost" as const },
        ],
    },
    {
        title: "저장 · 비동기",
        nodes: [
            { label: "Prisma → MySQL", sub: "약 90개 모델" },
            { label: "Bull 큐 · Socket.IO", sub: "PDF · 알림 · 강제 로그아웃" },
        ],
    },
];

const flowSteps = [
    { label: "설문 링크 발급", sub: "QR · 알림톡" },
    { label: "본인인증", sub: "SMS · PASS" },
    { label: "심리 설문", sub: "차원별 문항" },
    { label: "타액 키트 신청", sub: "채취 안내" },
    { label: "검사기관 분석", sub: "Cortisol · DHEA" },
    { label: "결과 수신 · 판정", sub: "마음신호등" },
    { label: "결과지 생성", sub: "PDF · KO/EN" },
    { label: "발송 · 연계", sub: "알림톡 · DTx" },
];

const surveySteps = [
    { label: "인증 방식 선택" },
    { label: "본인인증 · 가입" },
    { label: "약관 동의" },
    { label: "차원별 설문" },
    { label: "응답 확인" },
    { label: "키트 신청" },
    { label: "완료" },
];

const analysisItems = [
    { t: "RandomForest 파이프라인", d: "결측 대치 → 트리 앙상블. 층화 K-겹 교차검증으로 정확도·균형 정확도 확인" },
    { t: "SHAP 기여도", d: "심리 척도·호르몬 지표가 최종·심리·타액 등급에 얼마나 기여하는지 수치화" },
    { t: "지표 축소 연구", d: "호르몬 측정 6회 → 3회로 줄여도 타액 등급이 재현되는지, 고위험 누락률과 함께 검증" },
    { t: "운영 로직 검증", d: "실서비스 판정은 결정론적 규칙. 분석 결과는 그 규칙을 근거 짓고 다듬는 데 사용" },
];

/* ---------------- 컴포넌트 ---------------- */

export default function MindsNaviDevList() {
    const systemRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<HTMLDivElement>(null);
    const flowRef = useRef<HTMLDivElement>(null);
    const surveyRef = useRef<HTMLDivElement>(null);
    const adminRef = useRef<HTMLDivElement>(null);
    const analysisRef = useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div className="w-full flex flex-col">
            <SectionTitle center>프로젝트 오버뷰</SectionTitle>

            <div className="w-full grid grid-cols-3 gap-6 pt-2 m:grid-cols-1">
                <OverviewCard
                    icon={CloudIcon}
                    color={C}
                    title="시스템 아키텍처"
                    description="Google Cloud 기반. VM·PM2로 운영하고 PDF 렌더링만 Cloud Run 컨테이너로 분리"
                    onClick={() => scrollTo(systemRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "GitHub Actions", tone: "dark" }] },
                                { boxed: true, grow: 1.4, nodes: [{ label: "웹 · API (PM2)", tone: "brand" }, { label: "Cloud Run PDF", tone: "soft" }] },
                                { nodes: [{ label: "MySQL" }, { label: "Redis" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={CodeIcon}
                    color={C}
                    title="어플리케이션 아키텍처"
                    description="NestJS 모듈형 API. 본사·총판·대리점·병원·검사기관 역할별 API 트리와 Prisma 데이터 모델"
                    onClick={() => scrollTo(appRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "SPA" }, { label: "콘솔" }] },
                                { boxed: true, grow: 1.6, nodes: [{ label: "Guards", tone: "soft" }, { label: "역할별 모듈", tone: "brand" }, { label: "판정 로직", tone: "soft" }] },
                                { nodes: [{ label: "Prisma" }, { label: "Bull · Socket" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={LogicIcon}
                    color={C}
                    title="서비스 플로우"
                    description="설문 → 본인인증 → 타액 키트 → 검사기관 결과 → 판정 → 결과지 → 알림톡·DTx 연계"
                    onClick={() => scrollTo(flowRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "설문" }, { label: "키트" }, { label: "분석" }, { label: "판정" }, { label: "결과지" }]} />}
                />
                <OverviewCard
                    icon={UserLayoutIcon}
                    color={C}
                    title="사용자 설문 앱"
                    description="React SPA. 토큰 링크로 진입해 SMS·PASS 인증, 차원별 설문, 타액 키트 신청까지 한 흐름"
                    onClick={() => scrollTo(surveyRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "인증" }, { label: "약관" }, { label: "설문" }, { label: "확인" }, { label: "키트" }]} />}
                />
                <OverviewCard
                    icon={AdminLayoutIcon}
                    color={C}
                    title="관리자 대시보드"
                    description="Next.js. 총판→대리점→병원 3계층 권한, 진행 현황·정산·통계·QR·결과 관리"
                    onClick={() => scrollTo(adminRef)}
                    preview={<img className="w-full rounded-md object-cover object-top-left" src="/assets/portfolio/minds-navi/dashboard.png" alt="Minds. NAVI 관리자 대시보드" />}
                />
                <OverviewCard
                    icon={AIIcon}
                    color={C}
                    title="데이터 분석"
                    description="RandomForest·SHAP로 판정 지표별 기여도를 분석하고 호르몬 측정 6→3회 축소 가능성을 검증"
                    onClick={() => scrollTo(analysisRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "심리 척도" }, { label: "호르몬" }] },
                                { nodes: [{ label: "RandomForest", tone: "brand" }] },
                                { nodes: [{ label: "SHAP 기여도", tone: "soft" }] },
                            ]}
                        />
                    }
                />
            </div>

            {/* 시스템 아키텍처 */}
            <div ref={systemRef} className="pt-20">
                <SectionTitle>시스템 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="Google Cloud · VM 운영 + Cloud Run 분리 구성">
                        <ArchDiagram color={C} groups={systemGroups} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="PDF 생성 파이프라인 분리"
                            bullets={[
                                "API 프로세스 안 Puppeteer → BullMQ 워커 → Cloud Run 컨테이너로 단계적 이전",
                                "브라우저 인스턴스 재사용, 타임아웃·대기 조건 정리",
                                "API 서버의 메모리·CPU 부담 제거, 렌더러만 독립 확장",
                            ]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="GitHub Actions 배포 자동화"
                            bullets={["키 파일 없는 Workload Identity Federation 인증", "브랜치 push → 빌드 → Prisma 스키마 동기화 → PM2 재시작", "프론트 3종·API 동일 파이프라인"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="다국어 결과지"
                            bullets={["EJS 템플릿 기반 결과지 KO/EN 분리", "PDF와 JPEG(zip) 두 가지 출력", "결과지 API에 lang 파라미터 추가"]}
                        />
                    </div>
                </div>
            </div>

            {/* 어플리케이션 아키텍처 */}
            <div ref={appRef} className="pt-20">
                <SectionTitle>어플리케이션 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="NestJS 11 · Prisma 7 모듈형 API">
                        <ArchDiagram color={C} groups={appGroups} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="3계층 B2B 권한 모델"
                            bullets={["총판 → 대리점 → 병원·검진센터 계층과 기능×역할 권한 매트릭스", "발주 요청·승인, 계약서, QR, 정산까지 역할별 화면", "Pages Router → App Router · FSD 구조로 재작성"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="심리 · 호르몬 통합 판정"
                            bullets={["타액 Cortisol·DHEA 참조범위를 성별 × 채취 시점 × 연령대로 관리", "심리 등급 · 타액 등급 → 종합 마음신호등 산출", "검사기관 결과는 IP 허용 목록 뒤 전용 엔드포인트로 수신"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="세션 · 알림 실시간 처리"
                            bullets={["Socket.IO로 중복 로그인 강제 종료(단일 세션)", "로그인 이력 · 비밀번호 정책 · 강제 변경", "스케줄러 + 템플릿으로 알림톡 발송, SMS 실패 대체"]}
                        />
                    </div>
                </div>
            </div>

            {/* 서비스 플로우 */}
            <div ref={flowRef} className="pt-20">
                <SectionTitle>서비스 플로우</SectionTitle>
                <div className="flex gap-6 m:flex-col">
                    <div className="w-3/4 m:w-full">
                        <DiagramPanel title="설문 · 타액 검사 · 판정 · 결과지 발송 한 흐름">
                            <StepFlow color={C} steps={flowSteps} />
                        </DiagramPanel>
                    </div>
                    <div className="w-1/4 m:w-full bg-[#f6f5f4] rounded-2xl p-8 flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-[#191918] leading-tight">B2B2C 운영</h3>
                        <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 break-keep">
                            <li>병원·검진센터가 설문 링크·QR 발급</li>
                            <li>수검자는 링크만으로 인증·설문·키트 신청</li>
                            <li>검사기관 결과가 들어오면 자동 판정</li>
                            <li>결과지는 알림톡으로, 파트너 DTx에도 연계</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 사용자 설문 앱 */}
            <div ref={surveyRef} className="pt-20">
                <SectionTitle>사용자 설문 앱</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="React 19 · Vite SPA — 토큰 링크 진입형 설문">
                        <StepFlow color={C} steps={surveySteps} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="인증 경로 이원화" bullets={["SMS 인증과 PortOne 본인인증 선택", "캠페인·DTx·검사기관 진입 경로별 가드 분리"]} />
                        <TaskCard index={2} color={C} title="한/영 설문" bullets={["i18next 기반 문항·안내 다국어", "영문 결과지와 연결"]} />
                        <TaskCard index={3} color={C} title="인앱 브라우저 대응" bullets={["카카오·사파리 인앱 브라우저 탈출 안내", "문항 이동·중단 후 재진입 처리"]} />
                    </div>
                </div>
            </div>

            {/* 관리자 대시보드 */}
            <div ref={adminRef} className="pt-20">
                <SectionTitle>관리자 대시보드</SectionTitle>
                <div className="w-full bg-[#f6f5f4] rounded-2xl p-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-[#191918]">본사 · 총판 · 대리점 · 병원 콘솔</h3>
                        <p className="text-[15px] text-gray-600 break-keep">
                            Next.js App Router · TanStack Query · Zustand. 운영 대시보드, 병원별 진행 현황, 월별 정산, QR 관리, 결과지 미리보기·다운로드, 검체 데이터 업로드.
                        </p>
                    </div>
                    <img className="w-full rounded-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/minds-navi/dashboard.png" alt="Minds. NAVI 운영 대시보드" />
                </div>
            </div>

            {/* 데이터 분석 */}
            <div ref={analysisRef} className="pt-20">
                <SectionTitle>데이터 분석</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="판정 지표 기여도 분석 · 측정 축소 연구 (Python · scikit-learn · SHAP)">
                        <ArchDiagram
                            color={C}
                            groups={[
                                { title: "입력", nodes: [{ label: "심리 척도 합산", sub: "우울 · 애착 · 아동기 경험 · 회복탄력성 등" }, { label: "타액 호르몬", sub: "Cortisol · DHEA · 비율" }] },
                                { title: "모델", nodes: [{ label: "결측 대치 → RandomForest", sub: "층화 K-겹 교차검증", tone: "brand" }] },
                                { title: "설명", nodes: [{ label: "SHAP 기여도", sub: "지표별 % · 요약 차트", tone: "soft" }] },
                                { title: "산출", nodes: [{ label: "최종 · 심리 · 타액 등급" }, { label: "6 → 3회 축소 재현율" }] },
                            ]}
                        />
                    </DiagramPanel>
                    <CheckList color={C} items={analysisItems} />
                </div>
            </div>
        </div>
    );
}
