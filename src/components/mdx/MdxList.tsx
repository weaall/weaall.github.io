import { compileMDX } from "next-mdx-remote/rsc"
import fs from "fs"
import path from "path"
import { H1, H2, P } from "@/components/mdx/components"
import Link from "next/link"

interface ContentsProps {
    title: string
    date: string
}

export default async function getStaticProps() {
    const postsDirectory = path.join(process.cwd(), "posts")
    const mdxFiles = fs.readdirSync(postsDirectory)

    const postsData = await Promise.all(
        mdxFiles.map(async (filename) => {
            const filePath = path.join(postsDirectory, filename)
            const mdxContent = fs.readFileSync(filePath, "utf-8")

            const { frontmatter } = await compileMDX<ContentsProps>({
                source: mdxContent,
                options: { parseFrontmatter: true },
            })

            //url make
            const slug = frontmatter.title.toLowerCase().replace(/\s+/g, "-")
            const postUrl = `/shallow/${slug}`

            return {
                title: frontmatter.title,
                date: frontmatter.date,
                slug: slug,
                postUrl: postUrl,
            }
        }),
    )

    return (
        <div>
            {postsData.map((post) => (
                <Link href={post.postUrl} key={post.slug} className="text-center text-t-main">
                    <div>
                        <h1>{post.title}</h1>
                        <h1>{post.date}</h1>
                    </div>
                </Link>
            ))}
        </div>
    )
}
