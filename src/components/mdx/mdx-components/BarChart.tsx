"use client";

import React from "react";

export interface ChartRow {
    label: string;
    value: number;
    color?: string; // 지정 안 하면 인덱스 순서대로 팔레트 색이 배정됨
}

export type ChartType = "barV" | "barH" | "line" | "area" | "donut";

// 막대/라인/도넛 색상 팔레트 (노션풍 부드러운 톤).
// 비비드 팔레트 (도넛은 최댓값만 full, 나머지는 opacity를 낮춰 흐리게 표현)
export const CHART_COLORS = ["#8b5cf6", "#38bdf8", "#a3e635", "#f472b6", "#fb923c", "#f87171", "#facc15", "#34d399"];
export const colorAt = (i: number) => CHART_COLORS[((i % CHART_COLORS.length) + CHART_COLORS.length) % CHART_COLORS.length];

// 색 → 부드러운 그라데이션 배경
const grad = (c: string, deg = 180) => `linear-gradient(${deg}deg, ${c} 0%, ${c}cc 100%)`;
// 연한 라벤더(기본 세로막대용)
const SOFT = "linear-gradient(180deg, #efeafe 0%, #e2d8fb 100%)";
function hexToRgb(hex: string): [number, number, number] {
    const m = hex.replace("#", "");
    const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
    return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}
const rgbToHex = (r: number, g: number, b: number) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
// hex 색을 흰색과 섞어 밝게 (amt: 0=원본, 1=흰색)
function lighten(hex: string, amt: number): string {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
// 두 hex 색 선형 보간 (t: 0=a, 1=b)
function mixHex(a: string, b: string, t: number): string {
    const [ar, ag, ab] = hexToRgb(a);
    const [br, bg, bb] = hexToRgb(b);
    return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

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
    subtitle?: string;
    icon?: string;
}

export default function BarChart({ type, orient, data, rows, title, subtitle, icon }: BarChartProps) {
    let items: ChartRow[] = [];
    let ttl = title ?? "";
    let sub = subtitle ?? "";
    let ico = icon ?? "";
    let resolvedType: ChartType | undefined = type;
    if (data) {
        try {
            const parsed = JSON.parse(decodeURIComponent(data));
            items = normalizeRows(parsed.rows ?? []);
            ttl = parsed.title ?? ttl;
            sub = parsed.subtitle ?? sub;
            ico = parsed.icon ?? ico;
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
            {(ttl || sub || ico) && (
                <div className="mb-4">
                    {sub && <div className="mb-0.5 text-xs font-medium text-(--text-muted)">{sub}</div>}
                    {(ttl || ico) && (
                        <div className="flex items-center gap-2 text-xl font-bold text-(--text-strong)">
                            {ico && <span className="text-[22px] leading-none">{ico}</span>}
                            {ttl && <span>{ttl}</span>}
                        </div>
                    )}
                </div>
            )}
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
                        <span className={`min-w-0 max-w-full truncate text-xs ${isMax ? "font-bold text-(--text)" : "text-(--text-muted)"}`} title={r.label}>
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

/* ── 도넛 (부채꼴 path: 안팎 동일 폭 간격) ──── */
function Donut({ items }: { items: ChartRow[] }) {
    const uid = React.useId().replace(/:/g, "");
    const total = items.reduce((s, r) => s + Math.max(0, r.value), 0) || 1;
    const Ro = 82; // 바깥 반지름
    const Ri = 54; // 안쪽 반지름 (두께 28)
    const CORNER = 18; // 모서리 라운드용 stroke 두께 (클수록 더 둥글게)
    const SIZE = Ro * 2 + CORNER + 8; // stroke가 Ro 밖으로 CORNER/2 만큼 나오므로 여백 확보(안 짤리게)
    const CX = SIZE / 2;
    const GAP = items.length > 1 ? 5 + CORNER : 0; // 실제 간격 ≈ GAP-CORNER 이 되도록 보정 (조금 더 좁게)
    const pt = (r: number, a: number) => `${(CX + r * Math.cos(a)).toFixed(2)} ${(CX + r * Math.sin(a)).toFixed(2)}`;
    const maxIdx = items.reduce((m, r, i) => (r.value > items[m].value ? i : m), 0);

    // 한 부채꼴(annular sector) path 생성: 바깥[oStart→oEnd] + 안쪽[iEnd→iStart]
    const sector = (oStart: number, oEnd: number, iStart: number, iEnd: number) => {
        const large = oEnd - oStart > Math.PI ? 1 : 0;
        return `M ${pt(Ro, oStart)} A ${Ro} ${Ro} 0 ${large} 1 ${pt(Ro, oEnd)} L ${pt(Ri, iEnd)} A ${Ri} ${Ri} 0 ${large} 0 ${pt(Ri, iStart)} Z`;
    };

    let acc = 0;
    const segs = items.map((r, i) => {
        const frac = Math.max(0, r.value) / total;
        const a0 = -Math.PI / 2 + acc * 2 * Math.PI; // 상단 기준 시계방향
        const a1 = -Math.PI / 2 + (acc + frac) * 2 * Math.PI;
        acc += frac;
        // 간격을 안팎 동일 폭으로: 각 반지름에서 (GAP/2)만큼의 각도로 안쪽/바깥쪽을 따로 인셋
        const dOut = GAP / 2 / Ro;
        const dIn = GAP / 2 / Ri;
        const os = a0 + dOut, oe = a1 - dOut, isg = a1 - dIn, ie = a0 + dIn;
        const drawable = oe > os && isg > ie;
        const mid = (a0 + a1) / 2;
        const lr = (Ro + Ri) / 2; // 링 두께 가운데 → 숫자를 그래프 안에
        const color = r.color || colorAt(i);
        const isMax = i === maxIdx;
        const gEnd = lighten(color, 0.35);

        // 최댓값: 각도 기준으로 색을 보간해 "각(angular) 그라데이션"을 만든다.
        // 선형 그라데이션은 곡선을 직선으로 투영해 안/밖 페이드 시작점이 어긋나므로,
        // 부채꼴을 각도로 잘게 쪼개 각 조각을 보간색으로 채운다(안/밖 동일 각도에서 페이드).
        const EDGE = 0.16; // 양끝 페이드 구간 비율 (작을수록 끝에서만 하얘짐)
        // 끝에서만 살짝 밝아지도록 ease. t=0/1 → gEnd, EDGE 안쪽부터는 원색
        const colorAtT = (t: number) => {
            const edgeT = t < 0.5 ? t : 1 - t;
            if (edgeT >= EDGE) return color;
            const k = edgeT / EDGE; // 0(끝)~1(안쪽)
            return mixHex(gEnd, color, k * k); // ease-in: 끝 근처에서만 확 밝게
        };
        let slices: { d: string; color: string; t: number }[] = [];
        if (isMax && drawable) {
            const N = 120; // 촘촘히 쪼개 매끄러운 그라데이션
            const oa = (f: number) => os + (oe - os) * f;
            const ia = (f: number) => ie + (isg - ie) * f;
            const OV = (oe - os) / N * 0.6; // 좌우 대칭 미세 겹침(솔기 방지)
            for (let k = 0; k < N; k++) {
                const f0 = k / N, f1 = (k + 1) / N;
                const lo = k > 0 ? OV : 0, hi = k < N - 1 ? OV : 0;
                slices.push({
                    d: sector(oa(f0) - lo, oa(f1) + hi, ia(f0) - lo, ia(f1) + hi),
                    color: colorAtT((f0 + f1) / 2),
                    t: (f0 + f1) / 2,
                });
            }
            // 페인트 순서: 가운데(비비드)부터 → 양끝(페이드)이 위로. 좌우 대칭 보장.
            slices.sort((p, q) => Math.abs(p.t - 0.5) - Math.abs(q.t - 0.5));
        }
        const d = drawable ? sector(os, oe, ie, isg) : "";
        return {
            color,
            gEnd,
            max: isMax, // 최댓값 조각은 full opacity(비비드), 나머지는 더 흐리게
            d,
            slices,
            pct: Math.round(frac * 100),
            lx: CX + Math.cos(mid) * lr,
            ly: CX + Math.sin(mid) * lr,
        };
    });
    return (
        <div className="flex items-end justify-between gap-4">
            {/* 범례: 색점 + 이름만 (좌하단, 작은 폰트) */}
            <div className="flex min-w-0 flex-col gap-1.5">
                {items.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: r.color || colorAt(i) }} />
                        <span className="min-w-0 truncate text-(--text-muted)">{r.label || "-"}</span>
                    </div>
                ))}
            </div>
            {/* 도넛 (가운데 비움, 트랙 없음 → 간격은 배경색). 단색이라 라운드 모서리도 같은 색. */}
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="shrink-0">
                {segs.map((s, i) =>
                    s.max && s.slices.length ? (
                        // 최댓값: 각도 보간 슬라이스들 (양끝이 안팎 동일하게 페이드)
                        <g key={i}>
                            {s.slices.map((sl, k) => (
                                <path key={k} d={sl.d} fill={sl.color} stroke={sl.color} strokeWidth={CORNER} strokeLinejoin="round" />
                            ))}
                        </g>
                    ) : s.d ? (
                        <path key={i} d={s.d} fill={s.color} stroke={s.color} strokeWidth={CORNER} strokeLinejoin="round" opacity={0.25} />
                    ) : null,
                )}
                {/* 값 라벨: 링 안(두께 가운데). 흐린 조각은 회색빛, 최댓값은 검은 알약 + 흰 숫자 */}
                {segs.map((s, i) => {
                    if (s.pct < 6) return null;
                    const txt = String(items[i].value);
                    if (s.max) {
                        const w = txt.length * 7 + 12;
                        return (
                            <g key={i}>
                                <rect x={s.lx - w / 2} y={s.ly - 9} width={w} height={18} rx={6} fill="#1a1a1f" />
                                <text x={s.lx} y={s.ly + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" className="tabular-nums" fill="#ffffff">
                                    {txt}
                                </text>
                            </g>
                        );
                    }
                    return (
                        <text key={i} x={s.lx} y={s.ly + 3.5} textAnchor="middle" fontSize="11" fontWeight="600" className="tabular-nums" fill="#9a97a3">
                            {txt}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
