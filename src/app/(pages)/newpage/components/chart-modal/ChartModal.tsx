"use client";

import { useEffect, useState } from "react";
import BarChart, { ChartRow, CHART_COLORS, colorAt } from "@/components/mdx/mdx-components/BarChart";
import { BarChartHIcon, BarChartVIcon } from "@/components/ui/icons/TypeMenuSvg";

interface ChartModalProps {
    open: boolean;
    orient: "h" | "v";
    initialTitle: string;
    initialRows: ChartRow[];
    onSave: (title: string, rows: ChartRow[]) => void;
    onClose: () => void;
}

// 화면 가운데에 뜨는 그래프 데이터 편집 모달. 전환 메뉴(TypeMenu)와 같은 톤.
// 표: 항목 / 값 / 색 컬럼. 색·삭제는 인풋과 같은 톤의 버튼으로 감싼다.
// 색 팔레트 팝오버는 스크롤 영역(overflow) 밖 백드롭 레벨에 fixed로 띄워 스크롤이 생기지 않게 한다.
export default function ChartModal({ open, orient, initialTitle, initialRows, onSave, onClose }: ChartModalProps) {
    const [title, setTitle] = useState(initialTitle);
    const [rows, setRows] = useState<ChartRow[]>(initialRows.length ? initialRows : [{ label: "", value: 0 }]);
    const [palette, setPalette] = useState<{ idx: number; top: number; left: number } | null>(null);

    // 다른 블록을 열 때마다 초기값 재설정
    useEffect(() => {
        if (open) {
            setTitle(initialTitle);
            setRows(initialRows.length ? initialRows : [{ label: "", value: 0 }]);
            setPalette(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialTitle, JSON.stringify(initialRows)]);

    if (!open) return null;

    const updateRow = (i: number, patch: Partial<ChartRow>) => {
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    };
    const addRow = () => setRows((prev) => [...prev, { label: "", value: 0 }]);
    const removeRow = (i: number) => setRows((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

    const cleaned = rows.filter((r) => r.label.trim() !== "" || r.value !== 0);

    const handleSave = () => {
        onSave(title.trim(), cleaned);
        onClose();
    };

    const openPalette = (e: React.MouseEvent, i: number) => {
        if (palette?.idx === i) {
            setPalette(null);
            return;
        }
        const r = e.currentTarget.getBoundingClientRect();
        setPalette({ idx: i, top: r.bottom + 6, left: Math.min(r.left, window.innerWidth - 200) });
    };

    const inputCls =
        "rounded-[6px] border border-(--border) bg-transparent px-[8px] py-[6px] text-[14px] text-(--text) outline-none focus:border-[#3b82f6]";
    const iconBtnCls =
        "flex shrink-0 items-center justify-center rounded-[6px] border border-(--border) py-[6px] hover:bg-(--menu-hover-bg)";

    return (
        <div
            className="fixed inset-0 z-[1900] flex items-center justify-center bg-black/20 p-4"
            onClick={() => (palette ? setPalette(null) : onClose())}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div
                data-theme="light"
                className="animate-popIn flex max-h-[86vh] w-[440px] max-w-[94vw] flex-col rounded-[10px] border border-(--border) bg-(--menu-bg) p-[16px] text-(--text) shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="mb-[12px] flex items-center justify-between">
                    <span className="flex items-center gap-[8px] text-[14px] font-[600] text-(--text-strong)">
                        <span className="h-4 w-4">{orient === "h" ? <BarChartHIcon color="#5f5e5b" /> : <BarChartVIcon color="#5f5e5b" />}</span>
                        {orient === "h" ? "가로 막대그래프" : "세로 막대그래프"}
                    </span>
                    <button
                        className="flex h-6 w-6 items-center justify-center rounded-[6px] text-(--text-muted) hover:bg-(--menu-hover-bg)"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        ✕
                    </button>
                </div>

                <input className={`mb-[14px] w-full ${inputCls}`} placeholder="그래프 제목 (선택)" value={title} onChange={(e) => setTitle(e.target.value)} />

                {/* 표 헤더: 항목 / 값 / 색 */}
                <div className="mb-[6px] flex items-center gap-[8px] px-[2px] text-[12px] font-[500] text-(--text-muted) select-none">
                    <span className="flex-1">항목</span>
                    <span className="w-[72px]">값</span>
                    <span className="w-[44px] text-center">색</span>
                    <span className="w-[32px]" />
                </div>
                {/* 표 입력 행 */}
                <div className="flex max-h-[220px] flex-col gap-[6px] overflow-y-auto">
                    {rows.map((r, i) => (
                        <div key={i} className="flex items-center gap-[8px]">
                            <input
                                className={`min-w-0 flex-1 ${inputCls}`}
                                placeholder="이름"
                                value={r.label}
                                onChange={(e) => updateRow(i, { label: e.target.value })}
                            />
                            <input
                                type="number"
                                className={`w-[72px] ${inputCls}`}
                                placeholder="0"
                                value={Number.isFinite(r.value) ? r.value : 0}
                                onChange={(e) => updateRow(i, { value: Number(e.target.value) || 0 })}
                            />
                            {/* 색: 인풋과 같은 톤의 버튼 */}
                            <button className={`w-[44px] ${iconBtnCls}`} onClick={(e) => openPalette(e, i)} aria-label="막대 색 선택">
                                <span className="h-4 w-4 rounded-full" style={{ background: r.color || colorAt(i) }} />
                            </button>
                            {/* 삭제: 인풋과 같은 톤의 버튼 */}
                            <button
                                className={`w-[32px] text-[16px] text-(--text-muted) hover:text-[#e65b58] ${iconBtnCls}`}
                                onClick={() => removeRow(i)}
                                aria-label="행 삭제"
                            >
                                −
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    className="mt-[8px] w-full rounded-[6px] border border-dashed border-(--border) py-[6px] text-[13px] text-(--text-muted) hover:bg-(--menu-hover-bg)"
                    onClick={addRow}
                >
                    + 항목 추가
                </button>

                {/* 실시간 미리보기 */}
                {cleaned.length > 0 && (
                    <div className="mt-[14px] overflow-y-auto">
                        <div className="mb-[6px] text-[12px] font-[500] text-(--text-muted) select-none">미리보기</div>
                        <BarChart orient={orient} rows={cleaned} title={title.trim()} />
                    </div>
                )}

                <button
                    className="mt-[16px] w-full rounded-[6px] bg-[#3b82f6] py-[8px] text-[14px] font-[500] text-white hover:bg-[#2f6fe0]"
                    onClick={handleSave}
                >
                    적용
                </button>
            </div>

            {/* 색 팔레트 팝오버 — 스크롤 영역 밖(백드롭 레벨)에 fixed로 렌더 */}
            {palette && (
                <div
                    data-theme="light"
                    className="animate-popIn fixed z-[2100] flex w-[188px] flex-wrap gap-[6px] rounded-[10px] border border-(--border) bg-(--menu-bg) p-[8px] shadow-xl"
                    style={{ top: palette.top, left: palette.left }}
                    onClick={(e) => e.stopPropagation()}
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
