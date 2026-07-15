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
    // Alt/Ctrl 누르고 드래그하면 이동 대신 복제(복사). 색/서식까지 복제하려고 상위에 위임.
    onCopy?: (rangeStart: number, count: number, dropIdx: number) => void,
    // 블록을 다른 블록의 좌/우 가장자리에 드롭 → 2칸(컬럼) 구성. 상위에 위임.
    onSideDrop?: (targetIdx: number, side: "left" | "right", fromIdx: number) => void,
    // 대상 블록의 컬럼 정보(gid/col). 이미 2칸 안이면 사이드 드롭 금지 + 상/하 드롭 시 그 칸에 합류.
    colInfo?: (idx: number) => { gid?: string; col?: number },
) {
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
    const [insertLineIdx, setInsertLineIdx] = useState<number | null>(null);
    // 좌/우 가장자리에 드롭할 때 표시할 세로 인디케이터 대상
    const [sideDrop, setSideDrop] = useState<{ idx: number; side: "left" | "right" } | null>(null);
    // 상/하 삽입 지점이 2칸 안이면 그 칸(gid/col)에 합류시킬 대상
    const colDropRef = useRef<{ gid: string; col: number } | null>(null);
    const copyModeRef = useRef(false);
    // 2칸 컬럼 드롭 등 외부에서 이동을 처리했으면, 이어지는 handleDragEnd의 평면 이동을 건너뛴다.
    const externalDropRef = useRef(false);

    // 커서를 따라다니는 커스텀 미리보기 요소 + 이동 핸들러(정리를 위해 ref 보관)
    const previewRef = useRef<HTMLElement | null>(null);
    const moveHandlerRef = useRef<((e: DragEvent) => void) | null>(null);
    // 엣지 오토스크롤: 커서 Y 추적 + rAF 루프 (네이티브 DnD의 뚝뚝 끊기는 스크롤 대체)
    const pointerYRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    const autoScrollTick = () => {
        const y = pointerYRef.current;
        const h = window.innerHeight;
        const EDGE = 110; // 가장자리 감지 영역(px)
        const MAX = 24; // 프레임당 최대 스크롤(px)
        let dy = 0;
        if (y > 0 && y < EDGE) dy = -Math.ceil(((EDGE - y) / EDGE) * MAX);
        else if (y > h - EDGE) dy = Math.ceil(((y - (h - EDGE)) / EDGE) * MAX);
        if (dy !== 0) window.scrollBy(0, dy);
        rafRef.current = requestAnimationFrame(autoScrollTick);
    };

    const teardownPreview = () => {
        if (moveHandlerRef.current) {
            document.removeEventListener("dragover", moveHandlerRef.current);
            moveHandlerRef.current = null;
        }
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        pointerYRef.current = 0;
        previewRef.current?.remove();
        previewRef.current = null;
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.stopPropagation();
        setDraggingIdx(idx);
        copyModeRef.current = e.altKey || e.ctrlKey || e.metaKey; // 복사 모드
        e.dataTransfer.effectAllowed = "copyMove";
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
            img.style.opacity = "0.1";
            img.style.left = "0px";
            img.style.top = "-9999px"; // 첫 이동 전까지 화면 밖
            document.body.appendChild(img);
            previewRef.current = img;
        }

        // dragover마다 커서 위치 추적(+미리보기 이동). 오토스크롤 루프도 시작.
        const move = (ev: DragEvent) => {
            if (ev.clientX === 0 && ev.clientY === 0) return; // 유효하지 않은 좌표 무시
            pointerYRef.current = ev.clientY;
            if (previewRef.current) {
                // 커서보다 아래-오른쪽에 배치 → 커서 위 삽입선/블록을 가리지 않음
                previewRef.current.style.left = `${ev.clientX + 12}px`;
                previewRef.current.style.top = `${ev.clientY + 18}px`;
            }
        };
        moveHandlerRef.current = move;
        document.addEventListener("dragover", move);
        rafRef.current = requestAnimationFrame(autoScrollTick);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, idx: number, isIndicator: boolean) => {
        e.preventDefault();
        setInsertLineIdx(isIndicator ? idx : null);
        colDropRef.current = null;
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // 블록 위 드롭 히트: 상/하 절반으로 위/아래 삽입. 대상이 2칸 안이면 그 칸에 합류(세로 스택).
    // (열 생성은 "2열" 메뉴로만 → 드래그-투-사이드 세로바는 제거)
    const handleBlockDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const ci = colInfo?.(idx);
        const isBottom = e.clientY > rect.top + rect.height / 2;
        setInsertLineIdx(isBottom ? idx + 1 : idx);
        // 삽입 지점이 2칸 안이면 그 칸에 합류(일반 1열 블록을 열 안으로 드롭)
        colDropRef.current = ci?.gid ? { gid: ci.gid, col: ci.col ?? 0 } : null;
    };

    // 컬럼 드롭 등 외부에서 이동 처리 시 호출 → 다음 handleDragEnd의 평면 이동 스킵
    const notifyExternalDrop = () => {
        externalDropRef.current = true;
    };

    const handleDragEnd = () => {
        // 좌/우 가장자리 드롭 → 2칸 구성 (평면 이동 대신)
        if (draggingIdx !== null && sideDrop && onSideDrop && draggingIdx !== sideDrop.idx) {
            onSideDrop(sideDrop.idx, sideDrop.side, draggingIdx);
            copyModeRef.current = false;
            teardownPreview();
            setDraggingIdx(null);
            setInsertLineIdx(null);
            setSideDrop(null);
            return;
        }
        if (externalDropRef.current) {
            externalDropRef.current = false;
            copyModeRef.current = false;
            teardownPreview();
            setDraggingIdx(null);
            setInsertLineIdx(null);
            setSideDrop(null);
            return;
        }
        if (draggingIdx !== null && insertLineIdx !== null) {
            const fromIdx = draggingIdx;
            const dropIdx = insertLineIdx;

            // 드래그하는 블록이 선택 범위 안이면 범위 전체를 이동, 아니면 단일 블록
            const sel = getSelection?.();
            const inSel = sel && sel.max > sel.min && fromIdx >= sel.min && fromIdx <= sel.max;
            const rangeStart = inSel ? sel!.min : fromIdx;
            const rangeEnd = inSel ? sel!.max : fromIdx;
            const count = rangeEnd - rangeStart + 1;

            // 복사 모드(Alt/Ctrl+드래그): 원본은 두고 복제본을 드롭 위치에 삽입(상위가 색/서식까지 복제)
            if (copyModeRef.current && onCopy) {
                onCopy(rangeStart, count, dropIdx);
                copyModeRef.current = false;
                teardownPreview();
                setDraggingIdx(null);
                setInsertLineIdx(null);
                return;
            }

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
                const prevIsToggle = !!prevBlock && (prevBlock.type === "toggleText" || prevBlock.type.startsWith("toggleH"));
                const baseIndent = prevBlock ? prevBlock.indentationLevel + (prevIsToggle ? 1 : 0) : 0;
                const minIndent = Math.min(...moving.map((b) => b.indentationLevel));
                const cd = colDropRef.current;
                const adjusted = moving.map((b) => ({
                    ...b,
                    // 2칸 안으로 드롭이면 그 칸에 합류, 아니면 한 줄로 복귀
                    indentationLevel: cd ? 0 : Math.max(0, baseIndent + (b.indentationLevel - minIndent)),
                    colGroup: cd ? cd.gid : undefined,
                    col: cd ? cd.col : undefined,
                }));

                newBlocks.splice(targetIdx, 0, ...adjusted);
                return newBlocks;
            });
            onDropped?.(targetIdx, count);
        }
        teardownPreview();
        setDraggingIdx(null);
        setInsertLineIdx(null);
        setSideDrop(null);
        colDropRef.current = null;
    };

    return { draggingIdx, insertLineIdx, sideDrop, handleDragStart, handleDragEnter, handleDragOver, handleBlockDragOver, handleDragEnd, notifyExternalDrop };
}
