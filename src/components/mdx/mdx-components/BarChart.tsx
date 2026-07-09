"use client";

import React from "react";

export interface ChartRow {
    label: string;
    value: number;
}

// 막대 색상 팔레트 (테마 무관 고정색 — 라이트/다크 모두에서 잘 보이는 톤)
const BAR_COLORS = ["#4f8ff7", "#f79f4f", "#5fc98b", "#c98be0", "#f7677a", "#5fc9c9", "#f7c94f", "#8b9bf7"];

function normalizeRows(rows: ChartRow[]): ChartRow[] {
    return rows
        .filter((r) => r && (r.label !== "" || r.value !== undefined))
        .map((r) => ({ label: String(r.label ?? ""), value: Number(r.value) || 0 }));
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
        <div className="my-2 rounded-lg border border-(--border) bg-(--panel-bg) p-4">
            {ttl && <div className="mb-3 text-sm font-semibold text-(--text-strong)">{ttl}</div>}
            {orient === "h" ? (
                <div className="flex flex-col gap-2">
                    {items.map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-24 shrink-0 truncate text-right text-xs text-(--text-muted)" title={r.label}>
                                {r.label}
                            </div>
                            <div className="relative h-6 flex-1 overflow-hidden rounded bg-(--hover-bg)">
                                <div
                                    className="flex h-full items-center justify-end rounded px-2 text-xs font-medium text-white"
                                    style={{
                                        width: `${(r.value / max) * 100}%`,
                                        minWidth: 28,
                                        background: BAR_COLORS[i % BAR_COLORS.length],
                                    }}
                                >
                                    {r.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex h-52 items-end justify-around gap-3 px-2">
                    {items.map((r, i) => (
                        <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                            <div className="text-xs font-medium text-(--text-muted)">{r.value}</div>
                            <div
                                className="w-full max-w-[52px] rounded-t"
                                style={{
                                    height: `${(r.value / max) * 100}%`,
                                    minHeight: 4,
                                    background: BAR_COLORS[i % BAR_COLORS.length],
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
