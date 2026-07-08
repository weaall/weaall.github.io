import fs from "fs/promises"
import path from "path"
import { MetadataRoute } from "next"

export const dynamic = "force-static"

const BASE_URL = "https://weaall.github.io"

// MDX 콘텐츠가 있는 섹션들 (posts/<dir> → /<dir>/<slug>)
const CONTENT_DIRS = ["post", "dev", "prac"] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModified = new Date().toISOString().split("T")[0]

    const postEntries: MetadataRoute.Sitemap = []
    for (const dir of CONTENT_DIRS) {
        let files: string[] = []
        try {
            files = await fs.readdir(path.join(process.cwd(), "posts", dir))
        } catch {
            continue
        }
        for (const file of files) {
            if (!file.endsWith(".mdx")) continue
            postEntries.push({
                url: `${BASE_URL}/${dir}/${file.replace(/\.mdx$/, "")}`,
                lastModified,
                changeFrequency: "monthly",
                priority: 0.7,
            })
        }
    }

    const routes: MetadataRoute.Sitemap = ["", "/post", "/dev", "/prac", "/me", "/portfolio"].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified,
        priority: 0.5,
    }))

    return [...routes, ...postEntries]
}
