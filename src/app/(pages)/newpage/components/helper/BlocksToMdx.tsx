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
    // 2칸(컬럼) 레이아웃: 같은 colGroup을 가진 연속 블록들이 좌(col=0)/우(col=1) 두 칸으로 렌더된다.
    colGroup?: string;
    col?: number;
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
        icon?: string;
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
        if (meta.icon) frontmatter += `icon: ${yamlValue(meta.icon)}\n`;
        frontmatter += `---\n\n`;
    }

    // MDX 이스케이프: 사용자 텍스트의 '<'(태그 시작)와 '{'(표현식 시작)를 리터럴로.
    // 이걸 안 하면 본문에 <ToggleText> 같은 글자나 코드가 있을 때 MDX 컴파일이 깨진다.
    const escMdx = (s: string) => s.replace(/([<{])/g, "\\$1");

    // 텍스트에 포맷팅을 적용하는 함수
    const applyFormattingToText = (text: string, formattedRanges: FormattedRange[] = []): string => {
        if (!formattedRanges || formattedRanges.length === 0) {
            return escMdx(text);
        }

        // 범위를 시작 위치 순으로 정렬
        const sortedRanges = [...formattedRanges].sort((a, b) => a.start - b.start);
        let result = '';
        let lastIndex = 0;

        for (const range of sortedRanges) {
            // 이전 범위와 현재 범위 사이의 텍스트
            result += escMdx(text.slice(lastIndex, range.start));

            // 현재 범위의 텍스트
            let rangeText = escMdx(text.slice(range.start, range.end));
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
        result += escMdx(text.slice(lastIndex));

        return result;
    };

    // 내보내기 대상 블록만
    const keep = (b: Block) =>
        b.content.trim() !== "" ||
        b.type === "divider" ||
        b.type === "image" ||
        b.type === "table" ||
        b.type === "code" ||
        b.type === "chart" ||
        b.type.startsWith("barChart") ||
        b.type.startsWith("toggle");
    const isToggle = (t: string) => t === "toggleText" || t === "toggleH1" || t === "toggleH2" || t === "toggleH3";

    // 토글이 아닌 한 블록의 MDX 라인 (num: 번호목록 번호)
    const lineFor = (b: Block, num: number): string => {
        const indentation = "  ".repeat(b.indentationLevel);
        const formattedContent = applyFormattingToText(b.content, b.formattedRanges);
        const contentWithColor = b.color ? `<span style={{ color: '${b.color}' }}>${formattedContent}</span>` : formattedContent;
        switch (b.type) {
            case "h1":
                return `# ${contentWithColor}`;
            case "h2":
                return `## ${contentWithColor}`;
            case "h3":
                return `### ${contentWithColor}`;
            case "ul":
                return `${indentation}- ${contentWithColor}`;
            case "numberedList":
                return `${indentation}${num}. ${contentWithColor}`;
            case "checkedList":
                return `${indentation}- [${b.isChecked ? "x" : " "}] ${contentWithColor}`;
            case "divider":
                return "---";
            case "image": {
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
                return `<BarChart orient="${b.type === "barChartH" ? "h" : "v"}" data="${encodeURIComponent(b.content || "{}")}" />`;
            case "chart":
                // 타입(barV/barH/line/area/donut)은 data JSON 안에 포함
                return `<BarChart data="${encodeURIComponent(b.content || "{}")}" />`;
            case "table": {
                let ok = false;
                try {
                    const p = JSON.parse(b.content || "{}");
                    ok = Array.isArray(p.rows) && p.rows.length > 0;
                } catch {
                    ok = false;
                }
                if (!ok) return "";
                return `<DataTable data="${encodeURIComponent(b.content)}" />`;
            }
            case "code": {
                // content = { code, lang } JSON. ```lang 펜스로 내보냄(내부는 리터럴이라 이스케이프 불필요)
                let code = b.content;
                let lang = "";
                if (b.content && b.content[0] === "{") {
                    try {
                        const p = JSON.parse(b.content);
                        if (typeof p.code === "string") code = p.code;
                        if (typeof p.lang === "string") lang = p.lang;
                    } catch {
                        /* 폴백: content 그대로 코드 */
                    }
                }
                // 코드 안에 ``` 가 있으면 더 긴 펜스 사용
                let fence = "```";
                while (code.includes(fence)) fence += "`";
                // auto/plaintext는 언어 태그 없이 → 포스트에서 자동감지
                const langTag = lang && lang !== "plaintext" && lang !== "auto" ? lang : "";
                return `${fence}${langTag}\n${code}\n${fence}`;
            }
            case "p":
            default:
                return contentWithColor;
        }
    };

    // 토글은 자식(더 깊은 들여쓰기)을 <ToggleText> 안에 중첩 → 포스트에서 접기/펼치기.
    const renderRange = (list: Block[]): string => {
        const parts: string[] = [];
        let counter = 1;
        let prevNumIndent = -1;
        for (let i = 0; i < list.length; i++) {
            const b = list[i];
            // 2칸(컬럼) 그룹: 연속된 같은 colGroup을 <Columns><Column>좌</Column><Column>우</Column></Columns> 로 내보냄
            if (b.colGroup) {
                const g = b.colGroup;
                let j = i;
                const run: Block[] = [];
                while (j < list.length && list[j].colGroup === g) {
                    run.push(list[j]);
                    j++;
                }
                const strip = (x: Block) => ({ ...x, colGroup: undefined, col: undefined });
                const left = renderRange(run.filter((x) => (x.col ?? 0) === 0).map(strip));
                const right = renderRange(run.filter((x) => (x.col ?? 0) === 1).map(strip));
                parts.push(`<Columns>\n<Column>\n\n${left}\n\n</Column>\n<Column>\n\n${right}\n\n</Column>\n</Columns>`);
                prevNumIndent = -1;
                i = j - 1;
                continue;
            }
            if (isToggle(b.type)) {
                let j = i + 1;
                while (j < list.length && list[j].indentationLevel > b.indentationLevel) j++;
                const kids = list
                    .slice(i + 1, j)
                    .map((c) => ({ ...c, indentationLevel: Math.max(0, c.indentationLevel - (b.indentationLevel + 1)) }));
                const heading = b.type === "toggleH1" ? "h1" : b.type === "toggleH2" ? "h2" : b.type === "toggleH3" ? "h3" : "";
                const colorAttr = b.color ? ` color="${b.color}"` : "";
                const inner = renderRange(kids);
                const open = `<ToggleText heading="${heading}" text="${encodeURIComponent(b.content)}"${colorAttr}>`;
                parts.push(inner ? `${open}\n\n${inner}\n\n</ToggleText>` : `${open}</ToggleText>`);
                prevNumIndent = -1;
                i = j - 1;
                continue;
            }
            let num = 0;
            if (b.type === "numberedList") {
                if (prevNumIndent !== b.indentationLevel) counter = 1;
                num = counter++;
                prevNumIndent = b.indentationLevel;
            } else {
                prevNumIndent = -1;
            }
            const line = lineFor(b, num);
            if (line !== "") parts.push(line);
        }
        return parts.join("\n\n");
    };

    const body = renderRange(blocks.filter(keep));
    return frontmatter + body;
}