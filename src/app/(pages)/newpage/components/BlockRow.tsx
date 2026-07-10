import React from "react";
import * as tw from "./Newpage.styles";
import ContentEditableBlock from "./editable-block/ContentEditableBlock";
import { GripDotsIcon, PlusIcon } from "@/components/ui/icons/PostsSvg";
import { Block } from "./helper/BlocksToMdx";
import { FormattedRange } from "./text-modal/TextFormat.modal";

// NewPage의 블록 한 줄 렌더(삽입선 + 블록 래퍼 + 호버 핸들 + 편집 블록).
// 갓 컴포넌트였던 NewPage에서 렌더 부분을 분리한 것 — 동작은 기존과 동일.
interface BlockRowProps {
    block: Block;
    idx: number;
    prevIndentLevel: number;
    hoverId: string | null;
    menuId: string | null;
    setHoverId: (id: string | null) => void;
    draggingIdx: number | null;
    insertLineIdx: number | null;
    dotRefs: React.MutableRefObject<{ [id: string]: HTMLButtonElement | null }>;
    color?: string;
    formattedRanges: FormattedRange[];
    listNumber?: number;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, idx: number) => void;
    onDragEnter: (e: React.DragEvent<HTMLDivElement>, idx: number, isIndicator: boolean) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: () => void;
    onAddBlock: (idx: number) => void;
    onPlusClick: (id: string) => void;
    onContentChange: (idx: number, value: string) => void;
    onTypeChange: (idx: number, type: string) => void;
    onAddBlockAfterBullet: (idx: number) => void;
    onAddChildBlock: (idx: number) => void;
    onDeleteBlock: (idx: number) => void;
    onToggleChecked: (id: string, isChecked: boolean) => void;
    onToggleCollapse: (id: string) => void;
    onFocusNext: (currentId: string, targetX: number) => void;
    onFocusPrev: (currentId: string, targetX: number) => void;
    onIndent: (idx: number, change: number) => void;
    onFormattedRangesChange: (idx: number, ranges: FormattedRange[]) => void;
    selected: boolean;
    onClearSelection: () => void;
}

export default function BlockRow({
    block,
    idx,
    prevIndentLevel,
    hoverId,
    menuId,
    setHoverId,
    draggingIdx,
    insertLineIdx,
    dotRefs,
    color,
    formattedRanges,
    listNumber,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragEnd,
    onAddBlock,
    onPlusClick,
    onContentChange,
    onTypeChange,
    onAddBlockAfterBullet,
    onAddChildBlock,
    onDeleteBlock,
    onToggleChecked,
    onToggleCollapse,
    onFocusNext,
    onFocusPrev,
    onIndent,
    onFormattedRangesChange,
    selected,
    onClearSelection,
}: BlockRowProps) {
    return (
        <>
            <div
                className={`h-1 rounded ${insertLineIdx === idx ? "bg-[#e0edfb]" : "bg-transparent"}`}
                style={{ marginLeft: prevIndentLevel * 25 }}
                onDragEnter={(e) => onDragEnter(e, idx, true)}
                onDragOver={onDragOver}
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
                onDragEnter={(e: React.DragEvent<HTMLDivElement>) => onDragEnter(e, idx, false)}
                onDragOver={onDragOver}
            >
                {/* 왼쪽 갓터: 핸들 호버 영역 (여기서 빈 채로 드래그하면 상위에서 마퀴 선택 시작) */}
                <div
                    style={{
                        position: "absolute",
                        left: -56 + block.indentationLevel * 25,
                        top: 0,
                        width: 56,
                        height: "100%",
                        zIndex: 5,
                    }}
                    onMouseEnter={() => setHoverId(block.id)}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                        const related = e.relatedTarget as HTMLElement | null;
                        if (related && related.closest && related.closest(`[data-btn-idx="${idx}"]`)) {
                            return;
                        }
                        setHoverId(null);
                    }}
                />

                {(hoverId === block.id || menuId === block.id) && (
                    <div
                        data-btn-idx={block.id}
                        style={{
                            position: "absolute",
                            left: -56 + block.indentationLevel * 25,
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
                        onDragStart={(e) => onDragStart(e, idx)}
                        onDragEnd={onDragEnd}
                    >
                        <tw.PlusButton onClick={() => onAddBlock(idx)}>
                            <PlusIcon color={"#91918e"} />
                        </tw.PlusButton>
                        <tw.DotButton
                            ref={(el: HTMLButtonElement | null) => {
                                dotRefs.current[block.id] = el;
                            }}
                            className={`${menuId === block.id ? "bg-(--grip-hover-bg)" : ""}`}
                            onClick={() => onPlusClick(block.id)}
                        >
                            <GripDotsIcon color={"#91918e"} />
                        </tw.DotButton>
                    </div>
                )}

                <tw.InputWrap
                    className={selected || menuId === block.id ? "bg-(--active-bg)" : ""}
                    style={{ marginLeft: block.indentationLevel * 25 }}
                    onMouseDown={onClearSelection}
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
                        onContentChange={(value) => onContentChange(idx, value)}
                        onTypeChange={(newType) => onTypeChange(idx, newType)}
                        onAddBlock={() => onAddBlock(idx)}
                        onAddBlockAfterBullet={() => onAddBlockAfterBullet(idx)}
                        onAddChildBlock={() => onAddChildBlock(idx)}
                        onDeleteBlock={() => onDeleteBlock(idx)}
                        color={color}
                        id={block.id}
                        isChecked={block.isChecked}
                        onToggleChecked={onToggleChecked}
                        listNumber={listNumber}
                        onFocusNext={onFocusNext}
                        onFocusPrev={onFocusPrev}
                        indentationLevel={block.indentationLevel}
                        onIndent={(change) => onIndent(idx, change)}
                        formattedRanges={formattedRanges}
                        onFormattedRangesChange={(ranges) => onFormattedRangesChange(idx, ranges)}
                        collapsed={block.collapsed}
                        onToggleCollapse={() => onToggleCollapse(block.id)}
                    />
                </tw.InputWrap>
            </tw.BlockWrap>
        </>
    );
}
