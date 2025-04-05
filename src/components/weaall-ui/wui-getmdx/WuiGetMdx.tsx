import { compileMDX } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";

interface PostData {
    label: string;
    title: string;
    subTitle: string;
    index: number;
    slug: string;
}

export default async function WuiGetMdx(dir: string) {
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
                index: frontmatter.index,
                slug,
                postUrl,
            };
        }),
    );

    return postsData;
}
