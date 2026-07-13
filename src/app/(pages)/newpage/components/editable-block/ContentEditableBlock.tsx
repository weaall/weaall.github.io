// ContentEditableBlock.tsx (완전 버전)
import * as tw from "./ContentEditableBlock.styles";
import ChartBlock from "./ChartBlock";
import CodeBlock from "./CodeBlock";
import ImageBlock from "./ImageBlock";
import TableBlock from "./TableBlock";
import EmojiModal from "../emoji-modal/Emoji.modal";
import TextFormattingModal, { TextFormat, FormattedRange } from "../text-modal/TextFormat.modal";
import { useRef, useEffect, useState } from "react";
import React from "react";
import {
    generateFormattedHTML,
    getFormatForRange as computeFormatForRange,
    removeFormatFromRanges,
    applyFormatToRanges,
} from "./formatting";

// 토글 타입별: 삼각형 크기(arrow)와 텍스트 줄 높이(lh).
// 버튼 박스와 텍스트가 같은 lh를 쓰게 해서 삼각형이 첫 줄 정중앙에 오도록 한다.
const TOGGLE_SIZES: { [k: string]: { arrow: number; lh: number } } = {
    toggleText: { arrow: 16, lh: 24 },
    toggleH3: { arrow: 19, lh: 28 },
    toggleH2: { arrow: 23, lh: 34 },
    toggleH1: { arrow: 28, lh: 42 },
};
const TOGGLE_PADDING_TOP = 3; // 블록의 pt-[3px]과 동일

interface ContentEditableBlockProps {
    type: string;
    content: string;
    onContentChange: (value: string) => void;
    onTypeChange: (newType: string) => void;
    onAddBlock: () => void;
    onAddBlockAfterBullet: () => void;
    onAddChildBlock?: () => void;
    onDeleteBlock: () => void;
    id: string;
    listNumber?: number;
    isChecked?: boolean;
    onToggleChecked?: (id: string, isChecked: boolean) => void;
    onFocusNext?: (currentId: string, targetX: number) => void;
    onFocusPrev?: (currentId: string, targetX: number) => void;
    indentationLevel: number;
    onIndent: (change: number) => void;
    formattedRanges?: FormattedRange[];
    onFormattedRangesChange?: (ranges: FormattedRange[]) => void;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    selected?: boolean;
}

const ContentEditableBlock: React.FC<ContentEditableBlockProps & { color?: string }> = ({
    type,
    content,
    onContentChange,
    onTypeChange,
    onAddBlock,
    onAddBlockAfterBullet,
    onAddChildBlock,
    onDeleteBlock,
    color,
    id,
    listNumber,
    isChecked,
    onToggleChecked,
    onFocusNext,
    onFocusPrev,
    indentationLevel,
    onIndent,
    formattedRanges = [],
    onFormattedRangesChange,
    collapsed,
    onToggleCollapse,
    selected,
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const isComposingRef = useRef(false);
    const [isFocused, setIsFocused] = useState(false);

    // 이모지 관련 상태
    const [showEmojiModal, setShowEmojiModal] = useState(false);
    const [emojiModalPosition, setEmojiModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [emojiSearch, setEmojiSearch] = useState("");

    // 포맷팅 관련 상태
    const [showFormattingModal, setShowFormattingModal] = useState(false);
    const [formattingModalPosition, setFormattingModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
    const [currentFormat, setCurrentFormat] = useState<TextFormat>({});

    const savedSelection = useRef<Range | null>(null);
    const replacedRangeRef = useRef<{ start: number; end: number; format: TextFormat | null } | null>(null);

    // 캐럿 위치 계산
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

    // 커서 위치를 복원하는 함수
    const restoreCursorPosition = (element: HTMLDivElement, position: number) => {
        const selection = window.getSelection();
        if (!selection) return;

        let currentPosition = 0;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

        let node;
        while ((node = walker.nextNode())) {
            const textLength = node.textContent?.length || 0;
            if (currentPosition + textLength >= position) {
                const range = document.createRange();
                range.setStart(node, position - currentPosition);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                return;
            }
            currentPosition += textLength;
        }

        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const getTextPositionFromSelection = (): { start: number; end: number } | null => {
        const selection = window.getSelection();
        if (!selection || !ref.current || selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(ref.current);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        const start = preCaretRange.toString().length;
        const end = start + range.toString().length;
        return { start, end };
    };

    // content / formattedRanges → DOM 동기화 (단일화)
    //
    // 기존엔 거의 동일한 useEffect가 두 개라 서로 경쟁하며 타이핑 중에도
    // innerHTML을 다시 써서 커서가 튀었다. 여기서는 변경 출처를 구분한다.
    //  - 포커스 중 & 텍스트만 변경(타이핑)  → 브라우저가 이미 DOM을 갱신했으므로 건드리지 않음
    //  - 포맷 범위 변경(모달로 서식 적용)     → 재렌더 후 커서 위치 복원
    //  - 비포커스(다른 블록에서 반영 등)      → 그냥 동기화
    const prevContentRef = useRef(content);
    const prevRangesRef = useRef(formattedRanges);
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const contentChanged = prevContentRef.current !== content;
        const rangesChanged = prevRangesRef.current !== formattedRanges;
        prevContentRef.current = content;
        prevRangesRef.current = formattedRanges;

        const isFocused = document.activeElement === element;

        // 타이핑 중(포커스 + 텍스트만 변경)이면 DOM은 브라우저가 이미 맞춰뒀다. 재렌더 금지.
        // 단, 내용이 비워졌을 땐 예외 — 브라우저가 남긴 <br> 때문에 :empty가 안 맞아
        // placeholder가 안 뜨므로, 이 경우엔 DOM을 비워 :empty가 매칭되게 한다.
        if (isFocused && contentChanged && !rangesChanged && content !== "") return;

        const formattedHTML = content === "" ? "" : generateFormattedHTML(content, formattedRanges);
        if (element.innerHTML === formattedHTML) return;

        if (isFocused) {
            const selection = window.getSelection();
            const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            let cursorPosition = 0;
            if (range) {
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.startContainer, range.startOffset);
                cursorPosition = preCaretRange.toString().length;
            }
            element.innerHTML = formattedHTML;
            if (range) restoreCursorPosition(element, cursorPosition);
        } else {
            element.innerHTML = formattedHTML;
        }
    }, [content, formattedRanges]);

    useEffect(() => {
        setInternalIsChecked(isChecked || false);
    }, [isChecked]);

    useEffect(() => {
        if (content === "" && ref.current) {
            ref.current.focus();
        }
    }, [content]);

    // 선택된 영역의 현재 포맷 (순수 계산은 formatting.ts에 위임)
    const getFormatForRange = (range: { start: number; end: number }): TextFormat =>
        computeFormatForRange(formattedRanges, range);

    // 마우스 업 이벤트 (텍스트 선택 감지)
    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !ref.current) {
            if (showFormattingModal) {
                setShowFormattingModal(false);
            }
            return;
        }

        const selectedPos = getTextPositionFromSelection();
        if (!selectedPos || selectedPos.start === selectedPos.end) {
            if (showFormattingModal) {
                setShowFormattingModal(false);
            }
            return;
        }

        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setFormattingModalPosition({
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX,
        });
        setSelectedRange(selectedPos);
        setCurrentFormat(getFormatForRange(selectedPos));
        setShowFormattingModal(true);
    };
    
    // 포맷 적용 처리 (토글 기능 포함)
    const handleFormatText = (format: TextFormat) => {
        if (!selectedRange || !onFormattedRangesChange) return;

        const { start, end } = selectedRange;
        const nextRanges =
            Object.keys(format).length === 0
                ? removeFormatFromRanges(formattedRanges, start, end) // 포맷 제거
                : applyFormatToRanges(formattedRanges, start, end, format); // 포맷 추가/토글
        onFormattedRangesChange(nextRanges);

        setShowFormattingModal(false);
        setSelectedRange(null);
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (isComposingRef.current) return;
        const element = e.currentTarget;
        const newContent = element.innerText ?? "";
        const oldContent = content;

        // 완전히 비었거나 브라우저가 남긴 <br>(innerText가 "\n")만 있는 경우 → 빈 블록으로 처리
        if (newContent === "" || newContent === "\n") {
            // 남아있는 <br> 등을 제거해 :empty 가 매칭되도록 (placeholder 표시)
            if (element.innerHTML !== "") element.innerHTML = "";

            let styleToPreserve: TextFormat | null = null;
            if (formattedRanges.length > 0 && oldContent.length > 0) {
                styleToPreserve = formattedRanges[0].format;
            }

            onContentChange("");
            if (onFormattedRangesChange) {
                if (styleToPreserve) {
                    onFormattedRangesChange([{ start: 0, end: 0, format: styleToPreserve }]);
                } else {
                    onFormattedRangesChange([]);
                }
            }
            setShowEmojiModal(false);
            setEmojiSearch("");
            return;
        }

        const textChangeLength = newContent.length - oldContent.length;
        if (onFormattedRangesChange) {
            if (textChangeLength === 0 && newContent !== oldContent) {
                if (formattedRanges.length > 0) {
                    const styleToInherit = formattedRanges[0].format;
                    const newRange: FormattedRange = {
                        start: 0,
                        end: newContent.length,
                        format: styleToInherit,
                    };
                    onFormattedRangesChange([newRange]);
                }
            } else if (textChangeLength !== 0) {
                const selection = window.getSelection();
                if (selection && selection.isCollapsed) {
                    const cursorPos = getTextPositionFromSelection()?.start;
                    if (cursorPos !== undefined) {
                        const editPosition = textChangeLength > 0 ? cursorPos - textChangeLength : cursorPos;
                        const updatedRanges: FormattedRange[] = [];
                        const originalRanges = JSON.parse(JSON.stringify(formattedRanges)) as FormattedRange[];

                        originalRanges.forEach((range: FormattedRange) => {
                            const newRange = { ...range };
                            const { start, end } = range;
                            if (start === end && start === editPosition) {
                                newRange.end += textChangeLength;
                            } else if (start >= editPosition) {
                                newRange.start += textChangeLength;
                                newRange.end += textChangeLength;
                            } else if (start < editPosition && end >= editPosition) {
                                newRange.end += textChangeLength;
                            }

                            if (newRange.end > newRange.start) {
                                updatedRanges.push(newRange);
                            }
                        });
                        onFormattedRangesChange(updatedRanges);
                    }
                }
            }
        }

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
            onAddBlock();
        }
    };

    const handleCompositionStart = () => {
        isComposingRef.current = true;
    };

    const handleCompositionEnd = (e: React.FormEvent<HTMLDivElement>) => {
        isComposingRef.current = false;
        handleInput(e);
    };

    const getPlaceholderText = (blockType: string): string => {
        switch (blockType) {
            case "h1": return "제목1";
            case "h2": return "제목2";
            case "h3": return "제목3";
            case "ul": return "리스트";
            case "numberedList": return "번호 리스트";
            case "checkedList": return "체크 리스트";
            case "toggleText": return "토글";
            case "toggleH1": return "토글 제목1";
            case "toggleH2": return "토글 제목2";
            case "toggleH3": return "토글 제목3";
            case "p": default: return "텍스트";
        }
    };
    
    const emojiModalRef = useRef<any>(null);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const element = ref.current;
        if (!element) return;

        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            if (e.key === "Backspace" || e.key === "Delete" || e.key.length === 1) {
                const currentPos = getTextPositionFromSelection();
                if (currentPos) {
                    let formatAtSelectionStart: TextFormat | null = null;
                    for (const range of formattedRanges) {
                        if (currentPos.start >= range.start && currentPos.start < range.end) {
                            formatAtSelectionStart = range.format;
                            break;
                        }
                    }
                    replacedRangeRef.current = { ...currentPos, format: formatAtSelectionStart };
                }
            }
        }
    
        if (showEmojiModal && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
            e.preventDefault();
            if (emojiModalRef.current && emojiModalRef.current.handleKeyEvent) {
                emojiModalRef.current.handleKeyEvent(e);
            }
            return;
        }

        const range = selection?.getRangeAt(0);
        const currentText = element.innerText;
        const isAtStartOfBlock = selection?.anchorOffset === 0;

        const handleIndent = (change: number) => {
            const newIndent = indentationLevel + change;
            if (newIndent >= 0 && newIndent <= 6) {
                onIndent(change);
            }
        };

        if (e.key === "Tab") {
            e.preventDefault();
            if (e.shiftKey) {
                handleIndent(-1);
            } else {
                handleIndent(1);
            }
            return;
        }

        const isAtStartOfLine = () => {
            if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) return false;
            const textBeforeCursor = range.startContainer.textContent?.substring(0, range.startOffset) || "";
            return textBeforeCursor.endsWith("\n") || range.startOffset === 0;
        };

        const isAtEndOfLine = () => {
            if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) return false;
            const textAfterCursor = range.startContainer.textContent?.substring(range.startOffset) || "";
            return textAfterCursor.startsWith("\n") || range.startOffset === range.startContainer.textContent?.length;
        };

        if (e.key === "ArrowDown") {
            if (currentText.indexOf("\n") === -1 || isAtEndOfLine()) {
                e.preventDefault();
                const caretPos = getCaretPosition(element);
                onFocusNext?.(id, caretPos?.left ?? 0);
            }
        } else if (e.key === "ArrowUp") {
            if (currentText.indexOf("\n") === -1 || isAtStartOfLine()) {
                e.preventDefault();
                const caretPos = getCaretPosition(element);
                onFocusPrev?.(id, caretPos?.left ?? 0);
            }
        } else if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            const selection = window.getSelection();
            if (!selection || !selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const br = document.createElement("br");
            range.insertNode(br);

            // <br> 뒤에 커서를 위치시킵니다.
            const newRange = document.createRange();
            newRange.setStartAfter(br);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);

            // 상태 업데이트를 위해 innerHTML 사용
            onContentChange(element.innerHTML);
            document.execCommand("insertLineBreak");
            // handleInput을 수동으로 호출하여 상태를 동기화합니다.
            handleInput(e as any);
            return;
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (type === "ul" || type === "numberedList" || type === "checkedList") {
                onAddBlockAfterBullet();
            } else if (type === "toggleText" || type === "toggleH1" || type === "toggleH2" || type === "toggleH3") {
                // 토글에서 Enter → 내용이 한 단계 들여쓴 자식으로 들어간다
                onAddChildBlock?.();
            } else {
                onAddBlock();
            }
        } else if (e.key === "Backspace" && isAtStartOfBlock) {
            if (indentationLevel > 0) {
                e.preventDefault();
                onIndent(-1);
                return;
            }

            const isEmpty = isContentEmpty(element);
            if (isEmpty) {
                e.preventDefault();
                if (["h1", "h2", "h3", "ul", "numberedList", "checkedList"].includes(type)) {
                    onTypeChange("p");
                } else if (type === "p") {
                    onDeleteBlock();
                }
            }
        } else if (e.key === " " && ["-", "*", "+"].includes((ref.current?.innerText ?? "").trim())) {
            e.preventDefault();
            onTypeChange("ul");
            onContentChange("");
        } else if (e.key === " " && /^\d+\.$/.test((ref.current?.innerText ?? "").trim())) {
            e.preventDefault();
            onTypeChange("numberedList");
            onContentChange("");
        } else if (e.key === " " && (ref.current?.innerText ?? "").replace(/\s+/g, "") === "[]") {
            // "[]" 또는 "[ ]" (브라우저가 붙이는 후행 개행/공백까지 허용)
            e.preventDefault();
            onTypeChange("checkedList");
            onContentChange("");
        } else if (e.key === " " && (ref.current?.innerText ?? "").replace(/\s+/g, "") === "<>") {
            // "<>" + space → 코드 블록
            e.preventDefault();
            onTypeChange("code");
            onContentChange("");
        }
    };
    
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleCheckboxToggle = () => {
        const newCheckedState = !internalIsChecked;
        setInternalIsChecked(newCheckedState);
        onToggleChecked?.(id, newCheckedState);
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
        onMouseUp: handleMouseUp,
        id: id,
        "data-placeholder": getPlaceholderText(type),
    };
    
    // 이모지 모달 렌더링
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
                    setEmojiSearch("");
                    setShowEmojiModal(false);
                }}
            />
        );

    // 포맷팅 모달 렌더링
    const renderFormattingModal = () =>
        showFormattingModal && (
            <TextFormattingModal
                open={showFormattingModal}
                position={formattingModalPosition}
                onClose={() => {
                    setShowFormattingModal(false);
                    setSelectedRange(null);
                }}
                onFormat={handleFormatText}
                currentFormat={currentFormat}
                type={type}
                onTypeChange={onTypeChange}
            />
        );

    // 토글 삼각형: 타입별 글자 크기에 비례한 SVG. collapsed면 오른쪽(▶), 펼침이면 아래(▼)로 회전.
    // line = 해당 블록 첫 줄 높이(대략)로, 그 안에서 세로 중앙 정렬.
    const renderToggleButton = () => {
        const { arrow, lh } = TOGGLE_SIZES[type] ?? TOGGLE_SIZES.toggleText;
        // 박스 높이 = pt + lh, items-center → 삼각형 중심이 (pt + lh/2) = 텍스트 첫 줄 중심과 일치
        return (
            <div
                onClick={onToggleCollapse}
                className="flex items-center justify-center shrink-0 cursor-pointer text-(--text-muted)"
                style={{ height: lh + TOGGLE_PADDING_TOP, paddingTop: TOGGLE_PADDING_TOP, width: arrow + 8 }}
            >
                <svg
                    width={arrow}
                    height={arrow}
                    viewBox="0 0 20 20"
                    fill="none"
                    style={{
                        transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
                        transition: "transform 0.15s ease",
                    }}
                >
                    <path
                        d="M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        );
    };

    switch (type) {
        case "h1":
            return (
                <>
                    <tw.EditableH1Block {...commonProps} style={{ color: color }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
        case "h2":
            return (
                <>
                    <tw.EditableH2Block {...commonProps} style={{ color: color }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
        case "h3":
            return (
                <>
                    <tw.EditableH3Block {...commonProps} style={{ color: color }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
        case "ul":
            return (
                <tw.EditableUlBlockWrap>
                    <tw.EditableUlBlockTag style={{ color: color }} />
                    <tw.EditableUlBlock {...commonProps} style={{ color: color }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableUlBlockWrap>
            );
        case "numberedList":
            return (
                <tw.EditableNumberedListBlockWrap>
                    <tw.EditableNumberedListBlockTag style={{ color: color }} data-number={listNumber || 1} />
                    <tw.EditableNumberedListBlock {...commonProps} style={{ color: color }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableNumberedListBlockWrap>
            );
        case "checkedList":
            return (
                <tw.EditableCheckedListBlockWrap>
                    <tw.EditableCheckbox type="checkbox" checked={internalIsChecked} onChange={handleCheckboxToggle} style={{ color: color }} />
                    <tw.EditableCheckedListBlock {...commonProps} style={{ color: color }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableCheckedListBlockWrap>
            );
        case "toggleText":
            return (
                <tw.EditableToggleTextWrap>
                    {renderToggleButton()}
                    <tw.EditableTogglePBlock {...commonProps} style={{ color: color, lineHeight: `${TOGGLE_SIZES.toggleText.lh}px` }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableToggleTextWrap>
            );
        case "toggleH1":
        case "toggleH2":
        case "toggleH3": {
            const HeadingBlock = type === "toggleH1" ? tw.EditableH1Block : type === "toggleH2" ? tw.EditableH2Block : tw.EditableH3Block;
            const { lh } = TOGGLE_SIZES[type] ?? TOGGLE_SIZES.toggleText;
            return (
                <tw.EditableToggleTextWrap>
                    {renderToggleButton()}
                    <HeadingBlock {...commonProps} style={{ color: color, lineHeight: `${lh}px` }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableToggleTextWrap>
            );
        }
        case "divider":
            return <div className={`h-[2px] my-1.5 w-full rounded bg-[#d0cfca]`} />;
        case "image":
            return <ImageBlock id={id} content={content} />;
        case "table":
            return <TableBlock id={id} content={content} selected={selected} />;
        case "code":
            return <CodeBlock id={id} content={content} selected={selected} />;
        case "barChartH":
            return <ChartBlock id={id} orient="h" content={content} />;
        case "barChartV":
            return <ChartBlock id={id} orient="v" content={content} />;
        case "p":
        default:
            return (
                <>
                    <tw.EditablePBlock {...commonProps} style={{ color: color }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
    }
};

export default ContentEditableBlock;