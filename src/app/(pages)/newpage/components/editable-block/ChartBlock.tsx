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
        <div id={id} className="group/chart relative cursor-pointer" onClick={openEditor}>
            {rows.length === 0 ? (
                <div className="my-2 rounded-lg border border-dashed border-(--border) px-4 py-8 text-center text-sm text-(--text-muted)">
                    클릭해서 그래프 데이터를 입력하세요
                </div>
            ) : (
                <BarChart orient={orient} rows={rows} title={title} />
            )}
            <div className="pointer-events-none absolute right-2 top-2 rounded bg-(--menu-bg) px-2 py-0.5 text-xs text-(--text-muted) opacity-0 shadow group-hover/chart:opacity-100">
                편집
            </div>
        </div>
    );
}
