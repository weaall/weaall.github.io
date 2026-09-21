"use client";

import { Connector } from "./Connector";

/** 번호가 붙는 단계 흐름. 배포 파이프라인이나 서비스 순서를 보일 때 쓴다. */
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
