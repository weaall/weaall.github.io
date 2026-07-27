// 라우트 전환 시 보이는 글 상세 스켈레톤 (App Router Suspense fallback)
// 실제 PostTitle(커버 없는 기본형: 아이콘 56 → 카테고리·날짜 칩 → 제목 → 태그)과
// 콘텐츠 폭(712)·여백(py-16)을 맞춰, 로딩→렌더 시 제목 위치가 튀지 않게 한다.
import DrawerSkeleton from "@/components/PostListDrawer/DrawerSkeleton";

const Bar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`animate-pulse rounded bg-(--hover-bg) ${className}`} style={style} />
);

export default function Loading() {
    return (
        <div data-theme="light" className="relative flex min-h-screen w-full bg-(--page-bg)">
            {/* 드로워(열린 상태) 스켈레톤 */}
            <DrawerSkeleton />

            {/* 본문: MDXContent와 동일하게 712 컬럼을 중앙 정렬 + py-16 */}
            <div className="flex flex-1 justify-center px-10 py-16 m:px-4">
                <div className="w-[712px] max-w-full m:w-full">
                    {/* 헤더 (PostTitle 커버 없는 기본형과 동일 순서/간격) */}
                    <div className="mb-8">
                        {/* 아이콘(56) — pulse 없이 불투명 단색 */}
                        <div className="mb-3 h-14 w-14 rounded-[12px] bg-[#e3e2df]" />
                        {/* 카테고리 · 날짜 칩 */}
                        <div className="mb-1 flex gap-2">
                            <Bar className="h-[26px] w-24 rounded-md" />
                            <Bar className="h-[26px] w-20 rounded-md" />
                        </div>
                        {/* 제목 (text-40) */}
                        <Bar className="mt-[11px] h-9 w-3/4" />
                        {/* 태그 */}
                        <div className="mt-3 flex gap-1.5">
                            <Bar className="h-5 w-14 rounded-md" />
                            <Bar className="h-5 w-16 rounded-md" />
                            <Bar className="h-5 w-12 rounded-md" />
                        </div>
                    </div>

                    {/* 본문 라인 */}
                    <div className="space-y-3">
                        {["100%", "96%", "88%", "70%", "0", "92%", "98%", "60%", "0", "84%", "90%"].map((w, i) =>
                            w === "0" ? (
                                <div key={i} className="h-3" />
                            ) : (
                                <Bar key={i} className="h-4" style={{ width: w }} />
                            ),
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
