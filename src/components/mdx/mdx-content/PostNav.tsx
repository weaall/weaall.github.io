import Link from "next/link";
import { PostData } from "@/types/PostData";

// 글 하단 이전/다음 글 내비게이션 + 목록으로 돌아가기.
export default function PostNav({ postsData, slug }: { postsData: PostData[]; slug: string }) {
    const sorted = [...postsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const idx = sorted.findIndex((p) => p.slug === slug);
    if (idx === -1) return null;
    const newer = idx > 0 ? sorted[idx - 1] : null; // 더 최신 글
    const older = idx < sorted.length - 1 ? sorted[idx + 1] : null; // 더 이전 글

    return (
        <nav className="mt-16 border-t border-(--border) pt-8">
            <div className="grid grid-cols-2 gap-4 m:grid-cols-1">
                {older ? (
                    <Link
                        prefetch={false} href={older.postUrl}
                        className="group flex flex-col gap-1 rounded-xl border border-(--border) bg-(--panel-bg) p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <span className="text-xs text-(--text-muted)">← 이전 글</span>
                        <span className="line-clamp-1 font-medium text-(--text) group-hover:text-[#3b82f6]">{older.title}</span>
                    </Link>
                ) : (
                    <span />
                )}
                {newer ? (
                    <Link
                        prefetch={false} href={newer.postUrl}
                        className="group flex flex-col items-end gap-1 rounded-xl border border-(--border) bg-(--panel-bg) p-4 text-right transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <span className="text-xs text-(--text-muted)">다음 글 →</span>
                        <span className="line-clamp-1 font-medium text-(--text) group-hover:text-[#3b82f6]">{newer.title}</span>
                    </Link>
                ) : (
                    <span />
                )}
            </div>
            <div className="mt-6 text-center">
                <Link prefetch={false} href="/post" className="inline-flex items-center gap-1 rounded-lg border border-(--border) px-4 py-2 text-sm text-(--text-muted) transition-colors hover:bg-(--hover-bg) hover:text-(--text)">
                    목록으로 돌아가기
                </Link>
            </div>
        </nav>
    );
}
