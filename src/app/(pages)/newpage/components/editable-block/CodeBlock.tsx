"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import { canFormat, formatCode } from "../../lib/formatCode";

// 노션풍 코드 블록(에디터). 왼쪽 줄번호 거터 + 투명 textarea + 뒤 hljs 색칠 오버레이.
// 긴 줄은 자동 줄바꿈(가로 스크롤 없음), 줄번호는 각 논리 줄 상단에 정렬. 높이는 내용만큼 자동.
// content = { code, lang } JSON. lang="auto"면 언어 자동감지. 편집은 newpage:setcode 로 상위 반영.

export const CODE_LANGS = [
    "auto", "plaintext", "bash", "c", "cpp", "csharp", "css", "dart", "diff", "dockerfile", "go",
    "graphql", "html", "java", "javascript", "json", "kotlin", "less", "lua", "markdown",
    "objectivec", "php", "python", "ruby", "rust", "scss", "shell", "sql", "swift",
    "typescript", "tsx", "jsx", "xml", "yaml",
];

// pre(코드셀) / textarea가 정확히 겹치도록 공유하는 텍스트 메트릭 (패딩은 바깥 박스가 담당)
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

function parseCode(content: string): { code: string; lang: string } {
    if (content && content[0] === "{") {
        try {
            const p = JSON.parse(content);
            if (typeof p.code === "string") return { code: p.code, lang: typeof p.lang === "string" ? p.lang : "auto" };
        } catch {
            /* 폴백: content 그대로 코드 */
        }
    }
    return { code: content || "", lang: "auto" };
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// hljs가 만든 HTML을 줄 단위로 분리(줄을 넘나드는 <span>은 각 줄에서 다시 열고 닫아 유지).
function splitHljsLines(html: string): string[] {
    const open: string[] = [];
    return html.split("\n").map((line) => {
        const prefix = open.join("");
        const re = /<span[^>]*>|<\/span>/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(line))) {
            if (m[0] === "</span>") open.pop();
            else open.push(m[0]);
        }
        const suffix = "</span>".repeat(open.length);
        return prefix + line + suffix;
    });
}

export default function CodeBlock({ id, content }: { id: string; content: string }) {
    const initial = parseCode(content);
    const [code, setCode] = useState(initial.code);
    const [lang, setLang] = useState(initial.lang || "auto");
    const [langOpen, setLangOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [lineHtml, setLineHtml] = useState<string[]>([]);
    const [detected, setDetected] = useState("");
    const taRef = useRef<HTMLTextAreaElement>(null);
    const langWrapRef = useRef<HTMLDivElement>(null);

    const persist = (nextCode: string, nextLang: string) => {
        window.dispatchEvent(
            new CustomEvent("newpage:setcode", { detail: { id, content: JSON.stringify({ code: nextCode, lang: nextLang }) } }),
        );
    };

    // 하이라이팅(언어 지정 or 자동감지) → 줄 단위 HTML 배열
    useLayoutEffect(() => {
        const known = lang && lang !== "auto" && lang !== "plaintext" && hljs.getLanguage(lang);
        let value: string;
        try {
            if (known) {
                value = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
                setDetected(lang);
            } else if (lang === "plaintext") {
                value = escapeHtml(code);
                setDetected("");
            } else {
                const r = hljs.highlightAuto(code);
                value = r.value;
                setDetected(r.language || "");
            }
        } catch {
            value = escapeHtml(code);
        }
        setLineHtml(splitHljsLines(value));
    }, [code, lang]);

    // 드롭다운 바깥 클릭 시 닫기
    useEffect(() => {
        if (!langOpen) return;
        const onDown = (e: MouseEvent) => {
            if (langWrapRef.current && !langWrapRef.current.contains(e.target as Node)) {
                setLangOpen(false);
                setQuery("");
            }
        };
        window.addEventListener("mousedown", onDown);
        return () => window.removeEventListener("mousedown", onDown);
    }, [langOpen]);

    // 포맷 대상 언어(auto면 감지 언어)
    const detectLang = (src: string) => (lang !== "auto" ? lang : hljs.highlightAuto(src).language || "");
    const effectiveLang = lang !== "auto" ? lang : detected;
    const [formatting, setFormatting] = useState(false);

    // Prettier 포맷 실행(지원 언어만). 성공 시 코드 교체.
    const runFormat = async (src: string) => {
        const l = detectLang(src);
        if (!canFormat(l)) return;
        setFormatting(true);
        try {
            const f = await formatCode(src, l);
            if (f !== src) {
                setCode(f);
                persist(f, lang);
            }
        } finally {
            setFormatting(false);
        }
    };

    // 커서 위치를 유지하며 코드 갱신
    const replaceSelection = (ta: HTMLTextAreaElement, insert: string, start: number, end: number, caret: number) => {
        const next = code.slice(0, start) + insert + code.slice(end);
        setCode(next);
        persist(next, lang);
        requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = caret;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;

        // Tab → 2칸 들여쓰기(포커스 이동 대신)
        if (e.key === "Tab") {
            e.preventDefault();
            replaceSelection(ta, "  ", start, end, start + 2);
            return;
        }
        // Enter → 이전 줄의 들여쓰기(선행 공백)를 유지
        if (e.key === "Enter") {
            e.preventDefault();
            const lineStart = code.lastIndexOf("\n", start - 1) + 1;
            const indent = /^[ \t]*/.exec(code.slice(lineStart, start))?.[0] ?? "";
            const insert = "\n" + indent;
            replaceSelection(ta, insert, start, end, start + insert.length);
            return;
        }
    };

    const filtered = query ? CODE_LANGS.filter((l) => l.includes(query.toLowerCase())) : CODE_LANGS;
    const badge = lang === "auto" ? (detected ? `auto · ${detected}` : "auto") : lang;
    const gutterW = Math.max(28, String(lineHtml.length).length * 9 + 16);

    return (
        <div data-block-id={id} className="code-block relative my-1">
            {/* 언어 선택기 + 포맷 버튼: 코드 박스 바깥(위, 우측) */}
            <div ref={langWrapRef} className="relative z-10 mb-1 flex justify-end gap-1">
                {canFormat(effectiveLang) && (
                    <button
                        type="button"
                        onClick={() => runFormat(code)}
                        disabled={formatting}
                        className="rounded-md border border-(--border) bg-(--page-bg) px-2 py-1 font-mono text-[11px] text-(--text-muted) hover:bg-(--menu-hover-bg) disabled:opacity-50"
                        title="Prettier로 코드 정렬"
                    >
                        {formatting ? "정렬 중…" : "포맷"}
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => setLangOpen((o) => !o)}
                    className="rounded-md border border-(--border) bg-(--page-bg) px-2 py-1 font-mono text-[11px] lowercase text-(--text-muted) hover:bg-(--menu-hover-bg)"
                >
                    {badge} ▾
                </button>
                {langOpen && (
                    <div className="absolute right-0 top-[calc(100%+4px)] max-h-60 w-40 overflow-y-auto rounded-lg border border-(--border) bg-(--page-bg) py-1 shadow-lg">
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="언어 검색"
                            className="mx-1 mb-1 w-[calc(100%-8px)] rounded-sm border border-(--border) px-2 py-1 text-[12px] outline-none"
                        />
                        {filtered.map((l) => (
                            <button
                                key={l}
                                type="button"
                                onClick={() => {
                                    setLang(l);
                                    setLangOpen(false);
                                    setQuery("");
                                    persist(code, l);
                                }}
                                className={`block w-full px-3 py-1 text-left font-mono text-[12px] lowercase hover:bg-(--menu-hover-bg) ${
                                    l === lang ? "text-(--text) font-semibold" : "text-(--text-muted)"
                                }`}
                            >
                                {l}
                            </button>
                        ))}
                        {!filtered.length && <div className="px-3 py-1 text-[12px] text-(--text-muted)">결과 없음</div>}
                    </div>
                )}
            </div>

            {/* 노션풍 코드 박스: 부드러운 회색 배경 + 라운드 + 넉넉한 패딩 */}
            <div className="overflow-hidden rounded-[10px] bg-[#f7f6f3]" style={{ padding: "18px 20px" }}>
                <div className="relative">
                    {/* 색칠된 코드: [번호][코드셀] 한 행 → 줄바꿈돼도 번호가 그 줄 상단에 정렬 */}
                    <div aria-hidden>
                        {lineHtml.map((h, i) => (
                            <div key={i} className="flex" style={{ alignItems: "flex-start" }}>
                                <div
                                    className="shrink-0 select-none"
                                    style={{ ...CODE_FONT, width: gutterW, paddingRight: 14, textAlign: "right", color: "#b3afa4" }}
                                >
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
                    {/* 투명 textarea: 코드셀 영역 위에만 겹침(번호 거터만큼 오른쪽으로) */}
                    <textarea
                        ref={taRef}
                        value={code}
                        spellCheck={false}
                        onChange={(e) => {
                            setCode(e.target.value);
                            persist(e.target.value, lang);
                        }}
                        onPaste={() => {
                            // 붙여넣기 후 지원 언어면 자동 감지 → Prettier 포맷 (onChange 반영 뒤 실행)
                            setTimeout(() => {
                                const ta = taRef.current;
                                if (ta) runFormat(ta.value);
                            }, 0);
                        }}
                        onKeyDown={handleKeyDown}
                        className="absolute top-0 resize-none overflow-hidden bg-transparent outline-none"
                        style={{
                            ...CODE_FONT,
                            left: gutterW,
                            width: `calc(100% - ${gutterW}px)`,
                            height: "100%",
                            color: "transparent",
                            WebkitTextFillColor: "transparent",
                            caretColor: "#24292e",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
