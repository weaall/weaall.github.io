import { compileMDX } from "next-mdx-remote/rsc"
import path from "path"
import { readFile, access, readdir } from "fs/promises"
import {
    Hr,
    H1,
    H2,
    Code,
    Strong,
    Pre,
    H3,
    A,
    Li,
    Em,
    Img,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "@/components/mdx/mdx-dev-components/devComponents"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import remarkGfm from "remark-gfm"
import DevList from "@/components/dev-list/DevList"
import getPostsData from "@/components/mdx/getMdx"
import * as tw from "./page.styles"
import { DevMDXContent } from "@/components/dev-mdx/DevMDXContent"
import { PostFrontmatter } from "@/interface/PostData"

const POSTS_FOLDER = path.join(process.cwd(), "posts/dev")

export const generateStaticParams = async () => {
    const files = await readdir(POSTS_FOLDER)
    const posts = files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""))

    return posts.map((post) => ({
        slug: post,
    }))
}

async function readPostFile(slug: string) {
    const filePath = path.resolve(path.join(POSTS_FOLDER, `${slug}.mdx`))

    try {
        await access(filePath)
        return await readFile(filePath, { encoding: "utf8" })
    } catch (err) {
        return null
    }
}

async function compilePostMarkdown(slug: string) {
    const markdown = await readPostFile(slug)

    if (!markdown) {
        notFound()
    }

    return compileMDX<PostFrontmatter>({
        source: markdown,
        options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } },
        components: {
            h1: H1,
            h2: H2,
            h3: H3,
            a: A,
            li: Li,
            hr: Hr,
            pre: Pre,
            code: Code,
            strong: Strong,
            em: Em,
            img: Img,
            table: Table,
            thead: Thead,
            tbody: Tbody,
            tr: Tr,
            th: Th,
            td: Td,
        },
    })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { content } = await compilePostMarkdown(slug)
    const postsData = await getPostsData("dev")

    return (
        <tw.Container>
            <DevList props={postsData} />
            <DevMDXContent content={content} />
        </tw.Container>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { frontmatter } = await compilePostMarkdown(slug)

    const metadata: Metadata = {
        title: frontmatter.title,
        description: frontmatter.subTitle,
    }

    return metadata
}
