import React, { useState } from "react";
import { Block } from "../components/helper/BlocksToMdx";

/**
 * 블록 드래그 앤 드롭. 드래그 중 인덱스와 삽입선 위치를 관리하고,
 * 드롭 시 blocks 순서를 바꾼다. 드롭 위치 앞 블록의 들여쓰기를 물려받되
 * 앞 블록이 토글이면 그 자식(indent + 1)으로 들어간다.
 *
 * getSelection: 갓터 드래그로 선택한 블록 범위(min~max). 드래그하는 블록이 이 범위 안이면
 * 선택된 블록들을 통째로 이동한다. clearSelection: 이동 후 선택 해제.
 */
export function useBlockDnD(
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
    getSelection?: () => { min: number; max: number } | null,
    clearSelection?: () => void,
) {
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
    const [insertLineIdx, setInsertLineIdx] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.stopPropagation();
        setDraggingIdx(idx);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${idx}`);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, idx: number, isIndicator: boolean) => {
        e.preventDefault();
        setInsertLineIdx(isIndicator ? idx : null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragEnd = () => {
        if (draggingIdx !== null && insertLineIdx !== null) {
            const fromIdx = draggingIdx;
            const dropIdx = insertLineIdx;

            // 드래그하는 블록이 선택 범위 안이면 범위 전체를 이동, 아니면 단일 블록
            const sel = getSelection?.();
            const inSel = sel && sel.max > sel.min && fromIdx >= sel.min && fromIdx <= sel.max;
            const rangeStart = inSel ? sel!.min : fromIdx;
            const rangeEnd = inSel ? sel!.max : fromIdx;
            const count = rangeEnd - rangeStart + 1;

            setBlocks((prev) => {
                const newBlocks = [...prev];
                const moving = newBlocks.splice(rangeStart, count);

                // 삽입 위치 보정: 제거된 블록이 드롭지점 앞에 있었으면 그만큼 당김
                let targetIdx: number;
                if (dropIdx <= rangeStart) targetIdx = dropIdx;
                else if (dropIdx > rangeEnd) targetIdx = dropIdx - count;
                else targetIdx = rangeStart; // 범위 내부로 드롭 → 제자리

                // 앞 블록 들여쓰기를 base로, 선택 블록들의 상대 들여쓰기는 유지
                const prevBlock = newBlocks[targetIdx - 1];
                const prevIsToggle =
                    !!prevBlock && (prevBlock.type === "toggleText" || prevBlock.type.startsWith("toggleH"));
                const baseIndent = prevBlock ? prevBlock.indentationLevel + (prevIsToggle ? 1 : 0) : 0;
                const minIndent = Math.min(...moving.map((b) => b.indentationLevel));
                const adjusted = moving.map((b) => ({
                    ...b,
                    indentationLevel: Math.max(0, baseIndent + (b.indentationLevel - minIndent)),
                }));

                newBlocks.splice(targetIdx, 0, ...adjusted);
                return newBlocks;
            });
            clearSelection?.();
        }
        setDraggingIdx(null);
        setInsertLineIdx(null);
    };

    return { draggingIdx, insertLineIdx, handleDragStart, handleDragEnter, handleDragOver, handleDragEnd };
}
