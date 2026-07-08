import { Hr, H1, H2, P, Code, Strong, Pre, H3, A, Li, Em, Img } from "@/components/mdx/mdx-components/components"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getArticleMetadata } from "@/util/seo"
import PracTitle from "@/components/post-title/PracTitle"
import { compilePost, makeGenerateStaticParams } from "@/components/mdx/postRoutes"

const FOLDER = "prac"

const components = {
    h1: H1, h2: H2, h3: H3, p: P, a: A, li: Li, hr: Hr, pre: Pre,
    code: Code, strong: Strong, em: Em, img: Img,
}

export const generateStaticParams = makeGenerateStaticParams(FOLDER)

const compilePostMarkdown = (slug: string) => compilePost(FOLDER, slug, components)

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { content, frontmatter } = await compilePostMarkdown(slug)

    if (!content) notFound()

    return (
        <>
            <PracTitle frontmatter={frontmatter} />
            {content}
        </>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { frontmatter } = await compilePostMarkdown(slug)

    if (!frontmatter) return {}
    return getArticleMetadata(frontmatter, slug)
}