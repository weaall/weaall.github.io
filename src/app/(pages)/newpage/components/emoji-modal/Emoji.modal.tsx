import React from "react";
import { allEmojis } from "./EmojiList";

interface EmojiModalProps {
    open: boolean;
    position: { top: number; left: number } | null;
    search: string;
    onSelect: (emoji: string, label: string) => void;
    onClose: () => void;
}

const EmojiModal: React.FC<EmojiModalProps> = ({ open, position, search, onSelect, onClose }) => {
    if (!open || !position) return null;

    const filtered = !search || search.toLowerCase() === "all"
        ? allEmojis
        : allEmojis.filter(e => e.label.includes(search.toLowerCase()));

    return (
        <div
            style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                zIndex: 2000,
                background: "#252525",
                borderRadius: 10,
                padding: 12,
                boxShadow: "0 2px 16px #0008",
                minWidth: 220,
                maxWidth: 620,
            }}
        >
            <div style={{ marginBottom: 8, color: "#aaa", fontSize: 13 }}>
                :검색어로 이모지 검색 (예: :smile, :party, :all)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 180, overflowY: "auto" }}>
                {filtered.length === 0 && (
                    <div style={{ color: "#888", fontSize: 15, padding: 12 }}>검색 결과 없음</div>
                )}
                {filtered.map(({ emoji, label }) => (
                    <button
                        key={emoji}
                        style={{
                            fontSize: 20,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                        onClick={() => onSelect(emoji, label)}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            <button
                style={{
                    marginTop: 8,
                    width: "100%",
                    background: "#313131",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 0",
                    cursor: "pointer",
                }}
                onClick={onClose}
            >
                닫기
            </button>
        </div>
    );
};

export default EmojiModal;
