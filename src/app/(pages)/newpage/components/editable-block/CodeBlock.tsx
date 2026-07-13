"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// 노션풍 코드 블록(에디터). 모노스페이스 textarea + 우측 언어 선택 드롭다운.
// content = { code, lang } JSON. 편집 내용은 newpage:setcode 이벤트로 상위 blocks에 반영.
// 포스트에서는 ```lang 펜스로 내보내져 기존 CodeBlock(hljs)로 하이라이팅된다.

// 우측에서 고르는 언어 목록(하이라이트 지원 흔한 것들)
export const CODE_LANGS = [
    "plaintext", "bash", "c", "cpp", "csharp", "css", "dart", "diff", "dockerfile", "go",
    "graphql", "html", "java", "javascript", "json", "kotlin", "less", "lua", "markdown",
    "objectivec", "php", "python", "ruby", "rust", "scss", "shell", "sql", "swift",
    "typescript", "tsx", "jsx", "xml", "yaml",
];

function parseCode(content: string): { code: string; lang: string } {
    if (content && content[0] === "{") {
        try {
            const p = JSON.parse(content);
            if (typeof p.code === "string") return { code: p.code, lang: typeof p.lang === "string" ? p.lang : "plaintext" };
        } catch {
            /* 폴백: content 그대로 코드로 */
        }
    }
    return { code: content || "", lang: "plaintext" };
}

export default function CodeBlock({ id, content }: { id: string; content: string }) {
    const initial = parseCode(content);
    const [code, setCode] = useState(initial.code);
    const [lang, setLang] = useState(initial.lang || "plaintext");
    const [langOpen, setLangOpen] = useState(false);
    const [query, setQuery] = useState("");
    const taRef = useRef<HTMLTextAreaElement>(null);
    const langWrapRef = useRef<HTMLDivElement>(null);

    const persist = (nextCode: string, nextLang: string) => {
        window.dispatchEvent(
            new CustomEvent("newpage:setcode", { detail: { id, content: JSON.stringify({ code: nextCode, lang: nextLang }) } }),
        );
    };

    // 높이 자동 맞춤(내용 만큼)
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Tab → 2칸 들여쓰기(포커스 이동 대신)
        if (e.key === "Tab") {
            e.preventDefault();
            const ta = e.currentTarget;
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const next = code.slice(0, start) + "  " + code.slice(end);
            setCode(next);
            persist(next, lang);
            requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = start + 2;
            });
        }
    };

    const filtered = query ? CODE_LANGS.filter((l) => l.includes(query.toLowerCase())) : CODE_LANGS;

    return (
        <div data-block-id={id} className="code-block relative my-1 overflow-hidden rounded-[10px] border border-(--border) bg-[#f7f6f3]">
            {/* 우측 상단 언어 선택 */}
            <div ref={langWrapRef} className="absolute right-2 top-2 z-10">
                <button
                    type="button"
                    onClick={() => setLangOpen((o) => !o)}
                    className="rounded-[6px] bg-white/70 px-2 py-1 font-mono text-[11px] lowercase text-(--text-muted) hover:bg-white"
                >
                    {lang}
                </button>
                {langOpen && (
                    <div className="absolute right-0 top-[calc(100%+4px)] max-h-[240px] w-[160px] overflow-y-auto rounded-[8px] border border-(--border) bg-(--page-bg) py-1 shadow-lg">
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="언어 검색"
                            className="mx-1 mb-1 w-[calc(100%-8px)] rounded-[4px] border border-(--border) px-2 py-1 text-[12px] outline-none"
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
                className="block w-full resize-none whitespace-pre bg-transparent px-4 py-3 pr-16 font-mono text-[14px] leading-relaxed text-(--text) outline-none"
                rows={1}
            />
        </div>
    );
}
