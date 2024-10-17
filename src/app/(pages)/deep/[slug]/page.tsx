import { compileMDX } from "next-mdx-remote/rsc"
import path from "path"
import { readFile, access, readdir } from "fs/promises"
import { Hr, H1, H2, P, Code, Strong, Pre, H3, CheckBoxF, CheckBoxT, A, Li, Em, Img } from "@/components/mdx/mdx-components/components"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { MDXContent } from "@/components/mdx/mdx-content/MDXContent"

interface PostData {
    label: string
    title: string
    subTitle: string
    date: string
    tags: []
    mins: string
}

const POSTS_FOLDER = path.join(process.cwd(), "posts/deep")

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

    return compileMDX<PostData>({
        source: markdown,
        options: { parseFrontmatter: true },
        components: {
            h1: H1,
            h2: H2,
            h3: H3,
            h4: CheckBoxT,
            h5: CheckBoxF,
            p: P,
            a: A,
            li: Li,
            hr: Hr,
            pre: Pre,
            code: Code,
            strong: Strong,
            em: Em,
            img: Img,
        },
    })
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const { content, frontmatter } = await compilePostMarkdown(params.slug)

    return (
        <>
            <MDXContent content={content} frontmatter={frontmatter}  />
        </>
    )
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { frontmatter } = await compilePostMarkdown(params.slug)

    const metadata: Metadata = {
        title: frontmatter.title,
        description: frontmatter.subTitle,
    }

    return metadata
}
