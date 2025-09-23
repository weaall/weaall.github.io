// ContentEditableBlock.tsx (완전 버전)
import * as tw from "./ContentEditableBlock.styles";
import EmojiModal from "../emoji-modal/Emoji.modal";
import TextFormattingModal, { TextFormat, FormattedRange } from "../text-modal/TextFormat.modal";
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
    onFocusNext?: (currentId: string, targetX: number) => void;
    onFocusPrev?: (currentId: string, targetX: number) => void;
    indentationLevel: number;
    onIndent: (change: number) => void;
    formattedRanges?: FormattedRange[];
    onFormattedRangesChange?: (ranges: FormattedRange[]) => void;
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
    indentationLevel,
    onIndent,
    formattedRanges = [],
    onFormattedRangesChange,
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

    // 포맷된 HTML을 생성하는 함수
    const generateFormattedHTML = (text: string, ranges: FormattedRange[]): string => {
        if (!ranges || ranges.length === 0) return text;

        const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);
        let html = "";
        let lastIndex = 0;

        for (const range of sortedRanges) {
            // 이전 범위와 현재 범위 사이의 텍스트
            html += text.slice(lastIndex, range.start);

            // 현재 범위의 텍스트
            const rangeText = text.slice(range.start, range.end);
            const styles: string[] = [];

            if (range.format.color) styles.push(`color: ${range.format.color}`);
            if (range.format.bold) styles.push("font-weight: bold");
            if (range.format.italic) styles.push("font-style: italic");
            if (range.format.underline && range.format.strikethrough) {
                styles.push("text-decoration: underline line-through");
            } else if (range.format.underline) {
                styles.push("text-decoration: underline");
            } else if (range.format.strikethrough) {
                styles.push("text-decoration: line-through");
            }

            if (styles.length > 0) {
                html += `<span style="${styles.join("; ")}">${rangeText}</span>`;
            } else {
                html += rangeText;
            }

            lastIndex = range.end;
        }

        // 마지막 범위 이후의 텍스트
        html += text.slice(lastIndex);

        return html;
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

        // 위치를 찾지 못한 경우 끝으로 이동
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

    // 컴포넌트 업데이트 시 HTML 렌더링
    useEffect(() => {
        if (ref.current && document.activeElement !== ref.current) {
            if (content === "") {
                ref.current.innerHTML = "";
            } else {
                const formattedHTML = generateFormattedHTML(content, formattedRanges);
                if (ref.current.innerHTML !== formattedHTML) {
                    ref.current.innerHTML = formattedHTML || content;
                }
            }
        }
    }, [content, formattedRanges]);

    // 포맷팅 범위가 변경될 때마다 HTML 업데이트
    useEffect(() => {
        if (ref.current && formattedRanges.length > 0) {
            const formattedHTML = generateFormattedHTML(content, formattedRanges);
            if (ref.current.innerHTML !== formattedHTML) {
                // 현재 커서 위치 저장
                const selection = window.getSelection();
                const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                let cursorPosition = 0;

                if (range) {
                    const preCaretRange = range.cloneRange();
                    preCaretRange.selectNodeContents(ref.current);
                    preCaretRange.setEnd(range.startContainer, range.startOffset);
                    cursorPosition = preCaretRange.toString().length;
                }

                // HTML 업데이트
                ref.current.innerHTML = formattedHTML;

                // 커서 위치 복원
                if (range && document.activeElement === ref.current) {
                    restoreCursorPosition(ref.current, cursorPosition);
                }
            }
        }
    }, [formattedRanges]);

    useEffect(() => {
        setInternalIsChecked(isChecked || false);
    }, [isChecked]);

    useEffect(() => {
        if (content === "" && ref.current) {
            ref.current.focus();
        }
    }, [content]);

    // 마우스 업 이벤트 (텍스트 선택 감지)
    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !ref.current) return;

        const selectedPos = getTextPositionFromSelection();
        if (!selectedPos || selectedPos.start === selectedPos.end) return;

        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setFormattingModalPosition({
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX,
        });
        setSelectedRange(selectedPos);
        setShowFormattingModal(true);
    };

    // 포맷 적용 처리
    // ContentEditableBlock.tsx 파일의 기존 handleFormatText 함수를 아래 코드로 교체하세요.

    const handleFormatText = (format: TextFormat) => {
        if (!selectedRange || !onFormattedRangesChange) return;

        const { start: selectionStart, end: selectionEnd } = selectedRange;
        const newRanges: FormattedRange[] = [];

        // 기존 범위를 순회하며 새 범위와 비교하고, 필요에 따라 분할/병합합니다.
        const remainingRanges = [...formattedRanges];

        // 선택 영역과 겹치는 기존 범위들을 처리합니다.
        const overlappingOrAdjacentRanges = remainingRanges.filter((range) => Math.max(range.start, selectionStart) < Math.min(range.end, selectionEnd));

        // 겹치지 않는 범위들은 그대로 newRanges에 추가합니다.
        const nonOverlappingRanges = remainingRanges.filter((range) => !overlappingOrAdjacentRanges.includes(range));
        newRanges.push(...nonOverlappingRanges);

        if (Object.keys(format).length === 0) {
            // 포맷 제거 로직
            const rangesToModify = [...formattedRanges];
            const finalRanges: FormattedRange[] = [];

            rangesToModify.forEach((range) => {
                // 1. 선택 영역이 기존 범위를 완전히 포함하는 경우
                if (selectionStart <= range.start && selectionEnd >= range.end) {
                    // 이 범위는 제거되므로 아무것도 하지 않습니다.
                }
                // 2. 기존 범위가 선택 영역을 완전히 포함하는 경우
                else if (range.start < selectionStart && range.end > selectionEnd) {
                    finalRanges.push({ ...range, end: selectionStart });
                    finalRanges.push({ ...range, start: selectionEnd });
                }
                // 3. 기존 범위의 끝 부분이 선택 영역과 겹치는 경우
                else if (range.start < selectionStart && range.end > selectionStart) {
                    finalRanges.push({ ...range, end: selectionStart });
                }
                // 4. 기존 범위의 시작 부분이 선택 영역과 겹치는 경우
                else if (range.start < selectionEnd && range.end > selectionEnd) {
                    finalRanges.push({ ...range, start: selectionEnd });
                }
                // 5. 겹치지 않는 경우
                else {
                    finalRanges.push(range);
                }
            });
            onFormattedRangesChange(finalRanges);
        } else {
            // 포맷 추가/변경 로직
            const finalRanges: FormattedRange[] = [];
            const oldRanges = [...formattedRanges];

            const points = new Set<number>([selectionStart, selectionEnd]);
            oldRanges.forEach((range) => {
                points.add(range.start);
                points.add(range.end);
            });

            const sortedPoints = Array.from(points).sort((a, b) => a - b);

            for (let i = 0; i < sortedPoints.length - 1; i++) {
                const start = sortedPoints[i];
                const end = sortedPoints[i + 1];
                if (start === end) continue;

                const midPoint = (start + end) / 2;

                let currentFormat: TextFormat = {};
                oldRanges.forEach((range) => {
                    if (midPoint >= range.start && midPoint < range.end) {
                        currentFormat = { ...currentFormat, ...range.format };
                    }
                });

                if (midPoint >= selectionStart && midPoint < selectionEnd) {
                    currentFormat = { ...currentFormat, ...format };
                }

                if (Object.keys(currentFormat).length > 0) {
                    finalRanges.push({ start, end, format: currentFormat });
                }
            }

            // 인접하고 포맷이 동일한 범위들을 병합합니다.
            const mergedRanges: FormattedRange[] = [];
            if (finalRanges.length > 0) {
                let currentMerge = { ...finalRanges[0] };
                for (let i = 1; i < finalRanges.length; i++) {
                    const nextRange = finalRanges[i];
                    // JSON.stringify는 객체 순서에 민감할 수 있으므로, 더 나은 비교 방법이 필요할 수 있습니다.
                    // 여기서는 간단하게 사용합니다.
                    if (currentMerge.end === nextRange.start && JSON.stringify(currentMerge.format) === JSON.stringify(nextRange.format)) {
                        currentMerge.end = nextRange.end;
                    } else {
                        mergedRanges.push(currentMerge);
                        currentMerge = { ...nextRange };
                    }
                }
                mergedRanges.push(currentMerge);
            }

            onFormattedRangesChange(mergedRanges);
        }

        // 모달 닫기 및 선택 해제
        setShowFormattingModal(false);
        setSelectedRange(null);
        window.getSelection()?.removeAllRanges();
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (isComposingRef.current) return;
    const element = e.currentTarget;
    const newContent = element.innerText ?? "";
    const oldContent = content;

    // 1. 내용이 완전히 비워졌을 때의 처리 (스타일 기억 로직 포함)
    if (newContent === "") {
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

    // 2. 텍스트 변경에 따른 스타일 범위 업데이트
    const textChangeLength = newContent.length - oldContent.length;
    if (onFormattedRangesChange) {
        if (textChangeLength === 0 && newContent !== oldContent) { // 텍스트 교체
            if (formattedRanges.length > 0) {
                const styleToInherit = formattedRanges[0].format;
                const newRange: FormattedRange = {
                    start: 0,
                    end: newContent.length,
                    format: styleToInherit,
                };
                onFormattedRangesChange([newRange]);
            }
        } else if (textChangeLength !== 0) { // 텍스트 추가/삭제
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

    // 3. content state 업데이트
    onContentChange(newContent);

    // ✨ 4. 이모지 모달 트리거 로직 (누락되었던 부분)
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
                return; // 이모지 모달이 뜰 때는 여기서 함수를 종료
            }
        }
    }
    // 이모지 트리거 조건이 아닐 경우, 모달을 닫음
    setShowEmojiModal(false);
    setEmojiSearch("");

    // 5. 페이지 나누는 선 (---) 처리
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

    // 키 입력 처리 (기존 로직 유지)
    const emojiModalRef = useRef<any>(null);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const element = ref.current;
        if (!element) return;

        // --- 텍스트가 교체/삭제되기 직전의 스타일 정보를 저장하는 로직 ---
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            // Backspace, Delete 또는 일반 문자/숫자 입력으로 선택 영역이 교체될 때
            if (e.key === "Backspace" || e.key === "Delete" || e.key.length === 1) {
                const currentPos = getTextPositionFromSelection();
                if (currentPos) {
                    let formatAtSelectionStart: TextFormat | null = null;
                    // 선택 시작 지점의 스타일을 찾음
                    // 🔽 아래 줄의 range 매개변수에 타입을 추가합니다.
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
        // --- 로직 종료 ---

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
                if (caretPos) {
                    onFocusNext?.(id, caretPos.left);
                } else {
                    onFocusNext?.(id, 0);
                }
            }
        } else if (e.key === "ArrowUp") {
            if (currentText.indexOf("\n") === -1 || isAtStartOfLine()) {
                e.preventDefault();
                const caretPos = getCaretPosition(element);
                if (caretPos) {
                    onFocusPrev?.(id, caretPos.left);
                } else {
                    onFocusPrev?.(id, 0);
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
            if (indentationLevel > 0) {
                e.preventDefault();
                onIndent(-1);
                return;
            }

            const isEmpty = isContentEmpty(element);
            if (isEmpty) {
                e.preventDefault();
                if (type === "h1" || type === "h2" || type === "h3" || type === "ul" || type === "numberedList" || type === "checkedList") {
                    onTypeChange("p");
                } else if (type === "p") {
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

    const handleFocus = () => setIsFocused(true);

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
            />
        );

    // 블록 타입별 렌더링
    switch (type) {
        case "h1":
            return (
                <>
                    <tw.EditableH1Block {...commonProps} style={{ marginLeft: `${indentationLevel * 25}px` }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
        case "h2":
            return (
                <>
                    <tw.EditableH2Block {...commonProps} style={{ marginLeft: `${indentationLevel * 25}px` }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
        case "h3":
            return (
                <>
                    <tw.EditableH3Block {...commonProps} style={{ marginLeft: `${indentationLevel * 25}px` }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
        case "ul":
            return (
                <tw.EditableUlBlockWrap style={{ marginLeft: `${indentationLevel * 25}px` }}>
                    <tw.EditableUlBlockTag style={{ color: color || "#ffffffcf" }} />
                    <tw.EditableUlBlock {...commonProps} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableUlBlockWrap>
            );
        case "numberedList":
            return (
                <tw.EditableNumberedListBlockWrap style={{ marginLeft: `${indentationLevel * 25}px` }}>
                    <tw.EditableNumberedListBlockTag style={{ color: color || "#ffffffcf" }} data-number={listNumber || 1} />
                    <tw.EditableNumberedListBlock {...commonProps} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableNumberedListBlockWrap>
            );
        case "checkedList":
            return (
                <tw.EditableCheckedListBlockWrap style={{ marginLeft: `${indentationLevel * 25}px` }}>
                    <tw.EditableCheckbox type="checkbox" checked={internalIsChecked} onChange={handleCheckboxToggle} />
                    <tw.EditableCheckedListBlock {...commonProps} style={{ marginLeft: "6px" }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableCheckedListBlockWrap>
            );
        case "toggleText":
            return (
                <tw.EditableToggleTextWrap style={{ marginLeft: `${indentationLevel * 25}px` }}>
                    <tw.EditableTogglePButton $isToggled={true} />
                    <tw.EditableTogglePBlock {...commonProps} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableToggleTextWrap>
            );
        case "divider":
            return <div className={`h-[2px] my-1.5 w-full rounded bg-[#ffffff21]`} style={{ marginLeft: `${indentationLevel * 25}px` }} />;
        case "p":
        default:
            return (
                <>
                    <tw.EditablePBlock {...commonProps} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
    }
};

export default ContentEditableBlock;
