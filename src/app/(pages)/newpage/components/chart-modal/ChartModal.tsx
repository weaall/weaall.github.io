"use client";

import { useEffect, useState } from "react";
import BarChart, { ChartRow, ChartType, CHART_COLORS, colorAt } from "@/components/mdx/mdx-components/BarChart";

interface ChartModalProps {
    open: boolean;
    initialType: string;
    initialTitle: string;
    initialSubtitle?: string;
    initialRows: ChartRow[];
    onSave: (type: string, title: string, subtitle: string, rows: ChartRow[]) => void;
    onClose: () => void;
}

const TYPES: { key: ChartType; label: string }[] = [
    { key: "barV", label: "세로 막대" },
    { key: "barH", label: "가로 막대" },
    { key: "line", label: "선" },
    { key: "area", label: "영역" },
    { key: "donut", label: "도넛" },
];

// 타입별 미니 아이콘
function TypeIcon({ t }: { t: ChartType }) {
    const s = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none" as const };
    const c = "currentColor";
    switch (t) {
        case "barV":
            return (
                <svg {...s}>
                    <rect x="2" y="8" width="3" height="6" rx="1" fill={c} />
                    <rect x="6.5" y="4" width="3" height="10" rx="1" fill={c} />
                    <rect x="11" y="6" width="3" height="8" rx="1" fill={c} />
                </svg>
            );
        case "barH":
            return (
                <svg {...s}>
                    <rect x="2" y="2.5" width="10" height="3" rx="1.5" fill={c} />
                    <rect x="2" y="6.5" width="12" height="3" rx="1.5" fill={c} />
                    <rect x="2" y="10.5" width="7" height="3" rx="1.5" fill={c} />
                </svg>
            );
        case "line":
            return (
                <svg {...s}>
                    <path d="M2 11 L6 6 L9 9 L14 3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "area":
            return (
                <svg {...s}>
                    <path d="M2 11 L6 6 L9 9 L14 3 V14 H2 Z" fill={c} opacity="0.3" />
                    <path d="M2 11 L6 6 L9 9 L14 3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "donut":
            return (
                <svg {...s}>
                    <circle cx="8" cy="8" r="5" stroke={c} strokeWidth="2.6" fill="none" strokeDasharray="18 12" />
                </svg>
            );
    }
}

// 그래프 데이터/타입 편집 모달. 상단 타입 선택, 왼쪽 데이터 입력, 오른쪽 실시간 미리보기.
export default function ChartModal({ open, initialType, initialTitle, initialSubtitle, initialRows, onSave, onClose }: ChartModalProps) {
    const [type, setType] = useState<ChartType>((initialType as ChartType) || "barV");
    const [title, setTitle] = useState(initialTitle);
    const [subtitle, setSubtitle] = useState(initialSubtitle ?? "");
    const [rows, setRows] = useState<ChartRow[]>(initialRows.length ? initialRows : [{ label: "", value: 0 }]);
    const [palette, setPalette] = useState<{ idx: number; top: number; left: number } | null>(null);

    useEffect(() => {
        if (open) {
            setType((initialType as ChartType) || "barV");
            setTitle(initialTitle);
            setSubtitle(initialSubtitle ?? "");
            setRows(initialRows.length ? initialRows : [{ label: "", value: 0 }]);
            setPalette(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialType, initialTitle, initialSubtitle, JSON.stringify(initialRows)]);

    if (!open) return null;

    const updateRow = (i: number, patch: Partial<ChartRow>) => setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    const addRow = () => setRows((prev) => [...prev, { label: "", value: 0 }]);
    const removeRow = (i: number) => setRows((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
    const cleaned = rows.filter((r) => r.label.trim() !== "" || r.value !== 0);

    const handleSave = () => {
        onSave(type, title.trim(), subtitle.trim(), cleaned);
        onClose();
    };

    const openPalette = (e: React.MouseEvent, i: number) => {
        if (palette?.idx === i) return setPalette(null);
        const r = e.currentTarget.getBoundingClientRect();
        setPalette({ idx: i, top: r.bottom + 6, left: Math.min(r.left, window.innerWidth - 200) });
    };

    const inputCls = "editor-field rounded-[6px] border border-(--border) bg-transparent px-[8px] py-[6px] text-[14px] text-(--text) outline-none";
    const iconBtnCls = "flex shrink-0 items-center justify-center rounded-[6px] border border-(--border) py-[6px] hover:bg-(--menu-hover-bg)";

    return (
        <div
            className="fixed inset-0 z-[1900] flex items-center justify-center bg-black/20 p-4"
            onMouseDown={(e) => {
                e.stopPropagation();
                if (e.target !== e.currentTarget) return;
                if (palette) setPalette(null);
                else onClose();
            }}
        >
            <div
                data-theme="light"
                className="animate-popIn flex max-h-[86vh] w-[760px] max-w-[95vw] flex-col rounded-[14px] border border-(--border) bg-(--menu-bg) p-[16px] text-(--text) shadow-2xl"
            >
                {/* 헤더 */}
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-[14px] font-[600] text-(--text-strong)">그래프</span>
                    <button className="flex h-6 w-6 items-center justify-center rounded-[6px] text-(--text-muted) hover:bg-(--menu-hover-bg)" onClick={onClose} aria-label="닫기">
                        ✕
                    </button>
                </div>

                {/* 타입 선택 */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                    {TYPES.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setType(t.key)}
                            className={`flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-[13px] transition-colors ${
                                type === t.key ? "border-transparent bg-[#7c3aed] text-white" : "border-(--border) text-(--text-muted) hover:bg-(--menu-hover-bg)"
                            }`}
                        >
                            <TypeIcon t={t.key} />
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="flex min-h-0 flex-1 gap-4 m:flex-col">
                    {/* 왼쪽: 데이터 */}
                    <div className="flex w-[320px] shrink-0 flex-col m:w-full">
                        <input className={`mb-2 w-full ${inputCls}`} placeholder="그래프 제목 (선택)" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input className={`mb-3 w-full ${inputCls}`} placeholder="부제목 (선택)" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                        <div className="mb-[6px] flex items-center gap-[8px] px-[2px] text-[12px] font-[500] text-(--text-muted) select-none">
                            <span className="flex-1">항목</span>
                            <span className="w-[64px]">값</span>
                            <span className="w-[40px] text-center">색</span>
                            <span className="w-[28px]" />
                        </div>
                        <div className="flex max-h-[280px] flex-col gap-[6px] overflow-y-auto pr-1">
                            {rows.map((r, i) => (
                                <div key={i} className="flex items-center gap-[8px]">
                                    <input className={`min-w-0 flex-1 ${inputCls}`} placeholder="이름" value={r.label} onChange={(e) => updateRow(i, { label: e.target.value })} />
                                    <input
                                        type="number"
                                        className={`w-[64px] ${inputCls}`}
                                        placeholder="0"
                                        value={Number.isFinite(r.value) ? r.value : 0}
                                        onChange={(e) => updateRow(i, { value: Number(e.target.value) || 0 })}
                                    />
                                    <button className={`w-[40px] ${iconBtnCls}`} onClick={(e) => openPalette(e, i)} aria-label="색 선택">
                                        <span className="h-4 w-4 rounded-full" style={{ background: r.color || colorAt(i) }} />
                                    </button>
                                    <button className={`w-[28px] text-[16px] text-(--text-muted) hover:text-[#e65b58] ${iconBtnCls}`} onClick={() => removeRow(i)} aria-label="행 삭제">
                                        −
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="mt-[8px] w-full rounded-[6px] border border-dashed border-(--border) py-[6px] text-[13px] text-(--text-muted) hover:bg-(--menu-hover-bg)" onClick={addRow}>
                            + 항목 추가
                        </button>
                    </div>

                    {/* 오른쪽: 미리보기 */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        <div className="mb-[6px] text-[12px] font-[500] text-(--text-muted) select-none">미리보기</div>
                        <div className="flex-1 overflow-auto rounded-[10px] border border-(--border) bg-(--page-bg) p-3">
                            {cleaned.length > 0 ? (
                                <BarChart type={type} rows={cleaned} title={title.trim()} />
                            ) : (
                                <div className="flex h-full items-center justify-center py-10 text-sm text-(--text-faint)">데이터를 입력하세요</div>
                            )}
                        </div>
                    </div>
                </div>

                <button className="mt-[16px] w-full rounded-[6px] bg-[#7c3aed] py-[8px] text-[14px] font-[500] text-white hover:bg-[#6d28d9]" onClick={handleSave}>
                    적용
                </button>
            </div>

            {/* 색 팔레트 팝오버 */}
            {palette && (
                <div
                    data-theme="light"
                    className="animate-popIn fixed z-[2100] flex w-[188px] flex-wrap gap-[6px] rounded-[10px] border border-(--border) bg-(--menu-bg) p-[8px] shadow-xl"
                    style={{ top: palette.top, left: palette.left }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {CHART_COLORS.map((c) => {
                        const selected = rows[palette.idx]?.color === c;
                        return (
                            <button
                                key={c}
                                className="h-6 w-6 rounded-full border border-black/10 transition-transform hover:scale-110"
                                style={{ background: c, outline: selected ? "2px solid #3b82f6" : undefined, outlineOffset: 1 }}
                                onClick={() => {
                                    updateRow(palette.idx, { color: c });
                                    setPalette(null);
                                }}
                                aria-label={c}
                            />
                        );
                    })}
                    <button
                        className="flex h-6 items-center rounded-full border border-(--border) px-2 text-[11px] text-(--text-muted) hover:bg-(--menu-hover-bg)"
                        onClick={() => {
                            updateRow(palette.idx, { color: undefined });
                            setPalette(null);
                        }}
                    >
                        자동
                    </button>
                </div>
            )}
        </div>
    );
}
