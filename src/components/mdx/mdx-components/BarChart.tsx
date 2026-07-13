"use client";

import React from "react";

export interface ChartRow {
    label: string;
    value: number;
    color?: string; // 지정 안 하면 인덱스 순서대로 팔레트 색이 배정됨
}

// 막대 색상 팔레트 (에디터 텍스트 색상과 같은 톤의 부드러운 노션풍 색).
// 항목이 추가되면 순서대로 배정되고, 색을 다 쓰면 다시 1번째 색부터 순환한다.
export const CHART_COLORS = ["#8ecae6", "#ffb86b", "#b6e3b6", "#cbb7f0", "#f7b7d7", "#ff7b7b", "#ffe066", "#e9bfa8"];
export const colorAt = (i: number) => CHART_COLORS[((i % CHART_COLORS.length) + CHART_COLORS.length) % CHART_COLORS.length];

function normalizeRows(rows: ChartRow[]): ChartRow[] {
    return rows
        .filter((r) => r && (r.label !== "" || r.value !== undefined))
        .map((r) => ({ label: String(r.label ?? ""), value: Number(r.value) || 0, ...(r.color ? { color: r.color } : {}) }));
}

// 데이터 최댓값을 보고 "예쁜" 축 최댓값과 눈금(기준선) 배열을 자동으로 계산한다.
function niceScale(maxValue: number, tickCount = 4): { niceMax: number; ticks: number[] } {
    if (!(maxValue > 0)) return { niceMax: 1, ticks: [0, 1] };
    const rawStep = maxValue / tickCount;
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const norm = rawStep / mag;
    const niceStep = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
    const niceMax = Math.ceil(maxValue / niceStep) * niceStep;
    const ticks: number[] = [];
    for (let v = 0; v <= niceMax + niceStep * 1e-6; v += niceStep) ticks.push(Math.round(v * 1e6) / 1e6);
    return { niceMax, ticks };
}

interface BarChartProps {
    orient?: "h" | "v";
    /** 포스트(MDX)에서는 encodeURIComponent(JSON.stringify({title, rows))) 문자열로 전달 */
    data?: string;
    /** 에디터에서는 배열을 직접 전달 */
    rows?: ChartRow[];
    title?: string;
}

// 가로/세로 막대그래프. 각 값은 최댓값 대비 상대 비율로 그린다.
// 에디터(rows 배열)와 포스트(data 인코딩 문자열) 양쪽에서 동일하게 렌더 → WYSIWYG.
export default function BarChart({ orient = "h", data, rows, title }: BarChartProps) {
    let items: ChartRow[] = [];
    let ttl = title ?? "";
    if (data) {
        try {
            const parsed = JSON.parse(decodeURIComponent(data));
            items = normalizeRows(parsed.rows ?? []);
            ttl = parsed.title ?? ttl;
        } catch {
            items = [];
        }
    } else if (rows) {
        items = normalizeRows(rows);
    }

    if (items.length === 0) {
        return (
            <div className="my-2 rounded-lg border border-(--border) px-4 py-6 text-center text-sm text-(--text-muted)">
                데이터 없음
            </div>
        );
    }

    const max = Math.max(0, ...items.map((r) => r.value));
    const { niceMax, ticks } = niceScale(max);
    const LABEL_W = 96; // 가로형 항목 라벨 폭(px)

    return (
        <div className="my-2 rounded-xl border border-(--border) px-5 py-4">
            {ttl && <div className="mb-4 text-sm font-semibold text-(--text-strong)">{ttl}</div>}
            {orient === "h" ? (
                <div className="relative">
                    {/* 세로 기준선 (막대 영역에만) */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex justify-between" style={{ left: LABEL_W + 12 }}>
                        {ticks.map((_, i) => (
                            <div key={i} className="w-px bg-(--border)" />
                        ))}
                    </div>
                    {/* 막대들 */}
                    <div className="relative flex flex-col gap-3">
                        {items.map((r, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="shrink-0 truncate text-right text-xs text-(--text-muted)" style={{ width: LABEL_W }} title={r.label}>
                                    {r.label}
                                </div>
                                <div className="relative flex-1">
                                    <div
                                        className="flex h-5 items-center rounded-md transition-[width] duration-300"
                                        style={{ width: `${(r.value / niceMax) * 100}%`, minWidth: 2, background: r.color || colorAt(i) }}
                                    />
                                    <span
                                        className="absolute top-1/2 -translate-y-1/2 pl-1.5 text-xs font-semibold text-(--text-muted)"
                                        style={{ left: `${(r.value / niceMax) * 100}%` }}
                                    >
                                        {r.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* x축 눈금 */}
                    <div className="mt-2 flex justify-between text-[10px] tabular-nums text-(--text-faint)" style={{ marginLeft: LABEL_W + 12 }}>
                        {ticks.map((t, i) => (
                            <span key={i}>{t}</span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex gap-2">
                    {/* y축 눈금 */}
                    <div className="relative h-52 w-7 shrink-0">
                        {ticks.map((t, i) => (
                            <span
                                key={i}
                                className="absolute right-0 -translate-y-1/2 text-[10px] tabular-nums text-(--text-faint)"
                                style={{ bottom: `${(t / niceMax) * 100}%` }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    <div className="relative flex-1">
                        {/* 가로 기준선 */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-52">
                            {ticks.map((t, i) => (
                                <div key={i} className="absolute inset-x-0 border-t border-(--border)" style={{ bottom: `${(t / niceMax) * 100}%` }} />
                            ))}
                        </div>
                        {/* 막대들 */}
                        <div className="relative flex h-52 items-end justify-around gap-4 px-1">
                            {items.map((r, i) => (
                                <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                                    <div className="text-xs font-semibold text-(--text-muted)">{r.value}</div>
                                    <div
                                        className="w-full max-w-[48px] rounded-t-md transition-[height] duration-300"
                                        style={{ height: `${(r.value / niceMax) * 100}%`, minHeight: 2, background: r.color || colorAt(i) }}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* x축 라벨 */}
                        <div className="flex justify-around gap-4 px-1 pt-1.5">
                            {items.map((r, i) => (
                                <div key={i} className="min-w-0 flex-1 truncate text-center text-xs text-(--text-muted)" title={r.label}>
                                    {r.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
