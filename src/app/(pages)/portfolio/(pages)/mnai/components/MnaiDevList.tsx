"use client";

import { useRef } from "react";
import { AIIcon, CloudIcon, CodeIcon, LogicIcon, PipelineIcon, ShieldIcon } from "@/components/ui/icons/PortfolioSvg";
import { ArchDiagram, CheckList, DiagramPanel, FactGrid, LinkCard, OverviewCard, SectionTitle, StepFlow, TaskCard } from "@/components/portfolio/PortfolioKit";

const C = "#1d6f8f";

/* ---------------- 다이어그램 데이터 ---------------- */

const edgeGroups = [
    {
        title: "사용자",
        nodes: [{ label: "수검자 · 임상진 · 기관 · 관리자", sub: "브라우저", tone: "dark" as const }],
    },
    {
        title: "네이버 클라우드 · 경계",
        boxed: true,
        nodes: [
            { label: "Load Balancer", sub: "공인 진입점" },
            { label: "ingress-nginx", sub: "TLS(cert-manager) · L7 Rate Limit", tone: "soft" as const },
            { label: "WAF", sub: "ModSecurity · OWASP CRS 차단 모드", tone: "brand" as const },
        ],
    },
    {
        title: "NKS 워크로드 (prod 네임스페이스)",
        boxed: true,
        grow: 1.6,
        direction: "row" as const,
        nodes: [
            { label: "fe-survey", sub: "설문 웹", tone: "soft" as const },
            { label: "fe-dashboard", sub: "임상 · 관리 콘솔", tone: "soft" as const },
            { label: "be-api", sub: "NestJS", tone: "brand" as const },
            { label: "be-pdf", sub: "채점 · 리포트", tone: "brand" as const },
            { label: "be-ai", sub: "모델 추론", tone: "brand" as const },
        ],
    },
    {
        title: "관리형 데이터",
        nodes: [
            { label: "Cloud DB for MySQL" },
            { label: "Cloud DB for Redis" },
            { label: "Object Storage", sub: "리포트 · 로그 · SBOM" },
            { label: "KMS", sub: "봉투 암호화 키" },
        ],
    },
];

const obsGroups = [
    {
        title: "탐지",
        nodes: [
            { label: "Falco (eBPF IDS)", sub: "런타임 이상 행위", tone: "brand" as const },
            { label: "WAF 감사 로그", sub: "차단 이벤트" },
        ],
    },
    {
        title: "수집",
        nodes: [{ label: "Grafana Alloy", sub: "DaemonSet 로그 수집" }, { label: "Prometheus", sub: "메트릭 · 경보 규칙" }],
    },
    {
        title: "저장 · 시각화",
        nodes: [{ label: "Loki", sub: "14일 보관" }, { label: "Grafana", sub: "WAF · Falco · 서비스 대시보드", tone: "soft" as const }],
    },
    {
        title: "경보 · 증적",
        nodes: [
            { label: "Alertmanager → be-api → Slack", sub: "서비스 다운 · AI 모듈 무결성 등" },
            { label: "CronJob", sub: "로그 아카이브 · Trivy SBOM · ClamAV", tone: "ghost" as const },
        ],
    },
];

const gitopsSteps = [
    { label: "코드 push", sub: "prod 브랜치" },
    { label: "GitHub Actions", sub: "빌드 · 테스트" },
    { label: "컨테이너 레지스트리", sub: "이미지 다이제스트" },
    { label: "GitOps 저장소 갱신", sub: "GPG 서명 커밋" },
    { label: "ArgoCD 서명 검증", sub: "미서명 커밋 거부" },
    { label: "자동 동기화", sub: "selfHeal · prune" },
    { label: "롤링 배포 · 헬스체크" },
];

const appGroups = [
    {
        title: "프론트엔드",
        nodes: [{ label: "fe-survey", sub: "Next.js 16 · 본인인증(PortOne)" }, { label: "fe-dashboard", sub: "Next.js · PBAC · AI 리포트 미리보기" }],
    },
    {
        title: "be-api · NestJS 11",
        boxed: true,
        grow: 1.5,
        nodes: [
            { label: "JWT · PBAC · 계정 잠금", sub: "argon2 · Redis 세션", tone: "soft" as const },
            { label: "도메인 모듈", sub: "설문 · 패키지 · 호르몬 · 임상결과 · 리포트 · 정산", tone: "brand" as const },
            { label: "감사로그 기본 적용", sub: "모든 라우트 · opt-out", tone: "soft" as const },
            { label: "PII 암호화 · 블라인드 인덱스", sub: "AES-256 · HMAC · KMS", tone: "soft" as const },
        ],
    },
    {
        title: "be-pdf · Express",
        boxed: true,
        nodes: [{ label: "채점 엔진", sub: "178문항 · 호르몬 · 종합" }, { label: "25개 지표 매핑", tone: "soft" as const }, { label: "Puppeteer 리포트", sub: "PDF → Object Storage" }],
    },
    {
        title: "be-ai · FastAPI",
        boxed: true,
        nodes: [{ label: "모델 번들", sub: "sha256 고정", tone: "brand" as const }, { label: "SHAP TreeExplainer" }, { label: "/health · /ready · /metrics", tone: "ghost" as const }],
    },
];

const aiSteps = [
    { label: "설문 · 호르몬 데이터", sub: "178문항 · 코르티솔" },
    { label: "채점 엔진", sub: "척도 · 등급" },
    { label: "25개 지표 매핑", sub: "심리 + 호르몬" },
    { label: "모델 추론", sub: "이진 · 다중 분류" },
    { label: "SHAP 상위 15", sub: "지표별 기여도" },
    { label: "마음신호등 결과지", sub: "확률 · 근거 표시" },
];

const flowSteps = [
    { label: "기관 코드 · QR 진입" },
    { label: "본인인증", sub: "PortOne" },
    { label: "심리 설문", sub: "PROVE 178" },
    { label: "호르몬 결과 등록", sub: "엑셀 일괄 업로드" },
    { label: "AI 판정", sub: "be-pdf → be-ai" },
    { label: "결과지 생성", sub: "PDF · 서명 URL" },
    { label: "대시보드 조회", sub: "권한별" },
    { label: "알림 · 정산" },
];

const securityItems = [
    { t: "식별 · 인증 (IA)", d: "JWT 액세스/리프레시, argon2 해시, 5회 실패 30분 잠금, 강제 비밀번호 변경, 본인인증" },
    { t: "사용 통제 (UC)", d: "권한 기반 접근 제어(PBAC) 매트릭스, 세션 관리, 모든 요청 감사로그" },
    { t: "시스템 무결성 (SI)", d: "이미지 다이제스트 고정, GPG 서명 매니페스트만 배포, AI 모듈 sha256 검증·셀프테스트, Falco IDS" },
    { t: "데이터 기밀성 (DC)", d: "TLS, PII 필드 암호화 + 블라인드 인덱스, KMS 봉투 암호화, 서명 URL 다운로드" },
    { t: "적시 대응 (TRE)", d: "Falco · WAF · Prometheus 경보를 Slack으로, 로그 14일 보관 후 일일 아카이브" },
    { t: "자원 가용성 (RA)", d: "L7 Rate Limit, WAF 차단, 관리형 DB 백업, 무중단 롤링 배포 · selfHeal" },
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
                    description="네이버 클라우드 NKS 위 Kubernetes. 인그레스 WAF, Falco IDS, Loki·Grafana·Prometheus 관측성"
                    onClick={() => scrollTo(systemRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "LB · WAF", tone: "brand" }] },
                                { boxed: true, grow: 1.6, nodes: [{ label: "fe · be · ai", tone: "soft" }, { label: "Falco · Loki · Grafana" }] },
                                { nodes: [{ label: "MySQL" }, { label: "Redis" }, { label: "Object · KMS" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={PipelineIcon}
                    color={C}
                    title="GitOps 배포"
                    description="GitHub Actions → 레지스트리 → ArgoCD 자동 동기화. GPG 서명 커밋만 반영하고 이미지는 다이제스트로 고정"
                    onClick={() => scrollTo(gitopsRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "Actions" }, { label: "다이제스트" }, { label: "서명" }, { label: "ArgoCD" }, { label: "배포" }]} />}
                />
                <OverviewCard
                    icon={CodeIcon}
                    color={C}
                    title="어플리케이션 아키텍처"
                    description="설문 웹 · 대시보드 · API · 리포트 렌더러 · AI 추론 서버, 다섯 서비스로 분리"
                    onClick={() => scrollTo(appRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "survey" }, { label: "dashboard" }] },
                                { nodes: [{ label: "be-api", tone: "brand" }] },
                                { nodes: [{ label: "be-pdf", tone: "soft" }] },
                                { nodes: [{ label: "be-ai", tone: "dark" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={AIIcon}
                    color={C}
                    title="AI 판정 모듈"
                    description="25개 지표 → 트리 앙상블 모델 → 확률 + SHAP 기여도. 다이제스트 검증과 셀프테스트를 통과해야 서비스"
                    onClick={() => scrollTo(aiRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "채점" }, { label: "25지표" }, { label: "추론" }, { label: "SHAP" }, { label: "결과지" }]} />}
                />
                <OverviewCard
                    icon={LogicIcon}
                    color={C}
                    title="서비스 플로우"
                    description="기관 코드·QR 진입 → 본인인증 → 설문 → 호르몬 결과 등록 → AI 판정 → 결과지 → 대시보드"
                    onClick={() => scrollTo(flowRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "진입" }, { label: "설문" }, { label: "호르몬" }, { label: "판정" }, { label: "결과지" }]} />}
                />
                <OverviewCard
                    icon={ShieldIcon}
                    color={C}
                    title="보안 · GMP"
                    description="35개 중 32개 적용. PII 암호화·블라인드 인덱스, KMS 봉투 암호화, 전 라우트 감사로그, SBOM 자동화"
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
                    <DiagramPanel title="네이버 클라우드 NKS · 경계 보호 · 관리형 데이터">
                        <ArchDiagram color={C} groups={edgeGroups} />
                    </DiagramPanel>
                    <DiagramPanel title="관측성 · 침입 탐지 · 증적 자동화">
                        <ArchDiagram color={C} groups={obsGroups} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="경보 규칙"
                            bullets={["서비스 다운 · 크래시루프 · Pod 미준비", "AI 모듈 무결성 실패 · 모델 미로드 · 예측 오류", "Alertmanager → be-api 릴레이 → Slack, Falco·ArgoCD 알림도 같은 경로"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="GMP 증적 자동화"
                            bullets={["주간 Trivy 스캔 → CycloneDX SBOM + SOUP 관리대장(Word) 자동 생성", "ClamAV 스캔 · 배포 매니페스트 · 오류코드 문서 CronJob", "일일 로그 아카이브를 Object Storage에 압축 보관"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="dev · prod 동일 구성"
                            bullets={["dev는 GKE, prod는 NKS — 매니페스트는 같고 클라우드만 다름", "Kafka(Strimzi · KRaft) 등 인프라 컴포넌트를 ArgoCD 자식 앱으로 관리", "Object Storage 특성에 맞춘 Loki 저장 방식 선택"]}
                        />
                    </div>
                </div>
            </div>

            {/* GitOps */}
            <div ref={gitopsRef} className="pt-20">
                <SectionTitle>GitOps 배포</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="push → pull 배포. 서명된 매니페스트와 다이제스트 고정 이미지만 클러스터에 도달">
                        <StepFlow color={C} steps={gitopsSteps} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="커밋 서명 검증"
                            bullets={["ArgoCD 프로젝트에 GPG 키를 등록, 미서명 커밋은 동기화 거부", "의도적으로 미서명 · 불량 다이제스트 커밋을 넣어 거부되는지 실증", "검증 실패는 Slack으로 경보"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="배포 · 이관 절차 문서화"
                            bullets={["GMP 소프트웨어 설계·개발 절차서를 Rev.6로 개정", "배포 = 검증된 이미지·매니페스트를 GitOps 저장소에 등록, 이관 = 사용환경 동기화로 구분", "다이제스트 기록 · 이관 후 스모크 테스트 · 롤백 절차를 별표3에 대응"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="시크릿 · 키 관리"
                            bullets={["CI가 KMS로 래핑한 키를 배포 시 주입", "복호화 전용 · 접근 IP 제한 하위 계정", "프론트 공개 변수는 빌드 시점 주입으로 명시"]}
                        />
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
                        <TaskCard
                            index={1}
                            color={C}
                            title="암호화된 개인정보 검색"
                            bullets={["이름 · 연락처 · 생년월일을 AES-256으로 필드 암호화", "HMAC 블라인드 인덱스(2-gram)로 암호화 상태에서 부분 검색", "데이터 키는 KMS 봉투 암호화로 보호"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="감사로그 기본 적용"
                            bullets={["데코레이터로 모든 라우트에 감사로그를 기본 켬, 예외만 opt-out", "요청 · 응답 · 계정 · 권한 변경 이력 조회 화면", "공통 응답 · 오류코드 계약을 문서와 팩토리로 고정"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="호르몬 데이터 파이프라인"
                            bullets={["코르티솔 · DHEA 채취 시점별 결과를 추가 전용으로 저장", "엑셀 일괄 업로드에 컬럼 매핑 지원", "최신 값 기준으로 채점 엔진에 전달"]}
                        />
                    </div>
                </div>
            </div>

            {/* AI 모듈 */}
            <div ref={aiRef} className="pt-20">
                <SectionTitle>AI 판정 모듈</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="채점 → 지표 → 추론 → 설명. 모델은 별도 저장소에서 버전·해시로 고정">
                        <StepFlow color={C} steps={aiSteps} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="모델 공급 계약"
                            bullets={["모델 저장소와 서버 저장소 분리, 입출력 JSON 명세 문서화", "서버에는 모델 파일 대신 버전 + sha256 lock만 커밋", "태그 push 시 모델 번들을 오브젝트 스토리지에 자동 게시"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="자가 치유 기동"
                            bullets={["기동 시 다이제스트 검증 → 불일치면 고정 버전 재다운로드", "합성 25지표 샘플로 셀프테스트, 실패 시 /ready 503으로 트래픽 차단", "Prometheus 메트릭 · JSON 로그로 모델 상태 노출"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="장애 격리"
                            bullets={["5초 타임아웃 · 1회 재시도, 불가 시 결과지에 표기하고 나머지는 진행", "대시보드에 'AI 판정 서버 이상' 안내", "모델 예외는 입력 · 모델 · 무결성 오류로 분류해 절대 크래시하지 않음"]}
                        />
                    </div>
                </div>
            </div>

            {/* 서비스 플로우 */}
            <div ref={flowRef} className="pt-20">
                <SectionTitle>서비스 플로우</SectionTitle>
                <div className="flex gap-6 m:flex-col">
                    <div className="w-3/4 m:w-full">
                        <DiagramPanel title="기관 진입 → 설문 → 호르몬 → AI 판정 → 결과지">
                            <StepFlow color={C} steps={flowSteps} />
                        </DiagramPanel>
                    </div>
                    <div className="w-1/4 m:w-full bg-[#f6f5f4] rounded-2xl p-8 flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-[#191918] leading-tight">역할별 콘솔</h3>
                        <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 break-keep">
                            <li>관리자: 기관 · 병원 · 패키지 · 정산 · 감사로그</li>
                            <li>임상진(CRO) · 병원 · 기관: 수검자 · 결과 · 리포트</li>
                            <li>권한 매트릭스로 리포트 미리보기 · 다운로드 · 발송 분리</li>
                            <li>QR로 기관 진입 URL 발급</li>
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
                            { value: "32 / 35", label: "KS X IEC 62443-4-2 항목 적용 · 3개는 물리·부팅·자동화 연계 없음으로 해당 없음" },
                            { value: "6종", label: "Prometheus 경보 규칙 (서비스 · Pod · AI 모듈)" },
                            { value: "주간", label: "Trivy SBOM · SOUP 관리대장 자동 생성" },
                            { value: "보완 0건", label: "제출 후 각 심사에서 보완사항 미지적" },
                        ]}
                    />
                    <CheckList color={C} items={securityItems} />
                    <div className="grid grid-cols-2 gap-6 m:grid-cols-1">
                        <LinkCard color={C} href="/post/mnai-security-test" tag="시험성적서 · 35개 항목" title="마인즈내비 AI 사이버보안 시험성적서" desc="클라우드형 SaMD의 요구사항별 판정과 구현. 인프라 · GitOps · 관측성이 그대로 근거가 되는 구조." />
                        <LinkCard color={C} href="/portfolio/medsec" tag="포트폴리오" title="의료기기 사이버보안 & 인프라 설계" desc="바라봄 CE · 치유포레스트 · 마인즈내비 AI 세 제품의 시험성적서와 인프라 설계를 한 곳에서." />
                    </div>
                </div>
            </div>

            <div className="pt-20">
                <div className="w-full rounded-2xl bg-[#f6f5f4] p-8 flex items-center gap-3">
                    <ShieldIcon color={C} width="20" height="20" />
                    <p className="text-[13px] text-gray-500 break-keep">
                        본 제품에 관한 모든 저작권·기술 및 지식재산권은 주식회사 마인즈에이아이(MindsAI Co., Ltd.)에 귀속됩니다. 상세 시스템 구조나 보안 취약점이 노출되지 않도록 포괄적으로 작성했습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
