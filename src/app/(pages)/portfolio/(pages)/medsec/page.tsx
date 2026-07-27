import Link from "next/link";
import { Metadata } from "next";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
    title: "의료기기 사이버보안 및 인프라",
    description: "임상시험 허가·품목 인허가·디지털의료기기 GMP를 위한 사이버보안 시험성적서 작성과 인프라 설계·운영.",
    path: "/portfolio/medsec",
});

const DUTIES = [
    {
        t: "시험성적서 문서 작성",
        d: "35개 보안 항목을 제품 기능에 하나씩 연결해, 무엇이 어떻게 지켜지는지 문서로 증명",
    },
    {
        t: "식약처 가이드라인 준거",
        d: "허가·심사가 요구하는 최신 기준(안내서-0995-05, 2025.1)에 맞춰 작성",
    },
    {
        t: "위험관리 (ISO 14971)",
        d: "보안 위험을 미리 찾아 통제하고, 남은 위험이 안전한 수준인지 평가",
    },
    {
        t: "네이버 클라우드 (NCP)",
        d: "공공·의료용 보안인증(CSAP)을 받은 국내 클라우드 — 인프라 자체가 보안의 출발점",
    },
    {
        t: "Kubernetes (NKS)",
        d: "장애가 나도 자동 복구·무중단 — 서비스가 멈추지 않는 「가용성」 확보",
    },
    {
        t: "GitOps (ArgoCD)",
        d: "배포를 코드로 남기고 이미지를 고정 — 몰래 바뀌지 않는 「무결성·추적성」",
    },
    {
        t: "WAF · IDS",
        d: "외부 공격을 실시간 탐지·차단 — 시스템을 지켜냈다는 실제 증거",
    },
    {
        t: "암호화 · 인증 · 감사로그",
        d: "데이터는 암호화해 지키고, 누가 무엇을 했는지 로그로 남겨 「기밀성·부인방지」",
    },
    {
        t: "백업 · 복구 (PITR)",
        d: "문제가 생겨도 원하는 시점으로 되돌릴 수 있게 — 「복구·가용성」",
    },
    {
        t: "메시지 큐 (Kafka)",
        d: "이벤트·감사로그를 유실 없이 흘려보내 — 부하가 몰려도 기록이 빠지지 않게",
    },
    {
        t: "관측성 (Grafana · Loki)",
        d: "로그·지표·알림으로 이상 징후를 실시간 감지 — 「적시 대응」",
    },
    {
        t: "취약점 · 공급망 (Trivy · SBOM)",
        d: "이미지·오픈소스(SOUP) 취약점을 스캔·문서화 — 공급망까지 보안 관리",
    },
];

const CASES = [
    {
        href: "/post/varabom-ce-security",
        tag: "VR 인지기능 훈련 · 로컬 설치형 SaMD",
        title: "바라봄 CE",
        desc: "병원 PC에 설치해 쓰는 VR 인지훈련 프로그램. 로그인·기록·암호화를 처음부터 직접 만들어 보안 요건을 채웠다.",
        applied: "35개 중 29개 적용",
        status: "임상시험 허가",
        done: true,
        mark: "/assets/posts/varabom/icon.ico",
        logo: "/assets/portfolio/medsec/varabom-logo.png",
        logoW: "60%",
        color: "#7ba62b", // VARABOM 라임(포인트)
        titleColor: "#26303a", // VARABOM 워드마크 블랙
    },
    {
        href: "/post/chiyu-forest-security",
        tag: "폐쇄망 설치형 SaMD",
        title: "치유포레스트",
        desc: "폐쇄망 PC에 설치하는 프로그램. 로그인·데이터 보호·백업·복구까지 직접 구현했다.",
        applied: "35개 중 27개 적용",
        status: "의료기기 중대한 변경 허가",
        done: true,
        mark: "/assets/posts/chiyu/icon.ico",
        logo: "/assets/portfolio/medsec/cheeu-logo.png",
        logoW: "66%",
        color: "#2f7d46", // CHEEU. Forest 그린
        titleColor: "#2f7d46",
    },
    {
        href: "/post/mnai-security-test",
        tag: "클라우드 SaMD",
        title: "마인즈내비 AI",
        desc: "클라우드에서 돌아가는 AI 분석 서비스. 클라우드 보안 인프라가 곧 보안 요건의 근거가 된다.",
        applied: "35개 중 32개 적용",
        status: "GMP 임상시험, 인허가 진행중",
        done: false,
        mark: "/assets/portfolio/medsec/mnai-mark.png",
        logo: "/assets/portfolio/medsec/mindsnavi-logo.png",
        logoW: "74%",
        color: "#1d6f8f", // Minds. NAVI 딥틸
        titleColor: "#1d6f8f",
    },
];

export default function MedSecPortfolioPage() {
    return (
        <div className="mx-auto max-w-[1080px] px-6 pt-40 pb-24 m:px-4 m:pt-28">
            {/* 히어로 — PROVE Lite 배너 디자인 차용 (버튼 제외) */}
            <header className="flex w-full m:flex-col-reverse">
                {/* StartWrap */}
                <div className="flex w-1/2 flex-col gap-6 m:w-full m:items-center m:gap-4">
                    <h1 className="break-keep text-[4rem] font-semibold leading-[1.05] tracking-tighter text-gray-900 m:text-center m:text-[2.5rem]">
                        의료기기 인프라
                        <br />및 사이버보안 설계
                    </h1>
                    <p className="break-keep text-[1.3rem] font-medium leading-none tracking-[-0.07em] text-[#191918] m:text-center m:text-[1rem] m:leading-normal">
                        의료기기 <span className="text-[#416bac]">사이버보안 시험성적서</span>를 위한
                        <br />
                        <span className="tracking-[-0.18em]">인프라 설계·구축 · 시스템 아키텍처 · 인증·암호화·감사로그·백업/복구 구현 </span>
                    </p>
                    {/* 버튼 위치: 준거 가이드라인 버전 (작은 회색, 한 줄) */}
                    <p className="w-fit text-[11px] font-normal tracking-tight text-gray-400 m:mx-auto m:text-center">
                        식품의약품안전처 「의료기기의 사이버보안 허가·심사 가이드라인」 · 2025.1 개정(안내서-0995-05)
                    </p>
                </div>
                {/* EndWrap */}
                <div className="flex w-1/2 flex-col items-center justify-start m:w-full m:pb-8">
                    <div className="mx-auto my-auto flex w-full items-center justify-center gap-4">
                        <img className="h-32 w-auto max-w-full object-contain m:h-20" src="/assets/portfolio/medsec/mfds-logo.svg" alt="식품의약품안전처" />
                    </div>
                    <div className="h-[1px] w-full bg-[#416bac] m:hidden" />
                </div>
            </header>

            {/* 배경 · 왜 필요한가 (식약처 가이드라인 근거) */}
            <section className="mt-16">
                <h2 className="mb-4 text-2xl font-bold text-[#191918]">왜 사이버보안 시험성적서인가</h2>
                <ul className="max-w-[52rem] space-y-2.5 text-[15px] leading-relaxed text-gray-700 m:text-sm">
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>
                            통신되는 의료기기는 <b className="text-[#191918]">해킹 한 번이 환자 안전 사고</b>로 이어질 수 있다. 그래서 허가 단계에서 사이버보안 자료를 요구한다.
                        </span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>
                            그 기준이 <b className="text-[#191918]">KS X IEC 62443-4-2</b> — 인증·사용통제·무결성·기밀성·대응·가용성, 6개 영역 35개 항목이다.
                        </span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>
                            핵심은 <b className="text-[#191918]">시점</b>이다. 다 만들고 서류만 끼워 맞추는 게 아니라, 설계·DB 단계부터 가용성·기밀성·무결성(CIA)을 넣어야 한다.
                        </span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>
                            그래서 시험성적서의 진짜 근거는 문서가 아니라 <b className="text-[#191918]">실제로 그렇게 구현한 인프라와 코드</b>다.
                        </span>
                    </li>
                </ul>
                <figure className="mt-6 w-full rounded-2xl bg-[#f6f5f4] p-8 m:p-6">
                    <blockquote className="text-[1.0625rem] leading-[1.8] text-gray-700 m:text-[15px]">
                        “의료기기의 해킹, 정보 유출 등 사이버보안 위협사례가 꾸준히 보고되고 있고, 이러한 위협사례는 재산적 손실뿐만 아니라 환자 생명에 직접적인
                        위해를 줄 수 있어 의료기기의 사이버보안에 대한 중요성이 부각되고 있다.”
                    </blockquote>
                    <figcaption className="mt-4 text-[13px] text-gray-500">
                        식품의약품안전처 「의료기기의 사이버보안 허가·심사 가이드라인」 · 민원인 안내서 2025.1
                    </figcaption>
                </figure>
            </section>

            {/* 담당 영역 */}
            <section className="mt-20">
                <h2 className="mb-6 text-2xl font-bold text-[#191918]">담당 영역</h2>
                <div className="grid grid-cols-3 gap-5 m:grid-cols-1">
                    {DUTIES.map((x, i) => (
                        <div key={i} className="flex flex-col gap-2 rounded-2xl bg-[#f6f5f4] p-7">
                            <span className="text-3xl font-bold text-[#2f5aa8]/30">{String(i + 1).padStart(2, "0")}</span>
                            <h3 className="text-lg font-bold text-[#191918]">{x.t}</h3>
                            <p className="text-[15px] leading-relaxed text-gray-600">{x.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 관련 프로젝트 */}
            <section className="mt-24">
                <h2 className="mb-8 text-center text-[2.625rem] font-bold tracking-[-0.09375rem] text-[#191918] m:text-[2rem]">관련 프로젝트</h2>
                <div className="grid grid-cols-2 gap-6 m:grid-cols-1">
                    {CASES.map((c) => (
                        <Link
                            key={c.href}
                            href={c.href}
                            className="group flex h-[26rem] flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-[#f6f5f4] transition-colors duration-300 hover:border-[color:var(--c)] m:h-auto"
                            style={{ ["--c" as string]: c.color }}
                        >
                            {/* 상단: 마크 + 진행상태(같은 레벨) → 이름 → 설명 */}
                            <div className="flex flex-col gap-2 p-8 pb-6">
                                <div className="mb-1 flex items-center justify-between gap-2">
                                    <img className="h-8 w-8 object-contain" src={c.mark} alt="" />
                                    <span
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
                                        style={
                                            c.done
                                                ? { background: `color-mix(in srgb, ${c.color} 13%, #fff)`, color: c.color }
                                                : { background: "#eceae7", color: "#6b6a67" }
                                        }
                                    >
                                        {c.done ? (
                                            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden>
                                                <path
                                                    d="M4 10.5l4 4 8-9"
                                                    stroke="currentColor"
                                                    strokeWidth="2.6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        ) : (
                                            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden>
                                                <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.6" />
                                                <path
                                                    d="M10 6.3V10l2.6 1.7"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                        {c.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold" style={{ color: c.titleColor }}>
                                    {c.title}
                                </h3>
                                <p className="text-[15px] leading-relaxed text-gray-600">{c.desc}</p>
                            </div>
                            {/* 하단: 로고 패널(사진) */}
                            <div className="mt-auto w-full flex-1 overflow-hidden pl-8">
                                <div className="flex h-full w-full items-center justify-center rounded-tl-xl border-2 border-[#ededeb] bg-white shadow-lg transition-transform duration-300 group-hover:scale-105 origin-top-left">
                                    <img className="object-contain" style={{ width: c.logoW }} src={c.logo} alt={c.title} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
