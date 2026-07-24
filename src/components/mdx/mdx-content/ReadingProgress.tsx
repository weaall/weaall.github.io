"use client";

import { useEffect, useState } from "react";

// 글 읽기 진행률 바 (상단 고정). 문서 스크롤 비율을 추적한다.
export default function ReadingProgress() {
    const [pct, setPct] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const max = el.scrollHeight - el.clientHeight;
            setPct(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[2000] h-[3px]">
            <div className="h-full bg-[#3b82f6] transition-[width] duration-100 ease-out" style={{ width: `${pct}%` }} />
        </div>
    );
}
