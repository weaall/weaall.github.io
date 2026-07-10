"use client";

import { useEffect, useRef, useState } from "react";

// 노션 심플 테이블. 모든 셀 동일(플레인), 1px 보더.
// 표 둘레에 대칭 여백(18px)을 두고 컨트롤을 배치:
// - 상단(열)/좌측(행) 가장자리: 회색 라운드 버튼(−) → 해당 열/행 삭제 (호버 시 표시, 호버하면 빨강)
// - 우측 +(열)·하단 +(행)·우하단 코너 +(행+열)
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
    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden>
        <path d="M8 2.65a.75.75 0 0 1 .75.75v3.85h3.85a.75.75 0 0 1 0 1.5H8.75v3.85l-.004.077a.75.75 0 0 1-1.492 0L7.25 12.6V8.75H3.4a.75.75 0 0 1 0-1.5h3.85V3.4A.75.75 0 0 1 8 2.65" />
    </svg>
);

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
    // 삭제 핸들: 회색으로 감싼 버튼 느낌, 호버 시 표시, 커서 올리면 빨강
    const delBtn =
        "absolute z-[4] flex items-center justify-center rounded-[4px] bg-(--hover-bg) text-[12px] leading-none text-(--text-muted) opacity-0 transition-opacity group-hover/table:opacity-100 hover:!bg-[#e65b58] hover:!text-white";
    // 추가 버튼: 보더 + 회색, 호버 시 표시
    const addBtn =
        "absolute flex items-center justify-center rounded-[4px] border border-(--border) bg-(--hover-bg) text-(--text-muted) opacity-0 transition-opacity group-hover/table:opacity-100 hover:!bg-[#e3e2df]";

    return (
        <div id={id} className="group/table relative my-2 w-fit max-w-full p-[18px]">
            <table className="border-collapse">
                <tbody>
                    {grid.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => (
                                <td key={c} className="relative border border-[#d3d2ce] p-0 align-top">
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        className="min-h-[20px] min-w-[120px] px-[9px] py-[7px] text-[14px] leading-[20px] text-(--text) outline-none"
                                        onInput={(e) => setCell(r, c, e.currentTarget.innerText)}
                                        dangerouslySetInnerHTML={{ __html: esc(cell) }}
                                    />
                                    {/* 열 삭제 (첫 행 셀 위) */}
                                    {r === 0 && (
                                        <button
                                            title="열 삭제"
                                            className={`${delBtn} -top-[15px] left-1/2 h-[13px] w-[26px] -translate-x-1/2`}
                                            onMouseDown={noFocus(() => removeCol(c))}
                                        >
                                            −
                                        </button>
                                    )}
                                    {/* 행 삭제 (첫 열 셀 왼쪽) */}
                                    {c === 0 && (
                                        <button
                                            title="행 삭제"
                                            className={`${delBtn} -left-[15px] top-1/2 h-[26px] w-[13px] -translate-y-1/2`}
                                            onMouseDown={noFocus(() => removeRow(r))}
                                        >
                                            −
                                        </button>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 열 추가 (우측, 표 높이) */}
            <button className={`${addBtn} top-[18px] right-0 bottom-[18px] w-[14px]`} onMouseDown={noFocus(addCol)} title="열 추가">
                <PlusIcon />
            </button>
            {/* 행 추가 (하단, 표 너비) */}
            <button className={`${addBtn} bottom-0 left-[18px] right-[18px] h-[14px]`} onMouseDown={noFocus(addRow)} title="행 추가">
                <PlusIcon />
            </button>
            {/* 코너 (행+열) */}
            <button className={`${addBtn} bottom-0 right-0 h-[14px] w-[14px]`} onMouseDown={noFocus(addBoth)} title="행·열 추가">
                <PlusIcon />
            </button>
        </div>
    );
}
