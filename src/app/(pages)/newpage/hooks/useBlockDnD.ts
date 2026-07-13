import React, { useRef, useState } from "react";
import { Block } from "../components/helper/BlocksToMdx";

/**
 * 블록 드래그 앤 드롭. 드래그 중 인덱스/삽입선 위치를 관리하고, 드롭 시 순서를 바꾼다.
 * getSelection: 마퀴로 선택한 범위(min~max) — 드래그 블록이 범위 안이면 통째로 이동.
 * onDropped: 이동 후 새 위치를 알려 선택 유지.
 * buildDragImage: 드래그 시작 시 실제 블록을 복제한 DOM을 만들어 커서를 따라오는 미리보기로 쓴다.
 *
 * 미리보기는 네이티브 setDragImage(항상 최상단에 그려짐) 대신, 투명 고스트로 네이티브 상자를
 * 숨기고 직접 만든 클론을 "커서 아래쪽"에 따라오게 한다 → 커서 위의 삽입선/블록을 가리지 않음.
 */
export function useBlockDnD(
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
    getSelection?: () => { min: number; max: number } | null,
    onDropped?: (targetIdx: number, count: number) => void,
    buildDragImage?: (fromIdx: number) => HTMLElement | null,
) {
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
    const [insertLineIdx, setInsertLineIdx] = useState<number | null>(null);

    // 커서를 따라다니는 커스텀 미리보기 요소 + 이동 핸들러(정리를 위해 ref 보관)
    const previewRef = useRef<HTMLElement | null>(null);
    const moveHandlerRef = useRef<((e: DragEvent) => void) | null>(null);

    const teardownPreview = () => {
        if (moveHandlerRef.current) {
            document.removeEventListener("dragover", moveHandlerRef.current);
            moveHandlerRef.current = null;
        }
        previewRef.current?.remove();
        previewRef.current = null;
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.stopPropagation();
        setDraggingIdx(idx);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${idx}`);

        // 네이티브 드래그 이미지를 투명 1px로 숨긴다(브라우저가 항상 최상단에 그려 z-order 제어 불가).
        const ghost = document.createElement("canvas");
        ghost.width = ghost.height = 1;
        e.dataTransfer.setDragImage(ghost, 0, 0);

        // 실제 블록 모양 클론을 커서 "아래쪽"에 따라오는 커스텀 미리보기로 사용.
        const img = buildDragImage?.(idx);
        if (img) {
            img.style.position = "fixed";
            img.style.pointerEvents = "none";
            img.style.zIndex = "1400"; // 삽입선(z-1500)보다 아래 → 드롭 위치선이 위에 보인다
            img.style.opacity = "0.3";
            img.style.left = "0px";
            img.style.top = "-9999px"; // 첫 이동 전까지 화면 밖
            document.body.appendChild(img);
            previewRef.current = img;

            const move = (ev: DragEvent) => {
                if (!previewRef.current) return;
                if (ev.clientX === 0 && ev.clientY === 0) return; // 유효하지 않은 좌표 무시
                // 커서보다 아래-오른쪽에 배치 → 커서 위 삽입선/블록을 가리지 않음
                previewRef.current.style.left = `${ev.clientX + 12}px`;
                previewRef.current.style.top = `${ev.clientY + 18}px`;
            };
            moveHandlerRef.current = move;
            document.addEventListener("dragover", move);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, idx: number, isIndicator: boolean) => {
        e.preventDefault();
        setInsertLineIdx(isIndicator ? idx : null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // 블록 전체를 드롭 히트 영역으로: 커서가 블록 상/하 절반 중 어디냐로 위/아래 삽입 판정.
    const handleBlockDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const isBottom = e.clientY > rect.top + rect.height / 2;
        setInsertLineIdx(isBottom ? idx + 1 : idx);
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
        teardownPreview();
        setDraggingIdx(null);
        setInsertLineIdx(null);
    };

    return { draggingIdx, insertLineIdx, handleDragStart, handleDragEnter, handleDragOver, handleBlockDragOver, handleDragEnd };
}
