// BlocksToMdx.ts (완전 버전)
import { FormattedRange, TextFormat } from "../text-modal/TextFormat.modal";

export interface Block {
    id: string;
    type: string;
    content: string;
    indentationLevel: number;
    isChecked?: boolean;
    collapsed?: boolean;
    color?: string;
    formattedRanges?: FormattedRange[];
}

export function blocksToMDX(
    blocks: Block[],
    meta?: {
        label?: string;
        title?: string;
        subTitle?: string;
        date?: string;
        mins?: number;
        tags?: string[];
        imageUrl?: string;
    },
) {
    let frontmatter = "";

    // YAML에서 특수문자가 들어간 값은 따옴표로 감싸야 파싱이 깨지지 않는다.
    // (예: 콜론이 든 제목 "React: 입문", 콤마가 든 태그 등)
    // 평범한 값은 기존 포스트처럼 따옴표 없이 그대로 둔다.
    const yamlValue = (v: string): string => {
        const needsQuote = /[:#[\]{}",'`&*!|>%@]/.test(v) || /^\s|\s$/.test(v) || v === "";
        if (!needsQuote) return v;
        return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    };

    // 메타데이터 프론트매터 생성
    if (meta) {
        frontmatter = `---\n`;
        if (meta.label) frontmatter += `label: ${yamlValue(meta.label)}\n`;
        if (meta.title) frontmatter += `title: ${yamlValue(meta.title)}\n`;
        if (meta.subTitle) frontmatter += `subTitle: ${yamlValue(meta.subTitle)}\n`;
        if (meta.date) frontmatter += `date: ${yamlValue(meta.date)}\n`;
        if (meta.mins) frontmatter += `mins: ${meta.mins}\n`;
        if (meta.tags) frontmatter += `tags: [${meta.tags.map(yamlValue).join(", ")}]\n`;
        if (meta.imageUrl) frontmatter += `imageUrl: ${yamlValue(meta.imageUrl)}\n`;
        frontmatter += `---\n\n`;
    }

    let numberedListCounter = 1;

    // 텍스트에 포맷팅을 적용하는 함수
    const applyFormattingToText = (text: string, formattedRanges: FormattedRange[] = []): string => {
        if (!formattedRanges || formattedRanges.length === 0) {
            return text;
        }

        // 범위를 시작 위치 순으로 정렬
        const sortedRanges = [...formattedRanges].sort((a, b) => a.start - b.start);
        let result = '';
        let lastIndex = 0;

        for (const range of sortedRanges) {
            // 이전 범위와 현재 범위 사이의 텍스트
            result += text.slice(lastIndex, range.start);
            
            // 현재 범위의 텍스트
            let rangeText = text.slice(range.start, range.end);
            const format = range.format;

            // 포맷팅 적용 (중첩 적용 순서: 굵게 -> 기울임 -> 색상/밑줄/취소선)
            let formattedText = rangeText;
            
            // 1. 굵게 적용
            if (format.bold) {
                formattedText = `**${formattedText}**`;
            }
            
            // 2. 기울임 적용
            if (format.italic) {
                formattedText = `*${formattedText}*`;
            }
            
            // 3. 취소선 적용 (MDX 기본 문법 사용)
            if (format.strikethrough) {
                formattedText = `~~${formattedText}~~`;
            }
            
            // 4. 색상이나 밑줄 같은 CSS 스타일이 필요한 경우 span 태그로 감싸기
            const cssStyles: string[] = [];
            if (format.color) cssStyles.push(`color: '${format.color}'`);
            if (format.underline && format.strikethrough) {
                cssStyles.push(`textDecoration: 'underline line-through'`);
            } else if (format.underline) {
                cssStyles.push(`textDecoration: 'underline'`);
            }
            
            // CSS 스타일이 있으면 span으로 감싸기
            if (cssStyles.length > 0) {
                formattedText = `<span style={{ ${cssStyles.join(', ')} }}>${formattedText}</span>`;
            }
            
            result += formattedText;
            lastIndex = range.end;
        }
        
        // 마지막 범위 이후의 텍스트
        result += text.slice(lastIndex);
        
        return result;
    };

    // 블록을 MDX로 변환하는 메인 로직
    const body = blocks
        .filter(
            (b) =>
                b.content.trim() !== "" ||
                b.type === "divider" ||
                b.type === "image" ||
                b.type === "table" ||
                b.type.startsWith("barChart"),
        )
        .map((b, index) => {
            const indentation = "  ".repeat(b.indentationLevel);
            
            // 포맷팅이 적용된 콘텐츠 생성
            const formattedContent = applyFormattingToText(b.content, b.formattedRanges);
            
            // 블록 전체 색상이 있는 경우 추가로 적용
            const contentWithColor = b.color ? 
                `<span style={{ color: '${b.color}' }}>${formattedContent}</span>` : 
                formattedContent;

            switch (b.type) {
                case "h1":
                    numberedListCounter = 1;
                    return `# ${contentWithColor}`;
                case "h2":
                    numberedListCounter = 1;
                    return `## ${contentWithColor}`;
                case "h3":
                    numberedListCounter = 1;
                    return `### ${contentWithColor}`;
                case "p":
                    numberedListCounter = 1;
                    return contentWithColor;
                case "ul":
                    numberedListCounter = 1;
                    return `${indentation}- ${contentWithColor}`;
                case "numberedList": {
                    const prevBlock = blocks.filter((block) => block.content.trim() !== "" || block.type === "divider")[index - 1];

                    if (!prevBlock || prevBlock.type !== "numberedList" || prevBlock.indentationLevel !== b.indentationLevel) {
                        numberedListCounter = 1;
                    }

                    const currentNumber = numberedListCounter++;
                    return `${indentation}${currentNumber}. ${contentWithColor}`;
                }
                case "checkedList": {
                    numberedListCounter = 1;
                    const checkedState = b.isChecked ? "x" : " ";
                    return `${indentation}- [${checkedState}] ${contentWithColor}`;
                }
                case "divider":
                    numberedListCounter = 1;
                    return "---";
                case "toggleText":
                    return `${indentation}<ToggleText>${contentWithColor}</ToggleText>`;
                case "toggleH1":
                    numberedListCounter = 1;
                    return `${indentation}# ${contentWithColor}`;
                case "toggleH2":
                    numberedListCounter = 1;
                    return `${indentation}## ${contentWithColor}`;
                case "toggleH3":
                    numberedListCounter = 1;
                    return `${indentation}### ${contentWithColor}`;
                case "image": {
                    numberedListCounter = 1;
                    // content = {src, width} JSON (과거 raw dataURL도 호환). Img 컴포넌트로 매핑됨.
                    let src = b.content;
                    let width: number | undefined;
                    if (b.content && b.content[0] === "{") {
                        try {
                            const p = JSON.parse(b.content);
                            if (typeof p.src === "string") src = p.src;
                            if (typeof p.width === "number") width = p.width;
                        } catch {
                            /* 폴백: content 그대로 src */
                        }
                    }
                    return `<img src="${src}" alt=""${width ? ` width="${width}"` : ""} />`;
                }
                case "barChartH":
                case "barChartV":
                    numberedListCounter = 1;
                    // content = {title, rows} JSON. 속성 안전을 위해 URI 인코딩해서 전달.
                    return `<BarChart orient="${b.type === "barChartH" ? "h" : "v"}" data="${encodeURIComponent(
                        b.content || "{}",
                    )}" />`;
                case "table": {
                    numberedListCounter = 1;
                    // content = {rows: string[][]} — 첫 행이 헤더. GFM 마크다운 표로 출력.
                    let trows: string[][] = [];
                    try {
                        const p = JSON.parse(b.content || "{}");
                        if (Array.isArray(p.rows)) trows = p.rows;
                    } catch {
                        /* 무시 */
                    }
                    if (!trows.length) return "";
                    const cell = (s: unknown) =>
                        String(s ?? "")
                            .replace(/\|/g, "\\|")
                            .replace(/\n/g, " ")
                            .trim() || " ";
                    const ncols = trows[0].length;
                    const header = `| ${trows[0].map(cell).join(" | ")} |`;
                    const sep = `| ${Array(ncols).fill("---").join(" | ")} |`;
                    const body = trows.slice(1).map((r) => `| ${r.map(cell).join(" | ")} |`);
                    return [header, sep, ...body].join("\n");
                }
                default:
                    numberedListCounter = 1;
                    return contentWithColor;
            }
        })
        .join("\n\n");

    return frontmatter + body;
}