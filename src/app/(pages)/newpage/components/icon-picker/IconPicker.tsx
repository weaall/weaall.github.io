"use client";

import { useRef, useState } from "react";
import { allEmojis } from "../emoji-modal/EmojiList";
import { fileToWebp } from "../../lib/pageIcon";

interface IconPickerProps {
    open: boolean;
    position: { top: number; left: number } | null;
    onPick: (icon: string) => void; // 이모지 문자열 또는 webp data URL
    onRemove: () => void;
    onClose: () => void;
}

// 노션식 아이콘 선택기: 이모지 그리드 + 이미지 업로드(webp 변환) + 제거.
export default function IconPicker({ open, position, onPick, onRemove, onClose }: IconPickerProps) {
    const [search, setSearch] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    if (!open || !position) return null;

    const filtered = search.trim() ? allEmojis.filter((e) => e.label.includes(search.trim().toLowerCase())) : allEmojis;

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const webp = await fileToWebp(file);
            onPick(webp);
            onClose();
        } catch {
            /* 변환 실패 무시 */
        }
    };

    return (
        <div className="fixed inset-0 z-[1900]" onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
            <div
                data-theme="light"
                data-modal
                className="animate-popIn fixed z-[2000] flex w-[340px] max-w-[92vw] flex-col rounded-[12px] border border-(--border) bg-(--menu-bg) p-[10px] text-(--text) shadow-2xl"
                style={{ top: position.top, left: Math.min(position.left, window.innerWidth - 356) }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 상단: 업로드 / 제거 */}
                <div className="mb-[8px] flex items-center gap-[6px]">
                    <input
                        className="min-w-0 flex-1 rounded-[6px] border border-(--border) bg-transparent px-[8px] py-[5px] text-[13px] outline-none focus:border-[#3b82f6]"
                        placeholder="이모지 검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className="shrink-0 rounded-[6px] border border-(--border) px-[8px] py-[5px] text-[13px] text-(--text) hover:bg-(--menu-hover-bg)"
                        onClick={() => fileRef.current?.click()}
                    >
                        이미지 등록
                    </button>
                    <button
                        className="shrink-0 rounded-[6px] border border-(--border) px-[8px] py-[5px] text-[13px] text-(--text-muted) hover:bg-(--menu-hover-bg)"
                        onClick={() => {
                            onRemove();
                            onClose();
                        }}
                    >
                        제거
                    </button>
                    <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={handleFile} />
                </div>

                {/* 이모지 그리드 */}
                <div className="grid max-h-[220px] grid-cols-9 gap-[2px] overflow-y-auto">
                    {filtered.map((e, i) => (
                        <button
                            key={`${e.emoji}-${i}`}
                            className="flex h-8 items-center justify-center rounded-[6px] text-[20px] hover:bg-(--menu-hover-bg)"
                            title={e.label}
                            onClick={() => {
                                onPick(e.emoji);
                                onClose();
                            }}
                        >
                            {e.emoji}
                        </button>
                    ))}
                    {filtered.length === 0 && <div className="col-span-9 py-3 text-center text-xs text-(--text-muted)">결과 없음</div>}
                </div>
            </div>
        </div>
    );
}
