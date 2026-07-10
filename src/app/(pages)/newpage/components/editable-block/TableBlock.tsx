"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TableData, cellBg, cellText, headerShadow } from "@/components/mdx/mdx-components/DataTable";
import * as tm from "../menu-modal/TypeMenu.modal.styles";
import { TEXT_COLORS } from "../menu-modal/TypeMenu.modal";
import { RightIcon, FontIcon, ColorPainterIcon, TrashBinIcon } from "@/components/ui/icons/TypeMenuSvg";

// 글자색: 전환(태그) 모달과 동일한 팔레트/아이콘 사용
const TEXT_OPTS: { c: string | null; label: string }[] = TEXT_COLORS.map((t) => ({ c: t.color, label: t.label }));
// 배경색(노션풍 옅은 톤)
const BG_OPTS: { c: string | null; label: string }[] = [
    { c: null, label: "기본 배경" },
    { c: "#f1f0ef", label: "회색 배경" },
    { c: "#faebdd", label: "갈색 배경" },
    { c: "#fbf3db", label: "노란색 배경" },
    { c: "#ddedea", label: "초록색 배경" },
    { c: "#ddebf1", label: "파란색 배경" },
    { c: "#eae4f2", label: "보라색 배경" },
    { c: "#f4dfeb", label: "분홍색 배경" },
    { c: "#fbe4e4", label: "빨간색 배경" },
];

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
                    rowTextColors: Array.isArray(p.rowTextColors) ? p.rowTextColors : [],
                    colTextColors: Array.isArray(p.colTextColors) ? p.colTextColors : [],
                    colWidths: Array.isArray(p.colWidths) ? p.colWidths : [],
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
const P_HEADER = "M3.75 5.5h12.5v3H3.75z";

type MenuState = { kind: "row" | "col"; index: number; top: number; left: number } | null;

export default function TableBlock({ id, content }: { id: string; content: string }) {
    const dataRef = useRef<TableData>(parseTable(content));
    const [version, setVersion] = useState(0);
    const [menu, setMenu] = useState<MenuState>(null);
    const [colorDrawer, setColorDrawer] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    // 선택(메뉴 열린) 행/열 위에 덮어씌울 두꺼운 파란 아웃라인의 위치
    const [overlay, setOverlay] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    useLayoutEffect(() => {
        const wrap = wrapRef.current;
        if (!menu || !wrap) {
            setOverlay(null);
            return;
        }
        const sel = Array.from(
            wrap.querySelectorAll<HTMLElement>(menu.kind === "row" ? `td[data-r="${menu.index}"]` : `td[data-c="${menu.index}"]`),
        );
        if (!sel.length) {
            setOverlay(null);
            return;
        }
        const w = wrap.getBoundingClientRect();
        let top = Infinity,
            left = Infinity,
            right = -Infinity,
            bottom = -Infinity;
        sel.forEach((el) => {
            const r = el.getBoundingClientRect();
            top = Math.min(top, r.top);
            left = Math.min(left, r.left);
            right = Math.max(right, r.right);
            bottom = Math.max(bottom, r.bottom);
        });
        setOverlay({ top: top - w.top, left: left - w.left, width: right - left, height: bottom - top });
    }, [menu, version]);

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
        setColorDrawer(false);
    };

    useEffect(() => {
        if (!content) commit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const d = dataRef.current;
    d.rowColors ||= [];
    d.colColors ||= [];
    d.rowTextColors ||= [];
    d.colTextColors ||= [];
    d.colWidths ||= [];
    const cols = d.rows[0]?.length ?? 0;

    const setCell = (r: number, c: number, val: string) => {
        d.rows[r][c] = val;
        scheduleCommit();
    };

    const insertRowAt = (i: number) => {
        d.rows.splice(i, 0, Array(cols || 1).fill(""));
        d.rowColors!.splice(i, 0, null);
        d.rowTextColors!.splice(i, 0, null);
    };
    const insertColAt = (i: number) => {
        d.rows.forEach((row) => row.splice(i, 0, ""));
        d.colColors!.splice(i, 0, null);
        d.colTextColors!.splice(i, 0, null);
        d.colWidths!.splice(i, 0, null); // 새 열은 자동 너비
    };
    const duplicateRow = (r: number) => {
        d.rows.splice(r + 1, 0, [...d.rows[r]]);
        d.rowColors!.splice(r + 1, 0, d.rowColors![r] ?? null);
        d.rowTextColors!.splice(r + 1, 0, d.rowTextColors![r] ?? null);
    };
    const duplicateCol = (c: number) => {
        d.rows.forEach((row) => row.splice(c + 1, 0, row[c]));
        d.colColors!.splice(c + 1, 0, d.colColors![c] ?? null);
        d.colTextColors!.splice(c + 1, 0, d.colTextColors![c] ?? null);
        d.colWidths!.splice(c + 1, 0, d.colWidths![c] ?? null);
    };
    const clearRow = (r: number) => (d.rows[r] = d.rows[r].map(() => ""));
    const clearCol = (c: number) => d.rows.forEach((row) => (row[c] = ""));
    const removeRow = (r: number) => {
        if (d.rows.length <= 1) return;
        d.rows.splice(r, 1);
        d.rowColors!.splice(r, 1);
        d.rowTextColors!.splice(r, 1);
    };
    const removeCol = (c: number) => {
        if (cols <= 1) return;
        d.rows.forEach((row) => row.splice(c, 1));
        d.colColors!.splice(c, 1);
        d.colTextColors!.splice(c, 1);
        d.colWidths!.splice(c, 1);
    };

    // 열 너비 드래그 조절: 경계를 끌면 그 열과 "오른쪽 이웃 열"을 함께 조절해
    // 전체 표 너비는 유지(왼쪽 열들은 그대로). 마지막 열이면 표가 늘어난다.
    const MIN_W = 48;
    const startColResize = (c: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const measure = (i: number) => wrapRef.current?.querySelector<HTMLElement>(`td[data-c="${i}"]`)?.getBoundingClientRect().width ?? 120;
        const startWc = measure(c);
        const hasNext = c + 1 < cols;
        const startWn = hasNext ? measure(c + 1) : 0;
        // 마지막 열(이웃 없음)을 늘릴 때 표가 편집 영역(고정 712 컬럼)을 넘지 않도록 최대 너비 계산.
        // 부모(flex-1)는 표 따라 커지므로 기준으로 못 씀 → 폭이 고정된 [data-editor-col]을 기준으로.
        const tableEl = wrapRef.current?.querySelector("table");
        const tableRect = tableEl?.getBoundingClientRect();
        const tableW = tableRect?.width ?? 0;
        const tableLeft = tableRect?.left ?? 0;
        const colEl = wrapRef.current?.closest("[data-editor-col]");
        const colRight = colEl?.getBoundingClientRect().right ?? window.innerWidth;
        const maxTableW = Math.max(200, colRight - tableLeft - 24); // 우측 wrapper 패딩(18)+여백 고려
        const maxWcLast = Math.max(MIN_W, Math.round(maxTableW - (tableW - startWc))); // 마지막 열 최대
        const startX = e.clientX;
        const onMove = (ev: MouseEvent) => {
            let dx = ev.clientX - startX;
            if (hasNext) {
                // 두 열 모두 최소 너비를 지키도록 dx 클램프 (전체 폭 유지)
                dx = Math.max(-(startWc - MIN_W), Math.min(dx, startWn - MIN_W));
                d.colWidths![c] = Math.round(startWc + dx);
                d.colWidths![c + 1] = Math.round(startWn - dx);
            } else {
                // 마지막 열: 최소~최대(편집 영역) 사이로 클램프
                d.colWidths![c] = Math.min(maxWcLast, Math.max(MIN_W, Math.round(startWc + dx)));
            }
            setVersion((v) => v + 1);
        };
        const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            commit();
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
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
        setColorDrawer(false);
        setMenu({ kind, index, top: r.bottom + 4, left: Math.min(r.left, window.innerWidth - 420) });
    };

    const grid = d.rows;
    const bar = (active: boolean) =>
        `absolute z-[4] cursor-pointer rounded-[3px] opacity-0 transition group-hover/table:opacity-100 ${
            active ? "!bg-[#3b82f6] !opacity-100" : "bg-[#c4c4c2] hover:bg-[#3b82f6]"
        }`;
    const addBtn =
        "absolute flex items-center justify-center rounded-[4px] border border-(--border) bg-(--hover-bg) text-(--text-muted) opacity-0 transition-opacity group-hover/table:opacity-100 hover:!bg-[#e3e2df]";

    type Item = { icon?: string; iconNode?: React.ReactNode; label: string; run?: () => void; danger?: boolean; rotate?: number; color?: boolean; on?: boolean };
    const items: Item[] = menu
        ? [
              { iconNode: <ColorPainterIcon color="#5f5e5b" />, label: "색", color: true },
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
              { iconNode: <TrashBinIcon color="#5f5e5b" />, label: "삭제", danger: true, run: () => (menu.kind === "row" ? removeRow(menu.index) : removeCol(menu.index)) },
          ]
        : [];

    const setBgColor = (color: string | null) => {
        if (!menu) return;
        if (menu.kind === "row") d.rowColors![menu.index] = color;
        else d.colColors![menu.index] = color;
    };
    const setTextColor = (color: string | null) => {
        if (!menu) return;
        if (menu.kind === "row") d.rowTextColors![menu.index] = color;
        else d.colTextColors![menu.index] = color;
    };

    return (
        <div ref={wrapRef} id={id} className="group/table relative my-2 w-fit p-[18px]">
            <table className="border-collapse">
                <tbody>
                    {grid.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => {
                                const isHeader = (!!d.headerRow && r === 0) || (!!d.headerCol && c === 0);
                                const bg = cellBg(d, r, c, isHeader);
                                const cw = d.colWidths![c] || undefined;
                                return (
                                    <td
                                        key={c}
                                        data-r={r}
                                        data-c={c}
                                        className="relative border border-[#d3d2ce] p-0 align-top"
                                        style={{ background: bg, boxShadow: headerShadow(d, r, c), width: cw, minWidth: cw ? undefined : 120 }}
                                    >
                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            className={`min-h-[20px] px-[8px] py-[5px] text-[14px] leading-[20px] text-(--text) outline-none ${
                                                cw ? "" : "min-w-[120px] break-words"
                                            }`}
                                            style={{
                                                fontWeight: isHeader ? 600 : undefined,
                                                color: cellText(d, r, c),
                                                // 너비를 지정한 열은 그 폭으로 고정하고 내용은 줄바꿈(→ 세로로 늘어남, 폭 불변)
                                                width: cw ? cw : undefined,
                                                overflowWrap: cw ? "anywhere" : undefined,
                                                whiteSpace: cw ? "normal" : undefined,
                                            }}
                                            onInput={(e) => setCell(r, c, e.currentTarget.innerText)}
                                            dangerouslySetInnerHTML={{ __html: esc(cell) }}
                                        />
                                        {/* 열 너비 조절 핸들 (오른쪽 경계) */}
                                        <div
                                            className="absolute top-0 right-[-3px] z-[5] h-full w-[6px] cursor-col-resize opacity-0 hover:opacity-100 group-hover/table:opacity-100"
                                            onMouseDown={startColResize(c)}
                                        >
                                            <div className="mx-auto h-full w-[2px] bg-[#3b82f6]/40" />
                                        </div>
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

            {/* 선택된 행/열 위에 덮어씌우는 두꺼운 파란 아웃라인 */}
            {overlay && (
                <div
                    className="pointer-events-none absolute z-[3] rounded-[2px] border-2 border-[#3b82f6]"
                    style={{ top: overlay.top, left: overlay.left, width: overlay.width, height: overlay.height }}
                />
            )}

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
                    <div className="fixed inset-0 z-[1900]" onMouseDown={(e) => e.stopPropagation()} onClick={() => { setMenu(null); setColorDrawer(false); }} />
                    {/* 전환(태그) 모달과 동일한 드로워 디자인 */}
                    <div
                        data-theme="light"
                        className="animate-popIn fixed z-[2000] flex"
                        style={{ top: menu.top, left: menu.left, transformOrigin: "top left" }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <tm.Menu style={{ minWidth: "180px", position: "relative" }}>
                            {items.map((it) =>
                                it.color ? (
                                    <tm.MenuButton
                                        key={it.label}
                                        className={colorDrawer ? "bg-(--menu-hover-bg)" : ""}
                                        onMouseEnter={() => setColorDrawer(true)}
                                        onMouseDown={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setColorDrawer(true); }}
                                    >
                                        <tm.LabelWrap>
                                            <tm.SvgWrap>{it.iconNode}</tm.SvgWrap>
                                            {it.label}
                                        </tm.LabelWrap>
                                        <tm.SvgWrap><RightIcon color="#5f5e5b" /></tm.SvgWrap>
                                    </tm.MenuButton>
                                ) : (
                                    <tm.MenuButton
                                        key={it.label}
                                        onMouseEnter={() => setColorDrawer(false)}
                                        onMouseDown={noFocus(() => apply(it.run!))}
                                        style={it.danger ? { color: "#e65b58" } : undefined}
                                    >
                                        <tm.LabelWrap>
                                            <tm.SvgWrap>{it.iconNode ?? <Ico d={it.icon!} rotate={it.rotate} />}</tm.SvgWrap>
                                            {it.label}
                                        </tm.LabelWrap>
                                        {it.on !== undefined && <tm.ExpLabel style={{ color: "#3b82f6" }}>{it.on ? "✓" : ""}</tm.ExpLabel>}
                                    </tm.MenuButton>
                                ),
                            )}
                        </tm.Menu>
                        {colorDrawer && (
                            <tm.DrawerMenu
                                style={{ left: "calc(100% + 6px)", maxHeight: "70vh", overflowY: "auto" }}
                                onMouseEnter={() => setColorDrawer(true)}
                                onMouseLeave={() => setColorDrawer(false)}
                            >
                                <tm.Label>색</tm.Label>
                                {TEXT_OPTS.map(({ c, label }) => (
                                    <tm.MenuButton key={`t-${label}`} onMouseDown={noFocus(() => apply(() => setTextColor(c)))}>
                                        <tm.LabelWrap>
                                            <tm.SvgWrap>
                                                <FontIcon color={c ?? "#5f5e5b"} />
                                            </tm.SvgWrap>
                                            {label}
                                        </tm.LabelWrap>
                                    </tm.MenuButton>
                                ))}
                                <tm.Label>배경</tm.Label>
                                {BG_OPTS.map(({ c, label }) => (
                                    <tm.MenuButton key={`b-${label}`} onMouseDown={noFocus(() => apply(() => setBgColor(c)))}>
                                        <tm.LabelWrap>
                                            <tm.SvgWrap>
                                                <div className="h-4 w-4 rounded-[4px] border border-black/15" style={{ background: c ?? "#ffffff" }} />
                                            </tm.SvgWrap>
                                            {label}
                                        </tm.LabelWrap>
                                    </tm.MenuButton>
                                ))}
                            </tm.DrawerMenu>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
