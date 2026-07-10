"use client";

import { useRef, useState } from "react";
import { peopleEmojis, animalEmojis, foodEmojis, objectEmojis, symbolEmojis, allEmojis } from "../emoji-modal/EmojiList";
import { fileToWebp } from "../../lib/pageIcon";

interface IconPickerProps {
    open: boolean;
    position: { top: number; left: number } | null;
    onPick: (icon: string) => void; // 이모지 문자열 또는 webp data URL
    onRemove: () => void;
    onClose: () => void;
}

const CATEGORIES = [
    { label: "사람", list: peopleEmojis },
    { label: "동물", list: animalEmojis },
    { label: "음식", list: foodEmojis },
    { label: "사물", list: objectEmojis },
    { label: "기호", list: symbolEmojis },
];

// 노션식 페이지 아이콘 선택기: 탭(이모지/업로드) + 필터/랜덤 + 카테고리 그리드 + 제거.
export default function IconPicker({ open, position, onPick, onRemove, onClose }: IconPickerProps) {
    const [tab, setTab] = useState<"emoji" | "upload">("emoji");
    const [search, setSearch] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    if (!open || !position) return null;

    const q = search.trim().toLowerCase();
    const filtered = q ? allEmojis.filter((e) => e.label.includes(q)) : null;

    const pickEmoji = (emoji: string) => {
        onPick(emoji);
        onClose();
    };
    const pickRandom = () => pickEmoji(allEmojis[Math.floor((Date.now() % allEmojis.length + allEmojis.length) % allEmojis.length)].emoji);

    const consumeFile = async (file?: File | null) => {
        if (!file || !file.type.startsWith("image/")) return;
        try {
            const webp = await fileToWebp(file);
            onPick(webp);
            onClose();
        } catch {
            /* 무시 */
        }
    };

    const tabCls = (active: boolean) =>
        `relative px-[8px] py-[6px] text-[14px] ${active ? "text-(--text-strong) font-medium" : "text-(--text-muted)"}`;

    const EmojiBtn = ({ emoji, label }: { emoji: string; label: string }) => (
        <button
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[22px] hover:bg-(--menu-hover-bg)"
            title={label}
            onClick={() => pickEmoji(emoji)}
        >
            {emoji}
        </button>
    );

    return (
        <div className="fixed inset-0 z-[1900]" onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
            <div
                data-theme="light"
                data-modal
                className="animate-popIn fixed z-[2000] flex h-[390px] w-[408px] max-w-[92vw] flex-col rounded-[12px] border border-(--border) bg-(--menu-bg) text-(--text) shadow-2xl"
                style={{ top: position.top, left: Math.min(position.left, window.innerWidth - 424) }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 탭 헤더 */}
                <div className="flex items-center justify-between border-b border-(--border) px-[8px]">
                    <div className="flex items-center">
                        <button className={tabCls(tab === "emoji")} onClick={() => setTab("emoji")}>
                            이모지
                            {tab === "emoji" && <span className="absolute inset-x-[6px] -bottom-[1px] h-[2px] rounded bg-(--text-strong)" />}
                        </button>
                        <button className={tabCls(tab === "upload")} onClick={() => setTab("upload")}>
                            업로드
                            {tab === "upload" && <span className="absolute inset-x-[6px] -bottom-[1px] h-[2px] rounded bg-(--text-strong)" />}
                        </button>
                    </div>
                    <button className="rounded-[6px] px-[8px] py-[4px] text-[13px] text-(--text-muted) hover:bg-(--menu-hover-bg)" onClick={() => { onRemove(); onClose(); }}>
                        제거
                    </button>
                </div>

                {tab === "emoji" ? (
                    <>
                        {/* 필터 + 랜덤 */}
                        <div className="flex items-center gap-[6px] px-[10px] pt-[8px] pb-[6px]">
                            <input
                                className="min-w-0 flex-1 rounded-[6px] border border-(--border) bg-transparent px-[8px] py-[5px] text-[13px] outline-none focus:border-[#3b82f6]"
                                placeholder="필터"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] border border-(--border) text-(--text-muted) hover:bg-(--menu-hover-bg)"
                                title="랜덤"
                                onClick={pickRandom}
                            >
                                🎲
                            </button>
                        </div>
                        {/* 그리드 */}
                        <div className="flex-1 overflow-y-auto px-[10px] pb-[10px]">
                            {filtered ? (
                                filtered.length ? (
                                    <div className="grid grid-cols-9">
                                        {filtered.map((e, i) => (
                                            <EmojiBtn key={`${e.emoji}-${i}`} emoji={e.emoji} label={e.label} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-xs text-(--text-muted)">결과 없음</div>
                                )
                            ) : (
                                CATEGORIES.map((cat) => (
                                    <div key={cat.label}>
                                        <div className="px-[2px] pt-[8px] pb-[2px] text-[12px] font-medium text-(--text-muted)">{cat.label}</div>
                                        <div className="grid grid-cols-9">
                                            {cat.list.map((e, i) => (
                                                <EmojiBtn key={`${e.emoji}-${i}`} emoji={e.emoji} label={e.label} />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    /* 업로드 탭 */
                    <div className="flex flex-1 flex-col px-[16px] pt-[20px]">
                        <button
                            className={`flex items-center justify-center gap-[8px] rounded-[6px] border border-dashed py-[14px] text-[14px] transition-colors ${
                                dragOver ? "border-[#3b82f6] bg-[#e0edfb] text-[#3b82f6]" : "border-(--border) bg-(--hover-bg) text-(--text)"
                            }`}
                            onClick={() => fileRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setDragOver(false); consumeFile(e.dataTransfer.files?.[0]); }}
                        >
                            <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden>
                                <path d="M8.5 9.31a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                <path d="M2.375 6.25c0-1.174.951-2.125 2.125-2.125h11c1.174 0 2.125.951 2.125 2.125v7.5a2.125 2.125 0 0 1-2.125 2.125h-11a2.125 2.125 0 0 1-2.125-2.125zM4.5 5.375a.875.875 0 0 0-.875.875v5.491l1.996-1.995a.625.625 0 0 1 .883 0l1.98 1.98 4.137-4.137a.625.625 0 0 1 .883 0l2.871 2.87V6.25a.875.875 0 0 0-.875-.875zm11.875 6.853-3.312-3.313-4.137 4.136a.625.625 0 0 1-.884 0l-1.98-1.98-2.437 2.438v.241c0 .483.392.875.875.875h11a.875.875 0 0 0 .875-.875z" />
                            </svg>
                            이미지 업로드
                        </button>
                        <div className="mt-[10px] text-center text-[12px] text-(--text-muted)">png · jpeg · svg 파일을 올리면 webp로 저장됩니다.</div>
                        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={(e) => consumeFile(e.target.files?.[0])} />
                    </div>
                )}
            </div>
        </div>
    );
}
