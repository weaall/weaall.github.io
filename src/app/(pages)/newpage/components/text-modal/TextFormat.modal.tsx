// TextFormattingModal.tsx (최종 수정 버전)
import { FontIcon } from "@/components/ui/hover-header/svg/TypeMenuSvg";
import React, { useRef, useEffect, useState } from "react";

// (Interface 정의는 기존과 동일)
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
}

const TextFormattingModal: React.FC<TextFormattingModalProps> = ({
    open, position, onClose, onFormat, currentFormat,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const colors = [
        "#ffffffcf", "#b5b5b5", "#e9bfa8", "#ffb86b", "#ffe066", 
        "#b6e3b6", "#8ecae6", "#cbb7f0", "#f7b7d7", "#ff7b7b"
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    const activeClass = "bg-[#3772ff] text-white";
    const inactiveClass = "text-gray-300 hover:bg-[#333]";
    
    const handleColorSelect = (color: string) => {
        onFormat({ color });
        setIsColorPickerOpen(false);
    };

    return (
        <div
            ref={modalRef}
            className="fixed z-50 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg p-1"
            style={{ top: position.top, left: position.left }}
        >
            <div className="relative flex items-center gap-1">
                {/* --- ✨ SVG 대신 Span 태그를 사용한 텍스트 버튼 --- */}
                <button
                    title="굵게"
                    className={`w-7 h-7 flex items-center justify-center rounded text-base ${currentFormat.bold ? activeClass : inactiveClass}`}
                    onClick={() => onFormat({ bold: !currentFormat.bold })}>
                    <span className="font-bold">B</span>
                </button>
                <button
                    title="기울임"
                    className={`w-7 h-7 flex items-center justify-center rounded text-base ${currentFormat.italic ? activeClass : inactiveClass}`}
                    onClick={() => onFormat({ italic: !currentFormat.italic })}>
                    <span className="italic">I</span>
                </button>
                <button
                    title="밑줄"
                    className={`w-7 h-7 flex items-center justify-center rounded text-base ${currentFormat.underline ? activeClass : inactiveClass}`}
                    onClick={() => onFormat({ underline: !currentFormat.underline })}>
                    <span className="underline">U</span>
                </button>
                <button
                    title="취소선"
                    className={`w-7 h-7 flex items-center justify-center rounded text-base ${currentFormat.strikethrough ? activeClass : inactiveClass}`}
                    onClick={() => onFormat({ strikethrough: !currentFormat.strikethrough })}>
                    <span className="line-through">S</span>
                </button>

                <div className="w-[1px] h-5 bg-gray-600 mx-1" />

                <button
                    title="텍스트 색상"
                    className={`w-7 h-7 flex items-center justify-center rounded ${isColorPickerOpen ? activeClass : inactiveClass}`}
                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                >
                    <FontIcon width="16" height="16" color={currentFormat.color || "#ffffffcf"} />
                </button>
            </div>

            {/* --- 색상 선택 팝업 --- */}
            {isColorPickerOpen && (
                <div className="absolute top-full left-0 mt-2 w-auto bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg p-3">
                    <div className="grid grid-cols-5 gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                className={`w-6 h-6 rounded-full border border-gray-600 hover:scale-110 transition-transform ${
                                    currentFormat.color === color ? "ring-2 ring-white" : ""
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorSelect(color)}
                            />
                        ))}
                    </div>
                    <div className="border-t border-gray-600 mt-3 pt-2">
                        <button
                            className="w-full px-3 py-1.5 text-center bg-red-600 hover:bg-red-700 rounded text-white text-sm"
                            onClick={() => { onFormat({}); setIsColorPickerOpen(false); }}
                        >
                            포맷 제거
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextFormattingModal;