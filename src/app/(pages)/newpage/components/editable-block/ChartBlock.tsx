"use client";

import BarChart, { ChartRow, ChartType } from "@/components/mdx/mdx-components/BarChart";

// 에디터 안의 그래프 블록. 우측 상단 호버 "편집" 버튼으로 데이터/타입 편집 모달을 연다.
// content = { type, title, rows } JSON. 구버전(barChartH/V)은 orient로 타입을 유추.
export default function ChartBlock({ id, orient, content }: { id: string; orient?: "h" | "v"; content: string }) {
    let rows: ChartRow[] = [];
    let title = "";
    let type: ChartType = orient === "h" ? "barH" : "barV";
    try {
        const parsed = JSON.parse(content || "{}");
        rows = parsed.rows ?? [];
        title = parsed.title ?? "";
        if (parsed.type) type = parsed.type;
    } catch {
        /* 손상된 값은 빈 그래프 */
    }

    const openEditor = () => window.dispatchEvent(new CustomEvent("newpage:editchart", { detail: { id } }));

    return (
        <div id={id} className="group/chart relative my-1">
            {rows.length === 0 ? (
                <button
                    type="button"
                    onClick={openEditor}
                    className="w-full rounded-lg border border-dashed border-(--border) px-4 py-8 text-center text-sm text-(--text-muted) hover:bg-(--hover-bg)"
                >
                    클릭해서 그래프 데이터를 입력하세요
                </button>
            ) : (
                <BarChart type={type} rows={rows} title={title} />
            )}
            {rows.length > 0 && (
                <button
                    type="button"
                    onClick={openEditor}
                    className="absolute right-2 top-2 z-10 rounded-md border border-(--border) bg-(--page-bg) px-2 py-1 text-[11px] text-(--text-muted) opacity-0 shadow-md transition-opacity hover:bg-(--menu-hover-bg) group-hover/chart:opacity-100"
                >
                    편집
                </button>
            )}
        </div>
    );
}
