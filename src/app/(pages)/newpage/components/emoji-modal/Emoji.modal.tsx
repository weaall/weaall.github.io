import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { allEmojis } from "./EmojiList";
import { ModalWrap, ModalDesc, EmojiListWrap, EmojiButton, NoResult, CloseButton } from "./Emoji.modal.styles";

interface EmojiModalProps {
    open: boolean;
    position: { top: number; left: number } | null;
    search: string;
    onSelect: (emoji: string, label: string) => void;
    onClose: () => void;
}

const EmojiModal = forwardRef(function EmojiModal({ open, position, search, onSelect, onClose }: EmojiModalProps, ref) {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    
    // 이모지 한 줄에 표시할 최대 열 개수를 고정
    const COLS = 10;

    const filtered = !search || search.toLowerCase() === "all"
        ? allEmojis
        : allEmojis.filter(e => e.label.includes(search.toLowerCase()));

    // 검색어/리스트 변경 시 포커스 초기화
    useEffect(() => {
        setFocusedIndex(0);
    }, [search, filtered.length]);

    // 포커스된 이모지 버튼에 자동 스크롤
    useEffect(() => {
        if (listRef.current) {
            const btn = listRef.current.querySelector(`[aria-selected="true"]`) as HTMLButtonElement;
            if (btn) {
                btn.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [focusedIndex, filtered.length]);
    
    // 키보드 이벤트 핸들러
    const handleKeyEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (filtered.length === 0) return;
        
        let nextIndex = focusedIndex;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            nextIndex = focusedIndex + COLS;
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            nextIndex = focusedIndex - COLS;
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            nextIndex = focusedIndex - 1;
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            nextIndex = focusedIndex + 1;
        } else if (e.key === "Enter") {
            e.preventDefault();
            const { emoji, label } = filtered[focusedIndex];
            onSelect(emoji, label);
            return;
        } else if (e.key === "Escape") {
            e.preventDefault();
            onClose();
            return;
        }

        // 유효 범위 내로 인덱스 조정
        nextIndex = Math.max(0, Math.min(filtered.length - 1, nextIndex));
        setFocusedIndex(nextIndex);
    };

    useImperativeHandle(ref, () => ({
        handleKeyEvent,
    }));

    if (!open || !position) return null;

    return (
        <>
            {/* 외부 클릭 시 모달 닫힘 오버레이 */}
            <div
                style={{ position: "fixed", inset: 0, zIndex: 1999 }}
                onClick={onClose}
            />
            <ModalWrap
                ref={modalRef}
                style={{ top: position.top, left: position.left }}
                tabIndex={-1}
            >
                <ModalDesc>
                    :검색어로 이모지 검색 (예: :smile, :party, :all)
                </ModalDesc>
                <EmojiListWrap ref={listRef}>
                    {filtered.length === 0 && (
                        <NoResult>결과 없음</NoResult>
                    )}
                    {filtered.map(({ emoji, label }, i) => (
                        <EmojiButton
                            key={emoji}
                            onClick={() => onSelect(emoji, label)}
                            tabIndex={-1}
                            aria-selected={focusedIndex === i}
                            style={focusedIndex === i ? { background: '#313131', borderRadius: '8px' } : undefined}
                        >
                            {emoji}
                        </EmojiButton>
                    ))}
                </EmojiListWrap>
            </ModalWrap>
        </>
    );
});

export default EmojiModal;