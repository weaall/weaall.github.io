import { Block } from "../components/helper/BlocksToMdx";
import { FormattedRange, TextFormat } from "../components/text-modal/TextFormat.modal";
import { EditorData } from "./exportMdx";

// MDX(마크다운) 본문 → 에디터 블록으로 되돌리는 폴백 파서.
// 에디터가 만든 글은 editordata로 무손실 복원하고, 그게 없는(직접 작성/과거) 글만 이걸로 파싱한다.
// 완벽하진 않지만 흔한 문법(제목/목록/체크/구분선/이미지/표/그래프/토글/인라인서식)을 커버.

const uid = () => crypto.randomUUID();

// 따옴표 감싼 YAML 값 해제
function unq(s: string): string {
    const t = s.trim();
    if (t.length >= 2 && ((t[0] === '"' && t.endsWith('"')) || (t[0] === "'" && t.endsWith("'")))) {
        return t.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
    return t;
}

interface Meta {
    title?: string;
    label?: string;
    subTitle?: string;
    tags?: string[];
    imageUrl?: string;
    icon?: string;
}

function parseFrontmatter(fm: string): Meta {
    const meta: Meta = {};
    fm.split("\n").forEach((line) => {
        const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
        if (!m) return;
        const key = m[1];
        const val = m[2].trim();
        if (key === "tags") {
            const inner = val.replace(/^\[/, "").replace(/\]$/, "");
            meta.tags = inner.split(",").map((t) => unq(t)).filter(Boolean);
        } else if (key === "title" || key === "label" || key === "subTitle" || key === "imageUrl" || key === "icon") {
            (meta as Record<string, string>)[key] = unq(val);
        }
    });
    return meta;
}

// 인라인 마크다운/MDX 서식 → {text, ranges}
function parseInline(s: string): { text: string; ranges: FormattedRange[] } {
    const ranges: FormattedRange[] = [];
    let text = "";
    let i = 0;
    const applyChild = (child: { text: string; ranges: FormattedRange[] }, fmt: TextFormat) => {
        const base = text.length;
        if (Object.keys(fmt).length) ranges.push({ start: base, end: base + child.text.length, format: fmt });
        child.ranges.forEach((r) => ranges.push({ start: base + r.start, end: base + r.end, format: r.format }));
        text += child.text;
    };
    while (i < s.length) {
        // MDX 이스케이프 되돌리기: \< → < , \{ → {
        if (s[i] === "\\" && (s[i + 1] === "<" || s[i + 1] === "{")) {
            text += s[i + 1];
            i += 2;
            continue;
        }
        if (s.startsWith("**", i)) {
            const end = s.indexOf("**", i + 2);
            if (end !== -1) {
                applyChild(parseInline(s.slice(i + 2, end)), { bold: true });
                i = end + 2;
                continue;
            }
        }
        if (s.startsWith("~~", i)) {
            const end = s.indexOf("~~", i + 2);
            if (end !== -1) {
                applyChild(parseInline(s.slice(i + 2, end)), { strikethrough: true });
                i = end + 2;
                continue;
            }
        }
        if (s[i] === "*") {
            const end = s.indexOf("*", i + 1);
            if (end !== -1) {
                applyChild(parseInline(s.slice(i + 1, end)), { italic: true });
                i = end + 1;
                continue;
            }
        }
        if (s.startsWith("<span", i)) {
            const m = /^<span style=\{\{([^}]*)\}\}>/.exec(s.slice(i));
            if (m) {
                const contentStart = i + m[0].length;
                const closeIdx = s.indexOf("</span>", contentStart);
                if (closeIdx !== -1) {
                    const fmt: TextFormat = {};
                    const cm = /color:\s*'([^']+)'/.exec(m[1]);
                    if (cm) fmt.color = cm[1];
                    if (/underline/.test(m[1])) fmt.underline = true;
                    if (/line-through/.test(m[1])) fmt.strikethrough = true;
                    applyChild(parseInline(s.slice(contentStart, closeIdx)), fmt);
                    i = closeIdx + 7;
                    continue;
                }
            }
        }
        text += s[i];
        i++;
    }
    return { text, ranges };
}

export function mdxToBlocks(mdx: string): EditorData {
    let body = mdx.replace(/\r\n/g, "\n");
    let meta: Meta = {};
    const fm = /^---\n([\s\S]*?)\n---\n?/.exec(body);
    if (fm) {
        meta = parseFrontmatter(fm[1]);
        body = body.slice(fm[0].length);
    }
    // 혹시 남은 editordata 주석 제거
    body = body.replace(/\{\/\*\s*editordata:[^*]*\*\/\}/g, "");

    const blocks: Block[] = [];
    const blockFormattedRanges: { [id: string]: FormattedRange[] } = {};

    const pushText = (type: string, raw: string, indent: number, extra: Partial<Block> = {}) => {
        const { text, ranges } = parseInline(raw);
        const id = uid();
        blocks.push({ id, type, content: text, indentationLevel: indent, ...extra });
        if (ranges.length) blockFormattedRanges[id] = ranges;
    };
    const pushRaw = (type: string, content: string) => blocks.push({ id: uid(), type, content, indentationLevel: 0 });

    const lines = body.split("\n");
    for (let li = 0; li < lines.length; li++) {
        const line = lines[li];
        const trimmed = line.trim();
        if (!trimmed) continue;
        const indent = Math.min(6, Math.floor((/^(\s*)/.exec(line)?.[1].length ?? 0) / 2));

        // 컴포넌트/특수 블록
        if (trimmed.startsWith("<DataTable")) {
            const m = /data="([^"]*)"/.exec(trimmed);
            pushRaw("table", m ? decodeURIComponent(m[1]) : "{}");
            continue;
        }
        if (trimmed.startsWith("<BarChart")) {
            const o = /orient="([^"]*)"/.exec(trimmed);
            const d = /data="([^"]*)"/.exec(trimmed);
            pushRaw(o && o[1] === "v" ? "barChartV" : "barChartH", d ? decodeURIComponent(d[1]) : "{}");
            continue;
        }
        if (trimmed.startsWith("<img")) {
            const sm = /src="([^"]*)"/.exec(trimmed);
            const wm = /width="?(\d+)"?/.exec(trimmed);
            const src = sm ? sm[1] : "";
            pushRaw("image", JSON.stringify(wm ? { src, width: Number(wm[1]) } : { src }));
            continue;
        }
        const mdImg = /^!\[[^\]]*\]\(([^)\s]+)[^)]*\)$/.exec(trimmed);
        if (mdImg) {
            pushRaw("image", JSON.stringify({ src: mdImg[1] }));
            continue;
        }
        if (trimmed.startsWith("<ToggleText>")) {
            pushText("toggleText", trimmed.replace(/^<ToggleText>/, "").replace(/<\/ToggleText>$/, ""), indent);
            continue;
        }
        if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
            pushRaw("divider", "");
            continue;
        }
        // GFM 표: 연속된 | 라인 수집
        if (trimmed.startsWith("|")) {
            const tblLines: string[] = [];
            let k = li;
            while (k < lines.length && lines[k].trim().startsWith("|")) {
                tblLines.push(lines[k].trim());
                k++;
            }
            const cellsOf = (l: string) =>
                l.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim().replace(/\\\|/g, "|"));
            const rows = tblLines.filter((l) => !/^\|[\s|:-]+\|?$/.test(l)).map(cellsOf); // 구분선(---) 행 제외
            if (rows.length) pushRaw("table", JSON.stringify({ rows, headerRow: true }));
            li = k - 1;
            continue;
        }

        // 체크 리스트
        let m: RegExpExecArray | null;
        if ((m = /^[-*+]\s+\[([ xX])\]\s+(.*)$/.exec(trimmed))) {
            pushText("checkedList", m[2], indent, { isChecked: m[1].toLowerCase() === "x" });
            continue;
        }
        // 제목 (### → ## → #)
        if ((m = /^###\s+(.*)$/.exec(trimmed))) {
            pushText("h3", m[1], indent);
            continue;
        }
        if ((m = /^##\s+(.*)$/.exec(trimmed))) {
            pushText("h2", m[1], indent);
            continue;
        }
        if ((m = /^#\s+(.*)$/.exec(trimmed))) {
            pushText("h1", m[1], indent);
            continue;
        }
        // 목록
        if ((m = /^[-*+]\s+(.*)$/.exec(trimmed))) {
            pushText("ul", m[1], indent);
            continue;
        }
        if ((m = /^\d+\.\s+(.*)$/.exec(trimmed))) {
            pushText("numberedList", m[1], indent);
            continue;
        }
        // 일반 문단
        pushText("p", trimmed, indent);
    }

    if (!blocks.length) blocks.push({ id: uid(), type: "p", content: "", indentationLevel: 0 });

    return {
        v: 1,
        title: meta.title,
        label: meta.label,
        subTitle: meta.subTitle,
        tags: meta.tags,
        imageUrl: meta.imageUrl,
        icon: meta.icon,
        blocks,
        blockColors: {},
        blockFormattedRanges,
    };
}
