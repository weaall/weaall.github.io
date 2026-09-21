"use client";

import { useRef } from "react";
import { AdminLayoutIcon, DatabaseIcon, PackageIcon, PipelineIcon, ShieldIcon } from "@/components/ui/icons/PortfolioIcons";
import { ArchDiagram, CheckList, DiagramPanel, FactGrid, OverviewCard, SectionTitle, StepFlow, TaskCard } from "@/features/portfolio/components";

const C = "#2f7d46";

/* ---------------- 다이어그램 데이터 ---------------- */


const buildSteps = [
    { label: "소스 스냅샷" },
    { label: "이미지 빌드" },
    { label: "기준 해시" },
    { label: "설치 파일 패키징" },
    { label: "코드 서명" },
    { label: "검증 · 해시 출력" },
];

const updateSteps = [
    { label: "서명 검증" },
    { label: "버전 확인", sub: "다운그레이드 차단" },
    { label: "백업" },
    { label: "파일 교체" },
    { label: "해시 재검증" },
    { label: "불일치 → 자동 롤백" },
];


const securityItems = [
    { t: "식별 · 인증 (IA)", d: "관리자 · 사용자 · 기기 인증, 실패 잠금" },
    { t: "사용 통제 (UC)", d: "역할별 권한, 유휴 잠금, 중복 로그인 차단" },
    { t: "시스템 무결성 (SI)", d: "서명 · 해시 검증, 다운그레이드 차단, 롤백" },
    { t: "데이터 기밀성 (DC)", d: "TLS, 저장 데이터 암호화, 기기별 비밀값" },
    { t: "적시 대응 (TRE)", d: "감사 로그 보호와 업데이트 이력" },
    { t: "자원 가용성 (RA)", d: "검증된 백업 · 복구, 복구 도구, 권한 강화" },
];

/* ---------------- 컴포넌트 ---------------- */

export function CheeuSections() {
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
                    description="인터넷 없는 노트북 한 대에서 동작하는 설치형 컨테이너 스택"
                    onClick={() => scrollTo(systemRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "VR 헤드셋", tone: "dark" }] },
                                { boxed: true, grow: 1.8, nodes: [{ label: "nginx + React", tone: "soft" }, { label: "NestJS API", tone: "brand" }, { label: "DB · 캐시" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={PipelineIcon}
                    color={C}
                    title="빌드 · 패키징"
                    description="명령 하나로 이미지 생성부터 서명과 검증까지 끝내는 빌드"
                    onClick={() => scrollTo(buildRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "이미지" }, { label: "해시" }, { label: "패키징" }, { label: "서명" }, { label: "검증" }]} />}
                />
                <OverviewCard
                    icon={ShieldIcon}
                    color={C}
                    title="오프라인 업데이트"
                    description="서명 · 버전 · 해시 세 관문을 거치고 실패하면 자동 롤백"
                    onClick={() => scrollTo(updateRef)}
                    preview={<StepFlow compact color={C} steps={[{ label: "서명" }, { label: "버전" }, { label: "백업" }, { label: "교체" }, { label: "재검증" }]} />}
                />
                <OverviewCard
                    icon={DatabaseIcon}
                    color={C}
                    title="데이터 보호 · 백업"
                    description="봉투 암호화와 검증된 백업으로 기기 안에서만 보관"
                    onClick={() => scrollTo(dataRef)}
                    preview={
                        <ArchDiagram
                            compact
                            color={C}
                            groups={[
                                { nodes: [{ label: "마스터 키", tone: "dark" }] },
                                { nodes: [{ label: "데이터 키", tone: "brand" }] },
                                { nodes: [{ label: "레코드 · 음성", tone: "soft" }, { label: "백업 7세대" }] },
                            ]}
                        />
                    }
                />
                <OverviewCard
                    icon={ShieldIcon}
                    color={C}
                    title="사이버보안 시험성적서"
                    description="35개 항목 중 27개 적용, 기관 책임 항목은 해당 없음"
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
                    description="환자 · 기기 · 훈련 관리와 기기 안에서 끝내는 음성 전사"
                    onClick={() => scrollTo(adminRef)}
                    preview={<img className="w-full rounded-md object-cover object-top" src="/assets/portfolio/cheeu/login.png" alt="CHEEU. Forest N 관리자 웹" />}
                />
            </div>

            {/* 시스템 아키텍처 */}
            <div ref={systemRef} className="pt-20">
                <SectionTitle>시스템 아키텍처</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="폐쇄망 노트북 1대 · 설치형 컨테이너 스택" desc="변경허가 제출용 구성요소 모듈표.">
                        <img className="w-full object-contain" src="/assets/portfolio/cheeu/architecture.png" alt="CHEEU. Forest N 소프트웨어 시스템 구성" />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="폐쇄망 런타임 구성" bullets={["설치 파일 안 이미지만 사용", "DB · 캐시는 외부 비노출", "기기별 비밀값 생성 후 잠금", "비밀값 없으면 기동 차단"]} />
                        <TaskCard index={2} color={C} title="폐쇄망에서의 TLS" bullets={["사설 인증서를 설치 시 등록", "IP가 바뀌면 실행 시 재발급", "VR 기기용 평문 경로는 최소화"]} />
                        <TaskCard index={3} color={C} title="런처가 매 실행마다 하는 일" bullets={["설정 · 이미지 해시 검증", "인증서 재발급 · 환경 점검", "백업 후 서비스 기동"]} />
                    </div>
                </div>
            </div>

            {/* 빌드 파이프라인 */}
            <div ref={buildRef} className="pt-20">
                <SectionTitle>빌드 · 패키징</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="명령 하나로 이미지부터 서명 · 검증까지">
                        <StepFlow color={C} steps={buildSteps} />
                    </DiagramPanel>
                    <FactGrid
                        color={C}
                        facts={[
                            { value: "1.2 GB", label: "이미지 · 런타임 · 선행 구성요소를 담은 설치 파일" },
                            { value: "15~20분", label: "전체 빌드, 설치 파일만은 약 6분" },
                            { value: "22항목", label: "빌드 전 회귀 테스트" },
                            { value: "5개", label: "산출물과 해시 목록" },
                        ]}
                    />
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="단일 진입점" bullets={["순서를 타던 스크립트를 하나로", "단계마다 검증 삽입", "설치 파일만 · 재검증 옵션"]} />
                        <TaskCard index={2} color={C} title="자동 검증" bullets={["사전: 도구 · 인증서 지문 확인", "사후: 서명 · 버전 · 태그 일치", "산출물 해시 출력"]} />
                        <TaskCard index={3} color={C} title="SOUP · 라이선스" bullets={["베이스 이미지 버전 고정", "고지문 · 부품 목록 동봉", "라이선스 이슈 식별 후 기록"]} />
                    </div>
                </div>
            </div>

            {/* 업데이트 · 무결성 */}
            <div ref={updateRef} className="pt-20">
                <SectionTitle>오프라인 업데이트</SectionTitle>
                <div className="flex flex-col gap-6">
                    <DiagramPanel title="서명 → 버전 → 해시, 실패하면 이전 버전으로">
                        <StepFlow color={C} steps={updateSteps} />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="두 가지 배포 경로" bullets={["신규 설치용과 갱신용 분리", "런처가 다음 실행 때 검증 후 적용"]} />
                        <TaskCard index={2} color={C} title="설치 상태의 단일 진실" bullets={["버전 · 빌드 · 경로를 한 곳에 기록", "적용과 롤백 이력 추적"]} />
                        <TaskCard index={3} color={C} title="위변조 테스트" bullets={["변조 · 타 서명 · 무서명 모두 거부", "시스템 명령을 절대 경로로 호출"]} />
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
                                { title: "키 계층", nodes: [{ label: "마스터 키", sub: "설치 시 생성", tone: "dark" }, { label: "데이터 키", sub: "DB 보관", tone: "brand" }] },
                                { title: "보호 대상", nodes: [{ label: "환자 개인정보", tone: "soft" }, { label: "음성 · 전사문", tone: "soft" }] },
                                { title: "백업", nodes: [{ label: "7세대 보관" }, { label: "복원 검증" }] },
                                { title: "복구", nodes: [{ label: "손상 진단" }, { label: "동의 후 복구" }] },
                            ]}
                        />
                    </DiagramPanel>
                    <div className="grid grid-cols-3 gap-6 m:grid-cols-1">
                        <TaskCard index={1} color={C} title="봉투 암호화" bullets={["디스크의 키가 DB의 키를 감싼다", "환자 정보는 저장 시 자동 암호화", "VR 기기로는 마스킹해서 보낸다"]} />
                        <TaskCard index={2} color={C} title="검증된 백업" bullets={["매 실행 시 덤프 생성", "복원 가능 여부까지 확인", "7세대 보관"]} />
                        <TaskCard index={3} color={C} title="손상 감지 · 복구" bullets={["손상 시점을 보여주고 동의 후 복구", "감사로그는 DB 실패 시 파일로 폴백"]} />
                    </div>
                </div>
            </div>

            {/* 사이버보안 */}
            <div ref={securityRef} className="pt-20">
                <SectionTitle>사이버보안 시험성적서</SectionTitle>
                <div className="flex flex-col gap-6">
                    <FactGrid
                        color={C}
                        facts={[
                            { value: "27 / 35", label: "항목 적용, 8개는 기관 운영환경 책임" },
                            { value: "6개 영역", label: "인증 · 통제 · 무결성 · 기밀성 · 대응 · 가용성" },
                            { value: "2026.04", label: "의료기기 중대한 변경 허가" },
                            { value: "자체 작성", label: "시험성적서와 설치환경 테스트 절차" },
                        ]}
                    />
                    <CheckList color={C} items={securityItems} />
                </div>
            </div>

            {/* 관리자 웹 */}
            <div ref={adminRef} className="pt-20">
                <SectionTitle>관리자 웹 · AI 노트</SectionTitle>
                <div className="flex gap-6 m:flex-col">
                    <div className="w-3/5 m:w-full">
                        <DiagramPanel title="환자 · 기기 · 훈련 관리" desc="기기 페어링과 훈련 세션 실시간 제어, 결과 조회, 비식별 인쇄 리포트.">
                            <img className="w-full object-contain" src="/assets/portfolio/cheeu/login.png" alt="CHEEU. Forest N 로그인" />
                        </DiagramPanel>
                    </div>
                    <div className="w-2/5 m:w-full flex">
                        <TaskCard index={1} color={C} title="오프라인 음성 전사" className="w-full">
                            <div className="mt-4 flex flex-col gap-4">
                                <ArchDiagram
                                    color={C}
                                    groups={[
                                        { nodes: [{ label: "VR 녹음", tone: "dark" }] },
                                        { nodes: [{ label: "기기 내 전사", tone: "brand" }] },
                                        { nodes: [{ label: "암호화 저장", tone: "soft" }] },
                                    ]}
                                />
                                <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 break-keep">
                                    <li>인터넷 없이 기기 안에서 변환</li>
                                    <li>실패해도 원본 음성은 보존</li>
                                    <li>외부 전송 없이 개인정보 보호</li>
                                </ul>
                            </div>
                        </TaskCard>
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
