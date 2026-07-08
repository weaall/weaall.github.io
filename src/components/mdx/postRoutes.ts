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
        return files.filter((f) => f.endsWith(".mdx")).map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
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
