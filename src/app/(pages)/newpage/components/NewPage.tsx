// NewPage.tsx (완전 버전)
import React, { useState, useRef, useEffect } from "react";

import TypeMenuModal from "./menu-modal/TypeMenu.modal";
import { ELEMENTS } from "./menu-modal/TypeElement";
import { Block, blocksToMDX } from "./helper/BlocksToMdx";
import ContentEditableBlock from "./editable-block/ContentEditableBlock";
import { FormattedRange } from "./text-modal/TextFormat.modal";
import { useBlockHistory } from "../hooks/useBlockHistory";
import { useBlockDnD } from "../hooks/useBlockDnD";

import { GripDotsIcon, PlusIcon } from "@/components/ui/icons/PostsSvg";
import { formatPostDate } from "@/util/date";
import * as tw from "./Newpage.styles";

export default function NewPage({ collapsed }: { collapsed: boolean }) {
    // blocks / colors / formattedRanges 상태 + 되돌리기(Ctrl+Z)·다시실행(Ctrl+Y) 히스토리는 훅이 소유
    const {
        blocks,
        setBlocks,
        blockColors,
        setBlockColors,
        blockFormattedRanges,
        setBlockFormattedRanges,
        undo,
        redo,
    } = useBlockHistory([{ id: crypto.randomUUID(), type: "p", content: "", indentationLevel: 0 }]);

    // hover/menu 대상은 배열 인덱스가 아니라 블록 id로 추적한다.
    // (드래그로 순서가 바뀌어도 메뉴가 엉뚱한 블록에 열리지 않게)
    const [hoverId, setHoverId] = useState<string | null>(null);
    const [menuId, setMenuId] = useState<string | null>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const dotRefs = useRef<{ [id: string]: HTMLButtonElement | null }>({});
    const [isTitleEmpty, setIsTitleEmpty] = useState(true);
    const [meta, setMeta] = useState({
        label: "",
        title: "새 페이지",
        subTitle: "",
        date: "",
        mins: 0,
        tags: [],
        imageUrl: "",
    });

    const { draggingIdx, insertLineIdx, handleDragStart, handleDragEnter, handleDragOver, handleDragEnd } =
        useBlockDnD(setBlocks);

    const getListNumber = (currentIndex: number): number => {
        let counter = 1;
        for (let i = 0; i <= currentIndex; i++) {
            if (blocks[i].type === "numberedList") {
                if (i === 0 || blocks[i - 1].type !== "numberedList" || blocks[i].indentationLevel !== blocks[i - 1].indentationLevel) {
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

    // Ctrl+Z(되돌리기) / Ctrl+Y·Ctrl+Shift+Z(다시실행). 블록 삭제 등 구조 변경도 롤백된다.
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            const key = e.key.toLowerCase();
            if (key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if (key === "y" || (key === "z" && e.shiftKey)) {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [undo, redo]);

    // 항상 마지막 블록은 편집 가능한 블록이어야 한다.
    // (divider가 맨 아래면 그 밑에 입력할 곳이 없으므로 빈 텍스트 블록을 추가)
    useEffect(() => {
        if (blocks.length === 0) {
            setBlocks([{ id: crypto.randomUUID(), type: "p", content: "", indentationLevel: 0 }]);
            return;
        }
        const last = blocks[blocks.length - 1];
        if (last.type === "divider") {
            setBlocks((prev) => [
                ...prev,
                { id: crypto.randomUUID(), type: "p", content: "", indentationLevel: last.indentationLevel },
            ]);
        }
    }, [blocks, setBlocks]);

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

    // 제목은 한 줄만 — Enter로 줄바꿈하지 않고 첫 번째 블록으로 포커스를 넘긴다.
    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            const firstBlock = blocks[0];
            if (!firstBlock) return;
            const el = document.getElementById(firstBlock.id);
            if (el) {
                el.focus();
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }
    };

    const handleExport = async () => {
        // 블록에 색상과 포맷팅 범위 정보를 추가
        const blocksWithFormatting = blocks.map(block => ({
            ...block,
            color: blockColors[block.id],
            formattedRanges: blockFormattedRanges[block.id] || [],
        }));

        const exportedTags = meta.tags.length > 0 ? meta.tags : ["default-tag"];
        
        const mdx = blocksToMDX(blocksWithFormatting, {
            label: meta.label || "",
            title: meta.title || "",
            subTitle: meta.subTitle || "",
            date: meta.date || formatPostDate(new Date()),
            mins: meta.mins || 2,
            tags: exportedTags,
            imageUrl: meta.imageUrl || "",
        });

        // 파일명은 페이지 제목으로, 공백은 밑줄로. 제목이 없으면 'untitled'.
        const filename = `${(meta.title || "untitled").replace(/ /g, "_")}.mdx`;

        // 개발 모드: posts/post 폴더에 바로 저장 시도. 실패하면 브라우저 다운로드로 폴백.
        try {
            const res = await fetch("/api/save-mdx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename, content: mdx }),
            });
            if (res.ok) {
                const data = await res.json();
                alert(`저장되었습니다 → ${data.path}`);
                return;
            }
        } catch {
            // 네트워크/서버 불가 → 아래 다운로드 폴백
        }

        // 폴백: 브라우저 다운로드
        const blob = new Blob([mdx], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const changeBlockType = (idx: number, type: string) => {
        // 함수형 업데이트: 뒤이어 호출될 수 있는 onContentChange("")와 합쳐지도록
        // (예: "[]"+space 마크다운 단축 시 type 변경이 content 변경에 덮어써지던 버그 방지)
        const blockId = blocks[idx]?.id;
        setBlocks((prev) => prev.map((b, i) => (i === idx ? { ...b, type } : b)));
        setMenuId(null);
        setMenuPos(null);
        setTimeout(() => {
            if (!blockId) return;
            const blockElement = document.getElementById(blockId);
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
        setMenuId(null);
        setMenuPos(null);
    };

    const handleContentChange = (idx: number, value: string) => {
        setBlocks((prev) => prev.map((b, i) => (i === idx ? { ...b, content: value } : b)));
    };

    const handleFormattedRangesChange = (idx: number, ranges: FormattedRange[]) => {
        const blockId = blocks[idx].id;
        setBlockFormattedRanges((prev) => ({
            ...prev,
            [blockId]: ranges,
        }));
    };

    // 체크리스트 체크 상태를 blocks에 반영 (내보내기 시 - [x] 로 나가게)
    const handleToggleChecked = (id: string, isChecked: boolean) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, isChecked } : b)));
    };

    // 토글(목록/제목) 접기·펼치기
    const handleToggleCollapse = (id: string) => {
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, collapsed: !b.collapsed } : b)));
    };

    const handleDeleteBlock = (idx: number) => {
        // 블록이 1개뿐이면 삭제하지 않는다 (0개가 되면 입력할 곳이 없어짐).
        if (blocks.length <= 1) {
            setMenuId(null);
            setMenuPos(null);
            return;
        }
        const newBlocks = [...blocks];
        const blockId = blocks[idx].id;
        newBlocks.splice(idx, 1);
        setBlocks(newBlocks);
        
        // 포맷팅 범위와 색상도 함께 삭제
        setBlockFormattedRanges((prev) => {
            const newRanges = { ...prev };
            delete newRanges[blockId];
            return newRanges;
        });
        setBlockColors((prev) => {
            const newColors = { ...prev };
            delete newColors[blockId];
            return newColors;
        });
        
        setMenuId(null);
        setMenuPos(null);
    };

    const handleDeleteBlockAndFocusPrevious = (idx: number) => {
        if (blocks.length <= 1) return;
        
        const newBlocks = [...blocks];
        const blockId = blocks[idx].id;
        const prevBlockIdx = idx > 0 ? idx - 1 : 0;
        const prevBlockId = blocks[prevBlockIdx].id;
        newBlocks.splice(idx, 1);
        setBlocks(newBlocks);
        
        // 포맷팅 범위와 색상도 함께 삭제
        setBlockFormattedRanges((prev) => {
            const newRanges = { ...prev };
            delete newRanges[blockId];
            return newRanges;
        });
        setBlockColors((prev) => {
            const newColors = { ...prev };
            delete newColors[blockId];
            return newColors;
        });
        
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

    const handlePlusClick = (id: string) => {
        setMenuId(id);
        setTimeout(() => {
            const btn = dotRefs.current[id];
            if (btn) {
                const rect = btn.getBoundingClientRect();
                // 메뉴는 position: fixed 라 뷰포트 기준 좌표를 그대로 쓴다(scroll 오프셋 더하지 않음).
                const menuWidth = 265;
                const menuHeight = 220;
                const margin = 12;
                let left = rect.left - menuWidth - 45;
                let top = rect.top - 70;
                // 화면 밖으로 넘어가지 않도록 클램핑
                left = Math.max(margin, Math.min(left, window.innerWidth - menuWidth - margin));
                top = Math.max(margin, Math.min(top, window.innerHeight - menuHeight - margin));
                setMenuPos({ top, left });
            }
        }, 0);
    };

    const handleAddBlock = (idx: number) => {
        // 함수형 업데이트: 앞서 호출된 onTypeChange/onContentChange(예: "---" divider 단축)를 덮어쓰지 않도록
        const newBlockId = crypto.randomUUID();
        setBlocks((prev) => {
            const newBlocks = [...prev];
            const newBlock = { id: newBlockId, type: "p", content: "", indentationLevel: prev[idx]?.indentationLevel ?? 0 };
            newBlocks.splice(idx + 1, 0, newBlock);
            return newBlocks;
        });
        setTimeout(() => {
            const newBlockElement = document.getElementById(newBlockId);
            if (newBlockElement) {
                newBlockElement.focus();
            }
        }, 0);
    };

    const handleAddBlockAfterBullet = (idx: number) => {
        const newBlockId = crypto.randomUUID();
        setBlocks((prev) => {
            const newBlocks = [...prev];
            const currentBlock = prev[idx];
            const newBlock = { id: newBlockId, type: currentBlock.type, content: "", indentationLevel: currentBlock.indentationLevel };
            newBlocks.splice(idx + 1, 0, newBlock);
            return newBlocks;
        });
        setTimeout(() => {
            const newBlockElement = document.getElementById(newBlockId);
            if (newBlockElement) {
                newBlockElement.focus();
            }
        }, 0);
    };

    // 토글에서 Enter → 한 단계 들여쓴 자식 블록 생성 (접혀 있으면 펼쳐서 보이게)
    const handleAddBlockAsChild = (idx: number) => {
        const newBlockId = crypto.randomUUID();
        setBlocks((prev) => {
            const newBlocks = [...prev];
            const parent = prev[idx];
            if (parent?.collapsed) newBlocks[idx] = { ...parent, collapsed: false };
            const newBlock = {
                id: newBlockId,
                type: "p",
                content: "",
                indentationLevel: (parent?.indentationLevel ?? 0) + 1,
            };
            newBlocks.splice(idx + 1, 0, newBlock);
            return newBlocks;
        });
        setTimeout(() => {
            document.getElementById(newBlockId)?.focus();
        }, 0);
    };

    const handleTypeChange = (idx: number, newType: string) => {
        changeBlockType(idx, newType);
    };

    const handleIndent = (idx: number, change: number) => {
        setBlocks(prevBlocks => {
            const newBlocks = [...prevBlocks];
            const currentBlock = newBlocks[idx];
            const newIndent = Math.max(0, currentBlock.indentationLevel + change);

            if (change > 0 && idx > 0) {
              const prevBlock = newBlocks[idx - 1];
              if (newIndent > prevBlock.indentationLevel + 1) {
                return prevBlocks;
              }
            } else if (change < 0 && newIndent < 0) {
                return prevBlocks;
            }

            newBlocks[idx] = { ...currentBlock, indentationLevel: newIndent };
            return newBlocks;
        });
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
                let closestOffset = prevBlock.textContent?.length || 0;
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

    // 접힌 토글의 자식(= 바로 아래에 이어지는 더 깊게 들여쓴 연속 블록)은 렌더링에서 숨긴다.
    const hiddenBlockIds = new Set<string>();
    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        const isToggle = b.type === "toggleText" || b.type.startsWith("toggleH");
        if (isToggle && b.collapsed) {
            for (let j = i + 1; j < blocks.length; j++) {
                if (blocks[j].indentationLevel > b.indentationLevel) {
                    hiddenBlockIds.add(blocks[j].id);
                } else {
                    break;
                }
            }
        }
    }

    return (
        <tw.Container
            style={{
                paddingLeft: collapsed ? 50 : 350,
                transition: "padding-left 0.2s",
            }}
        >
            <div className="max-w-[712px] min-w-[712px] w-[712px] mx-10" style={{ position: "relative" }}>
                <tw.BlockWrap>
                    <tw.TitleBlock>
                        <tw.EditableTitle
                            ref={divRef}
                            contentEditable
                            suppressContentEditableWarning
                            spellCheck={true}
                            className="notranslate"
                            onInput={handleTitleInput}
                            onKeyDown={handleTitleKeyDown}
                            data-placeholder="새 페이지"
                        />
                    </tw.TitleBlock>
                </tw.BlockWrap>
                
                <TypeMenuModal
                    open={menuId !== null}
                    position={menuPos}
                    onSelect={(type) => {
                        const idx = blocks.findIndex((b) => b.id === menuId);
                        if (idx !== -1) changeBlockType(idx, type);
                    }}
                    onColorSelect={(color) => {
                        const idx = blocks.findIndex((b) => b.id === menuId);
                        if (idx !== -1) handleColorChange(idx, color);
                    }}
                    onDeleteBlock={() => {
                        const idx = blocks.findIndex((b) => b.id === menuId);
                        if (idx !== -1) handleDeleteBlock(idx);
                    }}
                    onClose={() => {
                        setMenuId(null);
                        setMenuPos(null);
                    }}
                    elements={ELEMENTS}
                />
                
                {blocks.map((block, idx) => (
                    hiddenBlockIds.has(block.id) ? null : (
                    <React.Fragment key={block.id}>
                        <div
                            className={`h-1 rounded ${insertLineIdx === idx ? "bg-blue-500/50" : "bg-transparent"}`}
                            style={{ marginLeft: (blocks[idx - 1]?.indentationLevel ?? 0) * 25 }}
                            onDragEnter={(e) => handleDragEnter(e, idx, true)}
                            onDragOver={handleDragOver}
                        />
                        <tw.BlockWrap
                            className={`group ${draggingIdx === idx ? "opacity-50" : ""}`}
                            style={{ position: "relative" }}
                            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                const related = e.relatedTarget as HTMLElement | null;
                                if (related && related.closest && related.closest(`[data-btn-idx="${idx}"]`)) {
                                    return;
                                }
                                setHoverId(null);
                            }}
                            onDragEnter={(e: React.DragEvent<HTMLDivElement>) => handleDragEnter(e, idx, false)}
                            onDragOver={handleDragOver}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    left: -56 + (block.indentationLevel * 25),
                                    top: 0,
                                    width: 56,
                                    height: "100%",
                                    zIndex: 5,
                                    cursor: "pointer",
                                }}
                                onMouseEnter={() => setHoverId(block.id)}
                                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                    const related = e.relatedTarget as HTMLElement | null;
                                    if (related && related.closest && related.closest(`[data-btn-idx="${idx}"]`)) {
                                        return;
                                    }
                                    setHoverId(null);
                                }}
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragEnd={handleDragEnd}
                            />
                            
                            {(hoverId === block.id || menuId === block.id) && (
                                <div
                                    data-btn-idx={block.id}
                                    style={{
                                        position: "absolute",
                                        left: -56 + (block.indentationLevel * 25),
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        display: "flex",
                                        alignItems: "center",
                                        zIndex: 10,
                                        width: 56,
                                        height: "100%",
                                    }}
                                    onMouseEnter={() => setHoverId(block.id)}
                                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                        const related = e.relatedTarget as HTMLElement | null;
                                        if (related instanceof Element && (related.closest(`[data-btn-idx="${idx}"]`) || related.closest(".group"))) {
                                            return;
                                        }
                                        setHoverId(null);
                                    }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <tw.PlusButton onClick={() => handleAddBlock(idx)}>
                                        <PlusIcon color={"#91918e"} />
                                    </tw.PlusButton>
                                    <tw.DotButton
                                        ref={(el: HTMLButtonElement | null) => {
                                            dotRefs.current[block.id] = el;
                                        }}
                                        className={`${menuId === block.id ? "bg-(--grip-hover-bg)" : ""}`}
                                        onClick={() => handlePlusClick(block.id)}
                                    >
                                        <GripDotsIcon color={"#91918e"} />
                                    </tw.DotButton>
                                </div>
                            )}
                            
                            <tw.InputWrap
                                className={menuId === block.id ? "bg-(--hover-bg)" : ""}
                                style={{ marginLeft: block.indentationLevel * 25 }}
                                onMouseEnter={() => setHoverId(block.id)}
                                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                    const related = e.relatedTarget as HTMLElement | null;
                                    if (related instanceof Element && (related.closest(`[data-btn-idx="${idx}"]`) || related.closest(".group"))) {
                                        return;
                                    }
                                    setHoverId(null);
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
                                    onAddChildBlock={() => handleAddBlockAsChild(idx)}
                                    onDeleteBlock={() => handleDeleteBlockAndFocusPrevious(idx)}
                                    color={blockColors[block.id]}
                                    id={block.id}
                                    isChecked={block.isChecked}
                                    onToggleChecked={handleToggleChecked}
                                    listNumber={block.type === "numberedList" ? getListNumber(idx) : undefined}
                                    onFocusNext={handleFocusNext}
                                    onFocusPrev={handleFocusPrev}
                                    indentationLevel={block.indentationLevel}
                                    onIndent={(change) => handleIndent(idx, change)}
                                    formattedRanges={blockFormattedRanges[block.id] || []}
                                    onFormattedRangesChange={(ranges) => handleFormattedRangesChange(idx, ranges)}
                                    collapsed={block.collapsed}
                                    onToggleCollapse={() => handleToggleCollapse(block.id)}
                                />
                            </tw.InputWrap>
                        </tw.BlockWrap>
                    </React.Fragment>
                    )
                ))}
                
                <div
                    className={`h-[4px] rounded ${insertLineIdx === blocks.length ? "bg-blue-500/50" : "bg-transparent"}`}
                    style={{ marginLeft: (blocks[blocks.length - 1]?.indentationLevel ?? 0) * 25 }}
                    onDragEnter={(e) => handleDragEnter(e, blocks.length, true)}
                    onDragOver={handleDragOver}
                />
            </div>
            
            <div className="fixed bottom-8 right-8 z-50">
                <button 
                    className="px-6 py-3 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition" 
                    onClick={handleExport}
                >
                    내보내기
                </button>
            </div>
        </tw.Container>
    );
}