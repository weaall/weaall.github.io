"use client";

import React from "react";

export interface ChartRow {
    label: string;
    value: number;
    color?: string; // 지정 안 하면 인덱스 순서대로 팔레트 색이 배정됨
}

export type ChartType = "barV" | "barH" | "line" | "area" | "donut";

// 막대/라인/도넛 색상 팔레트 (노션풍 부드러운 톤).
export const CHART_COLORS = ["#8b5cf6", "#38bdf8", "#c0f23c", "#f472b6", "#fb923c", "#f87171", "#facc15", "#34d399"];
export const colorAt = (i: number) => CHART_COLORS[((i % CHART_COLORS.length) + CHART_COLORS.length) % CHART_COLORS.length];

// 색 → 부드러운 그라데이션 배경
const grad = (c: string, deg = 180) => `linear-gradient(${deg}deg, ${c} 0%, ${c}cc 100%)`;
// 연한 라벤더(기본 세로막대용)
const SOFT = "linear-gradient(180deg, #efeafe 0%, #e2d8fb 100%)";

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

/* ── 가로 막대 (알약형 + 트랙) ─────────────── */
function BarsH({ items }: { items: ChartRow[] }) {
    const max = Math.max(1, ...items.map((r) => r.value));
    const LABEL_W = 80;
    return (
        <div className="flex flex-col gap-3.5">
            {items.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="shrink-0 truncate text-right text-xs text-(--text-muted)" style={{ width: LABEL_W }} title={r.label}>
                        {r.label}
                    </div>
                    {/* 트랙 */}
                    <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-(--hover-bg)">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
                            style={{ width: `${(r.value / max) * 100}%`, minWidth: 10, background: r.color ? grad(r.color, 90) : "linear-gradient(90deg,#a78bfa,#7c3aed)" }}
                        />
                    </div>
                    <div className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-(--text)">{r.value}</div>
                </div>
            ))}
        </div>
    );
}

/* ── 세로 막대 (라운드 + 최댓값 강조) ───────── */
function BarsV({ items }: { items: ChartRow[] }) {
    const max = Math.max(1, ...items.map((r) => r.value));
    const maxIdx = items.reduce((m, r, i) => (r.value > items[m].value ? i : m), 0);
    return (
        <div className="flex h-56 items-end justify-around gap-3">
            {items.map((r, i) => {
                const isMax = i === maxIdx && !r.color;
                const bg = r.color ? grad(r.color) : isMax ? "linear-gradient(180deg,#8b5cf6,#7c3aed)" : SOFT;
                return (
                    <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                        <span className={`text-sm font-semibold tabular-nums ${isMax ? "text-(--text)" : "text-(--text-muted)"}`}>{r.value}</span>
                        <div className="w-full max-w-[56px] rounded-[14px] transition-[height] duration-300" style={{ height: `${(r.value / max) * 100}%`, minHeight: 10, background: bg }} />
                        <span className={`min-w-0 max-w-full truncate rounded-md px-2 text-xs ${isMax ? "bg-(--text) py-0.5 text-(--page-bg)" : "text-(--text-muted)"}`} title={r.label}>
                            {r.label}
                        </span>
                    </div>
                );
            })}
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
    const R = 62;
    const SW = 20;
    const C = 2 * Math.PI * R;
    const GAP = items.length > 1 ? 7 : 0; // 세그먼트 사이 간격(px)
    let offset = 0;
    const segs = items.map((r, i) => {
        const frac = Math.max(0, r.value) / total;
        const len = Math.max(0, frac * C - GAP);
        const seg = { color: r.color || colorAt(i), len, offset, pct: Math.round(frac * 100) };
        offset += frac * C;
        return seg;
    });
    return (
        <div className="flex flex-wrap items-center gap-6">
            <svg width="164" height="164" viewBox="0 0 164 164" className="shrink-0">
                <g transform="rotate(-90 82 82)">
                    <circle cx="82" cy="82" r={R} fill="none" stroke="var(--hover-bg)" strokeWidth={SW} />
                    {segs.map((s, i) => (
                        <circle
                            key={i}
                            cx="82"
                            cy="82"
                            r={R}
                            fill="none"
                            stroke={s.color}
                            strokeWidth={SW}
                            strokeDasharray={`${s.len} ${C - s.len}`}
                            strokeDashoffset={-(s.offset + GAP / 2)}
                            strokeLinecap="round"
                        />
                    ))}
                </g>
                <text x="82" y="78" textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--text-strong)">
                    {total}
                </text>
                <text x="82" y="96" textAnchor="middle" fontSize="10" fill="var(--text-muted)">
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
