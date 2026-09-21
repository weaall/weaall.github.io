"use client";

import { useRef } from "react";
import { AIIcon, CloudIcon, CodeIcon, LogicIcon, PipelineIcon, ShieldIcon } from "@/components/ui/icons/PortfolioSvg";
import { ArchDiagram, CheckList, DiagramPanel, FactGrid, LinkCard, OverviewCard, SectionTitle, StepFlow, TaskCard } from "@/components/portfolio/PortfolioKit";

const C = "#1d6f8f";

/* ---------------- 다이어그램 데이터 ---------------- */

const edgeGroups = [
    {
        title: "사용자",
        nodes: [{ label: "수검자 · 임상진 · 기관", sub: "브라우저", tone: "dark" as const }],
    },
    {
        title: "경계",
        boxed: true,
        nodes: [
            { label: "Load Balancer" },
            { label: "Ingress", sub: "TLS · 요청 제한", tone: "soft" as const },
            { label: "WAF", sub: "공격 패턴 차단", tone: "brand" as const },
        ],
    },
    {
        title: "Kubernetes 워크로드",
        boxed: true,
        grow: 1.6,
        direction: "row" as const,
        nodes: [
            { label: "설문 웹", tone: "soft" as const },
            { label: "대시보드", tone: "soft" as const },
            { label: "API", tone: "brand" as const },
            { label: "리포트", tone: "brand" as const },
            { label: "AI 추론", tone: "brand" as const },
        ],
    },
    {
        title: "관리형 데이터",
        nodes: [{ label: "DB" }, { label: "캐시" }, { label: "오브젝트 스토리지" }, { label: "키 관리(KMS)" }],
    },
];

const obsGroups = [
    {
        title: "탐지",
        nodes: [
            { label: "런타임 IDS", sub: "이상 행위 탐지", tone: "brand" as const },
            { label: "WAF 감사 로그" },
        ],
    },
    {
        title: "수집",
        nodes: [{ label: "로그 수집" }, { label: "메트릭 · 경보 규칙" }],
    },
    {
        title: "저장 · 시각화",
        nodes: [{ label: "로그 저장소", sub: "14일 보관" }, { label: "대시보드", tone: "soft" as const }],
    },
    {
        title: "경보 · 증적",
        nodes: [
            { label: "Slack 경보" },
            { label: "정기 작업", sub: "로그 보관 · 부품 목록 · 백신", tone: "ghost" as const },
        ],
    },
];

const gitopsSteps = [
    { label: "코드 push" },
    { label: "빌드 · 테스트" },
    { label: "이미지 다이제스트 고정" },
    { label: "서명 커밋" },
    { label: "서명 검증", sub: "미서명 거부" },
    { label: "자동 동기화" },
    { label: "무중단 배포" },
];

const appGroups = [
    {
        title: "프론트엔드",
        nodes: [{ label: "설문 웹", sub: "본인인증" }, { label: "대시보드", sub: "역할별 권한" }],
    },
    {
        title: "API 서버",
        boxed: true,
        grow: 1.4,
        nodes: [
            { label: "인증 · 권한", sub: "토큰 · 계정 잠금", tone: "soft" as const },
            { label: "도메인 모듈", sub: "설문 · 호르몬 · 결과 · 정산", tone: "brand" as const },
            { label: "감사로그 기본 적용", tone: "soft" as const },
        ],
    },
    {
        title: "리포트 서버",
        boxed: true,
        nodes: [{ label: "채점 엔진" }, { label: "지표 매핑", tone: "soft" as const }, { label: "PDF 생성" }],
    },
    {
        title: "AI 서버",
        boxed: true,
        nodes: [{ label: "모델 번들", sub: "해시 고정", tone: "brand" as const }, { label: "기여도 계산" }],
    },
];

const aiSteps = [
    { label: "설문 · 호르몬" },
    { label: "채점" },
    { label: "25개 지표" },
    { label: "모델 추론" },
    { label: "기여도 상위 15" },
    { label: "결과지 표시" },
];

const flowSteps = [
    { label: "기관 코드 진입" },
    { label: "본인인증" },
    { label: "심리 설문" },
    { label: "호르몬 등록" },
    { label: "AI 판정" },
    { label: "결과지 생성" },
    { label: "대시보드 조회" },
    { label: "알림 · 정산" },
];

const securityItems = [
    { t: "식별 · 인증 (IA)", d: "토큰 인증, 실패 잠금, 강제 비밀번호 변경" },
    { t: "사용 통제 (UC)", d: "권한 매트릭스와 전 요청 감사로그" },
    { t: "시스템 무결성 (SI)", d: "다이제스트 고정, 서명 검증, 모델 해시 확인" },
    { t: "데이터 기밀성 (DC)", d: "개인정보 암호화와 키 관리 서비스 연동" },
    { t: "적시 대응 (TRE)", d: "침입 · 공격 · 장애 경보를 즉시 알림" },
    { t: "자원 가용성 (RA)", d: "요청 제한, 관리형 백업, 무중단 배포" },
];

/* ---------------- 컴포넌트 ---------------- */

export default function MnaiDevList() {
    const systemRef = useRef<HTMLDivElement>(null);
    const gitopsRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<HTMLDivElement>(null);
    const aiRef = useRef<HTMLDivElement>(null);
    const flowRef = useRef<HTMLDivElement>(null);
    const securityRef = useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div className="w-full flex flex-col">
            <SectionTitle center>프로젝트 오버뷰</SectionTitle>

            <div className="w-full grid grid-cols-3 gap-6 pt-2 m:grid-cols-1">
                <OverviewCard
                    icon={CloudIcon}
                    color={C}
                    title="시스템 아키텍처"
                    description="Kubernetes 위에 방화벽과 침입 탐지, 관측성을 갖춘 구성"
                    onClick={() => scrollTo(systemRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "WAF", tone: "brand" }] },
                                { boxed: true, grow: 1.6, nodes: [{ label: "웹 · API · AI", tone: "soft" }, { label: "탐지 · 관측" }] },
                                { nodes: [{ label: "DB · 캐시" }, { label: "스토리지" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={PipelineIcon}
                    color={C}
                    title="GitOps 배포"
                    description="서명된 설정과 고정된 이미지만 클러스터에 반영"
                    onClick={() => scrollTo(gitopsRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "빌드" }, { label: "고정" }, { label: "서명" }, { label: "검증" }, { label: "배포" }]} />}
                />
                <OverviewCard
                    icon={CodeIcon}
                    color={C}
                    title="어플리케이션 아키텍처"
                    description="설문 · 대시보드 · API · 리포트 · AI 다섯 서비스로 분리"
                    onClick={() => scrollTo(appRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "웹" }] },
                                { nodes: [{ label: "API", tone: "brand" }] },
                                { nodes: [{ label: "리포트", tone: "soft" }] },
                                { nodes: [{ label: "AI", tone: "dark" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={AIIcon}
                    color={C}
                    title="AI 판정 모듈"
                    description="25개 지표로 판정하고 기여도로 근거까지 제시"
                    onClick={() => scrollTo(aiRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "채점" }, { label: "지표" }, { label: "추론" }, { label: "기여도" }, { label: "결과지" }]} />}
                />
                <OverviewCard
                    icon={LogicIcon}
                    color={C}
                    title="서비스 플로우"
                    description="기관 진입부터 설문, 판정, 결과지 조회까지 한 흐름"
                    onClick={() => scrollTo(flowRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "진입" }, { label: "설문" }, { label: "호르몬" }, { label: "판정" }, { label: "결과지" }]} />}
                />
                <OverviewCard
                    icon={ShieldIcon}
                    color={C}
                    title="보안 · GMP"
                    description="35개 항목 중 32개 적용, 인프라가 그대로 근거가 되는 구조"
                    onClick={() => scrollTo(securityRef)}
                    preview={
                        <div className="flex flex-wrap gap-1.5">
                            {["IA", "UC", "SI", "DC", "TRE", "RA"].map((x) => (
                                <span key={x} className="rounded-md px-2 py-1 text-[10px] font-semibold" style={{ background: `color-mix(in srgb, ${C} 12%, #fff)`, color: C }}>
                                    {x}
                                </span>
                            ))}
                            <span className="rounded-md px-2 py-1 text-[10px] font-semibold text-white" style={{ background: C }}>
                                32 / 35 적용
                            </span>
                            <span className="rounded-md px-2 py-1 text-[10px] font-semibold bg-[#191918] text-white">GMP 별표3</span>
                        </div>
                    }
                />
            </div>

            {/* 시스템 아키텍처 */}
            <div ref={systemRef} className="pt-20">
                <SectionTitle>시스템 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="경계 보호 · Kubernetes 워크로드 · 관리형 데이터">
                        <ArchDiagram color={C} groups={edgeGroups} />
                    </DiagramPanel>
                    <DiagramPanel title="관측성 · 침입 탐지 · 증적 자동화">
                        <ArchDiagram color={C} groups={obsGroups} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="경보 체계" bullets={["서비스 · 파드 상태 감시", "AI 모듈 무결성 · 오류 감시", "탐지와 배포 알림을 한 경로로"]} />
                        <TaskCard index={2} color={C} title="GMP 증적 자동화" bullets={["주간 취약점 스캔과 부품 목록", "백신 · 배포 기록 정기 생성", "일일 로그 아카이브 보관"]} />
                        <TaskCard index={3} color={C} title="개발 · 운영 동일 구성" bullets={["설정은 같고 클라우드만 다름", "인프라 구성요소도 같은 방식 관리"]} />
                    </div>
                </div>
            </div>

            {/* GitOps */}
            <div ref={gitopsRef} className="pt-20">
                <SectionTitle>GitOps 배포</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="서명된 설정과 고정된 이미지만 클러스터에 도달">
                        <StepFlow color={C} steps={gitopsSteps} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="커밋 서명 검증" bullets={["미서명 커밋은 동기화 거부", "의도적 오염 커밋으로 실증", "검증 실패 시 즉시 경보"]} />
                        <TaskCard index={2} color={C} title="배포 · 이관 절차 문서화" bullets={["설계 · 개발 절차서 개정", "배포와 이관을 구분해 정의", "다이제스트 기록과 롤백 절차"]} />
                        <TaskCard index={3} color={C} title="시크릿 · 키 관리" bullets={["배포 시 암호화된 키 주입", "복호화 전용 · 접근 IP 제한"]} />
                    </div>
                </div>
            </div>

            {/* 어플리케이션 아키텍처 */}
            <div ref={appRef} className="pt-20">
                <SectionTitle>어플리케이션 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="다섯 서비스 · 역할 분리">
                        <ArchDiagram color={C} groups={appGroups} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="암호화된 개인정보 검색" bullets={["이름 · 연락처 필드 암호화", "암호화 상태에서 부분 검색", "데이터 키는 키 관리 서비스로"]} />
                        <TaskCard index={2} color={C} title="감사로그 기본 적용" bullets={["모든 라우트에 기본 기록", "권한 · 계정 변경 이력 조회", "응답 · 오류 규격 통일"]} />
                        <TaskCard index={3} color={C} title="호르몬 데이터 파이프라인" bullets={["채취 시점별 결과 누적 보관", "엑셀 일괄 업로드 지원", "최신 값으로 채점"]} />
                    </div>
                </div>
            </div>

            {/* AI 모듈 */}
            <div ref={aiRef} className="pt-20">
                <SectionTitle>AI 판정 모듈</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="채점 → 지표 → 추론 → 설명">
                        <StepFlow color={C} steps={aiSteps} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="모델 공급 계약" bullets={["모델과 서버 저장소 분리", "입출력 명세 문서화", "버전과 해시만 서버에 기록"]} />
                        <TaskCard index={2} color={C} title="자가 치유 기동" bullets={["해시 불일치면 재다운로드", "샘플 검사 실패 시 트래픽 차단", "모델 상태를 지표로 노출"]} />
                        <TaskCard index={3} color={C} title="장애 격리" bullets={["응답 지연 시 결과지에 표기", "대시보드에 상태 안내", "어떤 입력에도 중단되지 않음"]} />
                    </div>
                </div>
            </div>

            {/* 서비스 플로우 */}
            <div ref={flowRef} className="pt-20">
                <SectionTitle>서비스 플로우</SectionTitle>
                <div className="flex gap-6 m:flex-col">
                    <div className="w-3/4 m:w-full">
                        <DiagramPanel title="기관 진입부터 결과지 조회까지">
                            <StepFlow color={C} steps={flowSteps} />
                        </DiagramPanel>
                    </div>
                    <div className="w-1/4 m:w-full bg-[#f6f5f4] rounded-2xl p-8 flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-[#191918] leading-tight">역할별 콘솔</h3>
                        <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 break-keep">
                            <li>관리자: 기관 · 정산 · 감사로그</li>
                            <li>임상진 · 기관: 수검자와 결과</li>
                            <li>조회 · 다운로드 권한 분리</li>
                            <li>QR로 기관 진입 링크 발급</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 보안 · GMP */}
            <div ref={securityRef} className="pt-20">
                <SectionTitle>보안 · GMP</SectionTitle>
                <div className="flex flex-col gap-6">
                    <FactGrid
                        color={C}
                        facts={[
                            { value: "32 / 35", label: "항목 적용, 3개는 구조상 해당 없음" },
                            { value: "6종", label: "서비스 · 파드 · AI 경보 규칙" },
                            { value: "주간", label: "취약점 스캔과 부품 목록 자동 생성" },
                            { value: "보완 0건", label: "제출 후 심사 보완사항 미지적" },
                        ]}
                    />
                    <CheckList color={C} items={securityItems} />
                    <div className="grid grid-cols-2 gap-6 m:grid-cols-1">
                        <LinkCard color={C} href="/post/mnai-security-test" tag="시험성적서" title="마인즈내비 AI 사이버보안 시험성적서" desc="35개 항목별 판정과 구현 요약." />
                        <LinkCard color={C} href="/portfolio/medsec" tag="포트폴리오" title="의료기기 사이버보안 & 인프라 설계" desc="세 제품의 시험성적서와 인프라 설계를 한 곳에서." />
                    </div>
                </div>
            </div>

            <div className="pt-16">
                <p className="text-[13px] text-gray-400 break-keep">
                    본 제품에 관한 모든 저작권·기술 및 지식재산권은 주식회사 마인즈에이아이에 귀속됩니다. 상세 구조나 취약점이 드러나지 않도록 포괄적으로 작성했습니다.
                </p>
            </div>
        </div>
    );
}
