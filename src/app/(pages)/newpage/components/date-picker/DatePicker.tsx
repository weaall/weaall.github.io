"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useScrollLock } from "../../hooks/useScrollLock";

interface Props {
    open: boolean;
    position: { top: number; left: number } | null;
    value?: string; // "YYYY-MM-DD"
    onSelect: (date: string) => void;
    onClear?: () => void;
    onClose: () => void;
}

const WD = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n: number) => String(n).padStart(2, "0");
const toStr = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

// 예쁜 커스텀 달력. 브라우저 기본 date input 대신 사용.
export default function DatePicker({ open, position, value, onSelect, onClear, onClose }: Props) {
    const parsed = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split("-").map(Number) : null;
    const today = new Date();
    const initY = parsed ? parsed[0] : today.getFullYear();
    const initM = parsed ? parsed[1] - 1 : today.getMonth();
    const [view, setView] = useState({ y: initY, m: initM });
    useScrollLock(open);

    const panelRef = useRef<HTMLDivElement>(null);
    const [top, setTop] = useState(position?.top ?? 0);
    useLayoutEffect(() => {
        if (!open || !position) return;
        setView({ y: initY, m: initM });
        const h = panelRef.current?.offsetHeight ?? 320;
        setTop(position.top + h + 8 > window.innerHeight ? Math.max(8, position.top - h - 8) : position.top);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, position]);

    if (!open || !position) return null;

    const first = new Date(view.y, view.m, 1).getDay();
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const todayStr = toStr(today.getFullYear(), today.getMonth(), today.getDate());
    const move = (delta: number) => {
        const d = new Date(view.y, view.m + delta, 1);
        setView({ y: d.getFullYear(), m: d.getMonth() });
    };

    return (
        <div className="fixed inset-0 z-[1900]" onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
            <div
                ref={panelRef}
                data-theme="light"
                data-modal
                className="animate-popIn fixed z-[2000] w-[268px] rounded-[14px] border border-(--border) bg-(--menu-bg) p-3 text-(--text) shadow-2xl"
                style={{ top, left: Math.min(position.left, window.innerWidth - 284) }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="mb-2 flex items-center justify-between">
                    <button className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-muted) hover:bg-(--menu-hover-bg)" onClick={() => move(-1)} aria-label="이전 달">
                        ‹
                    </button>
                    <span className="text-[14px] font-semibold tabular-nums">
                        {view.y}년 {view.m + 1}월
                    </span>
                    <button className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-muted) hover:bg-(--menu-hover-bg)" onClick={() => move(1)} aria-label="다음 달">
                        ›
                    </button>
                </div>
                {/* 요일 */}
                <div className="mb-1 grid grid-cols-7 text-center text-[11px] text-(--text-muted)">
                    {WD.map((w, i) => (
                        <div key={w} className={i === 0 ? "text-[#e65b58]" : ""}>
                            {w}
                        </div>
                    ))}
                </div>
                {/* 날짜 */}
                <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: first }).map((_, i) => (
                        <div key={`b${i}`} />
                    ))}
                    {Array.from({ length: days }).map((_, i) => {
                        const d = i + 1;
                        const ds = toStr(view.y, view.m, d);
                        const isSel = value === ds;
                        const isToday = todayStr === ds;
                        return (
                            <button
                                key={d}
                                onClick={() => {
                                    onSelect(ds);
                                    onClose();
                                }}
                                className={`flex h-8 items-center justify-center rounded-md text-[13px] tabular-nums transition-colors ${
                                    isSel ? "bg-[#7c3aed] font-semibold text-white" : isToday ? "font-semibold text-[#7c3aed] hover:bg-(--menu-hover-bg)" : "hover:bg-(--menu-hover-bg)"
                                }`}
                            >
                                {d}
                            </button>
                        );
                    })}
                </div>
                {/* 푸터 */}
                <div className="mt-2 flex items-center justify-between border-t border-(--border) pt-2 text-[12px]">
                    <button className="rounded-md px-2 py-1 text-(--text-muted) hover:bg-(--menu-hover-bg)" onClick={() => { onSelect(todayStr); onClose(); }}>
                        오늘
                    </button>
                    {onClear && (
                        <button className="rounded-md px-2 py-1 text-[#e65b58] hover:bg-(--menu-hover-bg)" onClick={() => { onClear(); onClose(); }}>
                            지우기
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
