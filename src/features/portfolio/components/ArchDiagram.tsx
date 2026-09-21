"use client";

import { CSSProperties } from "react";
import { Connector } from "./Connector";

/** 다이어그램 한 칸. tone 이 색을 결정한다. */
export type DiagramNode = {
    label: string;
    sub?: string;
    /** brand: 채움 / soft: 연한 채움 / plain: 흰 박스 / dark: 검정 / ghost: 점선 */
    tone?: "brand" | "soft" | "plain" | "dark" | "ghost";
};

/** 화살표로 이어지는 한 덩어리. 세로로 쌓인 노드 여러 개를 담는다. */
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

/** 그림 파일 없이 CSS 로 그리는 아키텍처 다이어그램. */
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
