import { blocksToMDX } from "../components/helper/BlocksToMdx";
import { LocalDoc } from "./localDocs";
import { formatPostDate } from "@/util/date";

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
    const filename = `${(doc.title || "untitled").replace(/ /g, "_")}.mdx`;

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
