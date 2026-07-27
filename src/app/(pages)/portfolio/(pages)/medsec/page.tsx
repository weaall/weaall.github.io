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
            {/* 히어로 */}
            <header className="flex flex-col gap-4">
                <span className="text-sm font-medium text-[#2f5aa8]">포트폴리오 · 의료기기</span>
                <h1 className="text-[3rem] font-bold leading-tight tracking-tight text-[#191918] m:text-[2rem]">
                    의료기기 사이버보안 및 인프라 담당
                </h1>
                <p className="max-w-[48rem] text-[1.15rem] leading-relaxed text-gray-600 m:text-base">
                    서류로 채우는 사이버보안이 아니라, 제품을 실제로 그렇게 <b className="text-[#191918]">설계·구현해 증명</b>합니다.{" "}
                    KS X IEC 62443-4-2 <b className="text-[#191918]">시험성적서 작성</b>과 그 근거가 되는 <b className="text-[#191918]">시스템·인프라 구현</b>을 직접 담당해,{" "}
                    임상시험 허가 · 의료기기 변경 허가를 통과시킨 작업들입니다.
                </p>
            </header>

            {/* 배경 · 왜 필요한가 (식약처 가이드라인 근거) */}
            <section className="mt-16">
                <h2 className="mb-4 text-2xl font-bold text-[#191918]">왜 사이버보안 시험성적서인가</h2>
                <ul className="max-w-[52rem] space-y-2 text-[15px] leading-relaxed text-gray-700 m:text-sm">
                    <li className="flex gap-2">
                        <span className="text-[#2f5aa8]">·</span>
                        <span>통신 경로가 있는 의료기기 · SaMD · 디지털의료기기 → 허가·심사 시 <b className="text-[#191918]">사이버보안 검증 자료 필수</b></span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-[#2f5aa8]">·</span>
                        <span>검증 기준 <b className="text-[#191918]">KS X IEC 62443-4-2</b> · 6개 영역 35개 항목 (식별·인증 / 사용통제 / 무결성 / 기밀성 / 대응 / 가용성)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-[#2f5aa8]">·</span>
                        <span><b className="text-[#191918]">가용성·기밀성·무결성(CIA)</b> · <b className="text-[#191918]">ISO 14971</b> 위험관리 안에서 설계 단계부터 반영</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-[#2f5aa8]">·</span>
                        <span>서류가 아니라 <b className="text-[#191918]">제품을 그렇게 설계했음의 증명</b> → 문서 작성 + 실제 구현이 곧 근거</span>
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
                            {/* 상단: 조그만 마크(위로) + 이름 + 설명 + 상태 (PROVE Lite 카드 구조) */}
                            <div className="flex flex-col gap-2 p-8 pb-6">
                                <img className="mb-1 h-9 w-9 object-contain" src={c.mark} alt="" />
                                <h3 className="text-lg font-bold" style={{ color: c.titleColor }}>{c.title}</h3>
                                <p className="text-[15px] leading-relaxed text-gray-600">{c.desc}</p>
                                <span
                                    className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
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
