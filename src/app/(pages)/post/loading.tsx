// 라우트 전환 시 보이는 목록 스켈레톤 (App Router Suspense fallback)
import DrawerSkeleton from "@/components/PostListDrawer/DrawerSkeleton";

const Bar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`animate-pulse rounded bg-(--hover-bg) ${className}`} style={style} />
);

function CardSkeleton() {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-(--border) bg-(--panel-bg) p-5">
            <div className="flex items-center gap-2">
                <Bar className="h-4 w-4 rounded-md" />
                <Bar className="h-3 w-16" />
                <Bar className="ml-auto h-3 w-20" />
            </div>
            <Bar className="h-5 w-4/5" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-2/3" />
            <div className="mt-1 flex gap-1.5">
                <Bar className="h-5 w-12 rounded-md" />
                <Bar className="h-5 w-14 rounded-md" />
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div data-theme="light" className="relative flex min-h-screen w-full bg-(--page-bg)">
            {/* 드로워(열린 상태) 스켈레톤 */}
            <DrawerSkeleton />

            {/* 본문 */}
            <div className="flex-1">
                <div className="mx-auto w-full max-w-[920px] px-6 py-16 m:px-4">
                    {/* 헤더 */}
                    <Bar className="h-9 w-40" />
                    <Bar className="mt-3 h-4 w-72" />
                    <Bar className="mt-2 h-3 w-16" />

                    {/* 히어로 */}
                    <div className="mt-10 overflow-hidden rounded-2xl border border-(--border) bg-(--panel-bg)">
                        <Bar className="h-64 w-full rounded-none m:h-48" />
                        <div className="flex flex-col gap-3 p-7 m:p-5">
                            <div className="flex items-center gap-2">
                                <Bar className="h-5 w-5 rounded-md" />
                                <Bar className="h-3 w-20" />
                                <Bar className="ml-auto h-3 w-24" />
                            </div>
                            <Bar className="h-7 w-3/5" />
                            <Bar className="h-4 w-full" />
                            <Bar className="h-4 w-1/2" />
                        </div>
                    </div>

                    {/* 그리드 */}
                    <Bar className="mb-4 mt-12 h-4 w-20" />
                    <div className="grid grid-cols-2 gap-5 m:grid-cols-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
