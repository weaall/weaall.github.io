"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ELEMENTS } from "./TypeElement";
import { useScrollLock } from "../../hooks/useScrollLock";

interface Props {
    open: boolean;
    position: { top: number; left: number } | null;
    onSelect: (type: string) => void;
    onClose: () => void;
}

// 만들 블록을 검색해서 고르는 선택기 (코드블록 언어 드롭다운과 같은 디자인).
// "+" 버튼 / 빈 공간 클릭 시 열림.
export default function BlockTypePicker({ open, position, onSelect, onClose }: Props) {
    const [q, setQ] = useState("");
    useScrollLock(open);
    const panelRef = useRef<HTMLDivElement>(null);
    const [top, setTop] = useState(position?.top ?? 0);

    useEffect(() => {
        if (open) setQ("");
    }, [open]);

    // 아래로 넘치면 위로 뒤집어 잘리지 않게
    useLayoutEffect(() => {
        if (!open || !position) return;
        const h = panelRef.current?.offsetHeight ?? 320;
        setTop(position.top + h + 8 > window.innerHeight ? Math.max(8, position.top - h - 8) : position.top);
    }, [open, position, q]);

    if (!open || !position) return null;

    const items = ELEMENTS.filter((el): el is { label: string; type: string; icon: React.ReactNode } => !("divider" in el));
    const query = q.trim().toLowerCase();
    const filtered = query ? items.filter((el) => el.label.toLowerCase().includes(query)) : items;

    return (
        <div className="fixed inset-0 z-[1900]" onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
            <div
                ref={panelRef}
                data-theme="light"
                data-modal
                className="animate-popIn fixed z-[2000] flex max-h-[340px] w-[260px] max-w-[92vw] flex-col overflow-hidden rounded-[10px] border border-(--border) bg-(--menu-bg) text-(--text) shadow-2xl"
                style={{ top, left: Math.min(position.left, window.innerWidth - 276) }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-2">
                    <input
                        autoFocus
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && filtered[0]) onSelect(filtered[0].type);
                            if (e.key === "Escape") onClose();
                        }}
                        placeholder="블록 검색"
                        className="editor-field h-8 w-full rounded-md bg-(--hover-bg) px-2.5 text-[13px] outline-none placeholder:text-(--text-muted)"
                    />
                </div>
                <div className="overflow-y-auto px-1 pb-1">
                    {filtered.map((el) => (
                        <button
                            key={el.type}
                            type="button"
                            onClick={() => onSelect(el.type)}
                            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[14px] text-(--text) hover:bg-(--menu-hover-bg)"
                        >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center">{el.icon}</span>
                            <span className="truncate">{el.label}</span>
                        </button>
                    ))}
                    {!filtered.length && <div className="px-2.5 py-2 text-[13px] text-(--text-muted)">결과 없음</div>}
                </div>
            </div>
        </div>
    );
}
