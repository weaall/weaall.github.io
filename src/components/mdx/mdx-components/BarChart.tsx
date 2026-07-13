"use client";

import React from "react";

export interface ChartRow {
    label: string;
    value: number;
    color?: string; // 지정 안 하면 인덱스 순서대로 팔레트 색이 배정됨
}

export type ChartType = "barV" | "barH" | "line" | "area" | "donut";

// 막대/라인/도넛 색상 팔레트 (노션풍 부드러운 톤).
export const CHART_COLORS = ["#8b5cf6", "#38bdf8", "#a3e635", "#f472b6", "#fb923c", "#f87171", "#facc15", "#34d399"];
export const colorAt = (i: number) => CHART_COLORS[((i % CHART_COLORS.length) + CHART_COLORS.length) % CHART_COLORS.length];

function normalizeRows(rows: ChartRow[]): ChartRow[] {
    return rows
        .filter((r) => r && (r.label !== "" || r.value !== undefined))
        .map((r) => ({ label: String(r.label ?? ""), value: Number(r.value) || 0, ...(r.color ? { color: r.color } : {}) }));
}

// 데이터 최댓값을 보고 "예쁜" 축 최댓값과 눈금(기준선) 배열을 자동 계산.
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

// 부드러운 곡선 path (Catmull-Rom → 베지어)
function smoothPath(pts: { x: number; y: number }[]): string {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    return d;
}

interface BarChartProps {
    type?: ChartType;
    orient?: "h" | "v"; // 구버전 하위호환
    /** 포스트(MDX)에서는 encodeURIComponent(JSON.stringify({type, title, rows})) 문자열로 전달 */
    data?: string;
    /** 에디터에서는 배열을 직접 전달 */
    rows?: ChartRow[];
    title?: string;
}

export default function BarChart({ type, orient, data, rows, title }: BarChartProps) {
    let items: ChartRow[] = [];
    let ttl = title ?? "";
    let resolvedType: ChartType | undefined = type;
    if (data) {
        try {
            const parsed = JSON.parse(decodeURIComponent(data));
            items = normalizeRows(parsed.rows ?? []);
            ttl = parsed.title ?? ttl;
            if (parsed.type) resolvedType = parsed.type;
        } catch {
            items = [];
        }
    } else if (rows) {
        items = normalizeRows(rows);
    }
    // 타입 결정: 명시 → data.type → orient(구버전) → 기본 barV
    const chartType: ChartType = resolvedType || (orient === "h" ? "barH" : orient === "v" ? "barV" : "barV");

    if (items.length === 0) {
        return <div className="my-2 rounded-lg border border-(--border) px-4 py-6 text-center text-sm text-(--text-muted)">데이터 없음</div>;
    }

    return (
        <div className="my-2 rounded-xl border border-(--border) px-5 py-4">
            {ttl && <div className="mb-4 text-sm font-semibold text-(--text-strong)">{ttl}</div>}
            {chartType === "barH" && <BarsH items={items} />}
            {chartType === "barV" && <BarsV items={items} />}
            {(chartType === "line" || chartType === "area") && <LineArea items={items} area={chartType === "area"} />}
            {chartType === "donut" && <Donut items={items} />}
        </div>
    );
}

/* ── 가로 막대 ───────────────────────────── */
function BarsH({ items }: { items: ChartRow[] }) {
    const { niceMax, ticks } = niceScale(Math.max(0, ...items.map((r) => r.value)));
    const LABEL_W = 96;
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex justify-between" style={{ left: LABEL_W + 12 }}>
                {ticks.map((_, i) => (
                    <div key={i} className="w-px bg-(--border)" />
                ))}
            </div>
            <div className="relative flex flex-col gap-3">
                {items.map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="shrink-0 truncate text-right text-xs text-(--text-muted)" style={{ width: LABEL_W }} title={r.label}>
                            {r.label}
                        </div>
                        <div className="relative flex-1">
                            <div
                                className="h-5 rounded-md transition-[width] duration-300"
                                style={{ width: `${(r.value / niceMax) * 100}%`, minWidth: 2, background: r.color || colorAt(i) }}
                            />
                            <span className="absolute top-1/2 -translate-y-1/2 pl-1.5 text-xs font-semibold text-(--text-muted)" style={{ left: `${(r.value / niceMax) * 100}%` }}>
                                {r.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] tabular-nums text-(--text-faint)" style={{ marginLeft: LABEL_W + 12 }}>
                {ticks.map((t, i) => (
                    <span key={i}>{t}</span>
                ))}
            </div>
        </div>
    );
}

/* ── 세로 막대 ───────────────────────────── */
function BarsV({ items }: { items: ChartRow[] }) {
    const { niceMax, ticks } = niceScale(Math.max(0, ...items.map((r) => r.value)));
    return (
        <div className="flex gap-2">
            <div className="relative h-52 w-7 shrink-0">
                {ticks.map((t, i) => (
                    <span key={i} className="absolute right-0 -translate-y-1/2 text-[10px] tabular-nums text-(--text-faint)" style={{ bottom: `${(t / niceMax) * 100}%` }}>
                        {t}
                    </span>
                ))}
            </div>
            <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-52">
                    {ticks.map((t, i) => (
                        <div key={i} className="absolute inset-x-0 border-t border-(--border)" style={{ bottom: `${(t / niceMax) * 100}%` }} />
                    ))}
                </div>
                <div className="relative flex h-52 items-end justify-around gap-4 px-1">
                    {items.map((r, i) => (
                        <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                            <div className="text-xs font-semibold text-(--text-muted)">{r.value}</div>
                            <div className="w-full max-w-[48px] rounded-t-md transition-[height] duration-300" style={{ height: `${(r.value / niceMax) * 100}%`, minHeight: 2, background: r.color || colorAt(i) }} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-around gap-4 px-1 pt-1.5">
                    {items.map((r, i) => (
                        <div key={i} className="min-w-0 flex-1 truncate text-center text-xs text-(--text-muted)" title={r.label}>
                            {r.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── 라인 / 영역 (부드러운 곡선) ──────────── */
function LineArea({ items, area }: { items: ChartRow[]; area: boolean }) {
    const W = 600;
    const H = 200;
    const padL = 34;
    const padB = 22;
    const padT = 10;
    const padR = 10;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const { niceMax, ticks } = niceScale(Math.max(0, ...items.map((r) => r.value)));
    const n = items.length;
    const stroke = items[0]?.color || colorAt(0);
    const pts = items.map((r, i) => ({
        x: padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW),
        y: padT + plotH - (r.value / niceMax) * plotH,
    }));
    const line = smoothPath(pts);
    const areaPath = area && pts.length ? `${line} L ${pts[pts.length - 1].x} ${padT + plotH} L ${pts[0].x} ${padT + plotH} Z` : "";
    const gid = `area-${stroke.replace("#", "")}`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }} preserveAspectRatio="none">
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={stroke} stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* 가로 기준선 + y 눈금 */}
            {ticks.map((t, i) => {
                const y = padT + plotH - (t / niceMax) * plotH;
                return (
                    <g key={i}>
                        <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--border)" strokeWidth="1" />
                        <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="10" fill="var(--text-faint)">
                            {t}
                        </text>
                    </g>
                );
            })}
            {area && <path d={areaPath} fill={`url(#${gid})`} />}
            <path d={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fff" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            ))}
            {/* x 라벨 */}
            {items.map((r, i) => (
                <text key={i} x={pts[i].x} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--text-muted)">
                    {r.label}
                </text>
            ))}
        </svg>
    );
}

/* ── 도넛 ────────────────────────────────── */
function Donut({ items }: { items: ChartRow[] }) {
    const total = items.reduce((s, r) => s + Math.max(0, r.value), 0) || 1;
    const R = 60;
    const SW = 22;
    const C = 2 * Math.PI * R;
    let offset = 0;
    const segs = items.map((r, i) => {
        const frac = Math.max(0, r.value) / total;
        const seg = { color: r.color || colorAt(i), dash: frac * C, offset, pct: Math.round(frac * 100) };
        offset += frac * C;
        return seg;
    });
    return (
        <div className="flex flex-wrap items-center gap-6">
            <svg width="160" height="160" viewBox="0 0 160 160" className="shrink-0">
                <g transform="rotate(-90 80 80)">
                    <circle cx="80" cy="80" r={R} fill="none" stroke="var(--border)" strokeWidth={SW} />
                    {segs.map((s, i) => (
                        <circle
                            key={i}
                            cx="80"
                            cy="80"
                            r={R}
                            fill="none"
                            stroke={s.color}
                            strokeWidth={SW}
                            strokeDasharray={`${s.dash} ${C - s.dash}`}
                            strokeDashoffset={-s.offset}
                            strokeLinecap="butt"
                        />
                    ))}
                </g>
                <text x="80" y="76" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text-strong)">
                    {total}
                </text>
                <text x="80" y="94" textAnchor="middle" fontSize="10" fill="var(--text-muted)">
                    Total
                </text>
            </svg>
            <div className="flex flex-col gap-1.5">
                {items.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-(--text-muted)">
                        <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: r.color || colorAt(i) }} />
                        <span className="truncate">{r.label || "-"}</span>
                        <span className="ml-1 font-semibold text-(--text)">{segs[i].pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
