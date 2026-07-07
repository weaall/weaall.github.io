import fs from "fs/promises"
import path from "path"
import { MetadataRoute } from "next"

export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const POST_FOLDER = path.join(process.cwd(), "posts/post")
    const Post_files = await fs.readdir(POST_FOLDER)
    const lastModified = new Date().toISOString().split("T")[0]

    const Posts = Post_files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => ({
            url: `https://weaall.github.io/post/${file.replace(/\.mdx$/, "")}`,
            lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        }))

    const routes = ["", "/post", "/prac"].map((route) => ({
        url: `https://weaall.github.io${route}`,
        lastModified,
        priority: 0.5,
    }))

    return [...routes, ...Posts]
}
