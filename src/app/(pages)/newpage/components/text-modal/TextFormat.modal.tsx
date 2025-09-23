// TextFormattingModal.tsx
import React, { useRef, useEffect } from "react";

// 포맷된 텍스트 범위를 나타내는 인터페이스
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
}

const TextFormattingModal: React.FC<TextFormattingModalProps> = ({
    open,
    position,
    onClose,
    onFormat,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    const colors = [
        "#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1", 
        "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff",
        "#5f27cd", "#00d2d3", "#ff9f43", "#ff6348",
        "#2ed573", "#3742fa", "#f368e0", "#ff3838"
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={modalRef}
            className="fixed z-50 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg p-4 min-w-[280px]"
            style={{
                top: position.top,
                left: position.left,
            }}
        >
            {/* 색상 선택 */}
            <div className="mb-3">
                <p className="text-sm text-gray-300 mb-2">색상</p>
                <div className="grid grid-cols-8 gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            className="w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => onFormat({ color })}
                        />
                    ))}
                </div>
            </div>

            {/* 텍스트 스타일 버튼들 */}
            <div className="space-y-2">
                <button
                    className="w-full px-3 py-2 text-left bg-[#2a2a2a] hover:bg-[#333] rounded text-white text-sm flex items-center gap-2"
                    onClick={() => onFormat({ bold: true })}
                >
                    <span className="font-bold">B</span>
                    <span>굵게</span>
                </button>
                
                <button
                    className="w-full px-3 py-2 text-left bg-[#2a2a2a] hover:bg-[#333] rounded text-white text-sm flex items-center gap-2"
                    onClick={() => onFormat({ italic: true })}
                >
                    <span className="italic">I</span>
                    <span>기울임</span>
                </button>
                
                <button
                    className="w-full px-3 py-2 text-left bg-[#2a2a2a] hover:bg-[#333] rounded text-white text-sm flex items-center gap-2"
                    onClick={() => onFormat({ underline: true })}
                >
                    <span className="underline">U</span>
                    <span>밑줄</span>
                </button>
                
                <button
                    className="w-full px-3 py-2 text-left bg-[#2a2a2a] hover:bg-[#333] rounded text-white text-sm flex items-center gap-2"
                    onClick={() => onFormat({ strikethrough: true })}
                >
                    <span className="line-through">S</span>
                    <span>취소선</span>
                </button>

                <div className="border-t border-gray-600 pt-2">
                    <button
                        className="w-full px-3 py-2 text-left bg-red-600 hover:bg-red-700 rounded text-white text-sm"
                        onClick={() => onFormat({})} // 포맷 제거
                    >
                        포맷 제거
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TextFormattingModal;