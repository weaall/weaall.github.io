"use client";

import { useEffect, useRef, useState } from "react";

// 노션 심플 테이블. 모든 셀 동일(플레인), 1px 보더.
// 상단(열)/좌측(행) 가장자리에 셀렉터 바 → 호버 시 파랑, 클릭하면 옵션 메뉴
// (삽입/복제/콘텐츠 삭제/삭제). 우측/하단/코너 +로 빠른 추가.
// content = {"rows": string[][]} (첫 행이 GFM 헤더로 나감)
// ※ 노션의 "색"(셀 배경색)은 GFM 마크다운 표로 내보낼 수 없어 제외.

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

// 아이콘 (노션 표 옵션 메뉴 아이콘)
const Ico = ({ d, rotate }: { d: string; rotate?: number }) => (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}>
        <path d={d} />
    </svg>
);
const P_ARROW_UP = "M15.193 8.942a.626.626 0 0 0 0-.884l-4.75-4.75a.626.626 0 0 0-.885 0l-4.75 4.75a.626.626 0 0 0 .885.884L9.375 5.26v10.99a.625.625 0 1 0 1.25 0V5.26l3.683 3.682c.244.244.64.244.885 0";
const P_ARROW_DOWN = "M4.807 11.058a.627.627 0 0 0 0 .884l4.75 4.75c.244.244.64.244.885 0l4.75-4.75a.626.626 0 0 0-.885-.884l-3.683 3.682V3.75a.625.625 0 1 0-1.25 0v10.99l-3.682-3.682a.626.626 0 0 0-.885 0";
const P_DUP =
    "M4.5 2.375A2.125 2.125 0 0 0 2.375 4.5V12c0 1.174.951 2.125 2.125 2.125h1.625v1.625c0 1.174.951 2.125 2.125 2.125h7.5a2.125 2.125 0 0 0 2.125-2.125v-7.5a2.125 2.125 0 0 0-2.125-2.125h-1.625V4.5A2.125 2.125 0 0 0 12 2.375zm8.375 3.75H8.25A2.125 2.125 0 0 0 6.125 8.25v4.625H4.5A.875.875 0 0 1 3.625 12V4.5c0-.483.392-.875.875-.875H12c.483 0 .875.392.875.875zm-5.5 2.125c0-.483.392-.875.875-.875h7.5c.483 0 .875.392.875.875v7.5a.875.875 0 0 1-.875.875h-7.5a.875.875 0 0 1-.875-.875z";
const P_CLEAR =
    "M10 2.375a7.625 7.625 0 1 0 0 15.25 7.625 7.625 0 0 0 0-15.25m2.817 4.808a.625.625 0 0 1 0 .884L10.884 10l1.933 1.933a.625.625 0 1 1-.884.884L10 10.884l-1.933 1.933a.625.625 0 1 1-.884-.884L9.116 10 7.183 8.067a.625.625 0 1 1 .884-.884L10 9.116l1.933-1.933a.625.625 0 0 1 .884 0";
const P_TRASH =
    "M6.386 3.925v1.464H3.523a.625.625 0 1 0 0 1.25h.897l.393 8.646A2.425 2.425 0 0 0 7.236 17.6h5.528a2.425 2.425 0 0 0 2.422-2.315l.393-8.646h.898a.625.625 0 1 0 0-1.25h-2.863V3.925c0-.842-.683-1.525-1.525-1.525H7.91c-.842 0-1.524.683-1.524 1.525M7.91 3.65h4.18c.15 0 .274.123.274.275v1.464H7.636V3.925c0-.152.123-.275.274-.275m-.9 2.99h7.318l-.39 8.588a1.175 1.175 0 0 1-1.174 1.122H7.236a1.175 1.175 0 0 1-1.174-1.122l-.39-8.589z";

type MenuState = { kind: "row" | "col"; index: number; top: number; left: number } | null;

export default function TableBlock({ id, content }: { id: string; content: string }) {
    const dataRef = useRef<string[][]>(parseTable(content));
    const [, setVersion] = useState(0);
    const [menu, setMenu] = useState<MenuState>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const commit = () => {
        window.dispatchEvent(new CustomEvent("newpage:settable", { detail: { id, content: JSON.stringify({ rows: dataRef.current }) } }));
    };
    const scheduleCommit = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(commit, 400);
    };
    const apply = (fn: () => void) => {
        fn();
        setVersion((v) => v + 1);
        commit();
        setMenu(null);
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

    // 구조 조작
    const insertRowAt = (i: number) => dataRef.current.splice(i, 0, Array(cols || 1).fill(""));
    const insertColAt = (i: number) => dataRef.current.forEach((row) => row.splice(i, 0, ""));
    const duplicateRow = (r: number) => dataRef.current.splice(r + 1, 0, [...dataRef.current[r]]);
    const duplicateCol = (c: number) => dataRef.current.forEach((row) => row.splice(c + 1, 0, row[c]));
    const clearRow = (r: number) => (dataRef.current[r] = dataRef.current[r].map(() => ""));
    const clearCol = (c: number) => dataRef.current.forEach((row) => (row[c] = ""));
    const removeRow = (r: number) => dataRef.current.length > 1 && dataRef.current.splice(r, 1);
    const removeCol = (c: number) => cols > 1 && dataRef.current.forEach((row) => row.splice(c, 1));

    const noFocus = (fn: () => void) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        fn();
    };
    const openMenu = (kind: "row" | "col", index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setMenu({ kind, index, top: r.bottom + 4, left: Math.min(r.left, window.innerWidth - 210) });
    };

    const grid = dataRef.current;

    // 셀렉터 바: 기본 회색, 호버/메뉴열림 시 파랑
    const bar = (active: boolean) =>
        `absolute z-[4] cursor-pointer rounded-[3px] opacity-0 transition group-hover/table:opacity-100 ${
            active ? "!bg-[#3b82f6] !opacity-100" : "bg-[#c4c4c2] hover:bg-[#3b82f6]"
        }`;
    const addBtn =
        "absolute flex items-center justify-center rounded-[4px] border border-(--border) bg-(--hover-bg) text-(--text-muted) opacity-0 transition-opacity group-hover/table:opacity-100 hover:!bg-[#e3e2df]";

    type MenuItem = { icon: string; label: string; run: () => unknown; danger?: boolean; rotate?: number };
    const menuItems: MenuItem[] =
        menu?.kind === "row"
            ? [
                  { icon: P_ARROW_UP, label: "위에 삽입", run: () => insertRowAt(menu.index) },
                  { icon: P_ARROW_DOWN, label: "아래에 삽입", run: () => insertRowAt(menu.index + 1) },
                  { icon: P_DUP, label: "복제", run: () => duplicateRow(menu.index) },
                  { icon: P_CLEAR, label: "콘텐츠 삭제", run: () => clearRow(menu.index) },
                  { icon: P_TRASH, label: "삭제", run: () => removeRow(menu.index), danger: true },
              ]
            : menu
              ? [
                    { icon: P_ARROW_UP, label: "왼쪽에 삽입", rotate: -90, run: () => insertColAt(menu.index) },
                    { icon: P_ARROW_DOWN, label: "오른쪽에 삽입", rotate: -90, run: () => insertColAt(menu.index + 1) },
                    { icon: P_DUP, label: "복제", run: () => duplicateCol(menu.index) },
                    { icon: P_CLEAR, label: "콘텐츠 삭제", run: () => clearCol(menu.index) },
                    { icon: P_TRASH, label: "삭제", run: () => removeCol(menu.index), danger: true },
                ]
              : [];

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
                                    {/* 열 셀렉터 (첫 행 셀 위) */}
                                    {r === 0 && (
                                        <div
                                            title="열 옵션"
                                            className={`${bar(menu?.kind === "col" && menu.index === c)} -top-[9px] left-1/2 h-[7px] w-[calc(100%-8px)] -translate-x-1/2`}
                                            onMouseDown={openMenu("col", c)}
                                        />
                                    )}
                                    {/* 행 셀렉터 (첫 열 셀 왼쪽) */}
                                    {c === 0 && (
                                        <div
                                            title="행 옵션"
                                            className={`${bar(menu?.kind === "row" && menu.index === r)} -left-[9px] top-1/2 h-[calc(100%-8px)] w-[7px] -translate-y-1/2`}
                                            onMouseDown={openMenu("row", r)}
                                        />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 빠른 추가 */}
            <button className={`${addBtn} top-[18px] right-0 bottom-[18px] w-[14px]`} onMouseDown={noFocus(() => apply(() => insertColAt(cols)))} title="열 추가">
                +
            </button>
            <button className={`${addBtn} bottom-0 left-[18px] right-[18px] h-[14px]`} onMouseDown={noFocus(() => apply(() => insertRowAt(grid.length)))} title="행 추가">
                +
            </button>
            <button className={`${addBtn} bottom-0 right-0 h-[14px] w-[14px]`} onMouseDown={noFocus(() => apply(() => { insertColAt(cols); insertRowAt(grid.length); }))} title="행·열 추가">
                +
            </button>

            {/* 옵션 메뉴 */}
            {menu && (
                <>
                    <div className="fixed inset-0 z-[1900]" onMouseDown={(e) => e.stopPropagation()} onClick={() => setMenu(null)} />
                    <div
                        data-theme="light"
                        className="animate-popIn fixed z-[2000] min-w-[196px] rounded-[10px] border border-(--border) bg-(--menu-bg) p-[4px] shadow-xl"
                        style={{ top: menu.top, left: menu.left }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {menuItems.map((it) => (
                            <button
                                key={it.label}
                                className={`flex h-8 w-full items-center gap-[8px] rounded-[6px] px-[8px] text-left text-[14px] hover:bg-(--menu-hover-bg) ${
                                    it.danger ? "text-[#e65b58]" : "text-(--text)"
                                }`}
                                onMouseDown={noFocus(() => apply(it.run))}
                            >
                                <span className="flex h-[18px] w-[18px] items-center justify-center text-(--text-muted)">
                                    <Ico d={it.icon} rotate={it.rotate} />
                                </span>
                                {it.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
