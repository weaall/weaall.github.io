"use client";

import { CSSProperties, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  공통 타이포                                                         */
/* ------------------------------------------------------------------ */

export function SectionTitle({ children, center = false, className = "" }: { children: ReactNode; center?: boolean; className?: string }) {
    return (
        <h2
            className={`text-[2.625rem] text-[#191918] font-bold tracking-[-0.09375rem] pb-4 m:text-[1.9rem] break-keep ${
                center ? "text-center" : "text-left"
            } ${className}`}
        >
            {children}
        </h2>
    );
}

/* ------------------------------------------------------------------ */
/*  프로젝트 오버뷰 카드 (PROVE Lite 카드와 동일한 레이아웃)             */
/* ------------------------------------------------------------------ */

type IconComponent = (props: { color?: string; width?: string; height?: string }) => ReactNode;

export function OverviewCard({
    icon: Icon,
    color,
    title,
    description,
    preview,
    onClick,
}: {
    icon: IconComponent;
    color: string;
    title: string;
    description: string;
    preview: ReactNode;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="h-[22rem] bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden cursor-pointer group"
        >
            <div className="w-full h-1/2 flex flex-col p-8">
                <div className="w-8 h-8 mb-2">
                    <Icon color={color} />
                </div>
                <h3 className="text-lg font-bold mb-1 text-[#191918]">{title}</h3>
                <p className="text-[#191918] text-base break-keep">{description}</p>
            </div>
            <div className="pl-8 w-full h-1/2 overflow-hidden">
                <div className="w-full h-full rounded-tl-xl border-2 border-[#ededeb] bg-white shadow-lg transition-transform duration-300 group-hover:scale-110 origin-top-left overflow-hidden p-5 flex items-start">
                    {preview}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Task 카드                                                           */
/* ------------------------------------------------------------------ */

export function TaskCard({
    index,
    title,
    bullets,
    color = "#0075de",
    className = "",
    children,
}: {
    index: number;
    title: ReactNode;
    bullets?: string[];
    color?: string;
    className?: string;
    children?: ReactNode;
}) {
    return (
        <div className={`bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden p-8 ${className}`}>
            <p className="text-sm font-medium" style={{ color }}>
                Task {index}.
            </p>
            <h3 className="text-lg font-bold text-[#191918] leading-tight break-keep">{title}</h3>
            {bullets && (
                <ul className="text-[#191918] text-base list-disc pl-5 space-y-1 mt-2 break-keep">
                    {bullets.map((b) => (
                        <li key={b}>{b}</li>
                    ))}
                </ul>
            )}
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  핵심 수치 그리드                                                    */
/* ------------------------------------------------------------------ */

export function FactGrid({ facts, color }: { facts: { value: string; label: string }[]; color: string }) {
    return (
        <div className="grid gap-4 grid-cols-4 m:grid-cols-2">
            {facts.map((f) => (
                <div key={f.label} className="bg-[#f6f5f4] rounded-2xl p-6 flex flex-col gap-1">
                    <span className="text-[1.75rem] font-bold tracking-tight leading-none break-keep" style={{ color }}>
                        {f.value}
                    </span>
                    <span className="text-sm text-gray-600 break-keep">{f.label}</span>
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  아키텍처 다이어그램 (CSS 기반)                                       */
/* ------------------------------------------------------------------ */

export type DiagramNode = {
    label: string;
    sub?: string;
    /** brand: 채움 / soft: 연한 채움 / plain: 흰 박스 / dark: 검정 / ghost: 점선 */
    tone?: "brand" | "soft" | "plain" | "dark" | "ghost";
};

export type DiagramGroup = {
    title?: string;
    nodes: DiagramNode[];
    /** 노드 배치 방향 (기본 세로) */
    direction?: "col" | "row";
    /** 그룹을 점선 컨테이너로 감싸는지 */
    boxed?: boolean;
    /** 그룹 상대 폭 (flex-grow) */
    grow?: number;
};

function ArrowRight({ color }: { color: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 10h13M11 5l5 5-5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ArrowDown({ color }: { color: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M10 3v13M5 11l5 5 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function Connector({ compact }: { compact: boolean }) {
    return (
        <>
            <div className={`shrink-0 ${compact ? "" : "m:hidden"}`}>
                <ArrowRight color="#9c9994" />
            </div>
            {!compact && (
                <div className="hidden m:block shrink-0">
                    <ArrowDown color="#9c9994" />
                </div>
            )}
        </>
    );
}

export function DiagramNodeBox({ node, color, compact = false }: { node: DiagramNode; color: string; compact?: boolean }) {
    const tone = node.tone ?? "plain";
    const base = compact ? "rounded-md px-2 py-1 text-[10px] leading-tight" : "rounded-xl px-3.5 py-2.5 text-[13px] leading-snug";
    const style: Record<string, CSSProperties> = {
        brand: { background: color, color: "#fff" },
        soft: {
            background: `color-mix(in srgb, ${color} 12%, #fff)`,
            color,
            border: `1px solid color-mix(in srgb, ${color} 25%, #fff)`,
        },
        plain: { background: "#fff", color: "#191918", border: "1px solid #e5e3e0" },
        dark: { background: "#191918", color: "#fff" },
        ghost: { background: "transparent", color: "#6b6a67", border: "1px dashed #c9c6c1" },
    };
    return (
        <div className={`${base} font-semibold text-center break-keep flex flex-col items-center justify-center min-w-0`} style={style[tone]}>
            <span>{node.label}</span>
            {node.sub && !compact && <span className="font-normal opacity-80 text-[11px] leading-tight mt-0.5">{node.sub}</span>}
        </div>
    );
}

export function ArchDiagram({
    groups,
    color,
    compact = false,
    className = "",
}: {
    groups: DiagramGroup[];
    color: string;
    compact?: boolean;
    className?: string;
}) {
    const gap = compact ? "gap-1.5" : "gap-3";
    return (
        <div className={`w-full flex items-stretch ${gap} ${compact ? "" : "m:flex-col"} ${className}`}>
            {groups.map((g, i) => {
                const dir = g.direction ?? "col";
                const inner = (
                    <div className={`flex ${dir === "col" ? "flex-col" : "flex-row flex-wrap"} ${gap} justify-center h-full`}>
                        {g.nodes.map((n, j) => (
                            <DiagramNodeBox key={`${n.label}-${j}`} node={n} color={color} compact={compact} />
                        ))}
                    </div>
                );
                return (
                    <div key={i} className={`flex items-center ${gap} ${compact ? "" : "m:flex-col"} min-w-0`} style={{ flex: g.grow ?? 1 }}>
                        <div className="flex flex-col w-full min-w-0 h-full">
                            {g.title && (
                                <p className={`${compact ? "text-[9px] mb-1" : "text-[11px] mb-2"} font-semibold uppercase tracking-wide text-gray-400 text-center`}>
                                    {g.title}
                                </p>
                            )}
                            {g.boxed ? (
                                <div
                                    className={`${
                                        compact ? "rounded-lg p-1.5" : "rounded-2xl p-3"
                                    } border border-dashed border-[#d6d3ce] h-full flex flex-col justify-center`}
                                >
                                    {inner}
                                </div>
                            ) : (
                                inner
                            )}
                        </div>
                        {i < groups.length - 1 && <Connector compact={compact} />}
                    </div>
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  단계형 플로우 (번호 + 라벨)                                         */
/* ------------------------------------------------------------------ */

export function StepFlow({ steps, color, compact = false }: { steps: { label: string; sub?: string }[]; color: string; compact?: boolean }) {
    return (
        <ol className={`w-full flex ${compact ? "gap-1" : "gap-2 m:flex-col"} items-stretch`}>
            {steps.map((s, i) => (
                <li key={s.label} className={`flex-1 flex items-center ${compact ? "gap-1" : "gap-2 m:flex-col"} min-w-0`}>
                    <div
                        className={`flex-1 w-full h-full flex flex-col items-center justify-center text-center break-keep ${
                            compact ? "rounded-md px-1.5 py-1" : "rounded-xl px-3 py-4"
                        } bg-white border border-[#e5e3e0]`}
                    >
                        <span
                            className={`${
                                compact ? "w-4 h-4 text-[9px] mb-0.5" : "w-7 h-7 text-xs mb-2"
                            } rounded-full text-white font-bold flex items-center justify-center shrink-0`}
                            style={{ background: color }}
                        >
                            {i + 1}
                        </span>
                        <span className={`${compact ? "text-[10px]" : "text-[13px]"} font-semibold text-[#191918] leading-tight`}>{s.label}</span>
                        {s.sub && !compact && <span className="text-[11px] text-gray-500 leading-tight mt-1">{s.sub}</span>}
                    </div>
                    {i < steps.length - 1 && <Connector compact={compact} />}
                </li>
            ))}
        </ol>
    );
}

/* ------------------------------------------------------------------ */
/*  화이트 패널 (다이어그램 감싸기)                                      */
/* ------------------------------------------------------------------ */

export function DiagramPanel({ title, children, className = "" }: { title?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <div className={`w-full bg-[#f6f5f4] rounded-2xl flex flex-col border-2 border-transparent overflow-hidden ${className}`}>
            {title && (
                <div className="w-full flex flex-col p-8 pb-4">
                    <h3 className="text-lg font-bold text-[#191918] break-keep">{title}</h3>
                </div>
            )}
            <div className={`px-8 pb-8 w-full ${title ? "" : "pt-8"}`}>
                <div className="w-full rounded-xl bg-white shadow-lg p-6 border-2 border-[#ededeb] m:p-4">{children}</div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  링크 카드 (관련 글)                                                 */
/* ------------------------------------------------------------------ */

export function LinkCard({ href, tag, title, desc, color }: { href: string; tag: string; title: string; desc: string; color: string }) {
    return (
        <a
            href={href}
            className="group flex flex-col gap-2 rounded-2xl bg-[#f6f5f4] p-7 border-2 border-transparent transition-colors duration-300 hover:border-[color:var(--c)]"
            style={{ ["--c" as string]: color }}
        >
            <span className="text-xs font-semibold" style={{ color }}>
                {tag}
            </span>
            <h3 className="text-lg font-bold text-[#191918] break-keep">{title}</h3>
            <p className="text-[15px] leading-relaxed text-gray-600 break-keep">{desc}</p>
            <span className="mt-auto pt-2 text-sm font-medium group-hover:font-bold transition-all" style={{ color }}>
                자세히 보기 →
            </span>
        </a>
    );
}

/* ------------------------------------------------------------------ */
/*  체크리스트 카드 (보안 구현 항목 등)                                  */
/* ------------------------------------------------------------------ */

export function CheckList({ items, color }: { items: { t: string; d: string }[]; color: string }) {
    return (
        <ul className="grid grid-cols-2 gap-3 m:grid-cols-1">
            {items.map((it) => (
                <li key={it.t} className="flex gap-3 rounded-xl bg-white border border-[#e5e3e0] p-4">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 14%, #fff)` }}>
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden>
                            <path d="M4 10.5l4 4 8-9" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[14px] font-bold text-[#191918] break-keep">{it.t}</span>
                        <span className="text-[13px] text-gray-600 leading-relaxed break-keep">{it.d}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}
