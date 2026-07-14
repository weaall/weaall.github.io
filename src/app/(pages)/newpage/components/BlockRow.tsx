import React from "react";
import * as tw from "./Newpage.styles";
import ContentEditableBlock from "./editable-block/ContentEditableBlock";
import { GripDotsIcon, PlusIcon } from "@/components/ui/icons/CommonSvg";
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
    onBlockDragOver: (e: React.DragEvent<HTMLDivElement>, idx: number) => void;
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
    animateIn?: boolean;
    inColumn?: boolean;
    sideDropSide?: "left" | "right" | null;
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
    onBlockDragOver,
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
    animateIn,
    inColumn,
    sideDropSide,
}: BlockRowProps) {
    // 칸(컬럼) 안 블록은 손잡이가 -56px로 튀면 옆 칸과 겹치므로 살짝만 왼쪽으로.
    const gutterLeft = (inColumn ? -30 : -56) + block.indentationLevel * 25;
    return (
        <>
            <div
                className={`h-1 rounded ${insertLineIdx === idx ? "bg-[#e0edfb]" : "bg-transparent"}`}
                style={{ marginLeft: prevIndentLevel * 25 }}
                onDragEnter={(e) => onDragEnter(e, idx, true)}
                onDragOver={onDragOver}
            />
            <tw.BlockWrap
                className={`group ${draggingIdx === idx ? "opacity-50" : ""} ${animateIn ? "block-reveal" : ""}`}
                style={{ position: "relative" }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    const related = e.relatedTarget as HTMLElement | null;
                    if (related && related.closest && related.closest(`[data-btn-idx="${idx}"]`)) {
                        return;
                    }
                    setHoverId(null);
                }}
                onDragEnter={(e: React.DragEvent<HTMLDivElement>) => onBlockDragOver(e, idx)}
                onDragOver={(e: React.DragEvent<HTMLDivElement>) => onBlockDragOver(e, idx)}
            >
                {/* 좌/우 가장자리 2칸 드롭 인디케이터 (세로 파란 선) */}
                {sideDropSide && (
                    <div
                        className="pointer-events-none absolute top-1 bottom-1 z-20 w-[3px] rounded bg-[#3b82f6]"
                        style={sideDropSide === "right" ? { right: -8 } : { left: -8 }}
                    />
                )}
                {/* 왼쪽 갓터: 핸들 호버 영역 (여기서 빈 채로 드래그하면 상위에서 마퀴 선택 시작) */}
                <div
                    style={{
                        position: "absolute",
                        left: gutterLeft,
                        top: 0,
                        width: inColumn ? 30 : 56,
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
                            left: gutterLeft,
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                            zIndex: 10,
                            width: inColumn ? 30 : 56,
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
                        {/* 칸 안에서는 좁은 갓터라 + 버튼은 숨기고 드래그/메뉴 손잡이만 */}
                        {!inColumn && (
                            <tw.PlusButton onClick={() => onAddBlock(idx)}>
                                <PlusIcon color={"#91918e"} />
                            </tw.PlusButton>
                        )}
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
                    // 선택 하이라이트: 선택됐거나(드래그 중 제외) 이 블록 메뉴가 열렸을 때.
                    // 모든 타입 공통으로 InputWrap 배경을 선택색으로 → 폭이 동일. 박스형(불투명)은
                    // InputWrap의 px/여백만큼 파란 프레임이 박스를 감싼다.
                    className={`relative ${(selected && draggingIdx === null) || menuId === block.id ? "bg-(--active-bg)" : ""}`}
                    style={{ marginLeft: block.indentationLevel * 25 }}
                    // 선택된 블록은 본문을 잡아도 드래그(그룹 이동) + 누르기로 선택 해제 안 함
                    draggable={selected}
                    onDragStart={selected ? (e: React.DragEvent<HTMLDivElement>) => onDragStart(e, idx) : undefined}
                    onDragEnd={selected ? onDragEnd : undefined}
                    onMouseDown={selected ? undefined : onClearSelection}
                    // 인풋(포커스)으로 진입하면 다중 선택 해제
                    onFocus={onClearSelection}
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
