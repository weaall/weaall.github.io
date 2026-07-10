import { compileMDX } from "next-mdx-remote/rsc";
import { readFile, access, readdir } from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import { PostFrontmatter } from "@/interface/PostData";

// post/dev/prac 라우트가 공통으로 쓰던 정적 파라미터 생성 · 파일 읽기 · MDX 컴파일 로직.
// 각 라우트는 폴더명과 컴포넌트 맵(+gfm 여부)만 넘기면 된다.

type MdxComponents = NonNullable<Parameters<typeof compileMDX>[0]>["components"];

const postsDir = (folder: string) => path.join(process.cwd(), "posts", folder);

// generateStaticParams = makeGenerateStaticParams("post") 형태로 사용
export const makeGenerateStaticParams = (folder: string) => async () => {
    try {
        const files = await readdir(postsDir(folder));
        // 한글 등 비ASCII 파일명은 NFC로 정규화해야 URL 디코딩 값과 일치(파일시스템이 NFD로 줄 수 있음)
        return files.filter((f) => f.endsWith(".mdx")).map((f) => ({ slug: f.replace(/\.mdx$/, "").normalize("NFC") }));
    } catch {
        return [];
    }
};

async function readPostFile(folder: string, slug: string): Promise<string | null> {
    const filePath = path.resolve(path.join(postsDir(folder), `${slug}.mdx`));
    try {
        await access(filePath);
        return await readFile(filePath, { encoding: "utf8" });
    } catch {
        // 정규화(NFC/NFD) 불일치 폴백: 디렉터리에서 이름을 NFC로 맞춰 매칭
        try {
            const want = `${slug}.mdx`.normalize("NFC");
            const files = await readdir(postsDir(folder));
            const hit = files.find((f) => f.normalize("NFC") === want);
            if (hit) return await readFile(path.join(postsDir(folder), hit), { encoding: "utf8" });
        } catch {
            /* 무시 */
        }
        return null;
    }
}

export async function compilePost(
    folder: string,
    slug: string,
    components: MdxComponents,
    { gfm = false }: { gfm?: boolean } = {},
) {
    const markdown = await readPostFile(folder, slug);
    if (!markdown) notFound();

    return compileMDX<PostFrontmatter>({
        source: markdown,
        options: {
            parseFrontmatter: true,
            mdxOptions: { remarkPlugins: gfm ? [remarkGfm] : [] },
        },
        components,
    });
}
