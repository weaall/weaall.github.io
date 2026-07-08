import { useEffect, useRef, useState } from "react";

/**
 * #main-bg-container 위에서 마우스가 움직이면 헤더를 잠깐(기본 1초) 보여준다.
 * post 목록/상세, newpage 레이아웃이 동일하게 쓰던 로직을 한곳으로 모은 훅.
 */
export function useHoverHeader(hideDelayMs = 1000): boolean {
    const [showHeader, setShowHeader] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const container = document.getElementById("main-bg-container");
        if (!container) return;

        const handleMouseMove = () => {
            setShowHeader(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setShowHeader(false), hideDelayMs);
        };

        container.addEventListener("mousemove", handleMouseMove);
        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [hideDelayMs]);

    return showHeader;
}
