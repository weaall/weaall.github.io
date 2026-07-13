"use client";

import BarChart, { ChartRow } from "@/components/mdx/mdx-components/BarChart";

// 에디터 안의 그래프 블록. 클릭하면 우측 상단 데이터 편집 모달을 연다(newpage:editchart 이벤트).
// 렌더는 포스트와 동일한 BarChart를 써서 WYSIWYG 유지.
export default function ChartBlock({ id, orient, content }: { id: string; orient: "h" | "v"; content: string }) {
    let rows: ChartRow[] = [];
    let title = "";
    try {
        const parsed = JSON.parse(content || "{}");
        rows = parsed.rows ?? [];
        title = parsed.title ?? "";
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
                <BarChart orient={orient} rows={rows} title={title} />
            )}
            {/* 우측 상단 호버 편집 버튼 (코드블록 툴바와 동일 톤) */}
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
