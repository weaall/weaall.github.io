import Link from "next/link";
import { Metadata } from "next";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
    title: "의료기기 사이버보안 및 인프라",
    description: "임상시험 허가·품목 인허가·디지털의료기기 GMP를 위한 사이버보안 자체 시험성적서 작성과 인프라 설계·운영.",
    path: "/portfolio/medsec",
});

const DUTIES = [
    {
        t: "사이버보안 자체 시험성적서",
        d: "KS X IEC 62443-4-2 35개 항목(식별·인증 / 사용통제 / 무결성 / 기밀성 / 대응 / 가용성)을 제품에 매핑해 제조자 자체 시험성적서를 작성.",
    },
    {
        t: "인프라 설계·운영",
        d: "NCP NKS·GitOps(ArgoCD) 기반 배포, 관측성(Loki·Grafana·Prometheus), WAF(ModSecurity)·IDS(Falco)·이미지 다이제스트 검증.",
    },
    {
        t: "인허가 대응",
        d: "의료기기 임상시험 허가 · 품목 인허가 · 디지털의료기기 GMP(별표3)를 사이버보안 자료로 뒷받침.",
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
        logo: "/assets/portfolio/medsec/varabom-logo.png",
        logoW: "60%",
        color: "#2f5aa8",
    },
    {
        href: "/post/chiyu-forest-security",
        tag: "폐쇄망 설치형 SaMD",
        title: "치유포레스트",
        desc: "폐쇄망 범용 PC 설치형 SaMD. 인증·무결성·암호화·백업·복구를 자체 구현해 시험성적서로 갈음.",
        applied: "35개 중 27개 적용",
        status: "의료기기 변경 허가",
        done: true,
        logo: "/assets/portfolio/medsec/cheeu-logo.png",
        logoW: "66%",
        color: "#3f7d4e",
    },
    {
        href: "/post/mnai-security-test",
        tag: "클라우드 SaMD",
        title: "마인즈내비 AI",
        desc: "CSAP 네이버 클라우드 위 인프라·GitOps·관측성이 그대로 보안 요구사항의 근거가 되는 클라우드형 SaMD.",
        applied: "35개 중 32개 적용",
        status: "GMP · 임상 · 인허가 진행 중",
        done: false,
        logo: "/assets/portfolio/medsec/mindsnavi-logo.png",
        logoW: "74%",
        color: "#1a8f7a",
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
                <p className="max-w-[46rem] text-[1.15rem] leading-relaxed text-gray-600 m:text-base">
                    임상시험 허가 · 품목 인허가 · 디지털의료기기 GMP를 위한 <b className="text-[#191918]">사이버보안 자체 시험성적서</b> 작성과, 그 근거가 되는{" "}
                    <b className="text-[#191918]">인프라 설계·운영</b>을 직접 담당한 작업들입니다.
                </p>
            </header>

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

            {/* 사례 */}
            <section className="mt-20">
                <h2 className="mb-6 text-2xl font-bold text-[#191918]">사례</h2>
                <div className="grid grid-cols-2 gap-6 m:grid-cols-1">
                    {CASES.map((c) => (
                        <Link
                            key={c.href}
                            href={c.href}
                            className="group flex h-[26rem] flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-[#f6f5f4] transition-colors duration-300 hover:border-[color:var(--c)] m:h-auto"
                            style={{ ["--c" as string]: c.color }}
                        >
                            {/* 상단: 텍스트 */}
                            <div className="flex flex-col gap-2 p-8 pb-6">
                                <span className="text-sm text-gray-500">{c.tag}</span>
                                <h3 className="text-[1.75rem] font-bold leading-tight text-[#191918]" style={{ color: c.color }}>
                                    {c.title}
                                </h3>
                                <p className="text-[15px] leading-relaxed text-gray-600">{c.desc}</p>
                                {/* 상태: 무엇이 허가됐는지 + 적용 항목 수 */}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span
                                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold"
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
                                    <span className="text-[13px] text-gray-500">{c.applied}</span>
                                </div>
                            </div>
                            {/* 하단: 로고 패널 */}
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
