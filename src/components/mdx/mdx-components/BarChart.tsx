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

    const max = Math.max(1, ...items.map((r) => r.value));

    return (
        <div className="my-2 rounded-xl border border-(--border) px-5 py-4">
            {ttl && <div className="mb-4 text-sm font-semibold text-(--text-strong)">{ttl}</div>}
            {orient === "h" ? (
                <div className="flex flex-col gap-3">
                    {items.map((r, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-24 shrink-0 truncate text-right text-xs text-(--text-muted)" title={r.label}>
                                {r.label}
                            </div>
                            <div className="flex flex-1 items-center gap-2">
                                <div
                                    className="h-5 rounded-md transition-[width] duration-300"
                                    style={{
                                        width: `${(r.value / max) * 100}%`,
                                        minWidth: 6,
                                        background: r.color || colorAt(i),
                                    }}
                                />
                                <span className="shrink-0 text-xs font-semibold text-(--text-muted)">{r.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex h-52 items-end justify-around gap-4 px-1">
                    {items.map((r, i) => (
                        <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                            <div className="text-xs font-semibold text-(--text-muted)">{r.value}</div>
                            <div
                                className="w-full max-w-[48px] rounded-t-md transition-[height] duration-300"
                                style={{
                                    height: `${(r.value / max) * 100}%`,
                                    minHeight: 4,
                                    background: r.color || colorAt(i),
                                }}
                            />
                            <div className="w-full truncate text-center text-xs text-(--text-muted)" title={r.label}>
                                {r.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
