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
        metadataBase: new URL("https://weaall.github.io"), 
        title: `${title} - Weaall's Dive`, 
        description: description, 
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
                {
                    url: "https://weaall.github.io/another-image.jpg", 
                    alt: "보조 이미지 설명",
                },
            ],
            locale: "ko_KR", 
        },
        alternates: {
            canonical: siteConfig.url,
        },
    }
}

export const getArticleMetadata = (postData: PostData, url: string): Metadata => {
    const dateTime = new Date(postData.date).toISOString()

    return {
        metadataBase: new URL("https://weaall.github.io"),
        title: `${postData.title} - Weaall's Dive`, 
        description: postData.subTitle,
        keywords: postData.tags.join(", "), 
        openGraph: {
            title: postData.title,
            description: postData.subTitle,
            type: "article",
            siteName: siteConfig.title,
            url: url,
            publishedTime: dateTime,
            authors: [`https://github.com/weaall`],
            tags: postData.tags,
            images: [
                {
                    url: postData.imageUrl,
                    alt: postData.title,
                },
            ],
            locale: "ko_KR",
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
        publisher: {
            "@type": "Organization",
            name: siteConfig.title,
            logo: {
                "@type": "ImageObject",
                url: siteConfig.profile,
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
