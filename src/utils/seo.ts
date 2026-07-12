import { Metadata } from "next"
import { PostFrontmatter } from "@/types/PostData"

export const siteConfig = {
    url: "https://weaall.github.io",
    title: "WeHub",
    description: "나만을 위한 AI 워크스페이스 — 팀이 답을 찾고, 반복 업무를 자동화하며, 프로젝트를 완료하는 하나의 공간.",
    copyright: "weaall © All rights reserved.",
    since: 2023,
    googleAnalyticsId: "",
    author: "weaall",
    email: "weaall88@gmail.com",
    ogImage: "https://weaall.github.io/assets/weaall-ui.png",
}

const dateTime = (date: string) => new Date(date).toISOString()
const abs = (path: string) => (path.startsWith("http") ? path : `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`)

interface BaseMetadataInput {
    /** 페이지 고유 제목 (루트 template이 " | WeHub"를 자동으로 붙인다) */
    title: string
    /** 없으면 사이트 기본 설명 사용 */
    description?: string
    /** canonical 경로 (예: "/portfolio/provelite"). 없으면 사이트 루트 */
    path?: string
}

export const getBaseMetadata = ({ title, description = siteConfig.description, path = "/" }: BaseMetadataInput): Metadata => {
    const url = abs(path)

    return {
        metadataBase: new URL(siteConfig.url),
        title,
        description,
        openGraph: {
            title,
            description,
            siteName: siteConfig.title,
            url,
            type: "website",
            images: [{ url: siteConfig.ogImage, alt: siteConfig.title }],
            locale: "ko_KR",
        },
        alternates: {
            canonical: url,
        },
    }
}

export const getArticleMetadata = (postData: PostFrontmatter, url: string): Metadata => {
    const canonical = abs(url)
    const image = postData.imageUrl || siteConfig.ogImage

    return {
        metadataBase: new URL(siteConfig.url),
        title: postData.title,
        description: postData.subTitle,
        keywords: postData.tags.join(", "),
        openGraph: {
            title: postData.title,
            description: postData.subTitle,
            type: "article",
            siteName: siteConfig.title,
            url: canonical,
            publishedTime: dateTime(postData.date),
            authors: [`https://github.com/${siteConfig.author}`],
            tags: postData.tags,
            images: [{ url: image, alt: postData.title }],
            locale: "ko_KR",
        },
        alternates: {
            canonical,
        },
    }
}

export const JSONLD = (postData: PostFrontmatter, url: string) => {
    const canonical = abs(url)
    const image = postData.imageUrl || siteConfig.ogImage

    const jsonLD = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        author: {
            "@type": "Person",
            name: siteConfig.author,
            email: siteConfig.email,
            url: siteConfig.url,
            nationality: {
                "@type": "Country",
                name: "South Korea",
            },
        },
        publisher: {
            "@type": "Organization",
            name: siteConfig.title,
            logo: {
                "@type": "ImageObject",
                url: siteConfig.ogImage,
            },
        },
        image,
        description: postData.subTitle,
        headline: postData.title,
        datePublished: dateTime(postData.date),
        inLanguage: "ko",
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    }
    return JSON.stringify(jsonLD)
}
