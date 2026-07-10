"use client";

import { useEffect, useRef, useState } from "react";
import { TableData, TABLE_COLORS, cellBg } from "@/components/mdx/mdx-components/DataTable";

// 노션 심플 테이블(에디터). 셀 편집 + 행/열 셀렉터 → 옵션 메뉴(색/제목행·열/삽입/복제/콘텐츠삭제/삭제).
// 선택(메뉴 열림) 행·열은 파란 테두리로 표시. content = TableData JSON.
// 배경색·헤더를 보존하려고 내보내기는 GFM 표가 아니라 <DataTable data=.. /> 컴포넌트로 나감.

function parseTable(content: string): TableData {
    if (content && content[0] === "{") {
        try {
            const p = JSON.parse(content);
            if (Array.isArray(p.rows) && p.rows.length) {
                return {
                    rows: p.rows.map((r: unknown[]) => r.map((c) => String(c ?? ""))),
                    headerRow: !!p.headerRow,
                    headerCol: !!p.headerCol,
                    rowColors: Array.isArray(p.rowColors) ? p.rowColors : [],
                    colColors: Array.isArray(p.colColors) ? p.colColors : [],
                };
            }
        } catch {
            /* 폴백 */
        }
    }
    return { rows: [["", "", ""], ["", "", ""], ["", "", ""]], rowColors: [], colColors: [] };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const Ico = ({ d, rotate }: { d: string; rotate?: number }) => (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}>
        <path d={d} />
    </svg>
);
const P_UP = "M15.193 8.942a.626.626 0 0 0 0-.884l-4.75-4.75a.626.626 0 0 0-.885 0l-4.75 4.75a.626.626 0 0 0 .885.884L9.375 5.26v10.99a.625.625 0 1 0 1.25 0V5.26l3.683 3.682c.244.244.64.244.885 0";
const P_DOWN = "M4.807 11.058a.627.627 0 0 0 0 .884l4.75 4.75c.244.244.64.244.885 0l4.75-4.75a.626.626 0 0 0-.885-.884l-3.683 3.682V3.75a.625.625 0 1 0-1.25 0v10.99l-3.682-3.682a.626.626 0 0 0-.885 0";
const P_DUP =
    "M4.5 2.375A2.125 2.125 0 0 0 2.375 4.5V12c0 1.174.951 2.125 2.125 2.125h1.625v1.625c0 1.174.951 2.125 2.125 2.125h7.5a2.125 2.125 0 0 0 2.125-2.125v-7.5a2.125 2.125 0 0 0-2.125-2.125h-1.625V4.5A2.125 2.125 0 0 0 12 2.375zm8.375 3.75H8.25A2.125 2.125 0 0 0 6.125 8.25v4.625H4.5A.875.875 0 0 1 3.625 12V4.5c0-.483.392-.875.875-.875H12c.483 0 .875.392.875.875zm-5.5 2.125c0-.483.392-.875.875-.875h7.5c.483 0 .875.392.875.875v7.5a.875.875 0 0 1-.875.875h-7.5a.875.875 0 0 1-.875-.875z";
const P_CLEAR =
    "M10 2.375a7.625 7.625 0 1 0 0 15.25 7.625 7.625 0 0 0 0-15.25m2.817 4.808a.625.625 0 0 1 0 .884L10.884 10l1.933 1.933a.625.625 0 1 1-.884.884L10 10.884l-1.933 1.933a.625.625 0 1 1-.884-.884L9.116 10 7.183 8.067a.625.625 0 1 1 .884-.884L10 9.116l1.933-1.933a.625.625 0 0 1 .884 0";
const P_TRASH =
    "M6.386 3.925v1.464H3.523a.625.625 0 1 0 0 1.25h.897l.393 8.646A2.425 2.425 0 0 0 7.236 17.6h5.528a2.425 2.425 0 0 0 2.422-2.315l.393-8.646h.898a.625.625 0 1 0 0-1.25h-2.863V3.925c0-.842-.683-1.525-1.525-1.525H7.91c-.842 0-1.524.683-1.524 1.525M7.91 3.65h4.18c.15 0 .274.123.274.275v1.464H7.636V3.925c0-.152.123-.275.274-.275m-.9 2.99h7.318l-.39 8.588a1.175 1.175 0 0 1-1.174 1.122H7.236a1.175 1.175 0 0 1-1.174-1.122l-.39-8.589z";
const P_COLOR =
    "M5.606 2.669a1.55 1.55 0 0 0-1.55 1.55v.379l-.069-.004h-.693a.55.55 0 0 0 0 1.1h.693l.069-.004v.379c0 .856.694 1.55 1.55 1.55h8.787a1.55 1.55 0 0 0 1.55-1.55v-.375h.3c.208 0 .376.168.376.375v2.023a.375.375 0 0 1-.375.375h-5.32c-.814 0-1.474.66-1.474 1.475v.592a1.55 1.55 0 0 0-1.463 1.547v3.7c0 .856.694 1.55 1.55 1.55h.925a1.55 1.55 0 0 0 1.55-1.55v-3.7a1.55 1.55 0 0 0-1.462-1.547v-.592c0-.207.168-.375.375-.375h5.319c.814 0 1.475-.66 1.475-1.475V6.069c0-.815-.66-1.475-1.475-1.475h-.3v-.375a1.55 1.55 0 0 0-1.55-1.55zm-.3 1.55a.3.3 0 0 1 .3-.3h8.787a.3.3 0 0 1 .3.3v1.85a.3.3 0 0 1-.3.3H5.606a.3.3 0 0 1-.3-.3z";
const P_HEADER = "M3.75 5.5h12.5v3H3.75z";

type MenuState = { kind: "row" | "col"; index: number; top: number; left: number } | null;

export default function TableBlock({ id, content }: { id: string; content: string }) {
    const dataRef = useRef<TableData>(parseTable(content));
    const [, setVersion] = useState(0);
    const [menu, setMenu] = useState<MenuState>(null);
    const [menuMode, setMenuMode] = useState<"main" | "color">("main");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const commit = () => {
        window.dispatchEvent(new CustomEvent("newpage:settable", { detail: { id, content: JSON.stringify(dataRef.current) } }));
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
        setMenuMode("main");
    };

    useEffect(() => {
        if (!content) commit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const d = dataRef.current;
    d.rowColors ||= [];
    d.colColors ||= [];
    const cols = d.rows[0]?.length ?? 0;

    const setCell = (r: number, c: number, val: string) => {
        d.rows[r][c] = val;
        scheduleCommit();
    };

    const insertRowAt = (i: number) => {
        d.rows.splice(i, 0, Array(cols || 1).fill(""));
        d.rowColors!.splice(i, 0, null);
    };
    const insertColAt = (i: number) => {
        d.rows.forEach((row) => row.splice(i, 0, ""));
        d.colColors!.splice(i, 0, null);
    };
    const duplicateRow = (r: number) => {
        d.rows.splice(r + 1, 0, [...d.rows[r]]);
        d.rowColors!.splice(r + 1, 0, d.rowColors![r] ?? null);
    };
    const duplicateCol = (c: number) => {
        d.rows.forEach((row) => row.splice(c + 1, 0, row[c]));
        d.colColors!.splice(c + 1, 0, d.colColors![c] ?? null);
    };
    const clearRow = (r: number) => (d.rows[r] = d.rows[r].map(() => ""));
    const clearCol = (c: number) => d.rows.forEach((row) => (row[c] = ""));
    const removeRow = (r: number) => {
        if (d.rows.length <= 1) return;
        d.rows.splice(r, 1);
        d.rowColors!.splice(r, 1);
    };
    const removeCol = (c: number) => {
        if (cols <= 1) return;
        d.rows.forEach((row) => row.splice(c, 1));
        d.colColors!.splice(c, 1);
    };

    const noFocus = (fn: () => void) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        fn();
    };
    const openMenu = (kind: "row" | "col", index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setMenuMode("main");
        setMenu({ kind, index, top: r.bottom + 4, left: Math.min(r.left, window.innerWidth - 220) });
    };

    const grid = d.rows;
    const bar = (active: boolean) =>
        `absolute z-[4] cursor-pointer rounded-[3px] opacity-0 transition group-hover/table:opacity-100 ${
            active ? "!bg-[#3b82f6] !opacity-100" : "bg-[#c4c4c2] hover:bg-[#3b82f6]"
        }`;
    const addBtn =
        "absolute flex items-center justify-center rounded-[4px] border border-(--border) bg-(--hover-bg) text-(--text-muted) opacity-0 transition-opacity group-hover/table:opacity-100 hover:!bg-[#e3e2df]";

    type Item = { icon: string; label: string; run?: () => void; danger?: boolean; rotate?: number; color?: boolean; on?: boolean };
    const items: Item[] = menu
        ? [
              { icon: P_COLOR, label: "색", color: true },
              ...(menu.index === 0
                  ? [
                        menu.kind === "row"
                            ? { icon: P_HEADER, label: "제목 행", on: !!d.headerRow, run: () => (d.headerRow = !d.headerRow) }
                            : { icon: P_HEADER, label: "제목 열", on: !!d.headerCol, run: () => (d.headerCol = !d.headerCol) },
                    ]
                  : []),
              menu.kind === "row"
                  ? { icon: P_UP, label: "위에 삽입", run: () => insertRowAt(menu.index) }
                  : { icon: P_UP, rotate: -90, label: "왼쪽에 삽입", run: () => insertColAt(menu.index) },
              menu.kind === "row"
                  ? { icon: P_DOWN, label: "아래에 삽입", run: () => insertRowAt(menu.index + 1) }
                  : { icon: P_DOWN, rotate: -90, label: "오른쪽에 삽입", run: () => insertColAt(menu.index + 1) },
              { icon: P_DUP, label: "복제", run: () => (menu.kind === "row" ? duplicateRow(menu.index) : duplicateCol(menu.index)) },
              { icon: P_CLEAR, label: "콘텐츠 삭제", run: () => (menu.kind === "row" ? clearRow(menu.index) : clearCol(menu.index)) },
              { icon: P_TRASH, label: "삭제", danger: true, run: () => (menu.kind === "row" ? removeRow(menu.index) : removeCol(menu.index)) },
          ]
        : [];

    const setColor = (color: string | null) => {
        if (!menu) return;
        if (menu.kind === "row") d.rowColors![menu.index] = color;
        else d.colColors![menu.index] = color;
    };

    return (
        <div id={id} className="group/table relative my-2 w-fit max-w-full p-[18px]">
            <table className="border-collapse">
                <tbody>
                    {grid.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => {
                                const isHeader = (!!d.headerRow && r === 0) || (!!d.headerCol && c === 0);
                                const bg = cellBg(d, r, c, isHeader);
                                const selected = menu ? (menu.kind === "row" ? menu.index === r : menu.index === c) : false;
                                return (
                                    <td
                                        key={c}
                                        className={`relative border p-0 align-top ${selected ? "border-[#3b82f6]" : "border-[#d3d2ce]"}`}
                                        style={{ background: bg }}
                                    >
                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            className="min-h-[20px] min-w-[120px] px-[9px] py-[7px] text-[14px] leading-[20px] text-(--text) outline-none"
                                            style={{ fontWeight: isHeader ? 600 : undefined }}
                                            onInput={(e) => setCell(r, c, e.currentTarget.innerText)}
                                            dangerouslySetInnerHTML={{ __html: esc(cell) }}
                                        />
                                        {r === 0 && (
                                            <div
                                                title="열 옵션"
                                                className={`${bar(menu?.kind === "col" && menu.index === c)} -top-[9px] left-1/2 h-[7px] w-[calc(100%-8px)] -translate-x-1/2`}
                                                onMouseDown={openMenu("col", c)}
                                            />
                                        )}
                                        {c === 0 && (
                                            <div
                                                title="행 옵션"
                                                className={`${bar(menu?.kind === "row" && menu.index === r)} -left-[9px] top-1/2 h-[calc(100%-8px)] w-[7px] -translate-y-1/2`}
                                                onMouseDown={openMenu("row", r)}
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className={`${addBtn} top-[18px] right-0 bottom-[18px] w-[14px]`} onMouseDown={noFocus(() => apply(() => insertColAt(cols)))} title="열 추가">
                +
            </button>
            <button className={`${addBtn} bottom-0 left-[18px] right-[18px] h-[14px]`} onMouseDown={noFocus(() => apply(() => insertRowAt(grid.length)))} title="행 추가">
                +
            </button>
            <button className={`${addBtn} bottom-0 right-0 h-[14px] w-[14px]`} onMouseDown={noFocus(() => apply(() => { insertColAt(cols); insertRowAt(grid.length); }))} title="행·열 추가">
                +
            </button>

            {menu && (
                <>
                    <div className="fixed inset-0 z-[1900]" onMouseDown={(e) => e.stopPropagation()} onClick={() => { setMenu(null); setMenuMode("main"); }} />
                    <div
                        data-theme="light"
                        className="animate-popIn fixed z-[2000] min-w-[200px] rounded-[10px] border border-(--border) bg-(--menu-bg) p-[4px] shadow-xl"
                        style={{ top: menu.top, left: menu.left }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {menuMode === "color" ? (
                            <div className="flex flex-wrap gap-[6px] p-[6px]">
                                {TABLE_COLORS.map((color, i) => (
                                    <button
                                        key={i}
                                        title={color ?? "없음"}
                                        className="h-6 w-6 rounded-full border border-black/10 transition-transform hover:scale-110"
                                        style={{ background: color ?? "transparent", backgroundImage: color ? undefined : "linear-gradient(45deg,transparent 45%,#e65b58 45%,#e65b58 55%,transparent 55%)" }}
                                        onMouseDown={noFocus(() => apply(() => setColor(color)))}
                                    />
                                ))}
                            </div>
                        ) : (
                            items.map((it) =>
                                it.color ? (
                                    <button
                                        key={it.label}
                                        className="flex h-8 w-full items-center gap-[8px] rounded-[6px] px-[8px] text-left text-[14px] text-(--text) hover:bg-(--menu-hover-bg)"
                                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setMenuMode("color"); }}
                                    >
                                        <span className="flex h-[18px] w-[18px] items-center justify-center text-(--text-muted)"><Ico d={it.icon} /></span>
                                        {it.label}
                                        <span className="ml-auto text-(--text-muted)">›</span>
                                    </button>
                                ) : (
                                    <button
                                        key={it.label}
                                        className={`flex h-8 w-full items-center gap-[8px] rounded-[6px] px-[8px] text-left text-[14px] hover:bg-(--menu-hover-bg) ${
                                            it.danger ? "text-[#e65b58]" : "text-(--text)"
                                        }`}
                                        onMouseDown={noFocus(() => apply(it.run!))}
                                    >
                                        <span className="flex h-[18px] w-[18px] items-center justify-center text-(--text-muted)"><Ico d={it.icon} rotate={it.rotate} /></span>
                                        {it.label}
                                        {it.on !== undefined && <span className="ml-auto text-[#3b82f6]">{it.on ? "✓" : ""}</span>}
                                    </button>
                                ),
                            )
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
