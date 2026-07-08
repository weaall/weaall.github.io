import { compileMDX } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import { formatPostDate } from "@/util/date";
import { PostData } from "@/interface/PostData";

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
                imageUrl: frontmatter.imageUrl
            };
        }),
    );

    return postsData;
}
