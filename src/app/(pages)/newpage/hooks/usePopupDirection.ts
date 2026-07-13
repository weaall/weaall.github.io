import { RefObject, useLayoutEffect, useState } from "react";

// 팝업(드롭다운/드로워) 방향 결정: 기본은 아래(down), 트리거 아래 공간이 부족하고
// 위 공간이 더 넉넉하면 위(up)로 뒤집는다. 화면 밖으로 잘리지 않게.
export function usePopupDirection(
    open: boolean,
    triggerRef: RefObject<HTMLElement | null>,
    estimatedHeight = 300,
): "down" | "up" {
    const [dir, setDir] = useState<"down" | "up">("down");
    useLayoutEffect(() => {
        if (!open || !triggerRef.current) return;
        const r = triggerRef.current.getBoundingClientRect();
        const below = window.innerHeight - r.bottom;
        const above = r.top;
        setDir(below < estimatedHeight && above > below ? "up" : "down");
    }, [open, triggerRef, estimatedHeight]);
    return dir;
}
