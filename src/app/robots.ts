import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: "https://weaall.github.io/sitemap.xml",
        host: "https://weaall.github.io",
    }
}
