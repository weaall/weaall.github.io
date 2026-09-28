"use client";

import { useRef } from "react";
import { AdminLayoutIcon, CodeIcon, LicenseIcon, PipelineIcon, ShieldIcon, UserLayoutIcon } from "@/components/ui/icons/PortfolioIcons";
import {
    ArchDiagram,
    DiagramPanel,
    FactGrid,
    FlowIcon,
    IconRow,
    LinkCard,
    MaskIcon,
    OverviewCard,
    OverviewGrid,
    ScreenRow,
    ScreenSwitcher,
    SectionTitle,
    StepFlow,
    TaskCard,
} from "@/features/portfolio/components";

const C = "#1d6f8f";

/* ---------------- 네이버 클라우드 아이콘 ---------------- */

const ncp = (f: string) => `/assets/portfolio/mnai/ncp/${f}.png`;

/** 시스템 아키텍처 카드 아이콘 — 일반 클라우드 모양 대신 NKS 서비스 마크를 쓴다. */
const NksMark = (props: { color?: string; width?: string; height?: string }) => <MaskIcon src={ncp("kubernetes-service")} {...props} />;

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

/**
 * 설문 화면 주소.
 * 파일명을 그대로 두고 그림만 바꾸면 브라우저·CDN 이 옛 그림을 계속 준다.
 * 이미지를 다시 만들 때마다 v 를 올린다.
 */
const shot = (n: string) => `/assets/portfolio/mnai/survey/${n}.png?v=2`;

/** 관리자 대시보드 화면 — 관리자 매뉴얼 캡처에서 번호 박스를 지운 그림. 환자 정보는 원본부터 가려져 있다. */
const dash = (n: string) => `/assets/portfolio/mnai/dashboard/${n}.png?v=2`;

/** 관리자 대시보드 화면 — 네 장 모두 1920×1314 로 맞춰 두었다(ScreenSwitcher 가 겹쳐 그린다) */
const dashShots = [
    { src: dash("home"), label: "본사 대시보드" },
    { src: dash("progress"), label: "진행 현황" },
    { src: dash("report"), label: "결과지 관리" },
    { src: dash("hospital"), label: "병원 대시보드" },
];

/** 실제 설문 앱 화면 — 진입부터 타액 채취 안내까지 흐름 순서 */
const surveyShots = [
    { src: shot("01"), label: "시작 안내" },
    { src: shot("02"), label: "본인인증" },
    { src: shot("03"), label: "약관 동의" },
    { src: shot("04"), label: "의료기기 정보" },
    { src: shot("05"), label: "평가 인트로" },
    { src: shot("06"), label: "조작 안내" },
    { src: shot("07"), label: "문항 응답" },
    { src: shot("08"), label: "진행 현황" },
    { src: shot("09"), label: "이어서 진행" },
    { src: shot("10"), label: "완료 · 타액 채취" },
];

/* ---------------- 다이어그램 데이터 ---------------- */

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

/* ---------------- 컴포넌트 ---------------- */

export function MnaiSections() {
    const systemRef = useRef<HTMLDivElement>(null);
    const gitopsRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    const adminRef = useRef<HTMLDivElement>(null);
    const securityRef = useRef<HTMLDivElement>(null);
    const licenseRef = useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div className="w-full flex flex-col">
            <SectionTitle center>프로젝트 오버뷰</SectionTitle>

            <OverviewGrid>
                <OverviewCard
                    icon={NksMark}
                    color={C}
                    title="시스템 아키텍처"
                    description="네이버 클라우드 NKS 기반, 보안과 관측성을 갖춘 시스템"
                    onClick={() => scrollTo(systemRef)}
                    preview={<img className="w-full object-contain" src="/assets/portfolio/mnai/mnai_ncp_arch.png" alt="NCP 아키텍처" />}
                />
                <OverviewCard
                    icon={CodeIcon}
                    color={C}
                    title="어플리케이션 아키텍처"
                    description="Next.js · NestJS 기반, 5개 서비스로 분리된 웹 애플리케이션"
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
                    icon={PipelineIcon}
                    color={C}
                    title="GitOps 배포"
                    description="ArgoCD 기반, 서명 검증을 거치는 GitOps 배포 파이프라인"
                    onClick={() => scrollTo(gitopsRef)}
                    preview={<img className="w-full object-contain" src="/assets/portfolio/mnai/mnai_gitops_deploy.png" alt="GitOps 배포" />}
                />
                <OverviewCard
                    icon={UserLayoutIcon}
                    color={C}
                    title="사용자 레이아웃"
                    description="모바일 웹 기반 178문항 자가 설문 평가 서비스"
                    onClick={() => scrollTo(userRef)}
                    preview={<img className="w-full object-cover object-top" src={shot("07")} alt="설문 문항 화면" />}
                />
                <OverviewCard
                    icon={AdminLayoutIcon}
                    color={C}
                    title="관리자 대시보드"
                    description="역할별 권한 기반 검사 진행 · 결과지 관리 대시보드"
                    onClick={() => scrollTo(adminRef)}
                    preview={<img className="w-full rounded-md object-cover object-top-left" src={dash("home")} alt="Minds. NAVI AI 관리자 대시보드" />}
                />
                <OverviewCard
                    icon={ShieldIcon}
                    color={C}
                    title="사이버보안"
                    description="KS X IEC 62443-4-2 35개 항목 기반 사이버보안 시험성적서"
                    onClick={() => scrollTo(securityRef)}
                    preview={
                        <div className="flex h-full flex-col items-center justify-center gap-2 py-3 text-center">
                            <span className="rounded-full border px-3 py-1 text-[13px] font-semibold" style={{ color: C, borderColor: C }}>
                                사이버보안 시험성적서
                            </span>
                            <span className="text-[11px] text-gray-400">35개 항목 중 32개 적용</span>
                        </div>
                    }
                />
                <OverviewCard
                    icon={LicenseIcon}
                    color={C}
                    title="품목허가 · DGMP"
                    description="디지털의료기기 품목허가 및 별표 3·4 DGMP 문서"
                    onClick={() => scrollTo(licenseRef)}
                    preview={
                        <div className="flex h-full flex-col items-center justify-center gap-2 py-3 text-center">
                            <span className="rounded-full border px-3 py-1 text-[13px] font-semibold" style={{ color: C, borderColor: C }}>
                                디지털의료기기 품목허가
                            </span>
                            <span className="text-[11px] text-gray-400">D 제허 26-6호 · D 제10017호</span>
                        </div>
                    }
                />
            </OverviewGrid>

            {/* 시스템 아키텍처 */}
            <div ref={systemRef} className="pt-20">
                <SectionTitle>시스템 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="네이버 클라우드 NKS 아키텍처">
                        <img className="w-full object-contain" src="/assets/portfolio/mnai/mnai_ncp_arch_origin.png" alt="Minds. NAVI AI NCP 아키텍처" />
                    </DiagramPanel>
                    <DiagramPanel title="사용 중인 네이버 클라우드 서비스">
                        <IconRow items={ncpServices} color={C} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="관측성 및 경보 체계"
                            bullets={["응답 시간 · 에러율 · 자원 모니터링", "전 서비스 로그 통합 검색", "모델 이상 · 배포 실패 알림 통합"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="운영 증적 자동화"
                            bullets={["악성코드 정기 검사", "로그 일일 아카이브 · 장기 보관", "배포 매니페스트 자동 기록"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="개발 · 운영 동일 구성"
                            bullets={["환경별 분기 없는 단일 코드", "클라우드 · 보안 설정만 분리", "운영 환경 방화벽 · 관리형 DB 적용"]}
                        />
                    </div>
                </div>
            </div>

            {/* 어플리케이션 아키텍처 */}
            <div ref={appRef} className="pt-20">
                <SectionTitle>어플리케이션 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="Next.js · NestJS 기반 서비스 분리 아키텍처">
                        <ArchDiagram color={C} groups={appGroups} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="개인정보 봉투 암호화"
                            bullets={["이름 · 연락처 필드 단위 암호화", "KMS 상위 키 기반 키 보호", "기동 시 1회 복호 · 메모리 보관", "암호화 필드 검색용 인덱스"]}
                        />
                        <TaskCard index={2} color={C} title="감사로그 기본 적용" bullets={["전 라우트 감사로그 기본 적용", "권한 · 계정 변경 이력 관리", "응답 · 오류 규격 통일"]} />
                        <TaskCard index={3} color={C} title="호르몬 데이터 파이프라인" bullets={["채취 시점별 결과 누적 보관", "엑셀 일괄 업로드 지원", "최신 측정값 기준 채점"]} />
                    </div>
                </div>
            </div>

            {/* GitOps */}
            <div ref={gitopsRef} className="pt-20">
                <SectionTitle>GitOps 배포</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="배포 파이프라인">
                        <img className="w-full object-contain" src="/assets/portfolio/mnai/mnai_gitops_deploy_origin.png" alt="Minds. NAVI AI GitOps 배포 파이프라인" />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="진본성 · 서명된 변경만"
                            bullets={["신뢰 키로 GPG 서명한 커밋·매니페스트만 통과", "누가 무엇을 바꿨는지 서명으로 보증", "미서명 · 위변조 커밋은 거부하고 알림"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="무결성 · 다이제스트 고정"
                            bullets={["태그가 아닌 내용 해시(다이제스트)로 이미지 고정", "내용이 조금이라도 다르면 내려받기 자체가 실패", "동일 다이제스트만 클러스터에 반영"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="검증 · 실제 배포 확인"
                            bullets={["파드의 이미지 ID로 실제 무엇이 도는지 확인", "CI 초록불이 배포는 아니다 — 서명·검증까지 통과해야 반영", "재시작해도 고정된 다이제스트 그대로 진본 유지"]}
                        />
                    </div>
                </div>
            </div>

            {/* 사용자 레이아웃 */}
            <div ref={userRef} className="pt-20">
                <SectionTitle>사용자 레이아웃</SectionTitle>
                <ScreenRow shots={surveyShots} />
            </div>

            {/* 관리자 대시보드 */}
            <div ref={adminRef} className="pt-20">
                <SectionTitle>관리자 대시보드</SectionTitle>
                <div className="flex flex-col gap-6">
                    <ScreenSwitcher shots={dashShots} color={C} />
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="역할별 콘솔 · 계정 권한"
                            bullets={["본사 · CRO · 병원 · 기관 콘솔 분리", "계정별 기능 권한 · 역할별 기본 권한", "첫 로그인 비밀번호 변경 강제"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="검사 진행 관리"
                            bullets={["패키지 등록 · 번들 생성 · QR 출력", "검체 결과 엑셀 일괄 등록", "수검자 SMS 발송"]}
                        />
                        <TaskCard index={3} color={C} title="결과지 · 운영 기록" bullets={["결과지 PDF 일괄 다운로드", "감사 로그 조회 · 엑셀 내보내기", "기간 · 기관 · 상태별 필터"]} />
                    </div>
                </div>
            </div>

            {/* 사이버보안 */}
            <div ref={securityRef} className="pt-20">
                <SectionTitle>사이버보안</SectionTitle>
                <div className="flex flex-col gap-6">
                    <FactGrid
                        color={C}
                        facts={[
                            { value: "32 / 35", label: "적용 항목 · 3개 구조상 해당 없음" },
                            { value: "6개 영역", label: "KS X IEC 62443-4-2 기준" },
                            { value: "보완 0건", label: "제출 후 심사 보완사항 미지적" },
                            { value: "자체 작성", label: "사이버보안 시험성적서" },
                        ]}
                    />
                    <LinkCard
                        color={C}
                        href="/post/mnai-security-test"
                        tag="시험성적서"
                        title="마인즈내비 AI 사이버보안 시험성적서"
                        desc="35개 항목별 요구사항 · 판정 · 구현 요약"
                    />
                </div>
            </div>

            {/* 품목허가 · DGMP */}
            <div ref={licenseRef} className="pt-20">
                <SectionTitle>품목허가 · DGMP</SectionTitle>
                <div className="flex flex-col gap-6">
                    <FactGrid
                        color={C}
                        facts={[
                            { value: "D 제허 26-6호", label: "디지털의료기기 품목허가번호" },
                            { value: "D 제10017호", label: "디지털의료기기 제조업허가번호" },
                            { value: "별표 3 · 4", label: "DGMP 문서 작성" },
                            { value: "DGMP", label: "디지털의료기기 제조 및 품질관리 기준" },
                        ]}
                    />
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="별표 3 · 4 DGMP 문서 작성"
                            bullets={["DGMP 절차서 · 양식 작성", "설계 · 개발부터 배포 · 이관까지 문서화", "클라우드 운영 방식 반영"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="배포 · 이관 절차 분리"
                            bullets={["검증 이미지 저장소 등록(배포)", "사용환경 반영 및 점검(이관)", "다이제스트 기록 · 롤백 · 문제 보고"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="관리대장 자동 작성"
                            bullets={["SOUP · SBOM 관리대장 주간 생성", "오류코드 문서 자동 갱신", "심사 기록과 운영 상태 일치"]}
                        />
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
