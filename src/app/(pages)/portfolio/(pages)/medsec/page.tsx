import { Metadata } from "next";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
    title: "의료기기 사이버보안 및 인프라",
    description: "임상시험 허가·품목 인허가·디지털의료기기 GMP를 위한 사이버보안 시험성적서 작성과 인프라 설계·운영.",
    path: "/portfolio/medsec",
});

const DUTIES = [
    {
        t: "시험성적서 · 규제 대응",
        d: "KS X IEC 62443-4-2 시험성적서 작성, 식약처 가이드라인 준거, ISO 14971 위험관리",
    },
    {
        t: "클라우드 인프라",
        d: "CSAP 인증 네이버 클라우드 기반, Kubernetes(NKS)로 무중단·자동 복구",
    },
    {
        t: "배포 · 무결성",
        d: "GitOps(ArgoCD)로 배포를 코드화하고 이미지 다이제스트를 고정해 추적성 확보",
    },
    {
        t: "보안 방어",
        d: "WAF·IDS(ModSecurity·Falco)로 공격 탐지·차단, 취약점·공급망(Trivy·SBOM) 관리",
    },
    {
        t: "암호화 · 인증 · 감사로그",
        d: "TLS·AES·SHA 암호화와 접근 통제, 전 과정 감사로그로 기밀성·부인방지",
    },
    {
        t: "데이터 · 관측",
        d: "백업·복구(PITR), Kafka 로그 파이프라인, Grafana·Loki 모니터링",
    },
];

const CASES = [
    {
        href: "/post/varabom-ce-security",
        tag: "VR 인지기능 훈련 · 로컬 설치형 SaMD",
        title: "바라봄 CE",
        desc: "폐쇄망 PC 설치형 SaMD. 인증·감사로그·암호화·업데이트 절차를 설계 단계부터 구현해 시험성적서로 갈음.",
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
        desc: "폐쇄망 범용 PC 설치형 SaMD. 인증·무결성·암호화·백업·복구를 자체 구현해 시험성적서로 갈음.",
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
        desc: "CSAP 네이버 클라우드 위 인프라·GitOps·관측성이 그대로 보안 요구사항의 근거가 되는 클라우드형 SaMD.",
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
                <h2 className="mb-6 text-[2.625rem] font-bold tracking-[-0.09375rem] text-[#191918] m:text-[2rem]">사이버보안은 설계에서 결정된다</h2>
                <ul className="max-w-[52rem] space-y-2.5 text-[15px] leading-relaxed text-gray-700 m:text-sm">
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>
                            의료기기가 통신·네트워크로 연결되면서, <b className="text-[#191918]">해킹·정보 유출이 곧 환자 안전 문제</b>가 됐다.
                        </span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>
                            보안은 나중에 붙이는 기능이 아니다. 인증·데이터·로그 <b className="text-[#191918]">설계 단계부터</b> 녹여야 실제로 지켜진다.
                        </span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>
                            검증은 국제표준 <b className="text-[#191918]">KS X IEC 62443-4-2</b>(6개 영역 35개 항목)를 기준으로 한다.
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
                <h2 className="mb-6 text-[2.625rem] font-bold tracking-[-0.09375rem] text-[#191918] m:text-[2rem]">담당 영역</h2>
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
                        <a
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
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
