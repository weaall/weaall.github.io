"use client";

// 에디터 표 블록의 정적 렌더러 (포스트에서 사용). 에디터 TableBlock과 동일한 모양.
// data = encodeURIComponent(JSON.stringify(TableData))

export interface TableData {
    rows: string[][];
    headerRow?: boolean;
    headerCol?: boolean;
    rowColors?: (string | null)[]; // 행 배경색
    colColors?: (string | null)[]; // 열 배경색
    rowTextColors?: (string | null)[]; // 행 글자색
    colTextColors?: (string | null)[]; // 열 글자색
    colWidths?: (number | null)[]; // 열별 고정 너비(px). 없으면 내용에 맞춰 자동.
}

// 셀 배경 팔레트(노션풍 옅은 배경). null = 없음(기본).
export const TABLE_COLORS: (string | null)[] = [
    null,
    "#f1f0ef",
    "#faebdd",
    "#fbf3db",
    "#ddedea",
    "#ddebf1",
    "#eae4f2",
    "#f4dfeb",
    "#fbe4e4",
];

// 마크다운 post-table(Th/globals의 td:first-child)과 동일한 헤더 음영색.
export const HEADER_BG = "#f4f3f1";

// 헤더 행/열 + 첫 열은 회색 음영(마크다운 post-table과 동일). 명시적 셀 색이 있으면 그게 우선.
export function cellBg(td: TableData, r: number, c: number, isHeaderCell: boolean): string | undefined {
    return td.rowColors?.[r] || td.colColors?.[c] || (isHeaderCell || c === 0 ? HEADER_BG : undefined);
}

export function cellText(td: TableData, r: number, c: number): string | undefined {
    return td.rowTextColors?.[r] || td.colTextColors?.[c] || undefined;
}

export default function DataTable({ data }: { data?: string }) {
    let td: TableData = { rows: [] };
    try {
        td = JSON.parse(decodeURIComponent(data || ""));
    } catch {
        td = { rows: [] };
    }
    const rows = td.rows ?? [];
    if (!rows.length) return null;

    return (
        // 마크다운 표(post-table)와 동일: 전체폭, 헤더/첫 열 회색 음영, 10px 패딩, 얇은 보더.
        <div className="my-3 w-full max-w-full overflow-x-auto">
            <table className="post-table w-full border-collapse">
                <tbody>
                    {rows.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => {
                                const isHeaderCell = (!!td.headerRow && r === 0) || (!!td.headerCol && c === 0);
                                const strong = isHeaderCell || c === 0; // 헤더 + 첫 열은 볼드·강조색
                                const cw = td.colWidths?.[c] || undefined;
                                const Tag = (isHeaderCell ? "th" : "td") as "th" | "td";
                                return (
                                    <Tag
                                        key={c}
                                        className={`border border-[#d3d2ce] px-[10px] text-left align-top text-[14px] leading-[20px] ${
                                            isHeaderCell ? "py-[8px]" : "py-[7px]"
                                        } ${cw ? "" : "break-words"}`}
                                        style={{
                                            background: cellBg(td, r, c, isHeaderCell),
                                            color: cellText(td, r, c) ?? (strong ? "var(--text-strong)" : "var(--text)"),
                                            fontWeight: strong ? 600 : undefined,
                                            // 열 너비 지정 시 그 폭 고정, 아니면 첫 열은 내용폭(nowrap), 나머지는 자동.
                                            width: cw ?? (c === 0 ? "1%" : undefined),
                                            whiteSpace: cw ? "normal" : c === 0 ? "nowrap" : undefined,
                                            overflowWrap: cw ? "anywhere" : undefined,
                                        }}
                                    >
                                        {cell}
                                    </Tag>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
