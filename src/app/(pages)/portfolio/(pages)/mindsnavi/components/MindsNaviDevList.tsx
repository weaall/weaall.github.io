"use client";

import { useRef } from "react";
import { AdminLayoutIcon, AIIcon, CloudIcon, CodeIcon, LogicIcon, UserLayoutIcon } from "@/components/ui/icons/PortfolioSvg";
import { ArchDiagram, CheckList, DiagramPanel, OverviewCard, SectionTitle, StepFlow, TaskCard } from "@/components/portfolio/PortfolioKit";

const C = "#1a8f7a";

/* ---------------- 다이어그램 데이터 ---------------- */

const systemGroups = [
    {
        title: "CI/CD",
        nodes: [{ label: "GitHub Actions", sub: "빌드 · 배포 자동화", tone: "dark" as const }],
    },
    {
        title: "Compute Engine · PM2",
        boxed: true,
        grow: 1.6,
        nodes: [
            { label: "설문 웹 · 병원/B2B 웹", sub: "React · Next.js", tone: "soft" as const },
            { label: "API 서버", sub: "NestJS · Socket.IO · 큐", tone: "brand" as const },
        ],
    },
    {
        title: "데이터",
        nodes: [
            { label: "MySQL", sub: "Prisma" },
            { label: "Redis", sub: "캐시 · 세션 · 큐" },
        ],
    },
    {
        title: "분리 · 외부 연동",
        boxed: true,
        nodes: [
            { label: "Cloud Run", sub: "PDF 렌더러", tone: "soft" as const },
            { label: "알림톡 · SMS" },
            { label: "본인인증" },
            { label: "검사기관 LIS" },
        ],
    },
];

const appGroups = [
    {
        title: "클라이언트",
        nodes: [
            { label: "설문 SPA", sub: "React · Vite" },
            { label: "병원 · B2B 콘솔", sub: "Next.js" },
        ],
    },
    {
        title: "NestJS API",
        boxed: true,
        grow: 1.7,
        nodes: [
            { label: "Guards", sub: "JWT · 역할 · 외부 IP", tone: "soft" as const },
            { label: "역할별 모듈", sub: "본사 · 총판 · 대리점 · 병원 · 검사기관", tone: "brand" as const },
            { label: "판정 로직", sub: "심리 · 호르몬 · 종합", tone: "soft" as const },
        ],
    },
    {
        title: "저장 · 비동기",
        nodes: [
            { label: "Prisma → MySQL" },
            { label: "큐 · 소켓", sub: "PDF · 알림" },
        ],
    },
];

const flowSteps = [
    { label: "설문 발급", sub: "QR · 알림톡" },
    { label: "본인인증" },
    { label: "심리 설문" },
    { label: "키트 신청" },
    { label: "타액 분석", sub: "검사기관" },
    { label: "판정", sub: "종합 등급" },
    { label: "결과지", sub: "KO / EN" },
    { label: "발송 · 연계" },
];

const surveySteps = [{ label: "인증 선택" }, { label: "본인인증" }, { label: "약관 동의" }, { label: "차원별 설문" }, { label: "응답 확인" }, { label: "키트 신청" }, { label: "완료" }];

const analysisItems = [
    { t: "RandomForest 파이프라인", d: "결측 대치 후 트리 앙상블, 교차검증으로 성능 확인" },
    { t: "SHAP 기여도", d: "지표별 기여도를 수치화해 판정 근거 확인" },
    { t: "지표 축소 연구", d: "호르몬 6회 → 3회 재현율과 고위험 누락률 검증" },
    { t: "운영 로직 검증", d: "실서비스 판정은 결정론적 규칙, 분석은 그 근거" },
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
                    description="Google Cloud 기반, PDF 렌더링만 컨테이너로 분리한 구성"
                    onClick={() => scrollTo(systemRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "GitHub Actions", tone: "dark" }] },
                                { boxed: true, grow: 1.4, nodes: [{ label: "웹 · API", tone: "brand" }, { label: "Cloud Run PDF", tone: "soft" }] },
                                { nodes: [{ label: "MySQL" }, { label: "Redis" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={CodeIcon}
                    color={C}
                    title="어플리케이션 아키텍처"
                    description="역할별 API 트리와 판정 로직을 나눈 NestJS 모듈형 서버"
                    onClick={() => scrollTo(appRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "SPA" }, { label: "콘솔" }] },
                                { boxed: true, grow: 1.6, nodes: [{ label: "Guards", tone: "soft" }, { label: "역할별 모듈", tone: "brand" }, { label: "판정 로직", tone: "soft" }] },
                                { nodes: [{ label: "Prisma" }, { label: "큐 · 소켓" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={LogicIcon}
                    color={C}
                    title="서비스 플로우"
                    description="설문부터 타액 검사, 판정, 결과지 발송까지 자동화"
                    onClick={() => scrollTo(flowRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "설문" }, { label: "키트" }, { label: "분석" }, { label: "판정" }, { label: "결과지" }]} />}
                />
                <OverviewCard
                    icon={UserLayoutIcon}
                    color={C}
                    title="사용자 설문 앱"
                    description="링크 하나로 인증·설문·키트 신청을 잇는 크로스 플랫폼 웹"
                    onClick={() => scrollTo(surveyRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "인증" }, { label: "약관" }, { label: "설문" }, { label: "확인" }, { label: "키트" }]} />}
                />
                <OverviewCard
                    icon={AdminLayoutIcon}
                    color={C}
                    title="관리자 대시보드"
                    description="총판 · 대리점 · 병원 3계층 권한의 운영 및 정산 콘솔"
                    onClick={() => scrollTo(adminRef)}
                    preview={<img className="w-full rounded-md object-cover object-top-left" src="/assets/portfolio/minds-navi/dashboard.png" alt="Minds. NAVI 관리자 대시보드" />}
                />
                <OverviewCard
                    icon={AIIcon}
                    color={C}
                    title="데이터 분석"
                    description="판정 지표의 기여도 분석과 호르몬 측정 축소 가능성 검증"
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
                    <DiagramPanel title="Google Cloud · VM 운영 + 렌더러 분리">
                        <ArchDiagram color={C} groups={systemGroups} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="PDF 생성 파이프라인 분리" bullets={["API 내 렌더링 → 전용 컨테이너", "브라우저 인스턴스 재사용", "API 서버 부하 제거", "렌더러만 독립 확장"]} />
                        <TaskCard index={2} color={C} title="배포 자동화" bullets={["키 파일 없는 클라우드 인증", "빌드 → 스키마 동기화 → 재시작", "프론트 3종 · API 단일 파이프라인"]} />
                        <TaskCard index={3} color={C} title="다국어 결과지" bullets={["결과지 템플릿 한/영 분리", "PDF · 이미지 두 가지 출력", "결과지 API 언어 파라미터"]} />
                    </div>
                </div>
            </div>

            {/* 어플리케이션 아키텍처 */}
            <div ref={appRef} className="pt-20">
                <SectionTitle>어플리케이션 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="NestJS · Prisma 모듈형 API">
                        <ArchDiagram color={C} groups={appGroups} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="3계층 B2B 권한 모델" bullets={["총판 → 대리점 → 병원 계층", "기능 × 역할 권한 매트릭스", "발주 · 계약 · 정산 분리", "App Router · FSD 재작성"]} />
                        <TaskCard index={2} color={C} title="심리 · 호르몬 통합 판정" bullets={["성별 × 시점 × 연령 참조범위", "심리 · 타액 등급 → 종합 판정", "검사기관 결과는 허용 IP로 수신"]} />
                        <TaskCard index={3} color={C} title="세션 · 알림 실시간 처리" bullets={["중복 로그인 강제 종료", "로그인 이력 · 비밀번호 정책", "알림톡 발송, 실패 시 문자 대체"]} />
                    </div>
                </div>
            </div>

            {/* 서비스 플로우 */}
            <div ref={flowRef} className="pt-20">
                <SectionTitle>서비스 플로우</SectionTitle>
                <div className="flex gap-6 m:flex-col">
                    <div className="w-3/4 m:w-full">
                        <DiagramPanel title="설문 · 타액 검사 · 판정 · 발송">
                            <StepFlow color={C} steps={flowSteps} />
                        </DiagramPanel>
                    </div>
                    <div className="w-1/4 m:w-full bg-[#f6f5f4] rounded-2xl p-8 flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-[#191918] leading-tight">B2B2C 운영</h3>
                        <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 break-keep">
                            <li>기관이 설문 링크 · QR 발급</li>
                            <li>수검자는 링크만으로 참여</li>
                            <li>검사 결과 수신 시 자동 판정</li>
                            <li>결과지 알림톡 발송 · 외부 연계</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 사용자 설문 앱 */}
            <div ref={surveyRef} className="pt-20">
                <SectionTitle>사용자 설문 앱</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="토큰 링크로 진입하는 설문 흐름">
                        <StepFlow color={C} steps={surveySteps} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="인증 경로 이원화" bullets={["문자 인증 · 본인인증 선택", "진입 경로별 가드 분리"]} />
                        <TaskCard index={2} color={C} title="한 · 영 설문" bullets={["문항 · 안내 다국어", "영문 결과지와 연결"]} />
                        <TaskCard index={3} color={C} title="인앱 브라우저 대응" bullets={["카카오 · 사파리 이탈 안내", "중단 후 재진입 처리"]} />
                    </div>
                </div>
            </div>

            {/* 관리자 대시보드 */}
            <div ref={adminRef} className="pt-20">
                <SectionTitle>관리자 대시보드</SectionTitle>
                <div className="w-full bg-[#f6f5f4] rounded-2xl p-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-[#191918]">본사 · 총판 · 대리점 · 병원 콘솔</h3>
                        <p className="text-[15px] text-gray-600 break-keep">운영 현황, 월별 정산, QR 관리, 결과지 조회와 검체 데이터 업로드.</p>
                    </div>
                    <img className="w-full rounded-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/minds-navi/dashboard.png" alt="Minds. NAVI 운영 대시보드" />
                </div>
            </div>

            {/* 데이터 분석 */}
            <div ref={analysisRef} className="pt-20">
                <SectionTitle>데이터 분석</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="지표 기여도 분석 · 측정 축소 연구">
                        <ArchDiagram
                            color={C}
                            groups={[
                                { title: "입력", nodes: [{ label: "심리 척도", sub: "우울 · 애착 · 회복탄력성" }, { label: "타액 호르몬", sub: "Cortisol · DHEA" }] },
                                { title: "모델", nodes: [{ label: "RandomForest", sub: "교차검증", tone: "brand" }] },
                                { title: "설명", nodes: [{ label: "SHAP 기여도", sub: "지표별 비중", tone: "soft" }] },
                                { title: "산출", nodes: [{ label: "등급 재현율" }, { label: "6 → 3회 축소 검증" }] },
                            ]}
                        />
                    </DiagramPanel>
                    <CheckList color={C} items={analysisItems} />
                </div>
            </div>
        </div>
    );
}
