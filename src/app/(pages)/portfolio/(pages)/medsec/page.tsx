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
        t: "시험성적서 문서 작성 담당",
        d: "KS X IEC 62443-4-2 35개 항목 제품 매핑 · 제조자 시험성적서화",
    },
    {
        t: "실제 시스템·인프라 구현 담당",
        d: "인증 · 암호화 · 감사로그 · 백업/복구 · NCP NKS · GitOps · 관측성 · WAF · IDS",
    },
    {
        t: "인허가 대응 담당",
        d: "임상시험 허가 · 품목 인허가 · 디지털의료기기 GMP(별표3)",
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
            {/* 히어로 (PROVE Lite 배너와 동일: 좌 제목·부제 / 우 비주얼) */}
            <header className="flex items-center gap-10 m:flex-col-reverse m:items-stretch m:gap-8">
                {/* 좌: 텍스트 */}
                <div className="flex w-1/2 flex-col gap-6 m:w-full m:gap-4">
                    <span className="text-sm font-medium text-[#2f5aa8]">포트폴리오 · 의료기기</span>
                    <h1 className="text-[3.25rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#191918] m:text-[2.25rem]">
                        의료기기 사이버보안
                        <br />및 인프라 담당
                    </h1>
                    <p className="text-[1.15rem] leading-relaxed text-gray-600 m:text-base">
                        서류로 채우는 사이버보안이 아니라, 제품을 실제로 그렇게 <span className="font-semibold text-[#2f5aa8]">설계·구현해 증명</span>합니다.
                        KS X IEC 62443-4-2 <b className="text-[#191918]">시험성적서 작성</b>과 그 근거가 되는 <b className="text-[#191918]">시스템·인프라 구현</b>을 직접 담당해,{" "}
                        <span className="font-semibold text-[#191918]">임상시험 허가 · 의료기기 변경 허가</span>를 통과시킨 작업들입니다.
                    </p>
                </div>
                {/* 우: 준거 기준 카드 (기준·가이드라인 버전) */}
                <div className="flex w-1/2 justify-center m:w-full">
                    <div className="flex w-full max-w-[380px] flex-col gap-5 rounded-2xl border border-[#ededeb] bg-[#f6f5f4] p-8">
                        <span className="text-xs font-semibold tracking-wide text-[#2f5aa8]">준거 기준</span>
                        <div>
                            <div className="text-[1.5rem] font-bold leading-tight text-[#191918]">KS X IEC 62443-4-2</div>
                            <div className="mt-1.5 text-sm text-gray-500">산업제어시스템 보안 · 기술 보안 요구사항 (6영역 35항목)</div>
                        </div>
                        <div className="h-px w-full bg-[#e5e4e1]" />
                        <div>
                            <div className="text-[15px] font-semibold text-[#191918]">식품의약품안전처</div>
                            <div className="mt-1 text-[13px] leading-relaxed text-gray-500">「의료기기의 사이버보안 허가·심사 가이드라인」</div>
                            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#e5e4e1] bg-white px-3 py-1 text-[12px] font-medium text-gray-600">
                                안내서-0995-05 · 2025.1.10 기준
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 배경 · 왜 필요한가 (식약처 가이드라인 근거) */}
            <section className="mt-16">
                <h2 className="mb-4 text-2xl font-bold text-[#191918]">왜 사이버보안 시험성적서인가</h2>
                <ul className="max-w-[52rem] space-y-2.5 text-[15px] leading-relaxed text-gray-700 m:text-sm">
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>통신 기능이 있는 의료기기·SaMD·디지털의료기기는 허가·심사 때 <b className="text-[#191918]">사이버보안 검증 자료를 내야 한다.</b></span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>검증 기준은 <b className="text-[#191918]">KS X IEC 62443-4-2</b>의 6개 영역·35개 항목이다. (식별·인증 / 사용통제 / 무결성 / 기밀성 / 대응 / 가용성)</span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span><b className="text-[#191918]">가용성·기밀성·무결성(CIA)</b>을 <b className="text-[#191918]">ISO 14971</b> 위험관리 안에서 설계 단계부터 반영해야 한다.</span>
                    </li>
                    <li className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>결국 서류가 아니라 <b className="text-[#191918]">제품을 그렇게 설계했다는 증명</b>이고, 문서 작성과 실제 구현이 곧 그 근거가 된다.</span>
                    </li>
                </ul>
                <figure className="mt-6 max-w-[52rem] rounded-2xl bg-[#f6f5f4] p-8 m:p-6">
                    <blockquote className="text-[1.0625rem] leading-[1.8] text-gray-700 m:text-[15px]">
                        “의료기기의 해킹, 정보 유출 등 사이버보안 위협사례가 꾸준히 보고되고 있고, 이러한 위협사례는 재산적 손실뿐만 아니라 환자 생명에 직접적인 위해를 줄 수 있어 의료기기의 사이버보안에 대한 중요성이 부각되고 있다.”
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
                                                <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden>
                                                <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.6" />
                                                <path d="M10 6.3V10l2.6 1.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {c.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold" style={{ color: c.titleColor }}>{c.title}</h3>
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
