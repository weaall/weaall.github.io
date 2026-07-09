// 이미지 블록 content 직렬화 헬퍼.
// content는 {"src": dataURL, "width": px} JSON. (과거 형식인 raw dataURL도 호환)
export interface ImageData {
    src: string;
    width?: number;
}

export function parseImageContent(content: string): ImageData {
    if (content && content[0] === "{") {
        try {
            const p = JSON.parse(content);
            if (p && typeof p.src === "string") return { src: p.src, width: typeof p.width === "number" ? p.width : undefined };
        } catch {
            /* 손상 → 아래 폴백 */
        }
    }
    return { src: content, width: undefined };
}

export function serializeImageContent(src: string, width?: number): string {
    return JSON.stringify(width ? { src, width } : { src });
}
