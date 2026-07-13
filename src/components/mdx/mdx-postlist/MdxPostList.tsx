"use client";

import Link from "next/link";
import * as tw from "./MdxPostList.styles";
import { PostData } from "@/types/PostData";
import { PageIcon } from "@/app/(pages)/newpage/lib/pageIcon";

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
            {post.icon && <PageIcon icon={post.icon} size={size === "xs" ? 16 : 18} />}
            {post.label && <span className="font-medium">{post.label}</span>}
            <span className="ml-auto tabular-nums">{post.date}</span>
        </div>
    );
}

export default function MdxPostList({ latestPosts, collapsed }: PostListProps) {
    // 최신순 정렬
    const sorted = [...latestPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const [featured, ...rest] = sorted;

    return (
        <tw.Container className={`${collapsed ? "pl-[50px]" : "pl-[260px]"} m:pl-0!`} style={{ transition: "padding-left 0.2s" }}>
            <div className="mx-auto w-full max-w-[920px] px-6 py-16 m:px-4">
                {/* 헤더 */}
                <header className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-(--text)">게시물</h1>
                    <p className="mt-2 text-(--text-muted)">개발하며 정리한 기록과 생각을 담은 글 모음</p>
                    <p className="mt-1 text-sm text-(--text-muted)">총 {sorted.length}개</p>
                </header>

                {/* 최신글(히어로) */}
                {featured && (
                    <Link
                        href={featured.postUrl}
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

                {/* 나머지 카드 그리드 */}
                {rest.length > 0 && (
                    <>
                        <h2 className="mb-4 text-sm font-semibold tracking-wide text-(--text-muted)">모든 글</h2>
                        <div className="grid grid-cols-2 gap-5 m:grid-cols-1">
                            {rest.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={post.postUrl}
                                    className="group flex flex-col gap-2 rounded-2xl border border-(--border) bg-(--panel-bg) p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <Meta post={post} size="xs" />
                                    <h3 className="line-clamp-2 text-lg font-semibold text-(--text)">{post.title}</h3>
                                    {post.subTitle && post.subTitle !== "none" && (
                                        <p className="line-clamp-2 text-sm text-(--text-muted)">{post.subTitle}</p>
                                    )}
                                    <div className="mt-auto">
                                        <Tags tags={post.tags} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </tw.Container>
    );
}
