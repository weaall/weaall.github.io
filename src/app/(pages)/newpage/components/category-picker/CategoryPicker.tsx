"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface CategoryPickerProps {
    open: boolean;
    position: { top: number; left: number } | null;
    current?: string;
    options: string[]; // 기존 카테고리 목록
    onSelect: (label: string) => void;
    onClose: () => void;
}

// 카테고리 선택기: 기존 목록에서 검색/선택하거나 새로 입력해 추가.
export default function CategoryPicker({ open, position, current, options, onSelect, onClose }: CategoryPickerProps) {
    const [q, setQ] = useState("");
    const panelRef = useRef<HTMLDivElement>(null);
    // 화면 아래로 넘치면 위로 뒤집어(트리거 위로) 잘리지 않게
    const [top, setTop] = useState(position?.top ?? 0);
    useLayoutEffect(() => {
        if (!open || !position) return;
        const h = panelRef.current?.offsetHeight ?? 300;
        // 기본은 아래(position.top). 아래 공간 부족하면 위로 올림.
        setTop(position.top + h + 8 > window.innerHeight ? Math.max(8, position.top - h - 8) : position.top);
    }, [open, position, q]);
    if (!open || !position) return null;

    const query = q.trim();
    const filtered = query ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase())) : options;
    const canCreate = query && !options.some((o) => o.toLowerCase() === query.toLowerCase());

    const pick = (label: string) => {
        onSelect(label);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[1900]" onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
            <div
                ref={panelRef}
                data-theme="light"
                data-modal
                className="animate-popIn fixed z-[2000] flex max-h-[300px] w-[240px] max-w-[92vw] flex-col rounded-[10px] border border-(--border) bg-(--menu-bg) p-[6px] text-(--text) shadow-2xl"
                style={{ top, left: Math.min(position.left, window.innerWidth - 256) }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <input
                    autoFocus
                    className="mb-[6px] w-full rounded-[6px] border border-(--border) bg-transparent px-[8px] py-[5px] text-[13px] outline-none focus:border-[#3b82f6]"
                    placeholder="카테고리 검색 또는 추가"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && query) pick(query);
                    }}
                />
                <div className="flex-1 overflow-y-auto">
                    {current && (
                        <button
                            className="flex w-full items-center justify-between rounded-[6px] px-[8px] py-[6px] text-left text-[14px] text-(--text-muted) hover:bg-(--menu-hover-bg)"
                            onClick={() => pick("")}
                        >
                            카테고리 없음 {current ? "✓" : ""}
                        </button>
                    )}
                    {filtered.map((o) => (
                        <button
                            key={o}
                            className="flex w-full items-center justify-between rounded-[6px] px-[8px] py-[6px] text-left text-[14px] hover:bg-(--menu-hover-bg)"
                            onClick={() => pick(o)}
                        >
                            <span className="truncate">{o}</span>
                            {o === current && <span className="text-[#3b82f6]">✓</span>}
                        </button>
                    ))}
                    {canCreate && (
                        <button
                            className="flex w-full items-center gap-[6px] rounded-[6px] px-[8px] py-[6px] text-left text-[14px] hover:bg-(--menu-hover-bg)"
                            onClick={() => pick(query)}
                        >
                            <span className="text-(--text-muted)">+ 새로 만들기</span>
                            <span className="truncate font-medium">{query}</span>
                        </button>
                    )}
                    {!filtered.length && !canCreate && <div className="px-[8px] py-[6px] text-xs text-(--text-muted)">카테고리 없음</div>}
                </div>
            </div>
        </div>
    );
}
