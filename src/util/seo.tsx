import { Metadata } from "next"

export const siteConfig = {
    url: "https://weaall.github.io",
    title: "Weaall's Dive",
    description: "Weaall's pretty personal idea",
    copyright: "weaall © All rights reserved.",
    since: 2023,
    googleAnalyticsId: "",
    author: "weaall",
    email: "weaall88@gmail.com",
    profile: "https://weaall.github.io/profile.png",
}

export const getBaseMetadata = ({ title }: { title: string }): Metadata => {
    const { description } = siteConfig

    return {
        metadataBase: new URL("http://weaall.github.io"),
        title,
        description,
        openGraph: {
            title,
            description,
            siteName: siteConfig.title,
            url: siteConfig.url,
            type: "website",
            images: [
                {
                    url: siteConfig.profile,
                    alt: title,
                },
            ],
        },
        alternates: {
            canonical: siteConfig.url,
        },
    }
}

export const getArticleMetadata = (postData: PostData, url: string): Metadata => {
    const dateTime = new Date(postData.date).toISOString()

    return {
        metadataBase: new URL("http://weaall.github.io"),
        title: postData.title,
        description: postData.subTitle,
        keywords: postData.tags,
        openGraph: {
            title: postData.title,
            description: postData.subTitle,
            type: "article",
            siteName: "Weaall's Dive",
            url: url,
            publishedTime: dateTime,
            modifiedTime: dateTime,
            authors: [`https://github.com/weaall`],
            tags: postData.tags,
            images: [
                {
                    url: postData.imageUrl,
                    alt: postData.title,
                },
            ],
        },
        alternates: {
            canonical: url,
        },
    }
}

export const JSONLD = (postData: PostData, url: string) => {
    const jsonLD = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        name: siteConfig.author,
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
        image: siteConfig.profile,
        description: postData.subTitle,
        title: postData.title,
        headline: postData.title,
        datePublished: new Date(postData.date).toISOString(),
        inLanguage: "ko",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
    }
    return JSON.stringify(jsonLD)
}
