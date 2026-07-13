// 에디터(NewPage) 로딩 중 콘텐츠 영역 스켈레톤. 드로워는 NewPageLayout이 별도로 렌더한다.
const Bar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`animate-pulse rounded bg-(--hover-bg) ${className}`} style={style} />
);

export default function EditorSkeleton({ collapsed = false }: { collapsed?: boolean }) {
    return (
        <div className={`flex flex-1 justify-center py-16 ${collapsed ? "pl-[50px]" : "pl-[260px]"} m:pl-0!`} style={{ transition: "padding-left 0.2s" }}>
            <div className="w-[712px] max-w-full px-6 m:px-4">
                {/* 아이콘 + 카테고리 줄 */}
                <div className="mb-3 flex items-center gap-2">
                    <Bar className="h-11 w-11 rounded-[8px]" />
                    <Bar className="h-6 w-24 rounded-md" />
                </div>
                {/* 제목 */}
                <Bar className="mb-3 h-10 w-3/5" />
                {/* 부제목 */}
                <Bar className="mb-8 h-5 w-2/5" />
                {/* 본문 라인 */}
                <div className="space-y-3">
                    {["100%", "92%", "78%", "0", "96%", "88%", "60%", "0", "84%", "94%", "70%"].map((w, i) =>
                        w === "0" ? <div key={i} className="h-3" /> : <Bar key={i} className="h-4" style={{ width: w }} />,
                    )}
                </div>
            </div>
        </div>
    );
}
