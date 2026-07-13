// 라우트 전환 중 보이는 "열린 드로워" 스켈레톤 (실제 PostListDrawer 열린 상태 구조에 맞춤)
const Bar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`animate-pulse rounded bg-(--hover-bg) ${className}`} style={style} />
);

const ItemRow = ({ w = "70%" }: { w?: string }) => (
    <div className="flex items-center gap-2 px-2 py-[6px]">
        <Bar className="h-[18px] w-[18px] rounded-md" />
        <Bar className="h-3.5" style={{ width: w }} />
    </div>
);

export default function DrawerSkeleton() {
    return (
        <div className="w-[260px] shrink-0 border-r border-(--border) bg-(--panel-bg) px-2 py-1.5 m:hidden">
            {/* 접기 버튼 자리 */}
            <div className="mb-2 flex justify-end">
                <Bar className="h-7 w-7 rounded-md" />
            </div>
            {/* 상단 고정 네비 (홈/게시물/검색/새 페이지) */}
            {["55%", "45%", "40%", "65%"].map((w, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-[6px]">
                    <Bar className="h-5 w-5 rounded-md" />
                    <Bar className="h-3.5" style={{ width: w }} />
                </div>
            ))}

            {/* 로컬 저장 섹션 */}
            <Bar className="mx-2 mb-2 mt-4 h-3 w-16" />
            <ItemRow w="60%" />
            <ItemRow w="48%" />

            {/* 카테고리 섹션들 */}
            <Bar className="mx-2 mb-2 mt-4 h-3 w-20" />
            <ItemRow w="72%" />
            <ItemRow w="64%" />
            <ItemRow w="80%" />

            <Bar className="mx-2 mb-2 mt-4 h-3 w-14" />
            <ItemRow w="58%" />
            <ItemRow w="70%" />
        </div>
    );
}
