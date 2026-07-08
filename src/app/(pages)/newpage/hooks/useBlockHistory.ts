import { useCallback, useEffect, useRef, useState } from "react";
import { Block } from "../components/helper/BlocksToMdx";
import { FormattedRange } from "../components/text-modal/TextFormat.modal";

/**
 * 에디터의 되돌리기/다시실행 히스토리.
 *
 * blocks / blockColors / blockFormattedRanges 세 상태를 한 스냅샷으로 묶어 관리한다.
 * - 상태가 바뀌면 디바운스(연속 타이핑을 한 항목으로 합침) 후 스냅샷을 push.
 * - 블록 추가/삭제/이동/타입변경/색상 등 구조 변경도 blocks 스냅샷에 포함되므로 함께 롤백된다.
 * - undo/redo 는 스냅샷을 복원한다. 복원 중에는 재기록하지 않는다(isRestoring 플래그).
 *
 * 핸들러는 기존처럼 setBlocks/setBlockColors/setBlockFormattedRanges 를 그대로 쓰면 되고,
 * 히스토리 기록은 이 훅이 내부에서 관찰(useEffect)로 처리한다.
 */

export type ColorMap = { [id: string]: string };
export type RangeMap = { [id: string]: FormattedRange[] };

interface Snapshot {
    blocks: Block[];
    blockColors: ColorMap;
    blockFormattedRanges: RangeMap;
}

const DEBOUNCE_MS = 350;
const MAX_HISTORY = 200;

const clone = (s: Snapshot): Snapshot => JSON.parse(JSON.stringify(s));
const isSame = (a: Snapshot, b: Snapshot) => JSON.stringify(a) === JSON.stringify(b);

export function useBlockHistory(initialBlocks: Block[]) {
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
    const [blockColors, setBlockColors] = useState<ColorMap>({});
    const [blockFormattedRanges, setBlockFormattedRanges] = useState<RangeMap>({});

    // 매 렌더의 최신 상태 스냅샷(읽기 전용 참조)
    const liveRef = useRef<Snapshot>({ blocks: initialBlocks, blockColors: {}, blockFormattedRanges: {} });
    liveRef.current = { blocks, blockColors, blockFormattedRanges };

    const historyRef = useRef<Snapshot[]>([clone({ blocks: initialBlocks, blockColors: {}, blockFormattedRanges: {} })]);
    const pointerRef = useRef(0);
    const isRestoringRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const commit = useCallback(() => {
        const live = liveRef.current;
        const top = historyRef.current[pointerRef.current];
        if (top && isSame(top, live)) return;
        // 현재 지점 이후(redo 분기)는 버린다
        const next = historyRef.current.slice(0, pointerRef.current + 1);
        next.push(clone(live));
        // 상한 초과 시 오래된 항목 제거
        while (next.length > MAX_HISTORY) next.shift();
        historyRef.current = next;
        pointerRef.current = next.length - 1;
    }, []);

    // 상태 변경 → 디바운스 후 스냅샷 기록
    useEffect(() => {
        if (isRestoringRef.current) {
            isRestoringRef.current = false;
            return;
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(commit, DEBOUNCE_MS);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [blocks, blockColors, blockFormattedRanges, commit]);

    const restore = useCallback((snap: Snapshot) => {
        isRestoringRef.current = true;
        // 포커스된 블록은 "타이핑 중 DOM 재작성 스킵" 로직 때문에 복원이 화면에 반영되지 않는다.
        // 포커스를 해제해 비포커스 경로로 DOM이 다시 그려지도록 한다.
        (document.activeElement as HTMLElement | null)?.blur?.();
        setBlocks(snap.blocks);
        setBlockColors(snap.blockColors);
        setBlockFormattedRanges(snap.blockFormattedRanges);
    }, []);

    const undo = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        commit(); // 아직 기록 안 된 최신 변경을 먼저 확정
        if (pointerRef.current > 0) {
            pointerRef.current -= 1;
            restore(clone(historyRef.current[pointerRef.current]));
        }
    }, [commit, restore]);

    const redo = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (pointerRef.current < historyRef.current.length - 1) {
            pointerRef.current += 1;
            restore(clone(historyRef.current[pointerRef.current]));
        }
    }, [restore]);

    return {
        blocks,
        setBlocks,
        blockColors,
        setBlockColors,
        blockFormattedRanges,
        setBlockFormattedRanges,
        undo,
        redo,
    };
}
