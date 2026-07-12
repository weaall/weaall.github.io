import {
    Hr, H1, H2, Code, Strong, Pre, H3, A, Li, Em, Img,
    Table, Thead, Tbody, Tr, Th, Td,
} from "@/components/mdx/mdx-dev-components/devComponents"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import DevList from "@/components/dev-list/DevList"
import getPostsData from "@/components/mdx/getMdx"
import * as tw from "./page.styles"
import { DevMDXContent } from "@/components/dev-mdx/DevMDXContent"
import { compilePost, makeGenerateStaticParams } from "@/components/mdx/postRoutes"
import { getArticleMetadata, JSONLD } from "@/utils/seo"

const FOLDER = "dev"

const components = {
    h1: H1, h2: H2, h3: H3, a: A, li: Li, hr: Hr, pre: Pre,
    code: Code, strong: Strong, em: Em, img: Img,
    table: Table, thead: Thead, tbody: Tbody, tr: Tr, th: Th, td: Td,
}

export const generateStaticParams = makeGenerateStaticParams(FOLDER)

const compilePostMarkdown = (slug: string) => compilePost(FOLDER, slug, components, { gfm: true })

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { content, frontmatter } = await compilePostMarkdown(slug)

    if (!content) notFound()

    const postsData = await getPostsData("dev")
    const jsonLd = JSONLD(frontmatter, `https://weaall.github.io/${FOLDER}/${slug}`)

    return (
        <tw.Container>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
            <DevList posts={postsData} />
            <DevMDXContent content={content} />
        </tw.Container>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { frontmatter } = await compilePostMarkdown(slug)

    if (!frontmatter) return {}
    return getArticleMetadata(frontmatter, `/${FOLDER}/${slug}`)
}
