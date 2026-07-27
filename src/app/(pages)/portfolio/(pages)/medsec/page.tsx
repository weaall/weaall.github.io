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
        desc: "폐쇄망 PC 설치형 SaMD. 인증·감사로그(varabom_log)·암호화·업데이트 절차를 설계 단계부터 구현해 임상시험 허가까지 완료.",
        result: "임상시험 허가 · 성공",
        success: true,
        color: "#2f5aa8",
    },
    {
        href: "/post/chiyu-forest-security",
        tag: "폐쇄망 설치형 SaMD",
        title: "치유포레스트",
        desc: "폐쇄망 범용 PC 설치형 SaMD. 인증·무결성·암호화·백업·복구를 자체 구현해 의료기기 변경 허가까지 완료. 35개 항목 중 27개 적용.",
        result: "변경 허가 · 성공",
        success: true,
        color: "#3f7d4e",
    },
    {
        href: "/post/mnai-security-test",
        tag: "클라우드 SaMD",
        title: "마인즈내비 AI",
        desc: "CSAP 네이버 클라우드 위 인프라·GitOps·관측성이 그대로 보안 요구사항의 근거. 35개 항목 중 32개 적용. GMP·임상·인허가 진행.",
        result: "GMP · 임상 · 인허가 진행",
        success: false,
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
                            className="group flex min-h-[15rem] flex-col gap-3 rounded-2xl border border-[#ededeb] bg-white p-9 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg m:min-h-0 m:p-7"
                        >
                            <span className="text-sm text-gray-500">{c.tag}</span>
                            <h3 className="text-[2rem] font-bold leading-tight text-[#191918] transition-colors m:text-2xl" style={{ color: c.color }}>
                                {c.title}
                            </h3>
                            <p className="text-base leading-relaxed text-gray-600">{c.desc}</p>
                            <span
                                className="mt-auto flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-white"
                                style={{ background: c.success ? "#3f7d4e" : c.color }}
                            >
                                {c.success && (
                                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 10.5l4 4 8-9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                {c.result}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
