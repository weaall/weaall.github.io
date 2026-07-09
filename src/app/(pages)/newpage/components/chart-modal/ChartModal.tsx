"use client";

import { useEffect, useState } from "react";
import BarChart, { ChartRow } from "@/components/mdx/mdx-components/BarChart";

interface ChartModalProps {
    open: boolean;
    orient: "h" | "v";
    initialTitle: string;
    initialRows: ChartRow[];
    onSave: (title: string, rows: ChartRow[]) => void;
    onClose: () => void;
}

// 우측 상단에 뜨는 그래프 데이터 편집 모달. 표 형태로 라벨/값을 입력하면
// 아래 미리보기에 상대 막대그래프가 실시간으로 그려진다.
export default function ChartModal({ open, orient, initialTitle, initialRows, onSave, onClose }: ChartModalProps) {
    const [title, setTitle] = useState(initialTitle);
    const [rows, setRows] = useState<ChartRow[]>(initialRows.length ? initialRows : [{ label: "", value: 0 }]);

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

    return (
        <>
            <div className="fixed inset-0 z-[1900]" onClick={onClose} />
            <div
                data-theme="light"
                className="animate-popIn fixed right-4 top-16 z-[2000] flex w-[360px] max-w-[92vw] flex-col rounded-xl border border-(--border) bg-(--menu-bg) p-4 text-(--text) shadow-2xl"
            >
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-(--text-strong)">
                        {orient === "h" ? "가로 막대그래프" : "세로 막대그래프"}
                    </span>
                    <button className="rounded p-1 text-(--text-muted) hover:bg-(--hover-bg)" onClick={onClose} aria-label="닫기">
                        ✕
                    </button>
                </div>

                <input
                    className="mb-3 w-full rounded-md border border-(--border) bg-transparent px-2 py-1 text-sm outline-none focus:border-[#3b82f6]"
                    placeholder="그래프 제목 (선택)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* 표 형태 입력 */}
                <div className="mb-2 flex items-center gap-2 px-1 text-xs text-(--text-muted)">
                    <span className="flex-1">항목</span>
                    <span className="w-20">값</span>
                    <span className="w-6" />
                </div>
                <div className="flex max-h-[220px] flex-col gap-1.5 overflow-y-auto">
                    {rows.map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                className="min-w-0 flex-1 rounded-md border border-(--border) bg-transparent px-2 py-1 text-sm outline-none focus:border-[#3b82f6]"
                                placeholder="이름"
                                value={r.label}
                                onChange={(e) => updateRow(i, { label: e.target.value })}
                            />
                            <input
                                type="number"
                                className="w-20 rounded-md border border-(--border) bg-transparent px-2 py-1 text-sm outline-none focus:border-[#3b82f6]"
                                placeholder="0"
                                value={Number.isFinite(r.value) ? r.value : 0}
                                onChange={(e) => updateRow(i, { value: Number(e.target.value) || 0 })}
                            />
                            <button
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-(--text-muted) hover:bg-(--hover-bg) hover:text-[#e65b58]"
                                onClick={() => removeRow(i)}
                                aria-label="행 삭제"
                            >
                                −
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    className="mt-2 w-full rounded-md border border-dashed border-(--border) py-1 text-sm text-(--text-muted) hover:bg-(--hover-bg)"
                    onClick={addRow}
                >
                    + 항목 추가
                </button>

                {/* 실시간 미리보기 */}
                {cleaned.length > 0 && (
                    <div className="mt-3">
                        <div className="mb-1 text-xs text-(--text-muted)">미리보기</div>
                        <BarChart orient={orient} rows={cleaned} title={title.trim()} />
                    </div>
                )}

                <button
                    className="mt-3 w-full rounded-md bg-[#3b82f6] py-1.5 text-sm font-medium text-white hover:bg-[#2f6fe0]"
                    onClick={handleSave}
                >
                    적용
                </button>
            </div>
        </>
    );
}
