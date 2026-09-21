"use client";

import { ReactNode } from "react";
import { Connector } from "./Connector";

/** 아이콘 한 칸. 이미지(src) 또는 SVG 컴포넌트(node) 중 하나를 넣는다. */
export type FlowIcon = {
    /** 아이콘 이미지 경로 */
    src?: string;
    /** 이미지 대신 넣을 SVG 노드 */
    node?: ReactNode;
    label: string;
    sub?: string;
};

function IconBox({ item, size, color, compact = false }: { item: FlowIcon; size: number; color: string; compact?: boolean }) {
    return (
        <div className={`flex flex-col items-center text-center min-w-0 ${compact ? "gap-1" : "gap-1.5"}`}>
            <span className="flex items-center justify-center shrink-0" style={{ width: size, height: size, color }}>
                {item.src ? <img src={item.src} alt="" className="w-full h-full object-contain" /> : item.node}
            </span>
            <span className={`${compact ? "text-[10px]" : "text-[13px]"} font-bold leading-tight text-[#191918] break-keep`}>{item.label}</span>
            {item.sub && !compact && <span className="text-[11px] leading-tight text-gray-500 break-keep">{item.sub}</span>}
        </div>
    );
}

/** 화살표로 이어지는 아이콘 흐름. 요청이 지나는 경로처럼 순서가 있을 때 쓴다. */
export function IconFlow({ items, color, compact = false }: { items: FlowIcon[]; color: string; compact?: boolean }) {
    const size = compact ? 26 : 46;
    return (
        <div className={`w-full flex items-start ${compact ? "gap-1" : "gap-2 m:flex-col m:items-center"}`}>
            {items.map((it, i) => (
                <div key={it.label} className={`flex-1 flex items-center ${compact ? "gap-1" : "gap-2 m:flex-col"} min-w-0`}>
                    <div className="flex-1 w-full min-w-0">
                        <IconBox item={it} size={size} color={color} compact={compact} />
                    </div>
                    {i < items.length - 1 && <Connector compact={compact} />}
                </div>
            ))}
        </div>
    );
}

/** 화살표 없이 나열하는 아이콘 그리드. 사용 중인 서비스 목록처럼 순서가 없을 때 쓴다. */
export function IconRow({ items, color, cols = 4 }: { items: FlowIcon[]; color: string; cols?: number }) {
    return (
        <div className="w-full grid gap-y-7 gap-x-4 m:grid-cols-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {items.map((it) => (
                <IconBox key={it.label} item={it} size={44} color={color} />
            ))}
        </div>
    );
}
