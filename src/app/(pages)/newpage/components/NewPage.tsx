import React, { useState, useRef, useEffect } from "react";
import * as tw from "./Newpage.styles";
import { GripDotsIcon, PlusIcon } from "@/components/ui/hover-header/svg/PostsSvg";
import TypeMenuModal from "./menu/TypeMenu.modal";
import { ELEMENTS } from "./menu/TypeElement";

interface ContentEditableBlockProps {
    type: string;
    content: string;
    onContentChange: (value: string) => void;
}

const ContentEditableBlock: React.FC<ContentEditableBlockProps & { color?: string }> = ({ type, content, onContentChange, color }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (ref.current && ref.current.textContent !== content) {
            ref.current.textContent = content;
        }
    }, [content]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.textContent ?? "";
        onContentChange(newContent);
    };

    const commonProps = {
        ref: ref,
        contentEditable: true, // 항상 입력 가능
        suppressContentEditableWarning: true,
        spellCheck: true, // 항상 맞춤법 검사
        className: "notranslate",
        onInput: handleInput,
        style: { color },
    };

    switch (type) {
        case "h1":
            return <tw.EditableH1Block {...commonProps} />;
        case "h2":
            return <tw.EditableH2Block {...commonProps} />;
        case "h3":
            return <tw.EditableH3Block {...commonProps} />;
        default:
            return <tw.EditablePBlock {...commonProps} />;
    }
};

function blocksToMDX(
    blocks: Block[],
    meta?: {
        label?: string;
        title?: string;
        subTitle?: string;
        date?: string;
        mins?: number;
        tags?: string[];
        imageUrl?: string;
    },
    blockColors?: { [id: string]: string },
) {
    let frontmatter = "";
    if (meta) {
        frontmatter = `---\n`;
        if (meta.label) frontmatter += `label: ${meta.label}\n`;
        if (meta.title) frontmatter += `title: ${meta.title}\n`;
        if (meta.subTitle) frontmatter += `subTitle: ${meta.subTitle}\n`;
        if (meta.date) frontmatter += `date: ${meta.date}\n`;
        if (meta.mins) frontmatter += `mins: ${meta.mins}\n`;
        if (meta.tags) frontmatter += `tags: [${meta.tags.join(", ")}]\n`;
        if (meta.imageUrl) frontmatter += `imageUrl: ${meta.imageUrl}\n`;
        frontmatter += `---\n\n`;
    }
    const body = blocks
        .filter((b) => b.content.trim() !== "")
        .map((b) => {
            const color = blockColors?.[b.id];
            const style = color ? ` style={{color: '${color}'}}` : "";
            switch (b.type) {
                case "h1":
                    return `<h1${style}>${b.content}</h1>`;
                case "h2":
                    return `<h2${style}>${b.content}</h2>`;
                case "h3":
                    return `<h3${style}>${b.content}</h3>`;
                case "p":
                    return `<p${style}>${b.content}</p>`;
                default:
                    return `<p${style}>${b.content}</p>`;
            }
        })
        .join("\n\n");
    return frontmatter + body;
}

interface Block {
    id: string;
    type: string;
    content: string;
}

export default function NewPage({ collapsed }: { collapsed: boolean }) {
    const [blocks, setBlocks] = useState<Block[]>([{ id: crypto.randomUUID(), type: "p", content: "" }]);
    const [blockColors, setBlockColors] = useState<{ [id: string]: string }>({});
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);
    const [menuIdx, setMenuIdx] = useState<number | null>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
    const plusRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const divRef = useRef<HTMLDivElement | null>(null);
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
    const [insertLineIdx, setInsertLineIdx] = useState<number | null>(null);

    useEffect(() => {
        if (divRef.current && (!divRef.current.textContent || divRef.current.textContent === "")) {
            divRef.current.textContent = "시작하기";
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
        const mdx = blocksToMDX(
            blocks,
            {
                label: meta.label || "",
                title: meta.title || "",
                subTitle: meta.subTitle || "",
                date: meta.date || new Date().toISOString().slice(0, 10),
                mins: meta.mins || 2,
                tags: meta.tags.length ? meta.tags : [""],
                imageUrl: meta.imageUrl || "",
            },
            blockColors,
        );
        alert(mdx);
    };

    const changeBlockType = (idx: number, type: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].type = type;
        setBlocks(newBlocks);
        setMenuIdx(null);
        setMenuPos(null);
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

        const allBlocksNotEmpty = newBlocks.every((block) => block.content.trim() !== "");

        if (allBlocksNotEmpty) {
            setBlocks([...newBlocks, { id: crypto.randomUUID(), type: "p", content: "" }]);
        }
    };

    const handleDeleteBlock = (idx: number) => {
        const newBlocks = [...blocks];
        newBlocks.splice(idx, 1);
        setBlocks(newBlocks);
        setMenuIdx(null);
        setMenuPos(null);
    };

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.stopPropagation();
        setDraggingIdx(idx);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${idx}`);
        // 드래그 시 블록 전체가 따라 움직이도록 dragImage 설정
        const dragImage = (e.currentTarget.parentNode as HTMLElement);
        if (dragImage) {
            e.dataTransfer.setDragImage(dragImage, 0, 0);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.preventDefault();
        if (draggingIdx === null || draggingIdx === idx) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const middle = rect.height / 2;

        if (y < middle) {
            setInsertLineIdx(idx);
        } else {
            setInsertLineIdx(idx + 1);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIdx: number) => {
        e.preventDefault();
        if (draggingIdx !== null && insertLineIdx !== null) {
            const newBlocks = [...blocks];
            const [draggedItem] = newBlocks.splice(draggingIdx, 1);
            let targetIdx = insertLineIdx;
            
            if (draggingIdx < insertLineIdx) {
                targetIdx = insertLineIdx - 1;
            }

            if (targetIdx !== draggingIdx) {
                newBlocks.splice(targetIdx, 0, draggedItem);
                setBlocks(newBlocks);
            }
        }
        setDraggingIdx(null);
        setInsertLineIdx(null);
    };

    const handleDragEnd = () => {
        setDraggingIdx(null);
        setInsertLineIdx(null);
    };

    const handlePlusClick = (idx: number) => {
    setMenuIdx(idx);
    setTimeout(() => {
        const btn = plusRefs.current[idx];
        if (btn) {
            const rect = btn.getBoundingClientRect();

            const menuWidth = 265;
            const menuHeight = 100;

            const newLeft = rect.left - menuWidth - 490;

            const newTop = rect.top + (rect.height / 2) - (menuHeight / 2) - 80;

            setMenuPos({
                top: newTop,
                left: newLeft,
            });
        }
    }, 0);
};

    const handleAddBlock = (idx: number) => {
        const newBlocks = [...blocks];
        newBlocks.splice(idx + 1, 0, { id: crypto.randomUUID(), type: "p", content: "" });
        setBlocks(newBlocks);
    };

    return (
        <tw.Container
            style={{
                paddingLeft: collapsed ? 50 : 350,
                transition: "padding-left 0.2s",
            }}
        >
            <div className="w-full gap-2 max-w-[712px]" style={{ position: "relative" }}>
                <tw.BlockWrap>
                    <tw.TitleBlock>
                        <tw.EditableTitle
                            ref={divRef}
                            contentEditable
                            suppressContentEditableWarning
                            spellCheck={true}
                            className="notranslate"
                            onInput={() => {
                                setMeta((prev) => ({ ...prev, title: divRef.current?.textContent ?? "" }));
                            }}
                            onBlur={() => {
                                setMeta((prev) => ({ ...prev, title: divRef.current?.textContent ?? "" }));
                            }}
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
                    <tw.BlockWrap
                        key={block.id}
                        className={`group relative ${draggingIdx === idx ? 'opacity-50' : ''} 
                            ${insertLineIdx !== null && insertLineIdx === idx && draggingIdx !== idx ? 'border-t-2 border-blue-500' : ''} 
                            ${insertLineIdx !== null && insertLineIdx === idx + 1 && draggingIdx !== idx ? 'border-b-2 border-blue-500' : ''}`}
                        style={{ position: "relative" }}
                        onMouseEnter={() => setHoverIdx(idx)}
                        onMouseLeave={(e) => {
                            const related = e.relatedTarget as HTMLElement | null;
                            if (related && related.closest && related.closest(`[data-btn-idx="${idx}"]`)) {
                                return;
                            }
                            setHoverIdx(null);
                        }}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragLeave={() => setInsertLineIdx(null)}
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: -56,
                                top: 0,
                                width: 56,
                                height: "100%",
                                zIndex: 5,
                                cursor: block.content.trim() !== '' ? 'grab' : 'default', // 내용이 있을 때만 grab 커서 표시
                            }}
                            draggable={block.content.trim() !== ''} // 내용이 있을 때만 드래그 가능
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
                                    if (related && related.closest && related.closest(".group")) {
                                        return;
                                    }
                                    setHoverIdx(null);
                                }}
                            >
                                <tw.PlusButton ref={(el) => (plusRefs.current[idx] = el)} onClick={() => handleAddBlock(idx)}>
                                    <PlusIcon color={"#616161"} />
                                </tw.PlusButton>
                                <tw.DotButton
                                    ref={(el) => (plusRefs.current[idx] = el)}
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
                                color={blockColors[block.id]}
                            />
                        </tw.InputWrap>
                    </tw.BlockWrap>
                ))}
            </div>
            <div className="fixed bottom-8 right-8 z-50">
                <button className="px-6 py-3 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition" onClick={handleExport}>
                    내보내기
                </button>
            </div>
        </tw.Container>
    );
}