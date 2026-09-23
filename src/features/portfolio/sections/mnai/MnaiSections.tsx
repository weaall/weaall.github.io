"use client";

import { useRef } from "react";
import { CodeIcon, LogicIcon, PipelineIcon, ShieldIcon, UserLayoutIcon } from "@/components/ui/icons/PortfolioIcons";
import { WafIcon } from "@/components/ui/icons/NcpIcons";
import {
    ArchDiagram,
    CheckList,
    DiagramPanel,
    FactGrid,
    FlowIcon,
    IconFlow,
    IconRow,
    MaskIcon,
    OverviewCard,
    ScreenRow,
    SectionTitle,
    StepFlow,
    TaskCard,
} from "@/features/portfolio/components";

const C = "#1d6f8f";

/* ---------------- 네이버 클라우드 아이콘 ---------------- */

const ncp = (f: string) => `/assets/portfolio/mnai/ncp/${f}.png`;

/** 시스템 아키텍처 카드 아이콘 — 일반 클라우드 모양 대신 NKS 서비스 마크를 쓴다. */
const NksMark = (props: { color?: string; width?: string; height?: string }) => <MaskIcon src={ncp("kubernetes-service")} {...props} />;

/** 요청이 지나는 방어 계층 — 내부 인프라 문서(2026-09) 구성 그대로 */
const defenseLayers: FlowIcon[] = [
    { src: ncp("users"), label: "사용자", sub: "브라우저" },
    { src: ncp("load-balancer"), label: "Load Balancer", sub: "L4 단일 진입점" },
    { node: <WafIcon color="#222" />, label: "WAF", sub: "ModSecurity · 차단 모드" },
    { src: ncp("kubernetes-service"), label: "프론트엔드", sub: "API는 외부 비노출" },
    { src: ncp("ips"), label: "런타임 탐지", sub: "Falco IDS · IPS" },
    { src: ncp("ids"), label: "악성코드 점검", sub: "Trivy · ClamAV" },
];

/** 실제 사용 중인 네이버 클라우드 서비스 */
const ncpServices: FlowIcon[] = [
    { src: ncp("kubernetes-service"), label: "Kubernetes Service", sub: "워크로드 운영" },
    { src: ncp("container-registry"), label: "Container Registry", sub: "이미지 다이제스트 고정" },
    { src: ncp("load-balancer"), label: "Load Balancer", sub: "공인 진입점" },
    { src: ncp("cloud-db"), label: "Cloud DB", sub: "MySQL · Redis" },
    { src: ncp("object-storage"), label: "Object Storage", sub: "리포트 · 로그 · 증적" },
    { src: ncp("kms"), label: "KMS", sub: "봉투 암호화 키" },
    { src: ncp("anti-ddos"), label: "Anti-DDoS", sub: "경계 방어" },
    { src: ncp("security-monitoring"), label: "Security Monitoring", sub: "이벤트 감시" },
];

/** 실제 설문 앱 화면 — 진입부터 타액 채취 안내까지 흐름 순서 */
const surveyShots = [
    { src: "/assets/portfolio/mnai/survey/01.png", label: "시작 안내" },
    { src: "/assets/portfolio/mnai/survey/02.png", label: "본인인증" },
    { src: "/assets/portfolio/mnai/survey/03.png", label: "약관 동의" },
    { src: "/assets/portfolio/mnai/survey/04.png", label: "의료기기 정보" },
    { src: "/assets/portfolio/mnai/survey/05.png", label: "평가 인트로" },
    { src: "/assets/portfolio/mnai/survey/06.png", label: "조작 안내" },
    { src: "/assets/portfolio/mnai/survey/07.png", label: "문항 응답" },
    { src: "/assets/portfolio/mnai/survey/08.png", label: "진행 현황" },
    { src: "/assets/portfolio/mnai/survey/09.png", label: "이어서 진행" },
    { src: "/assets/portfolio/mnai/survey/10.png", label: "완료 · 타액 채취" },
];

/* ---------------- 다이어그램 데이터 ---------------- */

/** 자동 레인 — 이미지를 만들어 레지스트리에 올리는 데서 끝난다 */
const ciSteps = [
    { label: "코드 머지", sub: "prod 브랜치" },
    { label: "이미지 빌드", sub: "GitHub Actions" },
    { label: "레지스트리 적재", sub: "여기서 끝" },
];

/** 수동 레인 — 서명된 매니페스트만 클러스터를 바꾼다 */
const deploySteps = [
    { label: "다이제스트 교체", sub: "매니페스트 수정" },
    { label: "GPG 서명", sub: "지정 PC에서만" },
    { label: "서명 검증", sub: "미서명 거부" },
    { label: "롤링 교체", sub: "무중단 반영" },
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

export function MnaiSections() {
    const systemRef = useRef<HTMLDivElement>(null);
    const gitopsRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    const flowRef = useRef<HTMLDivElement>(null);
    const securityRef = useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div className="w-full flex flex-col">
            <SectionTitle center>프로젝트 오버뷰</SectionTitle>

            <div className="w-full grid grid-cols-3 gap-6 pt-2 m:grid-cols-1">
                <OverviewCard
                    icon={NksMark}
                    color={C}
                    title="시스템 아키텍처"
                    description="Kubernetes 위에 방화벽과 침입 탐지, 관측성을 갖춘 구성"
                    onClick={() => scrollTo(systemRef)}
                    preview={<img className="w-full object-contain" src="/assets/portfolio/mnai/mnai_ncp_arch.png" alt="NCP 아키텍처" />}
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
                    icon={LogicIcon}
                    color={C}
                    title="서비스 플로우"
                    description="기관 진입부터 설문, 판정, 결과지 조회까지 한 흐름"
                    onClick={() => scrollTo(flowRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "진입" }, { label: "설문" }, { label: "호르몬" }, { label: "판정" }, { label: "결과지" }]} />}
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
                    icon={UserLayoutIcon}
                    color={C}
                    title="사용자 레이아웃"
                    description="178문항을 끝까지 답하게 만드는 설문 화면"
                    onClick={() => scrollTo(userRef)}
                    preview={<img className="w-full object-cover object-top" src="/assets/portfolio/mnai/survey/07.png" alt="설문 문항 화면" />}
                />
                <OverviewCard
                    icon={ShieldIcon}
                    color={C}
                    title="보안 · GMP"
                    description="35개 항목 중 32개 적용, 인프라가 그대로 근거가 되는 구조"
                    onClick={() => scrollTo(securityRef)}
                    preview={<IconFlow compact color={C} items={defenseLayers.slice(1, 5)} />}
                />
            </div>

            {/* 시스템 아키텍처 */}
            <div ref={systemRef} className="pt-20">
                <SectionTitle>시스템 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="네이버 클라우드 Kubernetes(NKS) 구성">
                        <img className="w-full object-contain" src="/assets/portfolio/mnai/mnai_ncp_arch_origin.png" alt="Minds. NAVI AI NCP 아키텍처" />
                    </DiagramPanel>
                    <DiagramPanel title="사용 중인 네이버 클라우드 서비스">
                        <IconRow items={ncpServices} color={C} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="지표로 감지, 로그로 추적"
                            bullets={["응답 시간 · 에러율 · 자원 · 방화벽 차단 현황", "전 서비스 로그를 한곳에서 검색", "판정 모델 이상과 배포 실패를 같은 경로로 알림"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="증적을 사람이 만들지 않는다"
                            bullets={["부품 목록 · 배포 매니페스트 · 오류코드 사전", "악성코드 검사와 로그 장기 보관", "실제 시스템에서 모아 문서로 남긴다"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="개발 · 운영 동일 구성"
                            bullets={["앱 코드는 같고 환경별 분기가 없다", "클라우드와 보안 설정만 다르다", "운영에만 방화벽 차단 모드와 관리형 DB"]}
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
                            title="꺼낼 수 없는 키로 감싼 개인정보"
                            bullets={["이름 · 연락처를 필드 단위로 암호화", "그 키를 상위 키가 감싸고, 상위 키는 밖으로 못 꺼낸다", "기동 때 한 번만 풀어 메모리에 두고 디스크에 남기지 않는다", "암호화 상태로도 이름을 찾도록 검색용 키를 따로 둔다"]}
                        />
                        <TaskCard index={2} color={C} title="감사로그 기본 적용" bullets={["모든 라우트에 기본 기록", "권한 · 계정 변경 이력 조회", "응답 · 오류 규격 통일"]} />
                        <TaskCard index={3} color={C} title="호르몬 데이터 파이프라인" bullets={["채취 시점별 결과 누적 보관", "엑셀 일괄 업로드 지원", "최신 값으로 채점"]} />
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

            {/* GitOps */}
            <div ref={gitopsRef} className="pt-20">
                <SectionTitle>GitOps 배포</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="배포는 두 레인으로 나뉜다" desc="CI는 이미지를 만들 뿐이고, 클러스터를 바꾸는 것은 서명된 매니페스트뿐이다.">
                        <div className="flex flex-col gap-5">
                            <div>
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">자동 · CI</p>
                                <StepFlow color="#9c9994" steps={ciSteps} />
                            </div>
                            <div>
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">수동 · 서명 필요</p>
                                <StepFlow color={C} steps={deploySteps} />
                            </div>
                        </div>
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="관문 1 · 커밋 서명"
                            bullets={["신뢰 키로 서명한 커밋만 통과", "미서명 · 오염 커밋은 거부하고 알림", "웹에서 고친 커밋도 서명 불일치로 거부"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="관문 2 · 이미지 다이제스트"
                            bullets={["태그가 아닌 내용 해시로 고정", "내용이 다르면 내려받기 자체가 실패", "이미지 줄이 둘인 서비스도 함께 교체"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="CI 초록불이 배포는 아니다"
                            bullets={["재시작해도 고정된 다이제스트 그대로", "새 이미지는 올라와 있지만 아무도 지목 안 함", "파드의 이미지 ID로 판별"]}
                        />
                    </div>
                </div>
            </div>

            {/* 사용자 레이아웃 */}
            <div ref={userRef} className="pt-20">
                <SectionTitle>사용자 레이아웃</SectionTitle>
                <div className="flex flex-col gap-10">
                    <ScreenRow shots={surveyShots} />
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="178문항을 끝까지"
                            bullets={["응답은 실시간으로 저장된다", "중단해도 이어서 진행할 수 있다", "영역별로 몇 문항 남았는지 보여준다"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="화면에 있는 의료기기 표시"
                            bullets={["허가번호 · 표준코드 · 제조자 · 사용목적", "사용자 매뉴얼을 화면에서 내려받기", "전자문서로 제공하고 필요하면 종이로도"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="응답 부담 줄이기"
                            bullets={["처음 들어오면 조작 방법을 짚어준다", "보기를 고르면 다음 문항으로 넘어간다", "언제든 이전 답을 고칠 수 있다"]}
                        />
                    </div>
                </div>
            </div>

            {/* 보안 · GMP */}
            <div ref={securityRef} className="pt-20">
                <SectionTitle>보안 · GMP</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="요청이 지나는 방어 계층" desc="네이버 클라우드 보안 서비스와 오픈소스 도구를 단계로 배치했다.">
                        <IconFlow items={defenseLayers} color={C} />
                    </DiagramPanel>
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
