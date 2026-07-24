import { compileMDX } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import { formatPostDate } from "@/utils/date";
import { PostData } from "@/types/PostData";

export default async function getPostsData(dir: string) {
    const lowerDir = dir.toLowerCase();
    const postsDirectory = path.join(process.cwd(), `posts/${lowerDir}`);
    const mdxFiles = fs.readdirSync(postsDirectory);

    const postsData = await Promise.all(
        mdxFiles.map(async (filename) => {
            const filePath = path.join(postsDirectory, filename);
            const mdxContent = fs.readFileSync(filePath, "utf-8");

            const { frontmatter } = await compileMDX<PostData>({
                source: mdxContent,
                options: { parseFrontmatter: true },
            });

            const slug = filename.slice(0, -4);
            const postUrl = `/${lowerDir}/${slug}`;

            return {
                label: frontmatter.label,
                title: frontmatter.title,
                subTitle: frontmatter.subTitle,
                date: formatPostDate(frontmatter.date),
                tags: frontmatter.tags,
                slug,
                postUrl,
                imageUrl: frontmatter.imageUrl,
                icon: frontmatter.icon,
            };
        }),
    );

    return postsData;
}

// MDX 원문 → 검색용 플레인 텍스트 (프론트매터·base64·컴포넌트·마크다운 기호 제거)
function toPlainText(mdx: string): string {
    let s = mdx;
    s = s.replace(/^---[\s\S]*?---/, " "); // 프론트매터
    s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, " "); // editordata 주석
    s = s.replace(/data:[a-zA-Z0-9;+/=.\-]+/g, " "); // base64 data URL
    s = s.replace(/(data|content|src)="[^"]*"/g, " "); // 인코딩된 속성값
    s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"); // [텍스트](링크) → 텍스트
    s = s.replace(/<[^>]+>/g, " "); // JSX/HTML 태그
    s = s.replace(/[|#>*_`~]+/g, " "); // 마크다운 기호
    s = s.replace(/\s+/g, " ").trim();
    return s.slice(0, 2000);
}

// 검색 인덱스: 기본 메타 + 본문 플레인 텍스트 포함
export async function getPostsSearchIndex(dir: string): Promise<PostData[]> {
    const lowerDir = dir.toLowerCase();
    const postsDirectory = path.join(process.cwd(), `posts/${lowerDir}`);
    const mdxFiles = fs.readdirSync(postsDirectory);

    return Promise.all(
        mdxFiles.map(async (filename) => {
            const filePath = path.join(postsDirectory, filename);
            const mdxContent = fs.readFileSync(filePath, "utf-8");
            const { frontmatter } = await compileMDX<PostData>({ source: mdxContent, options: { parseFrontmatter: true } });
            const slug = filename.slice(0, -4);
            return {
                label: frontmatter.label,
                title: frontmatter.title,
                subTitle: frontmatter.subTitle,
                date: formatPostDate(frontmatter.date),
                tags: frontmatter.tags,
                slug,
                postUrl: `/${lowerDir}/${slug}`,
                imageUrl: frontmatter.imageUrl,
                icon: frontmatter.icon,
                body: toPlainText(mdxContent),
            };
        }),
    );
}
