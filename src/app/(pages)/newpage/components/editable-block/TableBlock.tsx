"use client";

import { useEffect, useRef, useState } from "react";

// 노션 심플 테이블. 모든 셀 동일(플레인), 1px 보더.
// - 열/행 셀렉터 바(회색 둥근 바)를 클릭하면 해당 열/행 삭제
// - 우측 +(열), 하단 +(행), 우하단 코너 +(행+열) 로 추가 (호버 시 표시)
// content = {"rows": string[][]} (첫 행이 GFM 헤더로 나감)

function parseTable(content: string): string[][] {
    if (content && content[0] === "{") {
        try {
            const p = JSON.parse(content);
            if (Array.isArray(p.rows) && p.rows.length) return p.rows.map((r: unknown[]) => r.map((c) => String(c ?? "")));
        } catch {
            /* 폴백 */
        }
    }
    return [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const PlusIcon = () => (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M8 2.65a.75.75 0 0 1 .75.75v3.85h3.85a.75.75 0 0 1 0 1.5H8.75v3.85l-.004.077a.75.75 0 0 1-1.492 0L7.25 12.6V8.75H3.4a.75.75 0 0 1 0-1.5h3.85V3.4A.75.75 0 0 1 8 2.65" />
    </svg>
);

// 호버 시 나오는 회색 셀렉터 바 (클릭 → 삭제)
const selectorBase =
    "absolute z-[4] rounded-[4px] bg-[#c4c4c2] opacity-0 transition-opacity group-hover/table:opacity-100 hover:!bg-[#3b82f6] pointer-events-auto";

export default function TableBlock({ id, content }: { id: string; content: string }) {
    const dataRef = useRef<string[][]>(parseTable(content));
    const [, setVersion] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const commit = () => {
        window.dispatchEvent(new CustomEvent("newpage:settable", { detail: { id, content: JSON.stringify({ rows: dataRef.current }) } }));
    };
    const scheduleCommit = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(commit, 400);
    };
    const rerenderAndCommit = () => {
        setVersion((v) => v + 1);
        commit();
    };

    useEffect(() => {
        if (!content) commit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cols = dataRef.current[0]?.length ?? 0;

    const setCell = (r: number, c: number, val: string) => {
        dataRef.current[r][c] = val;
        scheduleCommit();
    };
    const addCol = () => {
        dataRef.current.forEach((row) => row.push(""));
        rerenderAndCommit();
    };
    const addRow = () => {
        dataRef.current.push(Array(cols || 1).fill(""));
        rerenderAndCommit();
    };
    const addBoth = () => {
        dataRef.current.forEach((row) => row.push(""));
        dataRef.current.push(Array((cols || 0) + 1).fill(""));
        rerenderAndCommit();
    };
    const removeCol = (c: number) => {
        if (cols <= 1) return;
        dataRef.current.forEach((row) => row.splice(c, 1));
        rerenderAndCommit();
    };
    const removeRow = (r: number) => {
        if (dataRef.current.length <= 1) return;
        dataRef.current.splice(r, 1);
        rerenderAndCommit();
    };

    const noFocus = (fn: () => void) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        fn();
    };

    const grid = dataRef.current;
    const addBtn = "flex items-center justify-center rounded-[4px] border border-(--border) text-(--text-muted) opacity-0 transition-opacity hover:bg-(--hover-bg) group-hover/table:opacity-100";

    return (
        <div id={id} className="group/table relative my-2 w-fit max-w-full overflow-x-auto pr-[20px] pb-[20px]">
            <table className="border-collapse">
                <tbody>
                    {grid.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => (
                                <td key={c} className="relative border border-(--border) p-0 align-top">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        className="min-h-[20px] min-w-[120px] px-[9px] py-[7px] text-[14px] leading-[20px] text-(--text) outline-none"
                                        onInput={(e) => setCell(r, c, e.currentTarget.innerText)}
                                        dangerouslySetInnerHTML={{ __html: esc(cell) }}
                                    />
                                    {/* 열 셀렉터 (첫 행 셀 상단 중앙) → 열 삭제 */}
                                    {r === 0 && (
                                        <div
                                            title="열 삭제"
                                            className={`${selectorBase} left-1/2 top-[-3px] h-[6px] w-[18px] -translate-x-1/2 cursor-pointer border-2 border-(--page-bg)`}
                                            onMouseDown={noFocus(() => removeCol(c))}
                                        />
                                    )}
                                    {/* 행 셀렉터 (첫 열 셀 좌측 중앙) → 행 삭제 */}
                                    {c === 0 && (
                                        <div
                                            title="행 삭제"
                                            className={`${selectorBase} top-1/2 left-[-3px] h-[18px] w-[6px] -translate-y-1/2 cursor-pointer border-2 border-(--page-bg)`}
                                            onMouseDown={noFocus(() => removeRow(r))}
                                        />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 열 추가 (우측 전체 높이) */}
            <button className={`${addBtn} absolute top-0 right-0 bottom-[20px] w-4`} onMouseDown={noFocus(addCol)} title="열 추가">
                <PlusIcon />
            </button>
            {/* 행 추가 (하단 전체 너비) */}
            <button className={`${addBtn} absolute bottom-0 left-0 right-[20px] h-4`} onMouseDown={noFocus(addRow)} title="행 추가">
                <PlusIcon />
            </button>
            {/* 코너 (행+열 추가) */}
            <button className={`${addBtn} absolute right-0 bottom-0 h-4 w-4`} onMouseDown={noFocus(addBoth)} title="행·열 추가">
                <PlusIcon />
            </button>
        </div>
    );
}
