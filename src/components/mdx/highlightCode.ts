import hljs from "highlight.js";

// 코드 하이라이트 공용 헬퍼(에디터/포스트 공유).
// 핵심: hljs의 JS/TS 문법은 "표현식 위치"의 JSX만 색칠해서 최상위(bare) <div> 첫/막줄이 평문이 된다.
// → JS/TS 계열이면서 코드가 태그로 시작하면 표현식으로 감싸 하이라이트한 뒤 래퍼 줄만 제거한다.

const JS_FAMILY = new Set(["javascript", "typescript", "js", "ts", "jsx", "tsx"]);

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// hljs가 만든 HTML을 줄 단위로 분리(줄을 넘나드는 <span>은 각 줄에서 다시 열고 닫아 유지).
export function splitHljsLines(html: string): string[] {
    const open: string[] = [];
    return html.split("\n").map((line) => {
        const prefix = open.join("");
        const re = /<span[^>]*>|<\/span>/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(line))) {
            if (m[0] === "</span>") open.pop();
            else open.push(m[0]);
        }
        const suffix = "</span>".repeat(open.length);
        return prefix + line + suffix;
    });
}

export function highlightCode(code: string, lang: string): { value: string; language: string } {
    if (lang === "plaintext") return { value: escapeHtml(code), language: "" };

    // 지정 언어가 유효하면 그대로, 아니면(auto 포함) 자동감지
    const language =
        lang && lang !== "auto" && hljs.getLanguage(lang) ? lang : hljs.highlightAuto(code).language || "";
    if (!language) return { value: escapeHtml(code), language: "" };

    try {
        // 최상위 JSX(태그로 시작)를 JS/TS로 색칠 → 표현식으로 감싸고 래퍼 첫/막줄 제거
        if (JS_FAMILY.has(language) && /^\s*</.test(code)) {
            const full = hljs.highlight(`const __jsx = (\n${code}\n);`, { language, ignoreIllegals: true }).value;
            const lines = full.split("\n");
            return { value: lines.slice(1, -1).join("\n"), language };
        }
        return { value: hljs.highlight(code, { language, ignoreIllegals: true }).value, language };
    } catch {
        return { value: escapeHtml(code), language };
    }
}
