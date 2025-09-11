import React, { useState, useRef, useEffect } from "react";

import TypeMenuModal from "./menu-modal/TypeMenu.modal";
import { ELEMENTS } from "./menu-modal/TypeElement";
import { Block, blocksToMDX } from "./helper/BlocksToMdx";
import ContentEditableBlock from "./editable-block/ContentEditableBlock";

import { GripDotsIcon, PlusIcon } from "@/components/ui/hover-header/svg/PostsSvg";
import * as tw from "./Newpage.styles";

export default function NewPage({ collapsed }: { collapsed: boolean }) {
    const [blocks, setBlocks] = useState<Block[]>([{ id: crypto.randomUUID(), type: "p", content: "" }]);
    const [blockColors, setBlockColors] = useState<{ [id: string]: string }>({});

    const [hoverIdx, setHoverIdx] = useState<number | null>(null);
    const [menuIdx, setMenuIdx] = useState<number | null>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [isTitleEmpty, setIsTitleEmpty] = useState(true);
    const [meta, setMeta] = useState({
        label: "",
        title: "",
        subTitle: "",
        date: "",
        mins: 0,
        tags: [],
        imageUrl: "",
    });

    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
    const [insertLineIdx, setInsertLineIdx] = useState<number | null>(null);

    const getListNumber = (currentIndex: number): number => {
        let counter = 1;
        for (let i = 0; i <= currentIndex; i++) {
            if (blocks[i].type === "numberedList") {
                if (i === 0 || blocks[i - 1].type !== "numberedList") {
                    counter = 1;
                }
                if (i === currentIndex) {
                    return counter;
                }
                counter++;
            }
        }
        return 1;
    };

    useEffect(() => {
        if (!divRef.current) return;
        const observer = new MutationObserver(() => {
            const hasContent = !!divRef.current?.textContent?.trim();
            setIsTitleEmpty(!hasContent);
        });
        observer.observe(divRef.current, {
            childList: true,
            subtree: true,
            characterData: true,
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (divRef.current && (!divRef.current.textContent || divRef.current.textContent === "")) {
            divRef.current.textContent = "새 페이지";
        }
    }, []);

    const handleTitleInput = () => {
        if (divRef.current) {
            if (divRef.current.textContent === "" || divRef.current.innerHTML === "<br>" || divRef.current.innerHTML === "\n") {
                divRef.current.innerHTML = "";
            }
            setMeta((prev) => ({ ...prev, title: divRef.current ? divRef.current.textContent ?? "" : "" }));
        }
    };

    const handleExport = () => {
        const exportedTags = meta.tags.length > 0 ? meta.tags : ["default-tag"];
        const mdx = blocksToMDX(blocks, {
            label: meta.label || "",
            title: meta.title || "",
            subTitle: meta.subTitle || "",
            date: meta.date || new Date().toISOString().slice(0, 10),
            mins: meta.mins || 2,
            tags: exportedTags,
            imageUrl: meta.imageUrl || "",
        });
        alert(mdx);
    };

    const changeBlockType = (idx: number, type: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].type = type;
        setBlocks(newBlocks);
        setMenuIdx(null);
        setMenuPos(null);
        setTimeout(() => {
            const blockElement = document.getElementById(newBlocks[idx].id);
            if (blockElement) {
                blockElement.focus();
                const selection = window.getSelection();
                if (selection) {
                    const range = document.createRange();
                    range.selectNodeContents(blockElement);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }, 0);
    };

    const handleColorChange = (idx: number, color: string) => {
        const blockId = blocks[idx].id;
        setBlockColors((prev) => ({ ...prev, [blockId]: color }));
        setMenuIdx(null);
        setMenuPos(null);
    };

    const handleContentChange = (idx: number, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].content = value;
        setBlocks(newBlocks);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.stopPropagation();
        setDraggingIdx(idx);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${idx}`);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, idx: number, isIndicator: boolean) => {
        e.preventDefault();
        setDragOverIdx(idx);
        if (isIndicator) {
            setInsertLineIdx(idx);
        } else {
            setInsertLineIdx(null);
        }
    };

    const handleDragEnd = () => {
        if (draggingIdx !== null && insertLineIdx !== null) {
            const newBlocks = [...blocks];
            const [draggedItem] = newBlocks.splice(draggingIdx, 1);
            let targetIdx = insertLineIdx;
            if (draggingIdx < insertLineIdx) {
                targetIdx = insertLineIdx - 1;
            }
            newBlocks.splice(targetIdx, 0, draggedItem);
            setBlocks(newBlocks);
        }
        setDraggingIdx(null);
        setDragOverIdx(null);
        setInsertLineIdx(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDeleteBlock = (idx: number) => {
        const newBlocks = [...blocks];
        newBlocks.splice(idx, 1);
        setBlocks(newBlocks);
        setMenuIdx(null);
        setMenuPos(null);
    };

    const handleDeleteBlockAndFocusPrevious = (idx: number) => {
        if (blocks.length <= 1) {
            return;
        }
        const newBlocks = [...blocks];
        const prevBlockIdx = idx > 0 ? idx - 1 : 0;
        const prevBlockId = blocks[prevBlockIdx].id;
        newBlocks.splice(idx, 1);
        setBlocks(newBlocks);
        setTimeout(() => {
            const prevBlockElement = document.getElementById(prevBlockId);
            if (prevBlockElement) {
                prevBlockElement.focus();
                const selection = window.getSelection();
                if (selection) {
                    const range = document.createRange();
                    range.selectNodeContents(prevBlockElement);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }, 0);
    };

    const handlePlusClick = (idx: number) => {
        setMenuIdx(idx);
        setTimeout(() => {
            const btn = dotRefs.current[idx];
            if (btn) {
                const rect = btn.getBoundingClientRect();
                const menuWidth = 265;
                const newLeft = rect.left + window.scrollX - menuWidth - 45;
                const newTop = rect.top + window.scrollY - 70;
                setMenuPos({
                    top: newTop,
                    left: newLeft,
                });
            }
        }, 0);
    };

    const handleAddBlock = (idx: number) => {
        const newBlocks = [...blocks];
        const newBlockId = crypto.randomUUID();
        const newBlock = { id: newBlockId, type: "p", content: "" };
        newBlocks.splice(idx + 1, 0, newBlock);
        setBlocks(newBlocks);
        setTimeout(() => {
            const newBlockElement = document.getElementById(newBlockId);
            if (newBlockElement) {
                newBlockElement.focus();
            }
        }, 0);
    };

    const handleAddBlockAfterBullet = (idx: number) => {
        const newBlocks = [...blocks];
        const newBlockId = crypto.randomUUID();
        const currentBlockType = blocks[idx].type;
        const newBlock = { id: newBlockId, type: currentBlockType, content: "" };
        newBlocks.splice(idx + 1, 0, newBlock);
        setBlocks(newBlocks);
        setTimeout(() => {
            const newBlockElement = document.getElementById(newBlockId);
            if (newBlockElement) {
                newBlockElement.focus();
            }
        }, 0);
    };

    const handleTypeChange = (idx: number, newType: string) => {
        changeBlockType(idx, newType);
    };

    const setCaretPosition = (element: HTMLDivElement, offset: number) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStart(element.childNodes[0] || element, offset);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
    };

    const handleFocusNext = (currentId: string, targetX: number) => {
        const currentIdx = blocks.findIndex((block) => block.id === currentId);
        if (currentIdx < blocks.length - 1) {
            const nextBlock = document.getElementById(blocks[currentIdx + 1].id) as HTMLDivElement;
            if (nextBlock) {
                const contentText = nextBlock.innerText;
                let closestOffset = 0;
                let minDistance = Infinity;
                if (nextBlock.childNodes[0]?.nodeType === Node.TEXT_NODE) {
                    const textNode = nextBlock.childNodes[0] as Text;
                    const text = textNode.data;
                    for (let i = 0; i <= text.length; i++) {
                        const range = document.createRange();
                        range.setStart(textNode, i);
                        range.collapse(true);
                        const rects = range.getClientRects();
                        if (rects.length > 0) {
                            const rect = rects[0];
                            const distance = Math.abs(rect.left + window.scrollX - targetX);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestOffset = i;
                            }
                        }
                    }
                }
                nextBlock.focus();
                setCaretPosition(nextBlock, closestOffset);
            }
        }
    };

    const handleFocusPrev = (currentId: string, targetX: number) => {
        const currentIdx = blocks.findIndex((block) => block.id === currentId);
        if (currentIdx > 0) {
            const prevBlock = document.getElementById(blocks[currentIdx - 1].id) as HTMLDivElement;
            if (prevBlock) {
                const contentText = prevBlock.innerText;
                let closestOffset = contentText.length;
                let minDistance = Infinity;
                if (prevBlock.childNodes[0]?.nodeType === Node.TEXT_NODE) {
                    const textNode = prevBlock.childNodes[0] as Text;
                    const text = textNode.data;
                    for (let i = text.length; i >= 0; i--) {
                        const range = document.createRange();
                        range.setStart(textNode, i);
                        range.collapse(true);
                        const rects = range.getClientRects();
                        if (rects.length > 0) {
                            const rect = rects[0];
                            const distance = Math.abs(rect.left + window.scrollX - targetX);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestOffset = i;
                            }
                        }
                    }
                }
                prevBlock.focus();
                setCaretPosition(prevBlock, closestOffset);
            }
        }
    };

    return (
        <tw.Container
            style={{
                paddingLeft: collapsed ? 50 : 350,
                transition: "padding-left 0.2s",
            }}
        >
            <div className="w-full max-w-[712px]" style={{ position: "relative" }}>
                <tw.BlockWrap>
                    <tw.TitleBlock>
                        <tw.EditableTitle
                            ref={divRef}
                            contentEditable
                            suppressContentEditableWarning
                            spellCheck={true}
                            className="notranslate"
                            onInput={handleTitleInput}
                            data-placeholder="새 페이지"
                        />
                    </tw.TitleBlock>
                </tw.BlockWrap>
                <TypeMenuModal
                    open={menuIdx !== null}
                    position={menuPos}
                    onSelect={(type) => {
                        if (menuIdx !== null) changeBlockType(menuIdx, type);
                    }}
                    onColorSelect={(color) => {
                        if (menuIdx !== null) handleColorChange(menuIdx, color);
                    }}
                    onDeleteBlock={() => {
                        if (menuIdx !== null) handleDeleteBlock(menuIdx);
                    }}
                    onClose={() => {
                        setMenuIdx(null);
                        setMenuPos(null);
                    }}
                    elements={ELEMENTS}
                />
                {blocks.map((block, idx) => (
                    <React.Fragment key={block.id}>
                        <div
                            className={`h-1 rounded ${insertLineIdx === idx ? "bg-blue-500/50" : "bg-transparent"}`}
                            onDragEnter={(e) => handleDragEnter(e, idx, true)}
                            onDragOver={handleDragOver}
                        />
                        <tw.BlockWrap
                            className={`group ${draggingIdx === idx ? "opacity-50" : ""}`}
                            style={{ position: "relative" }}
                            onMouseLeave={(e) => {
                                const related = e.relatedTarget as HTMLElement | null;
                                if (related && related.closest && related.closest(`[data-btn-idx="${idx}"]`)) {
                                    return;
                                }
                                setHoverIdx(null);
                            }}
                            onDragEnter={(e) => handleDragEnter(e, idx, false)}
                            onDragOver={handleDragOver}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    left: -56,
                                    top: 0,
                                    width: 56,
                                    height: "100%",
                                    zIndex: 5,
                                    cursor: "pointer",
                                }}
                                onMouseEnter={() => setHoverIdx(idx)}
                                onMouseLeave={(e) => {
                                    const related = e.relatedTarget as HTMLElement | null;
                                    if (related && related.closest && related.closest(`[data-btn-idx="${idx}"]`)) {
                                        return;
                                    }
                                    setHoverIdx(null);
                                }}
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragEnd={handleDragEnd}
                            />
                            {(hoverIdx === idx || menuIdx === idx) && (
                                <div
                                    data-btn-idx={idx}
                                    style={{
                                        position: "absolute",
                                        left: -56,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        display: "flex",
                                        alignItems: "center",
                                        zIndex: 10,
                                        width: 56,
                                        height: "100%",
                                    }}
                                    onMouseEnter={() => setHoverIdx(idx)}
                                    onMouseLeave={(e) => {
                                        const related = e.relatedTarget as HTMLElement | null;
                                        if (related && (related.closest(`[data-btn-idx="${idx}"]`) || related.closest(".group"))) {
                                            return;
                                        }
                                        setHoverIdx(null);
                                    }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <tw.PlusButton onClick={() => handleAddBlock(idx)}>
                                        <PlusIcon color={"#616161"} />
                                    </tw.PlusButton>
                                    <tw.DotButton
                                        ref={(el) => (dotRefs.current[idx] = el)} // dotRefs로 변경
                                        className={`${menuIdx === idx ? "bg-[#252525]" : ""}`}
                                        onClick={() => handlePlusClick(idx)}
                                    >
                                        <GripDotsIcon color={"#616161"} />
                                    </tw.DotButton>
                                </div>
                            )}
                            <tw.InputWrap
                                className={menuIdx === idx ? "bg-gray-800" : ""}
                                onMouseEnter={() => setHoverIdx(idx)}
                                onMouseLeave={(e) => {
                                    const related = e.relatedTarget as HTMLElement | null;
                                    if (related && (related.closest(`[data-btn-idx="${idx}"]`) || related.closest(".group"))) {
                                        return;
                                    }
                                    setHoverIdx(null);
                                }}
                            >
                                <ContentEditableBlock
                                    key={`${block.id}-${block.type}`}
                                    type={block.type}
                                    content={block.content}
                                    onContentChange={(value) => handleContentChange(idx, value)}
                                    onTypeChange={(newType) => handleTypeChange(idx, newType)}
                                    onAddBlock={() => handleAddBlock(idx)}
                                    onAddBlockAfterBullet={() => handleAddBlockAfterBullet(idx)}
                                    onDeleteBlock={() => handleDeleteBlockAndFocusPrevious(idx)}
                                    color={blockColors[block.id]}
                                    id={block.id}
                                    listNumber={block.type === "numberedList" ? getListNumber(idx) : undefined}
                                    onFocusNext={handleFocusNext}
                                    onFocusPrev={handleFocusPrev}
                                />
                            </tw.InputWrap>
                        </tw.BlockWrap>
                    </React.Fragment>
                ))}
                <div
                    className={`h-[4px] rounded ${insertLineIdx === blocks.length ? "bg-blue-500/50" : "bg-transparent"}`}
                    onDragEnter={(e) => handleDragEnter(e, blocks.length, true)}
                    onDragOver={handleDragOver}
                />
            </div>
            <div className="fixed bottom-8 right-8 z-50">
                <button className="px-6 py-3 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition" onClick={handleExport}>
                    내보내기
                </button>
            </div>
        </tw.Container>
    );
}
