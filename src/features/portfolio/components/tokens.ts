/**
 * 포트폴리오 화면에서 반복되는 색.
 * 하드코딩된 hex 를 여기 한 곳에서만 정의해, 카드·패널 톤을 바꿀 때 한 파일만 고치면 되게 한다.
 */
export const tone = {
    /** 회색 카드 배경 (PROVE Lite 카드와 동일) */
    card: "#f6f5f4",
    /** 패널 안쪽 흰 배경 */
    panel: "#ffffff",
    /** 패널 테두리 */
    panelBorder: "#ededeb",
    /** 옅은 구분선 */
    line: "#e5e3e0",
    /** 점선 그룹 테두리 */
    dashed: "#d6d3ce",
    /** 본문 글자 */
    ink: "#191918",
    /** 흐린 글자 */
    inkMuted: "#6b6a67",
    /** 화살표 */
    arrow: "#9c9994",
    /** Task 라벨 기본색 (PROVE Lite) */
    task: "#0075de",
} as const;
