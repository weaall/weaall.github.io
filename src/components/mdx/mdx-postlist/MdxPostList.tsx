"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as tw from "./MdxPostList.styles";
import { PostData } from "@/types/PostData";
import { PageIcon, isImageIcon } from "@/app/(pages)/newpage/lib/pageIcon";

interface PostListProps {
    latestPosts: PostData[];
    collapsed: boolean;
}

const hasCover = (url?: string) => !!url && url !== "none";
const cleanTags = (tags?: string[]) => (tags || []).filter((t) => t && t !== "default-tag");

function Tags({ tags }: { tags?: string[] }) {
    const list = cleanTags(tags);
    if (!list.length) return null;
    return (
        <div className="mt-1 flex flex-wrap gap-1.5">
            {list.slice(0, 4).map((t, i) => (
                <span key={`${t}-${i}`} className="rounded-md bg-(--hover-bg) px-2 py-0.5 text-xs text-(--text-muted)">
                    #{t}
                </span>
            ))}
        </div>
    );
}

function Meta({ post, size = "sm" }: { post: PostData; size?: "sm" | "xs" }) {
    return (
        <div className={`flex items-center gap-2 text-(--text-muted) ${size === "xs" ? "text-xs" : "text-sm"}`}>
            {post.icon && !isImageIcon(post.icon) && <PageIcon icon={post.icon} size={size === "xs" ? 16 : 18} />}
            {post.label && <span className="font-medium">{post.label}</span>}
            {post.mins && <span className="tabular-nums">· {post.mins}분</span>}
            <span className="ml-auto tabular-nums">{post.date}</span>
        </div>
    );
}

function Card({ post }: { post: PostData }) {
    return (
        <Link
            prefetch={false} href={post.postUrl}
            className="group flex flex-col gap-2 rounded-2xl border border-(--border) bg-(--panel-bg) p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <Meta post={post} size="xs" />
            <h3 className="line-clamp-2 text-lg font-semibold text-(--text)">{post.title}</h3>
            {post.subTitle && post.subTitle !== "none" && <p className="line-clamp-2 text-sm text-(--text-muted)">{post.subTitle}</p>}
            <div className="mt-auto">
                <Tags tags={post.tags} />
            </div>
        </Link>
    );
}

export default function MdxPostList({ latestPosts, collapsed }: PostListProps) {
    // 최신순 정렬
    const sorted = useMemo(
        () => [...latestPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [latestPosts],
    );

    // 카테고리 목록(개수 포함, 최신 글 많은 순 아니고 이름 정렬)
    const categories = useMemo(() => {
        const map = new Map<string, number>();
        sorted.forEach((p) => p.label && map.set(p.label, (map.get(p.label) || 0) + 1));
        return [...map.entries()].sort((a, b) => b[1] - a[1]);
    }, [sorted]);

    const [activeCat, setActiveCat] = useState<string | null>(null);

    const visible = activeCat ? sorted.filter((p) => p.label === activeCat) : sorted;
    const showHero = !activeCat; // 전체일 때만 최신글 히어로
    const [featured, ...rest] = visible;
    const gridPosts = showHero ? rest : visible;

    return (
        <tw.Container className={`${collapsed ? "pl-[50px]" : "pl-[260px]"} m:pl-0!`} style={{ transition: "padding-left 0.2s" }}>
            <div className="mx-auto w-full max-w-[920px] px-6 py-16 m:px-4">
                {/* 헤더 */}
                <header className="mb-6">
                    <h1 className="text-4xl font-bold tracking-tight text-(--text)">게시물</h1>
                    <p className="mt-2 text-(--text-muted)">개발하며 정리한 기록과 생각을 담은 글 모음</p>
                </header>

                {/* 카테고리 필터 칩 */}
                <div className="mb-10 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveCat(null)}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                            activeCat === null
                                ? "border-transparent bg-(--text) text-(--page-bg)"
                                : "border-(--border) bg-(--panel-bg) text-(--text-muted) hover:bg-(--hover-bg)"
                        }`}
                    >
                        전체 <span className="opacity-60">{sorted.length}</span>
                    </button>
                    {categories.map(([cat, count]) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setActiveCat(cat)}
                            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                                activeCat === cat
                                    ? "border-transparent bg-(--text) text-(--page-bg)"
                                    : "border-(--border) bg-(--panel-bg) text-(--text-muted) hover:bg-(--hover-bg)"
                            }`}
                        >
                            {cat} <span className="opacity-60">{count}</span>
                        </button>
                    ))}
                </div>

                {/* 최신글(히어로) — 전체 탭에서만 */}
                {showHero && featured && (
                    <Link
                        prefetch={false} href={featured.postUrl}
                        className="group mb-12 block overflow-hidden rounded-2xl border border-(--border) bg-(--panel-bg) transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        {hasCover(featured.imageUrl) && (
                            <div className="h-64 w-full overflow-hidden bg-white m:h-48">
                                <img
                                    src={featured.imageUrl}
                                    alt={featured.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-3 p-7 m:p-5">
                            <Meta post={featured} />
                            <h2 className="text-2xl font-bold text-(--text) transition-colors group-hover:text-[#3b82f6] m:text-xl">
                                {featured.title}
                            </h2>
                            {featured.subTitle && featured.subTitle !== "none" && (
                                <p className="line-clamp-2 text-(--text-muted)">{featured.subTitle}</p>
                            )}
                            <Tags tags={featured.tags} />
                        </div>
                    </Link>
                )}

                {/* 카드 그리드 */}
                {gridPosts.length > 0 && (
                    <>
                        <h2 className="mb-4 text-sm font-semibold tracking-wide text-(--text-muted)">
                            {activeCat ? `${activeCat} · ${visible.length}` : "모든 글"}
                        </h2>
                        <div className="grid grid-cols-2 gap-5 m:grid-cols-1">
                            {gridPosts.map((post) => (
                                <Card key={post.slug} post={post} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </tw.Container>
    );
}
