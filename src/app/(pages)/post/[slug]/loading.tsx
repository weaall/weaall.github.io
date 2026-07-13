// 라우트 전환 시 보이는 글 상세 스켈레톤 (App Router Suspense fallback)
const Bar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`animate-pulse rounded bg-(--hover-bg) ${className}`} style={style} />
);

export default function Loading() {
    return (
        <div data-theme="light" className="relative flex min-h-screen w-full bg-(--page-bg)">
            {/* 드로워 자리 */}
            <div className="w-[260px] shrink-0 space-y-3 border-r border-(--border) p-4 m:hidden">
                <Bar className="h-6 w-32" />
                {Array.from({ length: 8 }).map((_, i) => (
                    <Bar key={i} className="h-4" style={{ width: `${60 + ((i * 7) % 35)}%` }} />
                ))}
            </div>

            {/* 본문 */}
            <div className="flex-1">
                <div className="mx-auto w-full max-w-[720px] px-6 py-16 m:px-4">
                    {/* 커버 */}
                    <Bar className="h-[360px] w-full rounded-basic m:h-56" />
                    {/* 제목 영역 */}
                    <Bar className="mt-8 h-10 w-3/4" />
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
