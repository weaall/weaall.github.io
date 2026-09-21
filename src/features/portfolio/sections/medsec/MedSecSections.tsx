import { CASES, DUTIES, GUIDELINE } from "./content";

/** 사이버보안이 설계 단계에서 결정된다는 배경 + 식약처 인용 */
function WhySection() {
    const bullets = [
        <>
            의료기기가 통신·네트워크로 연결되면서, <b className="text-[#191918]">해킹·정보 유출이 곧 환자 안전 문제</b>가 됐다.
        </>,
        <>
            보안은 나중에 붙이는 기능이 아니다. 인증·데이터·로그 <b className="text-[#191918]">설계 단계부터</b> 녹여야 실제로 지켜진다.
        </>,
        <>
            검증은 국제표준 <b className="text-[#191918]">KS X IEC 62443-4-2</b>(6개 영역 35개 항목)를 기준으로 한다.
        </>,
    ];
    return (
        <section className="mt-16">
            <h2 className="mb-6 text-[2.625rem] font-bold tracking-[-0.09375rem] text-[#191918] m:text-[2rem]">사이버보안은 설계에서 결정된다</h2>
            <ul className="max-w-[52rem] space-y-2.5 text-[15px] leading-relaxed text-gray-700 m:text-sm">
                {bullets.map((b, i) => (
                    <li key={i} className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5aa8]" />
                        <span>{b}</span>
                    </li>
                ))}
            </ul>
            <figure className="mt-6 w-full rounded-2xl bg-[#f6f5f4] p-8 m:p-6">
                <blockquote className="text-[1.0625rem] leading-[1.8] text-gray-700 m:text-[15px]">“{GUIDELINE.quote}”</blockquote>
                <figcaption className="mt-4 text-[13px] text-gray-500">{GUIDELINE.source}</figcaption>
            </figure>
        </section>
    );
}

/** 담당 영역 6칸 */
function DutySection() {
    return (
        <section className="mt-20">
            <h2 className="mb-6 text-[2.625rem] font-bold tracking-[-0.09375rem] text-[#191918] m:text-[2rem]">담당 영역</h2>
            <div className="grid grid-cols-3 gap-5 m:grid-cols-1">
                {DUTIES.map((x, i) => (
                    <div key={x.t} className="flex flex-col gap-2 rounded-2xl bg-[#f6f5f4] p-7">
                        <span className="text-3xl font-bold text-[#2f5aa8]/30">{String(i + 1).padStart(2, "0")}</span>
                        <h3 className="text-lg font-bold text-[#191918]">{x.t}</h3>
                        <p className="text-[15px] leading-relaxed text-gray-600">{x.d}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function DoneMark() {
    return (
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function OngoingMark() {
    return (
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 6.3V10l2.6 1.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** 관련 프로젝트 카드 3개 */
function CaseSection() {
    return (
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
                                    {c.done ? <DoneMark /> : <OngoingMark />}
                                    {c.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold" style={{ color: c.titleColor }}>
                                {c.title}
                            </h3>
                            <p className="text-[15px] leading-relaxed text-gray-600">{c.desc}</p>
                        </div>
                        <div className="mt-auto w-full flex-1 overflow-hidden pl-8">
                            <div className="flex h-full w-full items-center justify-center rounded-tl-xl border-2 border-[#ededeb] bg-white shadow-lg transition-transform duration-300 group-hover:scale-105 origin-top-left">
                                <img className="object-contain" style={{ width: c.logoW }} src={c.logo} alt={c.title} />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

export function MedSecSections() {
    return (
        <>
            <WhySection />
            <DutySection />
            <CaseSection />
        </>
    );
}
