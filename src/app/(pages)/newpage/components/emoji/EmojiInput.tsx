"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { searchEmojis, EmojiItem } from "./emojiData";

interface EmojiInputProps {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    className?: string;
    title?: string;
    maxLength?: number;
}

const COLS = 9;
const POPUP_H = 232;

// `:` 입력 시 이모지 검색 팝업이 뜨는 텍스트 입력(노션/슬랙식).
// `:키워드` 를 이모지로 치환. 제목/부제목/항목 등에 재사용.
export default function EmojiInput({ value, onChange, placeholder, className, title, maxLength }: EmojiInputProps) {
    const ref = useRef<HTMLInputElement>(null);
    const [menu, setMenu] = useState<{ query: string; start: number; top: number; left: number; up: boolean } | null>(null);
    const [active, setActive] = useState(0);

    const results: EmojiItem[] = menu ? searchEmojis(menu.query) : [];

    // 커서 앞에서 `:query` 패턴을 찾아 팝업 열기/닫기
    const detect = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        const caret = el.selectionStart ?? value.length;
        const before = value.slice(0, caret);
        const m = before.match(/(^|\s):([\p{L}\p{N}_+-]*)$/u);
        if (m) {
            const start = caret - m[2].length - 1; // ':' 위치
            const r = el.getBoundingClientRect();
            const up = r.bottom + 6 + POPUP_H > window.innerHeight;
            setMenu({ query: m[2], start, top: up ? r.top - 6 - POPUP_H : r.bottom + 6, left: r.left, up });
            setActive(0);
        } else {
            setMenu(null);
        }
    }, [value]);

    // value가 바뀌면(치환 포함) 다시 감지
    useEffect(() => {
        setActive(0);
    }, [menu?.query]);

    const insert = (emoji: string) => {
        const el = ref.current;
        if (!menu) return;
        const caret = el?.selectionStart ?? value.length;
        const next = value.slice(0, menu.start) + emoji + value.slice(caret);
        onChange(next);
        setMenu(null);
        requestAnimationFrame(() => {
            if (el) {
                el.focus();
                const pos = menu.start + emoji.length;
                el.setSelectionRange(pos, pos);
            }
        });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!menu || results.length === 0) return;
        if (e.key === "ArrowRight") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
        else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + COLS, results.length - 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - COLS, 0)); }
        else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); insert(results[active].char); }
        else if (e.key === "Escape") { e.preventDefault(); setMenu(null); }
    };

    return (
        <div className="relative min-w-0 w-full">
            <input
                ref={ref}
                className={`w-full ${className ?? ""}`}
                placeholder={placeholder}
                title={title}
                maxLength={maxLength}
                value={value}
                onChange={(e) => { onChange(e.target.value); }}
                onKeyUp={detect}
                onClick={detect}
                onKeyDown={onKeyDown}
                onBlur={() => setTimeout(() => setMenu(null), 120)}
            />
            {menu && results.length > 0 && (
                <div
                    data-theme="light"
                    data-scroll-allow
                    className="animate-popIn fixed z-[2200] w-[300px] overflow-y-auto overscroll-contain rounded-[10px] border border-(--border) bg-(--menu-bg) p-[6px] shadow-xl"
                    style={{ top: menu.top, left: menu.left, maxHeight: POPUP_H }}
                    onMouseDown={(e) => e.preventDefault() /* 입력 포커스 유지 */}
                >
                    <div className="grid grid-cols-9 gap-[2px]">
                        {results.map((em, i) => (
                            <button
                                key={em.char + i}
                                type="button"
                                title={em.names[0]}
                                onClick={() => insert(em.char)}
                                onMouseEnter={() => setActive(i)}
                                className={`flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[18px] leading-none ${
                                    i === active ? "bg-(--active-bg)" : "hover:bg-(--menu-hover-bg)"
                                }`}
                            >
                                {em.char}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
