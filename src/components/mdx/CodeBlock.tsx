import React, { useMemo, useState } from "react";
import { highlightCode, splitHljsLines } from "./highlightCode";

// 게시글 코드블록: 에디터(/newpage)의 노션 디자인과 동일 —
// 왼쪽 줄번호 거터 + 부드러운 회색 배경 + 라운드 + 자동 줄바꿈, 우측 상단(호버) 언어라벨 + 복사.
export interface CodeStyles {
    CodeWrapC: React.ElementType;
    ClassWrap: React.ElementType;
    ClassLabel: React.ElementType;
    CodeBoxC: React.ElementType;
    Code: React.ElementType;
}

interface CodeBlockProps {
    className?: string;
    children?: React.ReactNode;
    styles?: CodeStyles; // 하위호환용(현재 미사용) — 디자인은 고정 노션 스타일
}

// 에디터 CodeBlock과 동일한 텍스트 메트릭
const CODE_FONT: React.CSSProperties = {
    margin: 0,
    padding: 0,
    border: 0,
    fontFamily: "SFMono-Regular, Menlo, Consolas, 'PT Mono', 'Liberation Mono', Courier, monospace",
    fontSize: "13.5px",
    lineHeight: "1.6",
    letterSpacing: "normal",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    tabSize: 2,
    boxSizing: "border-box",
};

export default function CodeBlock({ className, children }: CodeBlockProps) {
    const raw = children?.toString() || "";
    const lang = className ? className.replace("language-", "") : "";
    const { value, language } = useMemo(() => highlightCode(raw, lang || "auto"), [raw, lang]);
    const lines = useMemo(() => splitHljsLines(value), [value]);
    const gutterW = Math.max(28, String(lines.length).length * 9 + 16);

    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(raw);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            /* 무시 */
        }
    };

    return (
        <div className="code-block group relative my-4">
            <div className="relative rounded-[10px] bg-[#f7f6f3]" style={{ padding: "18px 20px" }}>
                {/* 우측 상단(호버): 언어 라벨 + 복사 */}
                <div className="absolute right-2 top-2 z-20 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {language && <span className="font-mono text-[11px] lowercase text-(--text-muted)">{language}</span>}
                    <button
                        type="button"
                        onClick={copy}
                        aria-label="코드 복사"
                        title="코드 복사"
                        className="flex items-center rounded-sm bg-(--page-bg)/70 p-1 text-(--text-muted) hover:bg-(--page-bg) hover:text-(--text)"
                    >
                        {copied ? (
                            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path d="M3.5 8.5l3 3 6-6.5" stroke="#22863a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                <path d="M3.25 1.375c-1.036 0-1.875.84-1.875 1.875v6c0 1.036.84 1.875 1.875 1.875h1.625v1.625c0 1.036.84 1.875 1.875 1.875h6c1.036 0 1.875-.84 1.875-1.875v-6c0-1.036-.84-1.875-1.875-1.875h-1.625V3.25c0-1.036-.84-1.875-1.875-1.875zM2.625 3.25c0-.345.28-.625.625-.625h6c.345 0 .625.28.625.625v1.625H6.75c-1.036 0-1.875.84-1.875 1.875v3.125H3.25a.625.625 0 0 1-.625-.625zm3.5 3.5c0-.345.28-.625.625-.625h6c.345 0 .625.28.625.625v6c0 .345-.28.625-.625.625h-6a.625.625 0 0 1-.625-.625z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* [번호][코드셀] 한 행 → 줄바꿈돼도 번호가 그 줄 상단 정렬 */}
                {lines.map((h, i) => (
                    <div key={i} className="flex" style={{ alignItems: "flex-start" }}>
                        <div className="shrink-0 select-none" style={{ ...CODE_FONT, width: gutterW, paddingRight: 14, textAlign: "right", color: "#b3afa4" }}>
                            {i + 1}
                        </div>
                        <div
                            className="hljs min-w-0 flex-1"
                            style={{ ...CODE_FONT, background: "transparent", color: "#24292e" }}
                            dangerouslySetInnerHTML={{ __html: h === "" ? "&nbsp;" : h }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
