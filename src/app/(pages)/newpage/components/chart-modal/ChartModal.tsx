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

// 화면 가운데에 뜨는 그래프 데이터 편집 모달. 전환 메뉴(TypeMenu)와 같은 톤:
// --menu-bg / --border / rounded-[10px] / muted 라벨 / --menu-hover-bg 호버.
// 표 형태로 라벨·값을 입력하면 아래 미리보기에 상대 막대그래프가 실시간으로 그려진다.
export default function ChartModal({ open, orient, initialTitle, initialRows, onSave, onClose }: ChartModalProps) {
    const [title, setTitle] = useState(initialTitle);
    const [rows, setRows] = useState<ChartRow[]>(initialRows.length ? initialRows : [{ label: "", value: 0 }]);
    const [paletteOpenIdx, setPaletteOpenIdx] = useState<number | null>(null);

    // 다른 블록을 열 때마다 초기값 재설정
    useEffect(() => {
        if (open) {
            setTitle(initialTitle);
            setRows(initialRows.length ? initialRows : [{ label: "", value: 0 }]);
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

    const inputCls =
        "rounded-[6px] border border-(--border) bg-transparent px-[8px] py-[5px] text-[14px] text-(--text) outline-none focus:border-[#3b82f6]";

    return (
        <div
            className="fixed inset-0 z-[1900] flex items-center justify-center bg-black/20 p-4"
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div
                data-theme="light"
                className="animate-popIn flex max-h-[86vh] w-[420px] max-w-[94vw] flex-col rounded-[10px] border border-(--border) bg-(--menu-bg) p-[16px] text-(--text) shadow-2xl"
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

                {/* 표 헤더 */}
                <div className="mb-[6px] flex items-center gap-[8px] px-[2px] text-[12px] font-[500] text-(--text-muted) select-none">
                    <span className="w-6" />
                    <span className="flex-1">항목</span>
                    <span className="w-[80px]">값</span>
                    <span className="w-6" />
                </div>
                {/* 표 입력 행 */}
                <div className="flex max-h-[220px] flex-col gap-[6px] overflow-y-auto">
                    {rows.map((r, i) => (
                        <div key={i} className="relative flex items-center gap-[8px]">
                            {/* 색 선택 스와치 */}
                            <button
                                className="h-6 w-6 shrink-0 rounded-full border border-(--border)"
                                style={{ background: r.color || colorAt(i) }}
                                onClick={() => setPaletteOpenIdx(paletteOpenIdx === i ? null : i)}
                                aria-label="막대 색 선택"
                            />
                            <input
                                className={`min-w-0 flex-1 ${inputCls}`}
                                placeholder="이름"
                                value={r.label}
                                onChange={(e) => updateRow(i, { label: e.target.value })}
                            />
                            <input
                                type="number"
                                className={`w-[80px] ${inputCls}`}
                                placeholder="0"
                                value={Number.isFinite(r.value) ? r.value : 0}
                                onChange={(e) => updateRow(i, { value: Number(e.target.value) || 0 })}
                            />
                            <button
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] text-[16px] text-(--text-muted) hover:bg-(--menu-hover-bg) hover:text-[#e65b58]"
                                onClick={() => removeRow(i)}
                                aria-label="행 삭제"
                            >
                                −
                            </button>

                            {/* 색 팔레트 팝오버 */}
                            {paletteOpenIdx === i && (
                                <div className="animate-popIn absolute left-0 top-[32px] z-10 flex w-[184px] flex-wrap gap-[6px] rounded-[10px] border border-(--border) bg-(--menu-bg) p-[8px] shadow-xl">
                                    {CHART_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            className="h-6 w-6 rounded-full border border-black/10 transition-transform hover:scale-110"
                                            style={{ background: c, outline: r.color === c ? "2px solid #3b82f6" : undefined, outlineOffset: 1 }}
                                            onClick={() => {
                                                updateRow(i, { color: c });
                                                setPaletteOpenIdx(null);
                                            }}
                                            aria-label={c}
                                        />
                                    ))}
                                    <button
                                        className="flex h-6 items-center rounded-full border border-(--border) px-2 text-[11px] text-(--text-muted) hover:bg-(--menu-hover-bg)"
                                        onClick={() => {
                                            updateRow(i, { color: undefined });
                                            setPaletteOpenIdx(null);
                                        }}
                                    >
                                        자동
                                    </button>
                                </div>
                            )}
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
        </div>
    );
}
