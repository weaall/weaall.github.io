/** 체크 표시가 붙는 2열 항목 목록. 보안 요구사항 영역처럼 "충족했다"를 보일 때 쓴다. */
export function CheckList({ items, color }: { items: { t: string; d: string }[]; color: string }) {
    return (
        <ul className="grid grid-cols-2 gap-3 m:grid-cols-1">
            {items.map((it) => (
                <li key={it.t} className="flex gap-3 rounded-2xl bg-[#f6f5f4] p-5">
                    <span
                        className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: `color-mix(in srgb, ${color} 14%, #fff)` }}
                    >
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden>
                            <path d="M4 10.5l4 4 8-9" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[14px] font-bold text-[#191918] break-keep">{it.t}</span>
                        <span className="text-[13px] text-gray-600 leading-relaxed break-keep">{it.d}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}
