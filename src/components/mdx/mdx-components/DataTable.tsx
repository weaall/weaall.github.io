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

export const HEADER_BG = "#f4f4f2";

export function cellBg(td: TableData, r: number, c: number, isHeaderCell: boolean): string | undefined {
    return td.rowColors?.[r] || td.colColors?.[c] || (isHeaderCell ? HEADER_BG : undefined);
}

export function cellText(td: TableData, r: number, c: number): string | undefined {
    return td.rowTextColors?.[r] || td.colTextColors?.[c] || undefined;
}

// 제목 행/열은 보더를 더 두껍게: 헤더와 본문 사이 경계선을 inset box-shadow로 2px 덧그린다.
export function headerShadow(td: TableData, r: number, c: number): string | undefined {
    const s: string[] = [];
    if (td.headerRow && r === 0) s.push("inset 0 -2px 0 0 #b9b8b4");
    if (td.headerCol && c === 0) s.push("inset -2px 0 0 0 #b9b8b4");
    return s.length ? s.join(", ") : undefined;
}

export const TABLE_CELL_CLASS = "border border-[#d3d2ce] px-[8px] py-[5px] text-left align-top text-[14px] leading-[20px] break-words text-(--text)";

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
                                        style={{
                                            background: cellBg(td, r, c, isHeader),
                                            color: cellText(td, r, c),
                                            fontWeight: isHeader ? 600 : undefined,
                                            boxShadow: headerShadow(td, r, c),
                                            width: td.colWidths?.[c] || undefined,
                                            minWidth: td.colWidths?.[c] ? undefined : 120,
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
