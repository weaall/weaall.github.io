import { blocksToMDX } from "../components/helper/BlocksToMdx";
import { LocalDoc } from "./localDocs";
import { formatPostDate } from "@/util/date";

// 제목 → 파일명 슬러그(ASCII). 한글 등 비ASCII는 URL/정적export에서 문제되므로 제거하고,
// 결과가 비면 doc id 기반 대체 슬러그를 쓴다. (제목 자체는 frontmatter에 그대로 보존)
export function slugifyTitle(title: string, fallbackId?: string): string {
    const s = (title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    if (s.length >= 2) return s;
    const fb = (fallbackId || "").replace(/[^a-z0-9]/gi, "").slice(0, 6).toLowerCase();
    return `post-${fb || "untitled"}`;
}

// LocalDoc → MDX 문자열
export function buildMdx(doc: LocalDoc): string {
    const blocksWithFormatting = doc.blocks.map((block) => ({
        ...block,
        color: doc.blockColors[block.id],
        formattedRanges: doc.blockFormattedRanges[block.id] || [],
    }));

    return blocksToMDX(blocksWithFormatting, {
        title: doc.title || "",
        date: formatPostDate(new Date()),
        mins: 2,
        tags: ["default-tag"],
    });
}

// MDX 내보내기: 개발 모드는 posts/post에 저장 시도, 실패 시 브라우저 다운로드.
export async function exportDoc(doc: LocalDoc): Promise<void> {
    const mdx = buildMdx(doc);
    const filename = `${slugifyTitle(doc.title, doc.id)}.mdx`;

    try {
        const res = await fetch("/api/save-mdx", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename, content: mdx }),
        });
        if (res.ok) {
            const data = await res.json();
            alert(`저장되었습니다 → ${data.path}`);
            return;
        }
    } catch {
        // 서버 불가 → 다운로드 폴백
    }

    const blob = new Blob([mdx], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
