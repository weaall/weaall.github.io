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

    // 포맷된 HTML을 생성하는 함수
    const generateFormattedHTML = (text: string, ranges: FormattedRange[]): string => {
        text = text.replace(/\n/g, "<br>");

        if (!ranges || ranges.length === 0) return text;

        const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);
        let html = "";
        let lastIndex = 0;

        for (const range of sortedRanges) {
            html += text.slice(lastIndex, range.start);
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
        if (ref.current) {
            const formattedHTML = generateFormattedHTML(content, formattedRanges);
            if (ref.current.innerHTML !== formattedHTML) {
                const selection = window.getSelection();
                const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                let cursorPosition = 0;

                if (range) {
                    const preCaretRange = range.cloneRange();
                    preCaretRange.selectNodeContents(ref.current);
                    preCaretRange.setEnd(range.startContainer, range.startOffset);
                    cursorPosition = preCaretRange.toString().length;
                }

                ref.current.innerHTML = formattedHTML;

                if (range && document.activeElement === ref.current) {
                    restoreCursorPosition(ref.current, cursorPosition);
                }
            }
        }
    }, [formattedRanges, content]);

    useEffect(() => {
        setInternalIsChecked(isChecked || false);
    }, [isChecked]);

    useEffect(() => {
        if (content === "" && ref.current) {
            ref.current.focus();
        }
    }, [content]);

    // 선택된 영역의 현재 포맷을 가져오는 함수
    const getFormatForRange = (range: { start: number; end: number }): TextFormat => {
        const activeFormat: TextFormat = {};
        if (!formattedRanges) return activeFormat;

        const overlappingRanges = formattedRanges.filter(
            (r) => Math.max(r.start, range.start) < Math.min(r.end, range.end)
        );

        overlappingRanges.forEach((r) => {
            Object.assign(activeFormat, r.format);
        });

        return activeFormat;
    };

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

        const { start: selectionStart, end: selectionEnd } = selectedRange;

        if (Object.keys(format).length === 0) { // 포맷 제거 로직
            const finalRanges: FormattedRange[] = [];
            formattedRanges.forEach((range) => {
                if (range.end <= selectionStart || range.start >= selectionEnd) {
                    finalRanges.push(range);
                } else {
                    if (range.start < selectionStart) {
                        finalRanges.push({ ...range, end: selectionStart });
                    }
                    if (range.end > selectionEnd) {
                        finalRanges.push({ ...range, start: selectionEnd });
                    }
                }
            });
            onFormattedRangesChange(finalRanges);
        } else { // 포맷 추가/변경/토글 로직
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
                if (start >= end) continue;

                const midPoint = (start + end) / 2;
                let segmentFormat: TextFormat = {};

                oldRanges.forEach((range) => {
                    if (midPoint >= range.start && midPoint < range.end) {
                        segmentFormat = { ...segmentFormat, ...range.format };
                    }
                });

                if (midPoint >= selectionStart && midPoint < selectionEnd) {
                    segmentFormat = { ...segmentFormat, ...format };
                }

                const cleanedFormat: TextFormat = {};

                if (segmentFormat.color) {
                    cleanedFormat.color = segmentFormat.color;
                }
                if (segmentFormat.bold) {
                    cleanedFormat.bold = segmentFormat.bold;
                }
                if (segmentFormat.italic) {
                    cleanedFormat.italic = segmentFormat.italic;
                }
                if (segmentFormat.underline) {
                    cleanedFormat.underline = segmentFormat.underline;
                }
                if (segmentFormat.strikethrough) {
                    cleanedFormat.strikethrough = segmentFormat.strikethrough;
                }
                // 여기까지 교체합니다.

                if (Object.keys(cleanedFormat).length > 0) {
                    finalRanges.push({ start, end, format: cleanedFormat });
                }
            }

            const mergedRanges: FormattedRange[] = [];
            if (finalRanges.length > 0) {
                let currentMerge = { ...finalRanges[0] };
                for (let i = 1; i < finalRanges.length; i++) {
                    const nextRange = finalRanges[i];
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

        setShowFormattingModal(false);
        setSelectedRange(null);
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (isComposingRef.current) return;
        const element = e.currentTarget;
        const newContent = element.innerText ?? "";
        const oldContent = content;

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
        } else if (e.key === " " && ["-", "*", "+"].includes(ref.current?.innerText ?? "")) {
            e.preventDefault();
            onTypeChange("ul");
            onContentChange("");
        } else if (e.key === " " && ref.current?.innerText.match(/^\d+\.$/)) {
            e.preventDefault();
            onTypeChange("numberedList");
            onContentChange("");
        } else if (e.key === " " && ["[]", "[ ]"].includes(ref.current?.innerText ?? "")) {
            e.preventDefault();
            onTypeChange("checkedList");
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
            />
        );

    switch (type) {
        case "h1":
            return (
                <>
                    <tw.EditableH1Block {...commonProps} style={{ color: color, marginLeft: `${indentationLevel * 25}px` }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
        case "h2":
            return (
                <>
                    <tw.EditableH2Block {...commonProps} style={{ color: color, marginLeft: `${indentationLevel * 25}px` }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
        case "h3":
            return (
                <>
                    <tw.EditableH3Block {...commonProps} style={{ color: color, marginLeft: `${indentationLevel * 25}px` }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
        case "ul":
            return (
                <tw.EditableUlBlockWrap style={{ marginLeft: `${indentationLevel * 25}px` }}>
                    <tw.EditableUlBlockTag style={{ color: color }} />
                    <tw.EditableUlBlock {...commonProps} style={{ color: color }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableUlBlockWrap>
            );
        case "numberedList":
            return (
                <tw.EditableNumberedListBlockWrap style={{ marginLeft: `${indentationLevel * 25}px` }}>
                    <tw.EditableNumberedListBlockTag style={{ color: color }} data-number={listNumber || 1} />
                    <tw.EditableNumberedListBlock {...commonProps} style={{ color: color }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableNumberedListBlockWrap>
            );
        case "checkedList":
            return (
                <tw.EditableCheckedListBlockWrap style={{ marginLeft: `${indentationLevel * 25}px` }}>
                    <tw.EditableCheckbox type="checkbox" checked={internalIsChecked} onChange={handleCheckboxToggle} style={{ color: color }} />
                    <tw.EditableCheckedListBlock {...commonProps} style={{ color: color, marginLeft: "6px" }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </tw.EditableCheckedListBlockWrap>
            );
        case "toggleText":
            return (
                <tw.EditableToggleTextWrap style={{ marginLeft: `${indentationLevel * 25}px` }}>
                    <tw.EditableTogglePButton $isToggled={true} />
                    <tw.EditableTogglePBlock {...commonProps} style={{ color: color }} />
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
                    <tw.EditablePBlock {...commonProps} style={{ color: color, marginLeft: `${indentationLevel * 25}px` }} />
                    {renderEmojiModal()}
                    {renderFormattingModal()}
                </>
            );
    }
};

export default ContentEditableBlock;