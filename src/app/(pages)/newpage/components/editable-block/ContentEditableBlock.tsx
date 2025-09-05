// ContentEditableBlock.tsx

import * as tw from "./ContentEditableBlock.styles";
import EmojiModal from "../emoji-modal/Emoji.modal";
import { useRef, useEffect, useState } from "react";
import React from "react";

interface ContentEditableBlockProps {
    type: string;
    content: string;
    onContentChange: (value: string) => void;
    onTypeChange: (newType: string) => void;
    onAddBlock: () => void;
    onAddBlockAfterBullet: () => void;
    id: string;
    listNumber?: number; // 번호 리스트의 경우 순번 추가
    // 체크리스트 상태 추가
    isChecked?: boolean; 
    onToggleChecked?: (id: string, isChecked: boolean) => void;
}

const ContentEditableBlock: React.FC<ContentEditableBlockProps & { color?: string }> = ({
    type,
    content,
    onContentChange,
    onTypeChange,
    onAddBlock,
    onAddBlockAfterBullet,
    color,
    id,
    listNumber, // listNumber 매개변수 추가
    isChecked, // isChecked 매개변수 추가
    onToggleChecked, // onToggleChecked 매개변수 추가
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const isComposingRef = useRef(false);
    const [isFocused, setIsFocused] = useState(false);

    // 이모지 모달 상태 및 위치 관리
    const [showEmojiModal, setShowEmojiModal] = useState(false);
    const [emojiModalPosition, setEmojiModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [emojiSearch, setEmojiSearch] = useState("");

    // 커서 위치 저장
    const savedSelection = useRef<Range | null>(null);

    // 내부에서 체크 상태를 관리합니다. (외부 prop이 있다면 초기값으로 사용)
    const [internalIsChecked, setInternalIsChecked] = useState(isChecked || false);

    useEffect(() => {
        // content prop이 변경될 때마다 DOM을 동기화합니다.
        // 단, 실제로 외부에서 강제로 바꿀 때만 동기화 (사용자 입력 시에는 건드리지 않음)
        if (ref.current) {
            // 플레이스홀더/초기화 상황만 innerHTML을 비움
            if (content === "" && ref.current.textContent !== "") {
                ref.current.innerHTML = "";
            } else if (ref.current.textContent !== content && document.activeElement !== ref.current) {
                // 현재 포커스가 없을 때만 동기화
                ref.current.textContent = content;
            }
        }
    }, [content]);

    // 외부 isChecked prop이 변경될 때 내부 상태도 업데이트
    useEffect(() => {
        setInternalIsChecked(isChecked || false);
    }, [isChecked]);


    useEffect(() => {
        if (content === "") {
            ref.current?.focus();
        }
    }, [content]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (isComposingRef.current) return;

        const newContent = e.currentTarget.innerText ?? "";

        if (newContent.length === 0 || newContent.trim() === "") {
            if (ref.current) {
                ref.current.innerHTML = "";
            }
            onContentChange("");
            setShowEmojiModal(false);
            setEmojiSearch("");
            return;
        }

        // :검색어 패턴 감지 (텍스트 내 어디든)
        const match = newContent.match(/:(\w+)/);
        if (match) {
            // 커서 위치 저장
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                savedSelection.current = selection.getRangeAt(0).cloneRange();
            }
            // 모달 위치 계산 (블록 아래)
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                setEmojiModalPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX + 24,
                });
            }
            setShowEmojiModal(true);
            setEmojiSearch(match[1]); // 검색어만 저장
        } else {
            setShowEmojiModal(false);
            setEmojiSearch("");
        }

        const trimmedContent = newContent.trim();
        if (trimmedContent === "---" && type !== "divider") {
            onTypeChange("divider");
            onContentChange("");
            return;
        }

        onContentChange(newContent);
    };

    const handleCompositionStart = () => {
        isComposingRef.current = true;
    };

    const handleCompositionEnd = (e: React.FormEvent<HTMLDivElement>) => {
        isComposingRef.current = false;
        onContentChange(e.currentTarget.innerText ?? "");
    };

    const getPlaceholderText = (blockType: string): string => {
        switch (blockType) {
            case "h1":
                return "제목1";
            case "h2":
                return "제목2";
            case "h3":
                return "제목3";
            case "ul":
                return "리스트";
            case "numberedList":
                return "번호 리스트";
            case "checkedList":
                return "체크 리스트";
            case "p":
            default:
                return "텍스트";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && e.shiftKey) {
            // 쉬프트+엔터는 기본 동작(줄바꿈)을 허용
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            if (type === "ul" || type === "numberedList" || type === "checkedList") {
                onAddBlockAfterBullet();
            } else {
                onAddBlock();
            }
        } else if (e.key === ":") {
            // ':' 입력 시 이모지 모달 띄우기
            // 커서 위치 저장
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                savedSelection.current = selection.getRangeAt(0).cloneRange();
            }
            // 모달 위치 계산 (블록 아래)
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                setEmojiModalPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX + 24, // 약간 오른쪽
                });
            }
            setShowEmojiModal(true);
            setEmojiSearch("");
        } else if (e.key === " " && ref.current?.innerText === "-") {
            e.preventDefault();
            onTypeChange("ul");
            onContentChange("");
        } else if (e.key === " " && ref.current?.innerText.match(/^\d+\.$/)) {
            // "1." 형태로 입력했을 때 번호 리스트로 변환
            e.preventDefault();
            onTypeChange("numberedList");
            onContentChange("");
        } else if (e.key === " " && (ref.current?.innerText === "[]" || ref.current?.innerText === "[ ]")) {
            // "[]" 또는 "[ ]" 형태로 입력했을 때 체크 리스트로 변환
            e.preventDefault();
            onTypeChange("checkedList");
            onContentChange("");
        } else if (e.key === "Backspace" && ref.current?.innerText === "") {
            e.preventDefault();
            if (type === "ul" || type === "numberedList" || type === "checkedList") {
                onTypeChange("p");
            } else {
                if (ref.current) {
                    ref.current.innerHTML = "";
                }
                onContentChange("");
            }
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleCheckboxToggle = () => {
        const newCheckedState = !internalIsChecked;
        setInternalIsChecked(newCheckedState);
        if (onToggleChecked) {
            onToggleChecked(id, newCheckedState);
        }
    };

    const commonProps = {
        ref: ref,
        contentEditable: true,
        suppressContentEditableWarning: true,
        spellCheck: true,
        className: `notranslate ${internalIsChecked ? 'line-through' : ''}`,
        onInput: handleInput,
        onKeyDown: handleKeyDown,
        onCompositionStart: handleCompositionStart,
        onCompositionEnd: handleCompositionEnd,
        onFocus: handleFocus,
        onBlur: handleBlur,
        style: { color },
        id: id,
        "data-placeholder": getPlaceholderText(type),
    };

    switch (type) {
        case "h1":
            return (
                <>
                    <tw.EditableH1Block {...commonProps} />
                    {showEmojiModal && (
                        <EmojiModal
                            open={showEmojiModal}
                            position={emojiModalPosition}
                            search={emojiSearch}
                            onClose={() => setShowEmojiModal(false)}
                            onSelect={(emoji: string, label: string) => {
                                // :검색어 부분을 이모지로 치환
                                if (ref.current) {
                                    const text = ref.current.innerText ?? "";
                                    const replaced = text.replace(/:(\w*)$/, emoji);
                                    ref.current.innerText = replaced;
                                    onContentChange(replaced);
                                }
                                setShowEmojiModal(false);
                                setEmojiSearch("");
                            }}
                        />
                    )}
                </>
            );
        case "h2":
            return (
                <>
                    <tw.EditableH2Block {...commonProps} />
                    {showEmojiModal && (
                        <EmojiModal
                            open={showEmojiModal}
                            position={emojiModalPosition}
                            search={emojiSearch}
                            onClose={() => setShowEmojiModal(false)}
                            onSelect={(emoji: string, label: string) => {
                                if (ref.current) {
                                    const text = ref.current.innerText ?? "";
                                    const replaced = text.replace(/:(\w*)$/, emoji);
                                    ref.current.innerText = replaced;
                                    onContentChange(replaced);
                                }
                                setShowEmojiModal(false);
                                setEmojiSearch("");
                            }}
                        />
                    )}
                </>
            );
        case "h3":
            return (
                <>
                    <tw.EditableH3Block {...commonProps} />
                    {showEmojiModal && (
                        <EmojiModal
                            open={showEmojiModal}
                            position={emojiModalPosition}
                            search={emojiSearch}
                            onClose={() => setShowEmojiModal(false)}
                            onSelect={(emoji: string, label: string) => {
                                if (ref.current) {
                                    const text = ref.current.innerText ?? "";
                                    const replaced = text.replace(/:(\w*)$/, emoji);
                                    ref.current.innerText = replaced;
                                    onContentChange(replaced);
                                }
                                setShowEmojiModal(false);
                                setEmojiSearch("");
                            }}
                        />
                    )}
                </>
            );
        case "ul":
            return (
                <tw.EditableUlBlockWrap>
                    <tw.EditableUlBlockTag style={{ color: color || "#ffffffcf" }} />
                    <tw.EditableUlBlock {...commonProps} />
                    {showEmojiModal && (
                        <EmojiModal
                            open={showEmojiModal}
                            position={emojiModalPosition}
                            search={emojiSearch}
                            onClose={() => setShowEmojiModal(false)}
                            onSelect={(emoji: string, label: string) => {
                                if (ref.current) {
                                    const text = ref.current.innerText ?? "";
                                    const replaced = text.replace(/:(\w*)$/, emoji);
                                    ref.current.innerText = replaced;
                                    onContentChange(replaced);
                                }
                                setShowEmojiModal(false);
                                setEmojiSearch("");
                            }}
                        />
                    )}
                </tw.EditableUlBlockWrap>
            );
        case "numberedList":
            return (
                <tw.EditableNumberedListBlockWrap>
                    <tw.EditableNumberedListBlockTag 
                        style={{ color: color || "#ffffffcf" }}
                        data-number={listNumber || 1}
                    />
                    <tw.EditableNumberedListBlock {...commonProps} />
                    {showEmojiModal && (
                        <EmojiModal
                            open={showEmojiModal}
                            position={emojiModalPosition}
                            search={emojiSearch}
                            onClose={() => setShowEmojiModal(false)}
                            onSelect={(emoji: string, label: string) => {
                                if (ref.current) {
                                    const text = ref.current.innerText ?? "";
                                    const replaced = text.replace(/:(\w*)$/, emoji);
                                    ref.current.innerText = replaced;
                                    onContentChange(replaced);
                                }
                                setShowEmojiModal(false);
                                setEmojiSearch("");
                            }}
                        />
                    )}
                </tw.EditableNumberedListBlockWrap>
            );
        case "checkedList":
            return (
                <tw.EditableCheckedListBlockWrap>
                    <tw.EditableCheckbox 
                        type="checkbox" 
                        checked={internalIsChecked} 
                        onChange={handleCheckboxToggle} 
                    />
                    <tw.EditableCheckedListBlock {...commonProps} />
                    {showEmojiModal && (
                        <EmojiModal
                            open={showEmojiModal}
                            position={emojiModalPosition}
                            search={emojiSearch}
                            onClose={() => setShowEmojiModal(false)}
                            onSelect={(emoji: string, label: string) => {
                                if (ref.current) {
                                    const text = ref.current.innerText ?? "";
                                    const replaced = text.replace(/:(\w*)$/, emoji);
                                    ref.current.innerText = replaced;
                                    onContentChange(replaced);
                                }
                                setShowEmojiModal(false);
                                setEmojiSearch("");
                            }}
                        />
                    )}
                </tw.EditableCheckedListBlockWrap>
            );
        case "divider":
            return <div className={`h-[2px] my-1.5 w-full rounded bg-[#ffffff21]`} />;
        case "p":
        default:
            return (
                <>
                    <tw.EditablePBlock {...commonProps} />
                    {showEmojiModal && (
                        <EmojiModal
                            open={showEmojiModal}
                            position={emojiModalPosition}
                            search={emojiSearch}
                            onClose={() => setShowEmojiModal(false)}
                            onSelect={(emoji: string, label: string) => {
                                if (ref.current) {
                                    const text = ref.current.innerText ?? "";
                                    const replaced = text.replace(/:(\w*)$/, emoji);
                                    ref.current.innerText = replaced;
                                    onContentChange(replaced);
                                }
                                setShowEmojiModal(false);
                                setEmojiSearch("");
                            }}
                        />
                    )}
                </>
            );
    }
};

export default ContentEditableBlock;