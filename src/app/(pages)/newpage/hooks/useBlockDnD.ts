import React, { useState } from "react";
import { Block } from "../components/helper/BlocksToMdx";

/**
 * 블록 드래그 앤 드롭. 드래그 중 인덱스와 삽입선 위치를 관리하고,
 * 드롭 시 blocks 순서를 바꾼다. 드롭 위치 앞 블록의 들여쓰기를 물려받되
 * 앞 블록이 토글이면 그 자식(indent + 1)으로 들어간다.
 */
export function useBlockDnD(setBlocks: React.Dispatch<React.SetStateAction<Block[]>>) {
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
            setBlocks((prev) => {
                const newBlocks = [...prev];
                const [draggedItem] = newBlocks.splice(fromIdx, 1);
                let targetIdx = dropIdx;
                if (fromIdx < dropIdx) {
                    targetIdx = dropIdx - 1;
                }
                const prevBlock = newBlocks[targetIdx - 1];
                const prevIsToggle =
                    !!prevBlock && (prevBlock.type === "toggleText" || prevBlock.type.startsWith("toggleH"));
                const targetIndent = prevBlock ? prevBlock.indentationLevel + (prevIsToggle ? 1 : 0) : 0;
                newBlocks.splice(targetIdx, 0, { ...draggedItem, indentationLevel: targetIndent });
                return newBlocks;
            });
        }
        setDraggingIdx(null);
        setInsertLineIdx(null);
    };

    return { draggingIdx, insertLineIdx, handleDragStart, handleDragEnter, handleDragOver, handleDragEnd };
}
