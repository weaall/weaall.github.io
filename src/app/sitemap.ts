import fs from "fs/promises"
import path from "path"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const SHALLOW_FOLDER = path.join(process.cwd(), "posts/shallow")
    const SHALLOW_files = await fs.readdir(SHALLOW_FOLDER)
    const Shallow_posts = SHALLOW_files.map((file) => {
        return {
            url: `https://weaall.github.io/shallow/${file.replace(/\.mdx$/, "")}`,
            lastModified: new Date().toISOString().split("T")[0],
            changeFrequency: "monthly",
            priority: 0.7,
        }
    })

    const DEEP_FOLDER = path.join(process.cwd(), "posts/deep")
    const Deep_files = await fs.readdir(DEEP_FOLDER)
    const Deep_posts = Deep_files.map((file) => {
        return {
            url: `https://weaall.github.io/deep/${file.replace(/\.mdx$/, "")}`,
            lastModified: new Date().toISOString().split("T")[0],
            changeFrequency: "monthly",
            priority: 0.7,
        }
    })

    const routes = ["", "/shallow", "/deep", "/todo", "/project"].map((route) => ({
        url: `https://weaall.github.io${route}`,
        lastModified: new Date().toISOString().split("T")[0],
        priority: 0.5,
    }))

    return [...routes, ...Shallow_posts, ...Deep_posts]
}
