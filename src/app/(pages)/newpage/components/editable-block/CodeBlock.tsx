"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import { canFormat, formatCode } from "../../lib/formatCode";
import { usePopupDirection } from "../../hooks/usePopupDirection";
import { useScrollLock } from "../../hooks/useScrollLock";
import { highlightCode } from "@/components/mdx/highlightCode";

// 노션풍 코드 블록(에디터). 왼쪽 줄번호 거터 + 투명 textarea + 뒤 hljs 색칠 오버레이.
// 긴 줄은 자동 줄바꿈(가로 스크롤 없음), 줄번호는 각 논리 줄 상단에 정렬. 높이는 내용만큼 자동.
// content = { code, lang } JSON. lang="auto"면 언어 자동감지. 편집은 newpage:setcode 로 상위 반영.

// hljs가 지원하는 모든 언어 + auto/plaintext (검색 드롭다운용)
export const CODE_LANGS: string[] = ["auto", "plaintext", ...hljs.listLanguages().filter((l) => l !== "plaintext").sort()];

// 표시용 친숙한 이름(없으면 첫 글자 대문자)
const NICE: Record<string, string> = {
    auto: "auto", plaintext: "Plain Text", javascript: "JavaScript", typescript: "TypeScript",
    cpp: "C++", csharp: "C#", css: "CSS", scss: "SCSS", less: "Less", xml: "HTML/XML",
    json: "JSON", yaml: "YAML", sql: "SQL", php: "PHP", go: "Go", rust: "Rust", ruby: "Ruby",
    python: "Python", java: "Java", kotlin: "Kotlin", swift: "Swift", bash: "Bash", shell: "Shell",
    graphql: "GraphQL", markdown: "Markdown", dockerfile: "Dockerfile", objectivec: "Objective-C",
    perl: "Perl", lua: "Lua", dart: "Dart", scala: "Scala", haskell: "Haskell", elixir: "Elixir",
    clojure: "Clojure", erlang: "Erlang", matlab: "MATLAB", powershell: "PowerShell", diff: "Diff",
};
const displayName = (l: string) => NICE[l] ?? l.charAt(0).toUpperCase() + l.slice(1);

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

export default function CodeBlock({ id, content, selected }: { id: string; content: string; selected?: boolean }) {
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

    // 하이라이팅(언어 지정 or 자동감지, 최상위 JSX 보정) → 줄 단위 HTML 배열
    useLayoutEffect(() => {
        const { value, language } = highlightCode(code, lang);
        setDetected(lang === "plaintext" ? "" : language);
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
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            /* 클립보드 접근 불가 무시 */
        }
    };

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

    const q = query.toLowerCase();
    const filtered = query ? CODE_LANGS.filter((l) => l.includes(q) || displayName(l).toLowerCase().includes(q)) : CODE_LANGS;
    const badge = lang === "auto" ? (detected ? `auto · ${displayName(detected)}` : "auto") : displayName(lang);
    const gutterW = Math.max(28, String(lineHtml.length).length * 9 + 16);
    const dropDir = usePopupDirection(langOpen, langWrapRef, 380); // 아래 공간 부족하면 위로
    useScrollLock(langOpen); // 언어 드롭다운 열려있는 동안 페이지 스크롤 잠금



    return (
        <div data-block-id={id} className="code-block group/code relative my-1">
            {/* 노션풍 코드 박스: 부드러운 회색 배경 + 라운드 + 넉넉한 패딩. 선택되면 박스 전체가 선택색으로 */}
            <div className="relative rounded-[10px]" style={{ padding: "18px 20px", background: selected ? "rgba(35,131,226,0.3)" : "#f7f6f3" }}>
                {/* 우측 상단 작업 툴바(노션풍): 언어 드롭다운 | 포맷 | 복사 — hover 시 표시(드롭다운 열려있으면 계속 표시) */}
                <div className={`absolute right-1 top-1 z-20 transition-opacity duration-200 ${langOpen ? "opacity-100" : "opacity-0 group-hover/code:opacity-100"}`}>
                    <div className="flex items-center rounded-md border border-(--border) bg-(--page-bg) p-[2px] shadow-md">
                        {/* 언어 드롭다운 */}
                        <div ref={langWrapRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setLangOpen((o) => !o)}
                                aria-label="언어 선택"
                                className="flex items-center gap-1 rounded-sm px-2 py-1 text-[12px] text-(--text) hover:bg-(--menu-hover-bg)"
                            >
                                {badge}
                                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden className="text-(--text-muted)">
                                    <path d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.63.63 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88" />
                                </svg>
                            </button>
                            {langOpen && (
                                <div className={`absolute right-0 flex max-h-[380px] w-72 flex-col overflow-hidden rounded-[10px] border border-(--border) bg-(--page-bg) shadow-xl ${dropDir === "up" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"}`}>
                                    <div className="px-2 pt-2 pb-1">
                                        <input
                                            autoFocus
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="언어를 검색하세요"
                                            className="editor-field h-7 w-full rounded-md bg-(--hover-bg) px-2.5 text-[13px] outline-none placeholder:text-(--text-muted)"
                                        />
                                    </div>
                                    <div data-scroll-allow className="overflow-y-auto px-1 pb-1">
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
                                                className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-[14px] text-(--text) hover:bg-(--menu-hover-bg) ${
                                                    l === lang ? "bg-(--menu-hover-bg)" : ""
                                                }`}
                                            >
                                                <span className="truncate">{displayName(l)}</span>
                                                {l === lang && (
                                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden className="shrink-0 text-(--text-muted)">
                                                        <path d="M15.784 4.002a.625.625 0 0 1 .214.857L9.445 15.784a.625.625 0 0 1-1.01.085l-4.37-5.098a.625.625 0 0 1 .948-.814l3.806 4.44 6.109-10.181a.625.625 0 0 1 .857-.214" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                        {!filtered.length && <div className="px-2.5 py-1 text-[13px] text-(--text-muted)">결과 없음</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mx-1 h-4 w-px shrink-0 rounded bg-(--border)" />

                        {/* 포맷(Prettier 지원 언어만) */}
                        {canFormat(effectiveLang) && (
                            <button
                                type="button"
                                onClick={() => runFormat(code)}
                                disabled={formatting}
                                className="rounded-sm px-2 py-1 text-[12px] text-(--text-muted) hover:bg-(--menu-hover-bg) disabled:opacity-50"
                                title="Prettier로 코드 정렬"
                            >
                                {formatting ? "정렬 중…" : "포맷"}
                            </button>
                        )}

                        {/* 복사 */}
                        <button
                            type="button"
                            onClick={copyCode}
                            aria-label="코드 복사"
                            title="코드 복사"
                            className="flex items-center rounded-sm px-1.5 py-1 text-(--text-muted) hover:bg-(--menu-hover-bg)"
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
                </div>

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
