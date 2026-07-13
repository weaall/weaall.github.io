// 라우트 전환 시 보이는 글 상세 스켈레톤 (App Router Suspense fallback)
import DrawerSkeleton from "@/components/PostListDrawer/DrawerSkeleton";

const Bar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`animate-pulse rounded bg-(--hover-bg) ${className}`} style={style} />
);

export default function Loading() {
    return (
        <div data-theme="light" className="relative flex min-h-screen w-full bg-(--page-bg)">
            {/* 드로워(열린 상태) 스켈레톤 */}
            <DrawerSkeleton />

            {/* 본문 */}
            <div className="flex-1">
                <div className="mx-auto w-full max-w-[720px] px-6 py-16 m:px-4">
                    {/* 커버 + 아이콘(겹침) */}
                    <div className="relative">
                        <Bar className="h-[360px] w-full rounded-basic m:h-56" />
                        <div
                            className="absolute -bottom-5 left-1 flex h-[72px] w-[72px] items-center justify-center"
                            style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.95) 55%, rgba(255,255,255,0) 100%)" }}
                        >
                            {/* 아이콘 자리: pulse(투명도) 없이 불투명 단색 */}
                            <div className="h-14 w-14 rounded-[12px] bg-[#e3e2df]" />
                        </div>
                    </div>
                    {/* 제목 영역 */}
                    <Bar className="mt-10 h-10 w-3/4" />
                    <Bar className="mt-3 h-5 w-1/2" />
                    <div className="mt-3 flex gap-1.5">
                        <Bar className="h-5 w-14 rounded-md" />
                        <Bar className="h-5 w-16 rounded-md" />
                    </div>

                    {/* 본문 라인 */}
                    <div className="mt-10 space-y-3">
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
