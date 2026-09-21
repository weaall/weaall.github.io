/** 관련 글·다른 포트폴리오로 넘어가는 카드. */
export function LinkCard({ href, tag, title, desc, color }: { href: string; tag: string; title: string; desc: string; color: string }) {
    return (
        <a
            href={href}
            className="group flex flex-col gap-2 rounded-2xl bg-[#f6f5f4] p-7 border-2 border-transparent transition-colors duration-300 hover:border-[color:var(--c)]"
            style={{ ["--c" as string]: color }}
        >
            <span className="text-xs font-semibold" style={{ color }}>
                {tag}
            </span>
            <h3 className="text-lg font-bold text-[#191918] break-keep">{title}</h3>
            <p className="text-[15px] leading-relaxed text-gray-600 break-keep">{desc}</p>
            <span className="mt-auto pt-2 text-sm font-medium group-hover:font-bold transition-all" style={{ color }}>
                자세히 보기 →
            </span>
        </a>
    );
}
