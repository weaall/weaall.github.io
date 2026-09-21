"use client";

import { useRef } from "react";
import { AdminLayoutIcon, AIIcon, DatabaseIcon, PackageIcon, PipelineIcon, ShieldIcon } from "@/components/ui/icons/PortfolioSvg";
import { ArchDiagram, CheckList, DiagramPanel, FactGrid, LinkCard, OverviewCard, SectionTitle, StepFlow, TaskCard } from "@/components/portfolio/PortfolioKit";

const C = "#2f7d46";

/* ---------------- 다이어그램 데이터 ---------------- */

const systemGroups = [
    {
        title: "훈련 기기",
        nodes: [{ label: "VR 헤드셋", sub: "Unity 훈련 앱 · 기기 키 인증", tone: "dark" as const }],
    },
    {
        title: "CheeuForest.exe · Docker Compose (WSL2)",
        boxed: true,
        grow: 2.4,
        direction: "row" as const,
        nodes: [
            { label: "nginx + React", sub: "TLS 종단 · 관리자 웹", tone: "soft" as const },
            { label: "NestJS API", sub: "REST · SSE · Socket.IO · 감사로그 · 암호화", tone: "brand" as const },
            { label: "PostgreSQL 16", sub: "루프백 바인딩 · 체크섬" },
            { label: "Redis 7", sub: "세션 · 잠금 카운터 · 비노출" },
        ],
    },
    {
        title: "로컬 저장",
        nodes: [{ label: "DB 데이터 · 백업", sub: "7세대 pg_dump" }, { label: "암호화 음성 · 전사문", sub: "AES-256-GCM" }],
    },
];

const buildSteps = [
    { label: "소스 스냅샷", sub: "리비전 기록 · 더티 빌드 거부" },
    { label: "이미지 빌드", sub: "OCI 라벨 · docker save" },
    { label: "무결성 기준 해시", sub: "설정 · 런처 · 이미지 tar" },
    { label: "NSIS 패키징", sub: "설치 · 업데이트 · 복구 · 런처" },
    { label: "코드 서명", sub: "PFX · 지문 고정" },
    { label: "검증 · SHA-256", sub: "5개 산출물 · 매니페스트" },
];

const updateSteps = [
    { label: "업데이트 파일 실행", sub: "설치 여부 · 버전 확인" },
    { label: "서명 · 지문 검증", sub: "Authenticode" },
    { label: "버전 상향 확인", sub: "다운그레이드 차단" },
    { label: "백업", sub: ".rollback" },
    { label: "파일 교체" },
    { label: "해시 재검증", sub: "4개 SHA-256" },
    { label: "불일치 → 자동 롤백", sub: "이력 기록" },
];

const dataItems = [
    { t: "봉투 암호화", d: "디스크의 KEK가 DB의 DEK를 감싸고, DEK가 레코드·파일을 AES-256-GCM으로 암호화" },
    { t: "개인정보 투명 암호화", d: "이름·생년월일·연락처는 Prisma 확장으로 저장 시 암호화, VR 기기로 보낼 때는 마스킹" },
    { t: "음성 · 전사문 보호", d: "VR에서 올라온 WAV와 음성 전사 텍스트를 암호화 저장, 인증된 스트리밍으로만 재생" },
    { t: "검증된 백업 7세대", d: "매 실행 시 pg_dump 후 pg_restore --list로 덤프를 검증, 빈 덤프 폐기, 여유 공간 확인" },
    { t: "손상 감지 · 복구 안내", d: "손상 시그니처만 골라 진단하고, 복구 가능 시점(데이터 손실 경계)을 보여준 뒤 동의 시 복구" },
    { t: "감사로그 이중화", d: "모든 요청을 이벤트 로그로 기록. DB 기록 실패 시 파일 폴백 + 상태 파일" },
];

const securityItems = [
    { t: "식별 · 인증 (IA)", d: "관리자·사용자 로그인, 기기 키 인증, 로그인 실패 잠금, 최초 로그인·주기적 비밀번호 변경" },
    { t: "사용 통제 (UC)", d: "역할 기반 권한, 유휴 세션 잠금, 중복 로그인 차단, 감사 기록 보호" },
    { t: "시스템 무결성 (SI)", d: "설치·업데이트 파일 서명 검증, 실행 시 해시 검증, 다운그레이드 차단, 자동 롤백" },
    { t: "데이터 기밀성 (DC)", d: "TLS 1.2/1.3, 저장 데이터 봉투 암호화, 기기별 비밀값 자동 생성" },
    { t: "적시 대응 (TRE)", d: "감사 로그 ACL 보호, 업데이트·무결성 이벤트 이력" },
    { t: "자원 가용성 (RA)", d: "검증된 백업·복구, 복구 도구, 설치 디렉터리 ACL 강화" },
];

/* ---------------- 컴포넌트 ---------------- */

export default function CheeuDevList() {
    const systemRef = useRef<HTMLDivElement>(null);
    const buildRef = useRef<HTMLDivElement>(null);
    const updateRef = useRef<HTMLDivElement>(null);
    const dataRef = useRef<HTMLDivElement>(null);
    const securityRef = useRef<HTMLDivElement>(null);
    const adminRef = useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div className="w-full flex flex-col">
            <SectionTitle center>프로젝트 오버뷰</SectionTitle>

            <div className="w-full grid grid-cols-3 gap-6 pt-2 m:grid-cols-1">
                <OverviewCard
                    icon={PackageIcon}
                    color={C}
                    title="시스템 아키텍처"
                    description="인터넷 없는 노트북 한 대에서 동작. 컨테이너 4개와 런타임을 설치 파일 하나에 담아 배포"
                    onClick={() => scrollTo(systemRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "VR 헤드셋", tone: "dark" }] },
                                { boxed: true, grow: 1.8, nodes: [{ label: "nginx + React", tone: "soft" }, { label: "NestJS API", tone: "brand" }, { label: "PostgreSQL · Redis" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={PipelineIcon}
                    color={C}
                    title="빌드 · 패키징 파이프라인"
                    description="명령 하나로 이미지 생성 → NSIS 패키징 → 코드 서명 → 검증 → 해시 출력. 회귀 테스트 22항목 내장"
                    onClick={() => scrollTo(buildRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "이미지" }, { label: "해시" }, { label: "NSIS" }, { label: "서명" }, { label: "검증" }]} />}
                />
                <OverviewCard
                    icon={ShieldIcon}
                    color={C}
                    title="오프라인 업데이트 · 무결성"
                    description="서명·지문 검증 → 버전 상향 확인 → 백업 → 교체 → 해시 재검증. 불일치면 자동 롤백"
                    onClick={() => scrollTo(updateRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "서명" }, { label: "버전" }, { label: "백업" }, { label: "교체" }, { label: "재검증" }]} />}
                />
                <OverviewCard
                    icon={DatabaseIcon}
                    color={C}
                    title="데이터 보호 · 백업"
                    description="KEK→DEK 봉투 암호화, 개인정보·음성 암호화, 검증된 pg_dump 백업 7세대, 손상 감지 시 복구 안내"
                    onClick={() => scrollTo(dataRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "KEK (파일)", tone: "dark" }] },
                                { nodes: [{ label: "DEK (DB)", tone: "brand" }] },
                                { nodes: [{ label: "레코드 · 음성", tone: "soft" }, { label: "백업 7세대" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={ShieldIcon}
                    color={C}
                    title="사이버보안 시험성적서"
                    description="IEC 62443-4-2 35개 항목 중 27개 적용. 기관 책임 항목은 해당 없음으로 두고 프로그램 책임 항목을 구현"
                    onClick={() => scrollTo(securityRef)}
                    preview={
                        <div className="flex flex-wrap gap-1.5">
                            {["IA 8", "UC 7", "SI 11", "DC 3", "TRE 1", "RA 5"].map((x) => (
                                <span key={x} className="rounded-md px-2 py-1 text-[10px] font-semibold" style={{ background: `color-mix(in srgb, ${C} 12%, #fff)`, color: C }}>
                                    {x}
                                </span>
                            ))}
                            <span className="rounded-md px-2 py-1 text-[10px] font-semibold text-white" style={{ background: C }}>
                                27 / 35 적용
                            </span>
                        </div>
                    }
                />
                <OverviewCard
                    icon={AdminLayoutIcon}
                    color={C}
                    title="관리자 웹 · AI 노트"
                    description="환자·기기·훈련 세션 관리와 결과 조회, 인쇄용 리포트. VR 음성은 기기 안에서 텍스트로 전사"
                    onClick={() => scrollTo(adminRef)}
                    preview={<img className="w-full rounded-md object-cover object-top" src="/assets/portfolio/cheeu/login.png" alt="CHEEU. Forest N 관리자 웹" />}
                />
            </div>

            {/* 시스템 아키텍처 */}
            <div ref={systemRef} className="pt-20">
                <SectionTitle>시스템 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="폐쇄망 노트북 1대 · 설치형 컨테이너 스택">
                        <ArchDiagram color={C} groups={systemGroups} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="폐쇄망 런타임 구성"
                            bullets={[
                                "이미지는 설치 파일 안 tar에서만 적재(pull 금지)",
                                "DB는 루프백에만 바인딩, Redis는 호스트 비노출",
                                "비밀값이 없으면 스택이 기동되지 않도록 필수화",
                                "설치 시 기기별 128~256bit 비밀값 생성 후 ACL 잠금",
                            ]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="폐쇄망에서의 TLS"
                            bullets={["사설 CA 인증서를 설치 시 신뢰 저장소에 등록", "호스트 IP가 바뀌면 실행 시 인증서 재발급", "사설 CA를 검증 못 하는 VR 기기용 평문 경로는 에셋·상태 API로 최소화, 음성은 HTTPS 강제"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="런처가 매 실행마다 하는 일"
                            bullets={[
                                "설정 · 복구 도구 · 이미지 tar 해시 검증, 시계 · 환경 점검",
                                "현재 호스트 IP로 TLS 인증서 재발급",
                                "DB 백업 후 덤프 검증 → 이미지 적재 → 스키마 반영",
                                "서비스 기동 후 브라우저를 앱 모드로 열기",
                            ]}
                        />
                    </div>
                    <div className="w-full bg-[#f6f5f4] rounded-2xl p-8 flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-[#191918]">구성요소 모듈표 (변경허가 제출용)</h3>
                        <img className="w-full max-w-[52rem] mx-auto rounded-xl border-2 border-[#ededeb] bg-white shadow-lg" src="/assets/portfolio/cheeu/architecture.png" alt="CHEEU. Forest N 소프트웨어 시스템 구성" />
                    </div>
                </div>
            </div>

            {/* 빌드 파이프라인 */}
            <div ref={buildRef} className="pt-20">
                <SectionTitle>빌드 · 패키징 파이프라인</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="build 2.0.0 — 한 번의 명령으로 이미지부터 서명·검증까지">
                        <StepFlow color={C} steps={buildSteps} />
                    </DiagramPanel>
                    <FactGrid
                        color={C}
                        facts={[
                            { value: "1.2 GB", label: "설치 파일 1개에 이미지·런타임·오프라인 선행 구성요소 포함" },
                            { value: "15~20분", label: "전체 빌드 · 설치 파일만은 약 6분" },
                            { value: "22항목", label: "빌드 전 회귀 테스트 (버전 비교 · 해시 · 서명 · 롤백 · 감사로그)" },
                            { value: "5개", label: "산출물 (설치 · 업데이트 · 런처 · 복구 · 업데이트 코어) + SHA256SUMS" },
                        ]}
                    />
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard
                            index={1}
                            color={C}
                            title="단일 진입점"
                            bullets={["원래 순서를 지켜야 하는 스크립트 두 개 → build.cmd 하나로 묶고 단계마다 검증", "옵션: 설치 파일만 · 회귀 테스트 · 재검증 · 빌드 목록", "서명 비밀번호는 환경변수 또는 실행 중 입력"]}
                        />
                        <TaskCard
                            index={2}
                            color={C}
                            title="자동 검증"
                            bullets={["사전: 빌드 도구 · Docker · PFX 지문 일치", "사후: 산출물 존재 · 서명 지문 · 버전 스탬프 · 이미지 태그 · 소스 리비전", "오프라인 PC는 루트 신뢰를 가정할 수 없어 체인 검증 대신 지문 고정"]}
                        />
                        <TaskCard
                            index={3}
                            color={C}
                            title="SOUP · 라이선스 관리"
                            bullets={["베이스 이미지 · 런타임 버전을 태그+다이제스트로 고정", "제3자 고지문과 CycloneDX SBOM을 설치 폴더에 동봉", "라이선스 이슈(RSAL · AGPL) 식별 후 품질 기록과 연결"]}
                        />
                    </div>
                </div>
            </div>

            {/* 업데이트 · 무결성 */}
            <div ref={updateRef} className="pt-20">
                <SectionTitle>오프라인 업데이트 · 무결성</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="3중 게이트 업데이트 — 서명 → 버전 → 해시, 실패하면 이전 버전으로">
                        <StepFlow color={C} steps={updateSteps} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="두 가지 배포 경로" bullets={["신규 설치용 Setup(전체)과 기존 설치용 Update(차분)", "업데이트 파일은 서명된 업데이트 코어를 내려놓고, 런처가 다음 실행 때 검증 후 적용"]} />
                        <TaskCard index={2} color={C} title="설치 상태의 단일 진실" bullets={["레지스트리에 버전 · 빌드 ID · 설치 경로 · 이전 버전 기록", "업데이트 이력 로그로 언제 어떤 버전이 적용·롤백됐는지 추적"]} />
                        <TaskCard index={3} color={C} title="위변조 테스트" bullets={["변조된 파일 · 다른 서명자 · 서명 없는 파일 모두 거부되는지 회귀 테스트", "PATH 하이재킹을 막기 위해 시스템 PowerShell을 절대 경로로 호출"]} />
                    </div>
                </div>
            </div>

            {/* 데이터 보호 */}
            <div ref={dataRef} className="pt-20">
                <SectionTitle>데이터 보호 · 백업</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="봉투 암호화 · 검증된 백업">
                        <ArchDiagram
                            color={C}
                            groups={[
                                { title: "키 계층", nodes: [{ label: "KEK", sub: "설치 시 생성 · 파일 · ACL 잠금", tone: "dark" }, { label: "DEK", sub: "DB 저장 · KEK로 암호화", tone: "brand" }] },
                                { title: "보호 대상", nodes: [{ label: "환자 개인정보", sub: "이름 · 생년월일 · 연락처", tone: "soft" }, { label: "음성 · 전사문", sub: "WAV · STT 텍스트", tone: "soft" }] },
                                { title: "백업", nodes: [{ label: "pg_dump 7세대", sub: "pg_restore --list 검증" }, { label: ".env · KEK 사본", sub: "복구 시 필요" }] },
                                { title: "복구", nodes: [{ label: "손상 진단", sub: "pg_amcheck" }, { label: "시점 안내 → 동의 → 복구", sub: "기존 DB 보존" }] },
                            ]}
                        />
                    </DiagramPanel>
                    <CheckList color={C} items={dataItems} />
                </div>
            </div>

            {/* 사이버보안 */}
            <div ref={securityRef} className="pt-20">
                <SectionTitle>사이버보안 시험성적서</SectionTitle>
                <div className="flex flex-col gap-6">
                    <FactGrid
                        color={C}
                        facts={[
                            { value: "27 / 35", label: "KS X IEC 62443-4-2 항목 적용 · 8개는 기관 운영환경 책임으로 해당 없음" },
                            { value: "6개 영역", label: "식별·인증 · 사용통제 · 무결성 · 기밀성 · 적시대응 · 가용성" },
                            { value: "2026.04", label: "의료기기 중대한 변경 허가" },
                            { value: "자체 작성", label: "제조사가 직접 작성한 시험성적서와 설치환경 테스트 절차(A~G)" },
                        ]}
                    />
                    <CheckList color={C} items={securityItems} />
                    <div className="grid grid-cols-2 gap-6 m:grid-cols-1">
                        <LinkCard
                            color={C}
                            href="/post/chiyu-forest-security"
                            tag="시험성적서 · 35개 항목"
                            title="치유포레스트 사이버보안 시험성적서"
                            desc="요구사항별 판정과 구현 요약. 폐쇄망 설치형이라 해당 없음으로 둔 항목과 그 이유."
                        />
                        <LinkCard color={C} href="/portfolio/medsec" tag="포트폴리오" title="의료기기 사이버보안 & 인프라 설계" desc="바라봄 CE · 치유포레스트 · 마인즈내비 AI 세 제품의 시험성적서와 인프라 설계를 한 곳에서." />
                    </div>
                </div>
            </div>

            {/* 관리자 웹 */}
            <div ref={adminRef} className="pt-20">
                <SectionTitle>관리자 웹 · AI 노트</SectionTitle>
                <div className="flex gap-6 m:flex-col">
                    <div className="w-3/5 m:w-full bg-[#f6f5f4] rounded-2xl p-8 flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-[#191918]">React 19 · Vite · shadcn 관리자 웹</h3>
                        <img className="w-full rounded-xl border-2 border-[#ededeb] shadow-lg" src="/assets/portfolio/cheeu/login.png" alt="CHEEU. Forest N 로그인" />
                        <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 break-keep">
                            <li>환자 · VR 기기 페어링 · 훈련 세션 생성과 실시간 제어(SSE)</li>
                            <li>훈련 결과 · 설문 결과 · 세션 분석, 비식별 A4 인쇄 리포트</li>
                            <li>유휴 잠금 · 계정 · 로그 · 이용 공지 · 의료기기 표시 화면</li>
                        </ul>
                    </div>
                    <div className="w-2/5 m:w-full flex flex-col gap-6">
                        <TaskCard index={1} color={C} title="오프라인 음성 전사 (AI 노트)" className="h-full">
                            <div className="mt-4 flex flex-col gap-4">
                                <ArchDiagram
                                    color={C}
                                    groups={[
                                        { nodes: [{ label: "VR 녹음 업로드", tone: "dark" }] },
                                        { nodes: [{ label: "whisper.cpp", sub: "API 이미지 내장 · 큐 직렬 처리", tone: "brand" }] },
                                        { nodes: [{ label: "암호화 저장", sub: "결과 화면 AI 노트", tone: "soft" }] },
                                    ]}
                                />
                                <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 break-keep">
                                    <li>인터넷 없이 기기 안에서 한국어 음성을 텍스트로 변환</li>
                                    <li>전사 실패는 치명적이지 않게 처리하고 원본 음성은 보존</li>
                                    <li>외부 전송 없이 개인정보 보호 요건 충족</li>
                                </ul>
                            </div>
                        </TaskCard>
                    </div>
                </div>
            </div>

            <div className="pt-20">
                <div className="w-full rounded-2xl bg-[#f6f5f4] p-8 flex items-center gap-3">
                    <AIIcon color={C} width="20" height="20" />
                    <p className="text-[13px] text-gray-500 break-keep">
                        본 제품에 관한 모든 저작권·기술 및 지식재산권은 주식회사 마인즈에이아이(MindsAI Co., Ltd.)에 귀속됩니다. 상세 시스템 구조나 보안 취약점이 노출되지 않도록 포괄적으로 작성했습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
