import { compileMDX } from "next-mdx-remote/rsc"
import path from "path"
import { readFile, access, readdir } from "fs/promises"
import { Hr, H1, H2, P, Code, Strong, Pre, H3, CheckBoxF, CheckBoxT } from "@/components/mdx/mdx-components/components"
import { notFound } from "next/navigation"
import PostTitle from "@/components/post-title/PostTitle"

interface PostData {
    label: string
    title: string
    subTitle: string
    date: string
    tags: []
    mins: string
}

const POSTS_FOLDER = path.join(process.cwd(), "posts/shallow")

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

export default async function PostPage({ params }: { params: { slug: string } }) {
    const markdown = await readPostFile(params.slug)

    if (!markdown) {
        notFound()
    }

    const { content, frontmatter } = await compileMDX<PostData>({
        source: markdown,
        options: { parseFrontmatter: true },
        components: {
            h1: H1,
            h2: H2,
            h3: H3,
            h4: CheckBoxT,
            h5: CheckBoxF,
            p: P,
            hr: Hr,
            pre: Pre,
            code: Code,
            strong: Strong,
        },
    })

    return (
        <>
            <PostTitle frontmatter={frontmatter} />
            {content}
        </>
    )
}
