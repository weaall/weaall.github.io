import { compileMDX } from "next-mdx-remote/rsc"
import path from "path"
import { readFile, access, readdir } from "fs/promises"
import { H1, H2, P } from "@/components/mdx/mdx-components/components"
import { notFound } from "next/navigation"

const POSTS_FOLDER = path.join(process.cwd(), "posts/deep")

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

    const { content } = await compileMDX({
        source: markdown,
        options: { parseFrontmatter: true },
        components: { h1: H1, h2: H2, p: P },
    })

    return <>{content}</>
}

export const generateStaticParams = async () => {
    const files = await readdir(POSTS_FOLDER)

    const posts = files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""))

    return posts.map((post) => ({
        slug: post
    }))
}