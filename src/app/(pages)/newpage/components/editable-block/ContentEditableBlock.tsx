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
    onDeleteBlock: () => void;
    id: string;
    listNumber?: number;
    isChecked?: boolean;
    onToggleChecked?: (id: string, isChecked: boolean) => void;
    onFocusNext?: (currentId: string, targetX: number) => void; // targetX 추가
    onFocusPrev?: (currentId: string, targetX: number) => void; // targetX 추가
}

const ContentEditableBlock: React.FC<ContentEditableBlockProps & { color?: string }> = ({
    type,
    content,
    onContentChange,
    onTypeChange,
    onAddBlock,
    onAddBlockAfterBullet,
    onDeleteBlock,
    color,
    id,
    listNumber,
    isChecked,
    onToggleChecked,
    onFocusNext,
    onFocusPrev,
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const isComposingRef = useRef(false);
    const [isFocused, setIsFocused] = useState(false);

    const [showEmojiModal, setShowEmojiModal] = useState(false);
    const [emojiModalPosition, setEmojiModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [emojiSearch, setEmojiSearch] = useState("");

    const savedSelection = useRef<Range | null>(null);

    // 캐럿(커서)의 정확한 위치를 계산하는 함수
    const getCaretPosition = (editableDiv: HTMLDivElement | null) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        const range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        const rects = range.getClientRects();
        if (rects.length > 0) {
            const rect = rects[0];
            return { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX };
        }
        return null;
    };

    const [internalIsChecked, setInternalIsChecked] = useState(isChecked || false);

    const isContentEmpty = (element: HTMLDivElement | null): boolean => {
        if (!element) return true;
        const text = element.innerText || element.textContent || "";
        const trimmedText = text.trim();
        return trimmedText === "" || trimmedText === "\n";
    };

    const cleanEmptyContent = (element: HTMLDivElement) => {
        if (isContentEmpty(element)) {
            element.innerHTML = "";
        }
    };

    useEffect(() => {
        if (ref.current && ref.current.textContent !== content && document.activeElement !== ref.current) {
            if (content === "") {
                ref.current.innerHTML = "";
            } else {
                ref.current.textContent = content;
            }
        }
    }, [content]);

    useEffect(() => {
        setInternalIsChecked(isChecked || false);
    }, [isChecked]);

    useEffect(() => {
        if (content === "" && ref.current) {
            ref.current.focus();
        }
    }, [content]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (isComposingRef.current) return;
        const element = e.currentTarget;
        if (isContentEmpty(element)) {
            cleanEmptyContent(element);
            onContentChange("");
            setShowEmojiModal(false);
            setEmojiSearch("");
            return;
        }
        const newContent = element.innerText ?? "";
        onContentChange(newContent);
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && ref.current) {
            const range = selection.getRangeAt(0);
            let textBeforeCursor = "";
            try {
                const beforeRange = document.createRange();
                beforeRange.setStart(ref.current, 0);
                beforeRange.setEnd(range.startContainer, range.startOffset);
                textBeforeCursor = beforeRange.toString();
            } catch {
                textBeforeCursor = range.startContainer.textContent?.substring(0, range.startOffset) || "";
            }
            const lastColonIndex = textBeforeCursor.lastIndexOf(":");
            if (lastColonIndex !== -1) {
                const searchTerm = textBeforeCursor.substring(lastColonIndex + 1);
                if (searchTerm && !/[\s\n]/.test(searchTerm)) {
                    savedSelection.current = selection.getRangeAt(0).cloneRange();
                    if (!showEmojiModal) {
                        const caretPos = getCaretPosition(ref.current);
                        if (caretPos) {
                            setEmojiModalPosition(caretPos);
                        }
                    }
                    setShowEmojiModal(true);
                    setEmojiSearch(searchTerm);
                    return;
                }
            }
        }
        setShowEmojiModal(false);
        setEmojiSearch("");
        const trimmedContent = newContent.trim();
        if (trimmedContent === "---" && type !== "divider") {
            onTypeChange("divider");
            onContentChange("");
        }
    };

    const handleCompositionStart = () => {
        isComposingRef.current = true;
    };

    const handleCompositionEnd = (e: React.FormEvent<HTMLDivElement>) => {
        isComposingRef.current = false;
        const element = e.currentTarget;
        if (isContentEmpty(element)) {
            cleanEmptyContent(element);
            onContentChange("");
        } else {
            onContentChange(element.innerText ?? "");
        }
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

    const emojiModalRef = useRef<any>(null);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const element = ref.current;
        if (!element) return;
        
        // 이모지 모달이 열려 있을 때 키 이벤트 전달
        if (showEmojiModal && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
            e.preventDefault();
            if (emojiModalRef.current && emojiModalRef.current.handleKeyEvent) {
                emojiModalRef.current.handleKeyEvent(e);
            }
            return;
        }
        
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        const currentText = element.innerText;
        const isAtStartOfBlock = selection?.anchorOffset === 0;
        const isAtEndOfBlock = selection?.anchorOffset === currentText.length;
        
        // 커서 위치가 특정 행의 시작/끝에 있는지 확인하는 로직 (줄바꿈 포함)
        const isAtStartOfLine = () => {
            if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) return false;
            const textBeforeCursor = range.startContainer.textContent?.substring(0, range.startOffset) || '';
            return textBeforeCursor.endsWith('\n') || range.startOffset === 0;
        };

        const isAtEndOfLine = () => {
            if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) return false;
            const textAfterCursor = range.startContainer.textContent?.substring(range.startOffset) || '';
            return textAfterCursor.startsWith('\n') || range.startOffset === range.startContainer.textContent?.length;
        };
        
        // 방향키로 다음/이전 블록 이동
        if (e.key === "ArrowDown") {
            // 줄바꿈이 없는 단일 라인 블록이거나, 여러 줄 중 마지막 줄의 끝에 있을 때
            if (currentText.indexOf('\n') === -1 || isAtEndOfLine()) {
                e.preventDefault();
                const caretPos = getCaretPosition(element);
                if (caretPos) {
                    onFocusNext?.(id, caretPos.left);
                } else {
                    onFocusNext?.(id, 0); // fallback
                }
            }
        } else if (e.key === "ArrowUp") {
             // 줄바꿈이 없는 단일 라인 블록이거나, 여러 줄 중 첫 번째 줄의 시작에 있을 때
            if (currentText.indexOf('\n') === -1 || isAtStartOfLine()) {
                e.preventDefault();
                const caretPos = getCaretPosition(element);
                if (caretPos) {
                    onFocusPrev?.(id, caretPos.left);
                } else {
                    onFocusPrev?.(id, 0); // fallback
                }
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (type === "ul" || type === "numberedList" || type === "checkedList") {
                onAddBlockAfterBullet();
            } else {
                onAddBlock();
            }
        } else if (e.key === "Backspace" && isAtStartOfBlock) {
            const isEmpty = isContentEmpty(element);
            if (isEmpty) {
                e.preventDefault();
                if (type === "h1" || type === "h2" || type === "h3" || type === "ul" || type === "numberedList" || type === "checkedList") {
                    onTypeChange("p");
                } else if (type === "p") {
                    onDeleteBlock();
                }
            } else if (type === "p" && isAtStartOfBlock) {
                const text = element.innerText;
                if (text.length === 0 || (text.length === 1 && text.charCodeAt(0) === 10)) {
                    e.preventDefault();
                    onDeleteBlock();
                }
            }
        } else if (e.key === " " && (ref.current?.innerText === "-" || ref.current?.innerText === "*" || ref.current?.innerText === "+")) {
            e.preventDefault();
            onTypeChange("ul");
            onContentChange("");
        } else if (e.key === " " && ref.current?.innerText.match(/^\d+\.$/)) {
            e.preventDefault();
            onTypeChange("numberedList");
            onContentChange("");
        } else if (e.key === " " && (ref.current?.innerText === "[]" || ref.current?.innerText === "[ ]")) {
            e.preventDefault();
            onTypeChange("checkedList");
            onContentChange("");
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (ref.current && isContentEmpty(ref.current)) {
            cleanEmptyContent(ref.current);
            if (content !== "") {
                onContentChange("");
            }
        }
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
        className: `notranslate ${internalIsChecked ? "line-through" : ""}`,
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

    const renderEmojiModal = () =>
        showEmojiModal && (
            <EmojiModal
                ref={emojiModalRef}
                open={showEmojiModal}
                position={emojiModalPosition}
                search={emojiSearch}
                onClose={() => setShowEmojiModal(false)}
                onSelect={(emoji: string, label: string) => {
                    if (ref.current && savedSelection.current) {
                        const element = ref.current;
                        const selection = window.getSelection();
                        if (!selection || selection.rangeCount === 0) return;
                        selection.removeAllRanges();
                        selection.addRange(savedSelection.current);
                        try {
                            const range = selection.getRangeAt(0);
                            const textNode = range.startContainer;
                            if (textNode.nodeType === Node.TEXT_NODE) {
                                const textContent = textNode.textContent || "";
                                const cursorOffset = range.startOffset;
                                const textBeforeCursor = textContent.substring(0, cursorOffset);
                                const lastColonIndex = textBeforeCursor.lastIndexOf(":");
                                if (lastColonIndex !== -1) {
                                    const beforeColon = textContent.substring(0, lastColonIndex);
                                    const afterCursor = textContent.substring(cursorOffset);
                                    const newTextContent = beforeColon + emoji + afterCursor;
                                    textNode.textContent = newTextContent;
                                    const newCursorPosition = lastColonIndex + emoji.length;
                                    const newRange = document.createRange();
                                    newRange.setStart(textNode, newCursorPosition);
                                    newRange.collapse(true);
                                    selection.removeAllRanges();
                                    selection.addRange(newRange);
                                    onContentChange(element.innerText || "");
                                }
                            }
                        } catch (error) {
                            console.error("이모지 삽입 중 오류:", error);
                            const fullText = element.innerText || "";
                            const lines = fullText.split("\n");
                            for (let i = lines.length - 1; i >= 0; i--) {
                                const line = lines[i];
                                const lastColonIndex = line.lastIndexOf(":");
                                if (lastColonIndex !== -1) {
                                    const searchTerm = line.substring(lastColonIndex + 1);
                                    if (searchTerm === emojiSearch) {
                                        lines[i] = line.substring(0, lastColonIndex) + emoji + line.substring(lastColonIndex + 1 + searchTerm.length);
                                        break;
                                    }
                                }
                            }
                            const newText = lines.join("\n");
                            element.innerText = newText;
                            onContentChange(newText);
                        }
                    }
                    setShowEmojiModal(false);
                    setEmojiSearch("");
                }}
            />
        );

    switch (type) {
        case "h1":
            return (
                <>
                    <tw.EditableH1Block {...commonProps} />
                    {renderEmojiModal()}
                </>
            );
        case "h2":
            return (
                <>
                    <tw.EditableH2Block {...commonProps} />
                    {renderEmojiModal()}
                </>
            );
        case "h3":
            return (
                <>
                    <tw.EditableH3Block {...commonProps} />
                    {renderEmojiModal()}
                </>
            );
        case "ul":
            return (
                <tw.EditableUlBlockWrap>
                    <tw.EditableUlBlockTag style={{ color: color || "#ffffffcf" }} />
                    <tw.EditableUlBlock {...commonProps} />
                    {renderEmojiModal()}
                </tw.EditableUlBlockWrap>
            );
        case "numberedList":
            return (
                <tw.EditableNumberedListBlockWrap>
                    <tw.EditableNumberedListBlockTag style={{ color: color || "#ffffffcf" }} data-number={listNumber || 1} />
                    <tw.EditableNumberedListBlock {...commonProps} />
                    {renderEmojiModal()}
                </tw.EditableNumberedListBlockWrap>
            );
        case "checkedList":
            return (
                <tw.EditableCheckedListBlockWrap>
                    <tw.EditableCheckbox type="checkbox" checked={internalIsChecked} onChange={handleCheckboxToggle} />
                    <tw.EditableCheckedListBlock {...commonProps} />
                    {renderEmojiModal()}
                </tw.EditableCheckedListBlockWrap>
            );
        case "divider":
            return <div className={`h-[2px] my-1.5 w-full rounded bg-[#ffffff21]`} />;
        case "p":
        default:
            return (
                <>
                    <tw.EditablePBlock {...commonProps} />
                    {renderEmojiModal()}
                </>
            );
    }
};

export default ContentEditableBlock;