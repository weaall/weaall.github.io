import { Block } from "../components/helper/BlocksToMdx";
import { FormattedRange, TextFormat } from "../components/text-modal/TextFormat.modal";
import { EditorData } from "./exportMdx";

// 서식이 입혀진(리치 텍스트/HTML) 클립보드 내용을 에디터 블록으로 변환.
// 렌더된 마크다운/웹페이지를 복사해 붙여넣을 때 사용(plain text엔 마크다운 기호가 없으므로).

const uid = () => crypto.randomUUID();

// 한 요소의 인라인 내용 → {text, ranges}
function inlineOf(node: Node): { text: string; ranges: FormattedRange[] } {
    const ranges: FormattedRange[] = [];
    let text = "";
    const walk = (n: Node, fmt: TextFormat) => {
        if (n.nodeType === Node.TEXT_NODE) {
            const t = (n.textContent || "").replace(/\s+/g, " ");
            if (t) {
                const start = text.length;
                text += t;
                if (Object.keys(fmt).length) ranges.push({ start, end: text.length, format: { ...fmt } });
            }
            return;
        }
        if (n.nodeType !== Node.ELEMENT_NODE) return;
        const el = n as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (tag === "br") {
            text += "\n";
            return;
        }
        const f: TextFormat = { ...fmt };
        if (tag === "strong" || tag === "b") f.bold = true;
        else if (tag === "em" || tag === "i") f.italic = true;
        else if (tag === "del" || tag === "s" || tag === "strike") f.strikethrough = true;
        else if (tag === "u" || tag === "ins") f.underline = true;
        const c = el.style?.color;
        if (c) f.color = c;
        el.childNodes.forEach((ch) => walk(ch, f));
    };
    node.childNodes.forEach((ch) => walk(ch, {}));
    return { text: text.replace(/ /g, " ").trim(), ranges };
}

export function htmlToBlocks(html: string): EditorData {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const blocks: Block[] = [];
    const blockFormattedRanges: { [id: string]: FormattedRange[] } = {};

    const pushInline = (type: string, node: Node, indent: number, extra: Partial<Block> = {}) => {
        const { text, ranges } = inlineOf(node);
        if (!text && type !== "divider") return;
        const id = uid();
        blocks.push({ id, type, content: text, indentationLevel: indent, ...extra });
        if (ranges.length) blockFormattedRanges[id] = ranges;
    };
    const pushRaw = (type: string, content: string) => blocks.push({ id: uid(), type, content, indentationLevel: 0 });

    const handleList = (list: HTMLElement, ordered: boolean, indent: number) => {
        Array.from(list.children).forEach((li) => {
            if (li.tagName.toLowerCase() !== "li") return;
            const clone = li.cloneNode(true) as HTMLElement;
            const nested = Array.from(clone.querySelectorAll("ul, ol"));
            nested.forEach((n) => n.remove());
            const cb = clone.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
            const isCheck = !!cb;
            const checked = !!(cb && (cb.checked || cb.getAttribute("checked") !== null));
            if (cb) cb.remove();
            pushInline(isCheck ? "checkedList" : ordered ? "numberedList" : "ul", clone, indent, isCheck ? { isChecked: checked } : {});
            // 중첩 리스트
            (li as HTMLElement).querySelectorAll(":scope > ul, :scope > ol").forEach((sub) => {
                handleList(sub as HTMLElement, (sub as HTMLElement).tagName.toLowerCase() === "ol", indent + 1);
            });
        });
    };

    const handleTable = (table: HTMLElement) => {
        const rows: string[][] = [];
        table.querySelectorAll("tr").forEach((tr) => {
            const cells = Array.from(tr.querySelectorAll("th,td")).map((c) => (c.textContent || "").trim());
            if (cells.length) rows.push(cells);
        });
        if (rows.length) pushRaw("table", JSON.stringify({ rows, headerRow: !!table.querySelector("thead") }));
    };

    const walkBlock = (el: HTMLElement) => {
        Array.from(el.children).forEach((childNode) => {
            const child = childNode as HTMLElement;
            const tag = child.tagName.toLowerCase();
            switch (tag) {
                case "h1":
                    pushInline("h1", child, 0);
                    break;
                case "h2":
                    pushInline("h2", child, 0);
                    break;
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                    pushInline(tag === "h3" ? "h3" : "h3", child, 0);
                    break;
                case "p":
                    pushInline("p", child, 0);
                    break;
                case "ul":
                    handleList(child, false, 0);
                    break;
                case "ol":
                    handleList(child, true, 0);
                    break;
                case "hr":
                    pushRaw("divider", "");
                    break;
                case "pre":
                    pushInline("p", child, 0);
                    break;
                case "blockquote":
                    pushInline("p", child, 0);
                    break;
                case "table":
                    handleTable(child);
                    break;
                case "img": {
                    const src = child.getAttribute("src") || "";
                    if (src) pushRaw("image", JSON.stringify({ src }));
                    break;
                }
                case "figure":
                case "div":
                case "section":
                case "article":
                case "main":
                    walkBlock(child); // 래퍼는 파고든다
                    break;
                default: {
                    const { text, ranges } = inlineOf(child);
                    if (text) {
                        const id = uid();
                        blocks.push({ id, type: "p", content: text, indentationLevel: 0 });
                        if (ranges.length) blockFormattedRanges[id] = ranges;
                    }
                }
            }
        });
    };

    walkBlock(doc.body);

    return { v: 1, blocks, blockColors: {}, blockFormattedRanges };
}
