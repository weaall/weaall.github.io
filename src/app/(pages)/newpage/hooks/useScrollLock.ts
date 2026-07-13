import { useEffect } from "react";

// 모달/팝업이 열려있는 동안 "페이지" 스크롤만 막는다.
// overflow:hidden(스크롤바가 사라져 레이아웃이 튐)을 쓰지 않고, wheel/touch/키 스크롤을 preventDefault.
// 팝업 내부의 스크롤 영역([data-scroll-allow] 하위)은 그대로 스크롤되게 예외 처리.
export function useScrollLock(active: boolean) {
    useEffect(() => {
        if (!active) return;

        const insideAllowed = (t: EventTarget | null) =>
            t instanceof Element && !!t.closest("[data-scroll-allow]");

        const onWheel = (e: WheelEvent) => {
            if (!insideAllowed(e.target)) e.preventDefault();
        };
        const onTouch = (e: TouchEvent) => {
            if (!insideAllowed(e.target)) e.preventDefault();
        };
        const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"]);
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement | null;
            // 입력 중(검색창/에디터)에는 키 허용
            if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
            if (scrollKeys.has(e.key)) e.preventDefault();
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchmove", onTouch, { passive: false });
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchmove", onTouch);
            window.removeEventListener("keydown", onKey);
        };
    }, [active]);
}
