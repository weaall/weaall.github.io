import React, { useState, useRef, useEffect } from "react";
import * as tw from "./Newpage.styles";
import { GripDotsIcon, PlusIcon } from "@/components/ui/hover-header/svg/PostsSvg";
import TypeMenuModal from "./menu/TypeMenu.modal";
import { ELEMENTS } from "./menu/TypeElement";

function blocksToMDX(blocks: Block[]) {
    return blocks
        .filter((b) => b.content.trim() !== "")
        .map((b) => {
            switch (b.type) {
                case "h1":
                    return `# ${b.content}`;
                case "h2":
                    return `## ${b.content}`;
                case "h3":
                    return `### ${b.content}`;
                case "p":
                    return b.content;
                default:
                    return b.content;
            }
        })
        .join("\n\n");
}

interface Block {
    type: string;
    content: string;
}

function getBlockComponent(
    type: string,
    ref: React.RefObject<HTMLDivElement>,
    onInput: () => void,
    content: string
) {
    switch (type) {
        case "h1":
            return (
                <tw.EditableH1Block
                    ref={ref}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={true}
                    className="notranslate"
                    onInput={onInput}
                >
                    {content}
                </tw.EditableH1Block>
            );
        case "h2":
            return (
                <tw.EditableH2Block
                    ref={ref}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={true}
                    className="notranslate"
                    onInput={onInput}
                >
                    {content}
                </tw.EditableH2Block>
            );
        case "h3":
            return (
                <tw.EditableH3Block
                    ref={ref}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={true}
                    className="notranslate"
                    onInput={onInput}
                >
                    {content}
                </tw.EditableH3Block>
            );
        default:
            return (
                <tw.EditablePBlock
                    ref={ref}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={true}
                    className="notranslate"
                    onInput={onInput}
                >
                    {content}
                </tw.EditablePBlock>
            );
    }
}

export default function NewPage({ collapsed }: { collapsed: boolean }) {
    const [blocks, setBlocks] = useState<Block[]>([{ type: "p", content: "" }]);
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);
    const [menuIdx, setMenuIdx] = useState<number | null>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
    const plusRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

    // 타이틀 관리
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (divRef.current && (!divRef.current.textContent || divRef.current.textContent === "")) {
            divRef.current.textContent = "시작하기";
        }
    }, []);

    const handleTitleInput = () => {
        if (divRef.current) {
            if (
                divRef.current.textContent === "" ||
                divRef.current.innerHTML === "<br>" ||
                divRef.current.innerHTML === "\n"
            ) {
                divRef.current.innerHTML = "";
            }
        }
    };

    // 블록 입력 핸들러
    const handleBlockInput = (idx: number) => {
        const ref = blockRefs.current[idx];
        if (ref) {
            if (
                ref.textContent === "" ||
                ref.innerHTML === "<br>" ||
                ref.innerHTML === "\n"
            ) {
                ref.innerHTML = "";
            }
            handleContentChange(idx, ref.textContent ?? "");
        }
    };

    // 타입 변경 시 DOM에 기존 내용 반영
    useEffect(() => {
        blocks.forEach((block, idx) => {
            const ref = blockRefs.current[idx];
            if (ref && ref.textContent !== block.content) {
                ref.textContent = block.content;
            }
        });
    }, [blocks]);

    const handleExport = () => {
        const mdx = blocksToMDX(blocks);
        alert(mdx);
    };

    // 블록 타입 변경
    const changeBlockType = (idx: number, type: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].type = type;
        setBlocks(newBlocks);
        setMenuIdx(null);
        setMenuPos(null);
    };

    // 입력 시 해당 블록 내용 변경 및 마지막 블록이 채워지면 새 블록 추가
    const handleContentChange = (idx: number, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].content = value;
        setBlocks(newBlocks);

        if (
            idx === blocks.length - 1 &&
            value !== "" &&
            blocks.filter((b) => b.content === "").length < 3
        ) {
            setBlocks([...newBlocks, { type: "p", content: "" }]);
        }
    };

    // 버튼 클릭 시 메뉴 위치 계산
    const handlePlusClick = (idx: number) => {
        setMenuIdx(idx);
        const btn = plusRefs.current[idx];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            const parentRect = btn.parentElement?.parentElement?.getBoundingClientRect();
            setMenuPos({
                top: rect.top - (parentRect?.top ?? 0),
                left: rect.left - (parentRect?.left ?? 0) + rect.width - 328,
            });
        }
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
                            onInput={handleTitleInput}
                        />
                    </tw.TitleBlock>
                </tw.BlockWrap>
                {/* 메뉴는 버튼 클릭 시에만 앱솔루트로 렌더링 */}
                <TypeMenuModal
                    open={menuIdx !== null}
                    position={menuPos}
                    onSelect={(type) => {
                        if (menuIdx !== null) changeBlockType(menuIdx, type);
                    }}
                    onClose={() => {
                        setMenuIdx(null);
                        setMenuPos(null);
                    }}
                    elements={ELEMENTS}
                />
                {blocks.map((block, idx) => (
                    <tw.BlockWrap
                        key={idx}
                        className="group"
                        style={{ position: "relative" }}
                        onMouseLeave={(e) => {
                            const related = e.relatedTarget as HTMLElement | null;
                            if (related && related.closest && related.closest(`[data-btn-idx="${idx}"]`)) {
                                return;
                            }
                            setHoverIdx(null);
                        }}
                    >
                        {/* 버튼이 뜨는 공간에 호버 감지용 투명 div 추가 */}
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
                                <tw.PlusButton
                                    ref={(el) => (plusRefs.current[idx] = el)}
                                    className={`${menuIdx === idx ? "" : ""}`}
                                    onClick={() => handlePlusClick(idx)}
                                >
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
                            {getBlockComponent(
                                block.type,
                                // Pass the ref object, not a callback
                                { current: blockRefs.current[idx] },
                                () => handleBlockInput(idx),
                                block.content
                            )}
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