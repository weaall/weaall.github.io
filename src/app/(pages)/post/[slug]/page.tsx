import {
    Hr, H1, H2, Code, Strong, Pre, H3, A, Li, Ul, Ol, Em, Img,
    Table, Thead, Tbody, Tr, Th, Td, H4, P, Span, ToggleText, Columns, Column, Blockquote,
} from "@/components/mdx/mdx-components/components";
import BarChart from "@/components/mdx/mdx-components/BarChart";
import DataTable from "@/components/mdx/mdx-components/DataTable";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PostLayout from "./PostLayout";
import getPostsData from "@/components/mdx/getMdx";
import { compilePost, makeGenerateStaticParams } from "@/components/mdx/postRoutes";
import { getArticleMetadata, JSONLD } from "@/utils/seo";

const FOLDER = "post";

const components = {
    h1: H1, h2: H2, h3: H3, h4: H4, a: A, p: P, li: Li, ul: Ul, ol: Ol, hr: Hr, pre: Pre,
    code: Code, strong: Strong, em: Em, img: Img,
    table: Table, thead: Thead, tbody: Tbody, tr: Tr, th: Th, td: Td, span: Span,
    blockquote: Blockquote,
    ToggleText, BarChart, DataTable, Columns, Column,
};

export const generateStaticParams = makeGenerateStaticParams(FOLDER);

const compilePostMarkdown = (slug: string) => compilePost(FOLDER, slug, components, { gfm: true });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { content, frontmatter } = await compilePostMarkdown(slug)

    if (!content) notFound()

    const postsData = await getPostsData("post");
    const jsonLd = JSONLD(frontmatter, `https://weaall.github.io/${FOLDER}/${slug}`);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
            <PostLayout postsData={postsData} content={content} frontmatter={frontmatter} slug={slug} />
        </>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { frontmatter } = await compilePostMarkdown(slug);

    if (!frontmatter) return {};
    return getArticleMetadata(frontmatter, `/${FOLDER}/${slug}`);
}