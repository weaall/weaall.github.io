"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import hljs from "highlight.js";

// 노션풍 코드 블록(에디터). 투명 textarea + 뒤에 hljs로 색칠된 <pre> 오버레이.
// content = { code, lang } JSON. lang="auto"면 언어 자동감지. 편집 내용은 newpage:setcode 로 상위 반영.
// 가로 스크롤 없이 자동 줄바꿈, 높이는 내용만큼 자동(세로 스크롤 없음).

// 우측에서 고르는 언어(맨 앞 auto = 자동감지)
export const CODE_LANGS = [
    "auto", "plaintext", "bash", "c", "cpp", "csharp", "css", "dart", "diff", "dockerfile", "go",
    "graphql", "html", "java", "javascript", "json", "kotlin", "less", "lua", "markdown",
    "objectivec", "php", "python", "ruby", "rust", "scss", "shell", "sql", "swift",
    "typescript", "tsx", "jsx", "xml", "yaml",
];

// pre / textarea가 정확히 겹치도록 공유하는 텍스트 메트릭
const TEXT_STYLE: React.CSSProperties = {
    margin: 0,
    padding: "12px 16px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
    fontSize: "14px",
    lineHeight: "1.6",
    letterSpacing: "normal",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    tabSize: 2,
    border: 0,
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

export default function CodeBlock({ id, content }: { id: string; content: string }) {
    const initial = parseCode(content);
    const [code, setCode] = useState(initial.code);
    const [lang, setLang] = useState(initial.lang || "auto");
    const [langOpen, setLangOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [html, setHtml] = useState("");
    const [detected, setDetected] = useState("");
    const taRef = useRef<HTMLTextAreaElement>(null);
    const langWrapRef = useRef<HTMLDivElement>(null);

    const persist = (nextCode: string, nextLang: string) => {
        window.dispatchEvent(
            new CustomEvent("newpage:setcode", { detail: { id, content: JSON.stringify({ code: nextCode, lang: nextLang }) } }),
        );
    };

    // 하이라이팅(언어 지정 or 자동감지)
    useLayoutEffect(() => {
        const known = lang && lang !== "auto" && lang !== "plaintext" && hljs.getLanguage(lang);
        try {
            if (known) {
                setHtml(hljs.highlight(code, { language: lang, ignoreIllegals: true }).value);
                setDetected(lang);
            } else if (lang === "plaintext") {
                // 순수 텍스트: 하이라이트 없이(이스케이프만) — highlightAuto 안 씀
                setHtml(code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
                setDetected("");
            } else {
                const r = hljs.highlightAuto(code);
                setHtml(r.value);
                setDetected(r.language || "");
            }
        } catch {
            setHtml(code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        }
    }, [code, lang]);

    // 높이 자동 맞춤(내용 만큼 → 세로 스크롤 없음)
    useLayoutEffect(() => {
        const ta = taRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
    }, [code]);

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

    return (
        <div data-block-id={id} className="code-block relative my-1">
            {/* 언어 선택기: 코드 박스 바깥(위, 우측). 드롭다운이 박스 overflow에 잘리지 않게 밖으로 뺌 */}
            <div ref={langWrapRef} className="relative z-10 mb-1 flex justify-end">
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

            {/* 코드 박스: 뒤(색칠된 pre) + 위(투명 textarea) 오버레이 */}
            <div className="relative overflow-hidden rounded-[10px] border border-(--border) bg-[#f7f6f3]">
                <pre aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={TEXT_STYLE}>
                    <code className="hljs" style={{ background: "transparent", padding: 0 }} dangerouslySetInnerHTML={{ __html: (html || "") + "\n" }} />
                </pre>
                <textarea
                    ref={taRef}
                    value={code}
                    spellCheck={false}
                    placeholder="코드를 입력하세요"
                    onChange={(e) => {
                        setCode(e.target.value);
                        persist(e.target.value, lang);
                    }}
                    onKeyDown={handleKeyDown}
                    className="relative block w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-(--text-muted)"
                    style={{ ...TEXT_STYLE, color: "transparent", WebkitTextFillColor: "transparent", caretColor: "#24292e" }}
                    rows={1}
                />
            </div>
        </div>
    );
}
