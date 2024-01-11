import { compileMDX } from "next-mdx-remote/rsc"
import fs from "fs"
import path from "path"
import { H1, H2, P } from "@/components/mdx/components"
import Link from "next/link"

interface ContentsProps {
    title: string
    date: string
}

export default async function MdxReader() {
    const mdxFilePath = path.join(process.cwd(), "posts", "test.mdx")
    const mdxContent = fs.readFileSync(mdxFilePath, "utf-8")

    const { content, frontmatter } = await compileMDX<ContentsProps>({
        source: mdxContent,
        options: { parseFrontmatter: true },
        components: {
            h1: (props) => <H1 {...props} />,
            h2: (props) => <H2 {...props} />,
            p: (props) => <P {...props} />,
        },
    })

    //url make
    const slug = frontmatter.title.toLowerCase().replace(/\s+/g, "-")
    const postUrl = `/shallow/${slug}`

    return (
        <>
            <h1>{frontmatter.title}</h1>
            <h1>{frontmatter.date}</h1>
            <Link href={postUrl}>{frontmatter.title}</Link>
            {content}
        </>
    )
}
