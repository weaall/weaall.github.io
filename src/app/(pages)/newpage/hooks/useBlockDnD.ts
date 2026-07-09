import React, { useState, useEffect } from "react";
import { Block } from "../components/helper/BlocksToMdx";

/**
 * 블록 드래그 앤 드롭. 드래그 중 인덱스/삽입선 위치를 관리하고, 드롭 시 순서를 바꾼다.
 * getSelection: 갓터 드래그로 선택한 범위(min~max) — 드래그 블록이 범위 안이면 통째로 이동.
 * onDropped: 이동 후 새 위치를 알려 선택 유지.
 * describeDrag: 드래그 시작 시 미리보기(개수/라벨) 정보를 만든다 (노션식 커서 프리뷰).
 */
export function useBlockDnD(
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
    getSelection?: () => { min: number; max: number } | null,
    onDropped?: (targetIdx: number, count: number) => void,
    describeDrag?: (fromIdx: number) => { count: number; label: string },
) {
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
    const [insertLineIdx, setInsertLineIdx] = useState<number | null>(null);
    const [dragPreview, setDragPreview] = useState<{ count: number; label: string } | null>(null);
    const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

    // 드래그 중 커서 위치 추적 (커스텀 미리보기용)
    useEffect(() => {
        if (draggingIdx === null) return;
        const onOver = (e: DragEvent) => setDragPos({ x: e.clientX, y: e.clientY });
        window.addEventListener("dragover", onOver);
        return () => window.removeEventListener("dragover", onOver);
    }, [draggingIdx]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.stopPropagation();
        setDraggingIdx(idx);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${idx}`);

        // 기본 드래그 고스트(핸들 이미지) 숨기고 커스텀 미리보기를 쓴다
        const ghost = document.createElement("div");
        ghost.style.cssText = "width:1px;height:1px;opacity:0;position:fixed;top:-10px;left:-10px";
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);

        if (describeDrag) setDragPreview(describeDrag(idx));
        setDragPos({ x: e.clientX, y: e.clientY });
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

            // 삽입 위치 보정(순수 계산): 제거된 블록이 드롭지점 앞에 있었으면 그만큼 당김
            let targetIdx: number;
            if (dropIdx <= rangeStart) targetIdx = dropIdx;
            else if (dropIdx > rangeEnd) targetIdx = dropIdx - count;
            else targetIdx = rangeStart; // 범위 내부로 드롭 → 제자리

            setBlocks((prev) => {
                const newBlocks = [...prev];
                const moving = newBlocks.splice(rangeStart, count);

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
            onDropped?.(targetIdx, count);
        }
        setDraggingIdx(null);
        setInsertLineIdx(null);
        setDragPreview(null);
        setDragPos(null);
    };

    return { draggingIdx, insertLineIdx, dragPreview, dragPos, handleDragStart, handleDragEnter, handleDragOver, handleDragEnd };
}
