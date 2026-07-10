// TextFormattingModal — 텍스트 선택 시 뜨는 서식 툴바 (노션 툴바 디자인에 맞춤)
import React, { useRef, useEffect, useState } from "react";
import { ELEMENTS } from "../menu-modal/TypeElement";

// 인라인 타입 전환 목록 (구분선/그래프 등 텍스트 전환과 무관한 타입은 제외)
const TYPE_ITEMS = ELEMENTS.filter(
    (e): e is { label: string; type: string; icon: React.ReactNode } =>
        "type" in e && e.type !== "divider" && !e.type.startsWith("barChart"),
);

export interface FormattedRange {
    start: number;
    end: number;
    format: TextFormat;
}

export interface TextFormat {
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
}

interface TextFormattingModalProps {
    open: boolean;
    position: { top: number; left: number };
    onClose: () => void;
    onFormat: (format: TextFormat) => void;
    currentFormat: TextFormat;
    type?: string; // 현재 블록 타입 (타입 셀렉터 표시/전환용)
    onTypeChange?: (type: string) => void;
}

const ChevronDown = () => (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M3.238 5.778a.625.625 0 0 1 .884 0L8 9.657l3.878-3.879a.625.625 0 1 1 .884.884l-4.32 4.32a.625.625 0 0 1-.884 0l-4.32-4.32a.625.625 0 0 1 0-.884" />
    </svg>
);

// 노션 서식 툴바에서 가져온 아이콘들 (viewBox 0 0 20 20, fill=currentColor)
const BoldIcon = () => (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="M6.428 3.95a.875.875 0 0 0-.875.875v10.35c0 .483.392.875.875.875h3.81c1.377 0 2.461-.298 3.203-.963.763-.682 1.006-1.607 1.006-2.5 0-1.199-.582-2.18-1.483-2.788.704-.64 1.007-1.494 1.007-2.386 0-2.145-2.08-3.463-4.086-3.463zm.875 6.925h3.359c1.303 0 2.035.805 2.035 1.713 0 .586-.153.954-.423 1.196-.29.26-.873.516-2.036.516H7.303zm2.165-1.75H7.303V5.7h2.582c1.452 0 2.336.9 2.336 1.713 0 .515-.172.89-.516 1.16-.373.294-1.057.55-2.237.552" />
    </svg>
);
const ItalicIcon = () => (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="m10.541 5.45-2.374 9.1H6.4a.625.625 0 1 0 0 1.25h4.5a.625.625 0 1 0 0-1.25H9.46l2.374-9.1H13.6a.625.625 0 1 0 0-1.25H9.1a.625.625 0 1 0 0 1.25z" />
    </svg>
);
const UnderlineIcon = () => (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="M15.4 5.45a.625.625 0 1 0 0-1.25h-2.7a.625.625 0 0 0 0 1.25h.725v5.54c0 1.743-1.434 3.335-3.425 3.335-1.235 0-2.07-.414-2.602-.996-.541-.594-.823-1.423-.823-2.339V5.45H7.3a.625.625 0 1 0 0-1.25H4.6a.625.625 0 1 0 0 1.25h.725v5.54c0 1.163.358 2.314 1.15 3.181.8.877 1.989 1.404 3.525 1.404 2.699 0 4.675-2.17 4.675-4.585V5.45zm1.525 12.2c0 .345-.28.625-.625.625H3.7a.625.625 0 1 1 0-1.25h12.6c.345 0 .625.28.625.625" />
    </svg>
);
const StrikeIcon = () => (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="M10.065 9.373H16.3a.627.627 0 1 1 0 1.255h-3.233l.122.107c.723.665 1.038 1.505 1.038 2.456 0 1.024-.503 1.868-1.288 2.436-.772.56-1.81.85-2.939.85s-2.167-.29-2.94-.85c-.784-.568-1.288-1.412-1.288-2.436a.628.628 0 0 1 1.255 0c0 .571.268 1.057.77 1.42.513.37 1.276.611 2.203.611.928 0 1.69-.24 2.204-.612.5-.362.768-.848.768-1.42 0-.644-.199-1.133-.632-1.531-.452-.416-1.207-.777-2.405-1.032H3.7a.627.627 0 1 1 0-1.255h3.233l-.122-.107C6.088 8.6 5.773 7.76 5.773 6.81c0-1.024.503-1.868 1.288-2.436.772-.56 1.81-.85 2.94-.85s2.166.29 2.938.85c.785.568 1.289 1.412 1.289 2.436a.628.628 0 0 1-1.255 0c0-.571-.268-1.057-.77-1.42-.513-.37-1.275-.612-2.203-.612s-1.69.241-2.203.613c-.502.362-.77.848-.77 1.42 0 .644.2 1.133.633 1.531.452.416 1.207.777 2.405 1.032" />
    </svg>
);
const ClearIcon = () => (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="M12.75 4.2c.345 0 .625.28.625.625v1.8a.625.625 0 0 1-1.25 0V5.45h-3.25v9.1h.726a.626.626 0 0 1 0 1.25H6.9a.625.625 0 1 1 0-1.25h.724v-9.1h-3.25v1.175a.625.625 0 0 1-1.25 0v-1.8c0-.345.28-.625.625-.625z" />
        <path d="M16.176 9.558a.626.626 0 0 1 .884.884l-1.68 1.68 1.68 1.679a.625.625 0 0 1-.884.884l-1.68-1.68-1.679 1.68a.626.626 0 0 1-.884-.884l1.678-1.68-1.678-1.679a.626.626 0 0 1 .884-.884l1.68 1.678z" />
    </svg>
);

const COLORS = ["#37352f", "#b5b5b5", "#e9bfa8", "#ffb86b", "#ffe066", "#b6e3b6", "#8ecae6", "#cbb7f0", "#f7b7d7", "#ff7b7b"];

const TextFormattingModal: React.FC<TextFormattingModalProps> = ({ open, position, onClose, onFormat, currentFormat, type, onTypeChange }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const currentTypeLabel = TYPE_ITEMS.find((t) => t.type === type)?.label ?? "텍스트";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) onClose();
        };
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);

    if (!open) return null;

    // 노션식 아이콘 버튼: 28px 높이 · 6px 라운드 · 호버 배경 · 활성 시 파란 아이콘
    const btn = (active: boolean) =>
        `flex h-7 w-8 items-center justify-center rounded-[6px] transition-colors ${
            active ? "text-[#3b82f6]" : "text-(--text) hover:bg-(--menu-hover-bg)"
        }`;

    return (
        <div
            ref={modalRef}
            data-modal
            className="fixed z-50 flex items-center gap-[2px] rounded-[14px] border border-(--border) bg-(--menu-bg) p-[6px] shadow-xl"
            style={{ top: position.top, left: position.left }}
        >
            {/* 블록(태그) 타입 전환 */}
            {onTypeChange && (
                <>
                    <button
                        title="블록 타입 변경"
                        className="flex h-7 items-center gap-[4px] rounded-[6px] px-[8px] text-[14px] text-(--text) transition-colors hover:bg-(--menu-hover-bg)"
                        onClick={() => {
                            setIsTypeOpen((v) => !v);
                            setIsColorPickerOpen(false);
                        }}
                    >
                        <span className="max-w-[120px] truncate">{currentTypeLabel}</span>
                        <span className="text-(--text-muted)">
                            <ChevronDown />
                        </span>
                    </button>
                    <div className="mx-[4px] h-5 w-[1px] bg-(--border)" />
                </>
            )}

            {/* 색상 */}
            <button title="텍스트 색상" className={btn(isColorPickerOpen)} onClick={() => { setIsColorPickerOpen((v) => !v); setIsTypeOpen(false); }}>
                <span
                    className="flex h-5 w-5 items-center justify-center rounded-[6px] text-[12px] font-semibold"
                    style={{ color: currentFormat.color || "var(--text)", boxShadow: "inset 0 0 0 1px var(--border)" }}
                >
                    A
                </span>
            </button>

            <button title="굵게" className={btn(!!currentFormat.bold)} onClick={() => onFormat({ bold: !currentFormat.bold })}>
                <BoldIcon />
            </button>
            <button title="기울임" className={btn(!!currentFormat.italic)} onClick={() => onFormat({ italic: !currentFormat.italic })}>
                <ItalicIcon />
            </button>
            <button title="밑줄" className={btn(!!currentFormat.underline)} onClick={() => onFormat({ underline: !currentFormat.underline })}>
                <UnderlineIcon />
            </button>
            <button
                title="취소선"
                className={btn(!!currentFormat.strikethrough)}
                onClick={() => onFormat({ strikethrough: !currentFormat.strikethrough })}
            >
                <StrikeIcon />
            </button>

            <div className="mx-[4px] h-5 w-[1px] bg-(--border)" />

            <button title="형식 초기화" className={btn(false)} onClick={() => onFormat({})}>
                <ClearIcon />
            </button>

            {/* 색상 팔레트 */}
            {isColorPickerOpen && (
                <div className="animate-popIn absolute left-0 top-[calc(100%+6px)] flex w-[200px] flex-wrap gap-[6px] rounded-[12px] border border-(--border) bg-(--menu-bg) p-[8px] shadow-xl">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            className="h-6 w-6 rounded-full border border-black/10 transition-transform hover:scale-110"
                            style={{ backgroundColor: color, outline: currentFormat.color === color ? "2px solid #3b82f6" : undefined, outlineOffset: 1 }}
                            onClick={() => {
                                onFormat({ color });
                                setIsColorPickerOpen(false);
                            }}
                            aria-label={color}
                        />
                    ))}
                </div>
            )}

            {/* 타입 전환 드롭다운 */}
            {isTypeOpen && onTypeChange && (
                <div className="animate-popIn absolute left-0 top-[calc(100%+6px)] flex max-h-[300px] w-[220px] flex-col gap-[1px] overflow-y-auto rounded-[12px] border border-(--border) bg-(--menu-bg) p-[4px] shadow-xl">
                    {TYPE_ITEMS.map((t) => (
                        <button
                            key={t.type}
                            className={`flex h-7 items-center gap-[8px] rounded-[6px] px-[8px] text-left text-[14px] hover:bg-(--menu-hover-bg) ${
                                t.type === type ? "text-[#3b82f6]" : "text-(--text)"
                            }`}
                            onClick={() => {
                                onTypeChange(t.type);
                                setIsTypeOpen(false);
                                onClose();
                            }}
                        >
                            <span className="flex h-4 w-4 items-center justify-center">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TextFormattingModal;
