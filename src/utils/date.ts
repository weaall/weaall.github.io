/**
 * 프론트매터의 date 값을 항상 "YYYY.MM.DD" 문자열로 정규화한다.
 *
 * YAML은 따옴표 없는 `2026-01-07` 같은 값을 Date 객체로 파싱하기 때문에,
 * 그대로 렌더링하면 "Objects are not valid as a React child" 에러가 난다.
 * 문자열("2024.10.01")과 Date 객체를 모두 안전하게 처리한다.
 */
export function formatPostDate(value: unknown): string {
    if (value instanceof Date && !isNaN(value.getTime())) {
        const y = value.getUTCFullYear();
        const m = String(value.getUTCMonth() + 1).padStart(2, "0");
        const d = String(value.getUTCDate()).padStart(2, "0");
        return `${y}.${m}.${d}`;
    }

    if (typeof value === "string") {
        return value.replace(/-/g, ".");
    }

    return "";
}
