"use client";

import { useEffect, useMemo, useState } from "react";
import PostListDrawer from "@/components/PostListDrawer/PostListDrawer";
import HoverHeader from "@/components/ui/hover-header/HoverHeader";
import { useHoverHeader } from "@/hooks/useHoverHeader";
import { PostData } from "@/types/PostData";
import { PageIcon } from "@/app/(pages)/newpage/lib/pageIcon";
import { SearchIcon } from "@/components/PostListDrawer/SvgDrawer";

const cleanTags = (tags?: string[]) => (tags || []).filter((t) => t && t !== "default-tag");

// 검색어를 텍스트에서 하이라이트
function Highlight({ text, q }: { text: string; q: string }) {
    if (!q) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="rounded-[3px] bg-[#fde68a] px-0.5 text-(--text)">{text.slice(idx, idx + q.length)}</mark>
            {text.slice(idx + q.length)}
        </>
    );
}

function ResultCard({ post, q }: { post: PostData; q: string }) {
    const tags = cleanTags(post.tags);
    // 본문에서만 매칭되면 매칭 주변 스니펫을 보여준다
    const snippet = (() => {
        if (!q || !post.body) return null;
        const lc = post.body.toLowerCase();
        const idx = lc.indexOf(q.toLowerCase());
        if (idx === -1) return null;
        const inMeta = `${post.title} ${post.subTitle || ""} ${post.label || ""} ${(post.tags || []).join(" ")}`.toLowerCase().includes(q.toLowerCase());
        if (inMeta) return null;
        const start = Math.max(0, idx - 40);
        const end = Math.min(post.body.length, idx + q.length + 90);
        return `${start > 0 ? "…" : ""}${post.body.slice(start, end)}${end < post.body.length ? "…" : ""}`;
    })();
    return (
        <a
            href={post.postUrl}
            className="group flex flex-col gap-2 rounded-2xl border border-(--border) bg-(--panel-bg) p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex items-center gap-2 text-xs text-(--text-muted)">
                {post.icon && <PageIcon icon={post.icon} size={16} />}
                {post.label && <span className="font-medium"><Highlight text={post.label} q={q} /></span>}
                <span className="ml-auto tabular-nums">{post.date}</span>
            </div>
            <h3 className="line-clamp-2 text-lg font-semibold text-(--text)">
                <Highlight text={post.title} q={q} />
            </h3>
            {post.subTitle && post.subTitle !== "none" && (
                <p className="line-clamp-2 text-sm text-(--text-muted)">
                    <Highlight text={post.subTitle} q={q} />
                </p>
            )}
            {snippet && (
                <p className="line-clamp-2 text-xs text-(--text-faint)">
                    <Highlight text={snippet} q={q} />
                </p>
            )}
            {tags.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {tags.slice(0, 5).map((t, i) => (
                        <span key={`${t}-${i}`} className="rounded-md bg-(--hover-bg) px-2 py-0.5 text-xs text-(--text-muted)">
                            #<Highlight text={t} q={q} />
                        </span>
                    ))}
                </div>
            )}
        </a>
    );
}

export default function SearchLayout({ postsData }: { postsData: PostData[] }) {
    const [collapsed, setCollapsed] = useState(false);
    const showHeader = useHoverHeader();
    const [query, setQuery] = useState("");

    // URL ?q= 와 동기화 (정적 export: window 사용)
    useEffect(() => {
        const p = new URLSearchParams(window.location.search).get("q");
        if (p) setQuery(p);
    }, []);
    useEffect(() => {
        const u = new URL(window.location.href);
        if (query.trim()) u.searchParams.set("q", query.trim());
        else u.searchParams.delete("q");
        window.history.replaceState(null, "", u.toString());
    }, [query]);

    const q = query.trim().toLowerCase();
    const results = useMemo(() => {
        const sorted = [...postsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (!q) return sorted;
        return sorted.filter((p) => {
            const hay = [p.title, p.subTitle, p.label, p.body, ...(p.tags || [])].filter(Boolean).join(" ").toLowerCase();
            return hay.includes(q);
        });
    }, [postsData, q]);

    return (
        <div id="main-bg-container" data-theme="light" className="relative flex h-full w-full flex-col bg-(--page-bg)">
            <HoverHeader visible={showHeader} collapsed={collapsed} />
            <PostListDrawer posts={postsData} collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className={`min-h-full ${collapsed ? "pl-[50px]" : "pl-[260px]"} m:pl-0!`} style={{ transition: "padding-left 0.2s" }}>
                <div className="mx-auto w-full max-w-[920px] px-6 py-16 m:px-4">
                    <header className="mb-6">
                        <h1 className="text-4xl font-bold tracking-tight text-(--text)">검색</h1>
                        <p className="mt-2 text-(--text-muted)">제목 · 부제목 · 카테고리 · 태그로 검색해요.</p>
                    </header>

                    {/* 검색 입력 */}
                    <div className="mb-8 flex items-center gap-2 rounded-xl border border-(--border) bg-(--panel-bg) px-4 py-3 focus-within:border-[#3b82f6]">
                        <span className="shrink-0 text-(--text-muted)">
                            <SearchIcon color="currentColor" width="20" height="20" />
                        </span>
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="검색어를 입력하세요"
                            className="w-full bg-transparent text-[15px] text-(--text) outline-none placeholder:text-(--text-muted)"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery("")} className="shrink-0 text-sm text-(--text-muted) hover:text-(--text)" aria-label="지우기">
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="mb-4 text-sm text-(--text-muted)">
                        {q ? (
                            <>
                                <span className="font-semibold text-(--text)">{results.length}</span>개 결과
                                {results.length === 0 && <span> — 다른 검색어를 시도해 보세요.</span>}
                            </>
                        ) : (
                            <>전체 <span className="font-semibold text-(--text)">{results.length}</span>개</>
                        )}
                    </div>

                    {results.length > 0 && (
                        <div className="grid grid-cols-2 gap-5 m:grid-cols-1">
                            {results.map((post) => (
                                <ResultCard key={post.slug} post={post} q={query.trim()} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
