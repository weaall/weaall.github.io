"use client";

import { useEffect, useRef, useState } from "react";

// 노션식 심플 테이블. 첫 행은 헤더. 셀은 contentEditable, 우측/하단 +로 열/행 추가,
// 호버 시 나오는 −로 특정 행/열 삭제. 데이터는 block.content에 {rows} JSON으로 저장.
// content = {"rows": string[][]} — 첫 배열이 헤더 행.

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
        ["제목1", "제목2"],
        ["", ""],
        ["", ""],
    ];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

    // 처음 만들 때(content 비어있음) 기본 표를 바로 저장
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

    const grid = dataRef.current;

    return (
        <div id={id} className="group/table my-2 flex w-fit max-w-full items-start gap-1 overflow-x-auto">
            <div>
                <table className="border-collapse">
                    <tbody>
                        {/* 열 삭제 가터 (호버 시) */}
                        <tr className="opacity-0 transition-opacity group-hover/table:opacity-100">
                            <td className="w-4 border-0 p-0" />
                            {Array.from({ length: cols }).map((_, c) => (
                                <td key={c} className="border-0 p-0 text-center">
                                    <button
                                        className="mx-auto flex h-4 w-full items-center justify-center rounded text-[12px] text-(--text-muted) hover:bg-(--hover-bg) hover:text-[#e65b58]"
                                        onClick={() => removeCol(c)}
                                        title="열 삭제"
                                    >
                                        −
                                    </button>
                                </td>
                            ))}
                        </tr>
                        {grid.map((row, r) => (
                            <tr key={r}>
                                {/* 행 삭제 가터 (호버 시) */}
                                <td className="border-0 p-0 opacity-0 transition-opacity group-hover/table:opacity-100">
                                    <button
                                        className="flex h-full w-4 items-center justify-center rounded text-[12px] text-(--text-muted) hover:bg-(--hover-bg) hover:text-[#e65b58]"
                                        onClick={() => removeRow(r)}
                                        title="행 삭제"
                                    >
                                        −
                                    </button>
                                </td>
                                {row.map((cell, c) => {
                                    const isHeader = r === 0;
                                    const Tag = (isHeader ? "th" : "td") as "th" | "td";
                                    return (
                                        <Tag
                                            key={c}
                                            className={`border border-(--border) p-0 text-left align-top ${
                                                isHeader ? "bg-(--hover-bg) font-semibold" : ""
                                            }`}
                                        >
                                            <div
                                                contentEditable
                                                suppressContentEditableWarning
                                                className="min-w-[90px] px-2 py-1 text-[14px] leading-[1.4] text-(--text) outline-none"
                                                onInput={(e) => setCell(r, c, e.currentTarget.innerText)}
                                                dangerouslySetInnerHTML={{ __html: esc(cell) }}
                                            />
                                        </Tag>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* 행 추가 */}
                <button
                    className="mt-1 flex w-full items-center justify-center rounded border border-dashed border-(--border) py-0.5 text-[13px] text-(--text-muted) opacity-0 transition-opacity hover:bg-(--hover-bg) group-hover/table:opacity-100"
                    onClick={addRow}
                >
                    + 행
                </button>
            </div>
            {/* 열 추가 */}
            <button
                className="flex items-center justify-center self-stretch rounded border border-dashed border-(--border) px-1 text-[13px] text-(--text-muted) opacity-0 transition-opacity hover:bg-(--hover-bg) group-hover/table:opacity-100"
                onClick={addCol}
            >
                +
            </button>
        </div>
    );
}
