import { FormattedRange, TextFormat } from "../text-modal/TextFormat.modal";

// ContentEditableBlock의 서식 범위(FormattedRange) 계산 로직 — 순수 함수 모음.
// DOM/상태와 무관하게 (텍스트, 범위, 포맷) 입력 → 결과를 반환한다.

// 텍스트 + 서식 범위 → 인라인 스타일이 적용된 HTML 문자열
export function generateFormattedHTML(text: string, ranges: FormattedRange[]): string {
    text = text.replace(/\n/g, "<br>");
    if (!ranges || ranges.length === 0) return text;

    const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);
    let html = "";
    let lastIndex = 0;

    for (const range of sortedRanges) {
        html += text.slice(lastIndex, range.start);
        const rangeText = text.slice(range.start, range.end);
        const styles: string[] = [];

        if (range.format.color) styles.push(`color: ${range.format.color}`);
        if (range.format.bold) styles.push("font-weight: bold");
        if (range.format.italic) styles.push("font-style: italic");
        if (range.format.underline && range.format.strikethrough) {
            styles.push("text-decoration: underline line-through");
        } else if (range.format.underline) {
            styles.push("text-decoration: underline");
        } else if (range.format.strikethrough) {
            styles.push("text-decoration: line-through");
        }

        if (styles.length > 0) {
            html += `<span style="${styles.join("; ")}">${rangeText}</span>`;
        } else {
            html += rangeText;
        }
        lastIndex = range.end;
    }
    html += text.slice(lastIndex);
    return html;
}

// 선택 구간과 겹치는 범위들의 포맷을 합쳐 현재 활성 포맷을 구한다
export function getFormatForRange(ranges: FormattedRange[], range: { start: number; end: number }): TextFormat {
    const activeFormat: TextFormat = {};
    if (!ranges) return activeFormat;

    const overlappingRanges = ranges.filter((r) => Math.max(r.start, range.start) < Math.min(r.end, range.end));
    overlappingRanges.forEach((r) => {
        Object.assign(activeFormat, r.format);
    });
    return activeFormat;
}

// 선택 구간에서 서식을 제거한 새 범위 배열
export function removeFormatFromRanges(
    ranges: FormattedRange[],
    selectionStart: number,
    selectionEnd: number,
): FormattedRange[] {
    const finalRanges: FormattedRange[] = [];
    ranges.forEach((range) => {
        if (range.end <= selectionStart || range.start >= selectionEnd) {
            finalRanges.push(range);
        } else {
            if (range.start < selectionStart) {
                finalRanges.push({ ...range, end: selectionStart });
            }
            if (range.end > selectionEnd) {
                finalRanges.push({ ...range, start: selectionEnd });
            }
        }
    });
    return finalRanges;
}

// 선택 구간에 포맷을 적용/토글한 새 범위 배열 (경계점 분할 후 인접 동일포맷 병합)
export function applyFormatToRanges(
    ranges: FormattedRange[],
    selectionStart: number,
    selectionEnd: number,
    format: TextFormat,
): FormattedRange[] {
    const finalRanges: FormattedRange[] = [];
    const oldRanges = [...ranges];

    const points = new Set<number>([selectionStart, selectionEnd]);
    oldRanges.forEach((range) => {
        points.add(range.start);
        points.add(range.end);
    });

    const sortedPoints = Array.from(points).sort((a, b) => a - b);

    for (let i = 0; i < sortedPoints.length - 1; i++) {
        const start = sortedPoints[i];
        const end = sortedPoints[i + 1];
        if (start >= end) continue;

        const midPoint = (start + end) / 2;
        let segmentFormat: TextFormat = {};

        oldRanges.forEach((range) => {
            if (midPoint >= range.start && midPoint < range.end) {
                segmentFormat = { ...segmentFormat, ...range.format };
            }
        });

        if (midPoint >= selectionStart && midPoint < selectionEnd) {
            segmentFormat = { ...segmentFormat, ...format };
        }

        const cleanedFormat: TextFormat = {};
        if (segmentFormat.color) cleanedFormat.color = segmentFormat.color;
        if (segmentFormat.bold) cleanedFormat.bold = segmentFormat.bold;
        if (segmentFormat.italic) cleanedFormat.italic = segmentFormat.italic;
        if (segmentFormat.underline) cleanedFormat.underline = segmentFormat.underline;
        if (segmentFormat.strikethrough) cleanedFormat.strikethrough = segmentFormat.strikethrough;

        if (Object.keys(cleanedFormat).length > 0) {
            finalRanges.push({ start, end, format: cleanedFormat });
        }
    }

    const mergedRanges: FormattedRange[] = [];
    if (finalRanges.length > 0) {
        let currentMerge = { ...finalRanges[0] };
        for (let i = 1; i < finalRanges.length; i++) {
            const nextRange = finalRanges[i];
            if (currentMerge.end === nextRange.start && JSON.stringify(currentMerge.format) === JSON.stringify(nextRange.format)) {
                currentMerge.end = nextRange.end;
            } else {
                mergedRanges.push(currentMerge);
                currentMerge = { ...nextRange };
            }
        }
        mergedRanges.push(currentMerge);
    }
    return mergedRanges;
}
