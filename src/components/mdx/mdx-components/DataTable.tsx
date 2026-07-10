"use client";

// 에디터 표 블록의 정적 렌더러 (포스트에서 사용). 에디터 TableBlock과 동일한 모양.
// data = encodeURIComponent(JSON.stringify(TableData))

export interface TableData {
    rows: string[][];
    headerRow?: boolean;
    headerCol?: boolean;
    rowColors?: (string | null)[];
    colColors?: (string | null)[];
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

export const HEADER_BG = "#f4f4f2";

export function cellBg(td: TableData, r: number, c: number, isHeaderCell: boolean): string | undefined {
    return td.rowColors?.[r] || td.colColors?.[c] || (isHeaderCell ? HEADER_BG : undefined);
}

export const TABLE_CELL_CLASS = "border border-[#d3d2ce] px-[9px] py-[7px] text-left align-top text-[14px] leading-[20px] text-(--text)";

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
        <div className="my-2 w-fit max-w-full overflow-x-auto">
            <table className="border-collapse">
                <tbody>
                    {rows.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => {
                                const isHeader = (!!td.headerRow && r === 0) || (!!td.headerCol && c === 0);
                                const Tag = (isHeader ? "th" : "td") as "th" | "td";
                                return (
                                    <Tag
                                        key={c}
                                        className={TABLE_CELL_CLASS}
                                        style={{ background: cellBg(td, r, c, isHeader), fontWeight: isHeader ? 600 : undefined }}
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
