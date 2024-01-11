import React from "react"
import { GetStaticPropsContext, InferGetStaticPropsType } from "next"
import Head from "next/head"
import path from "path"
import fs from "fs"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote } from "next-mdx-remote"
import { H1, H2, P } from "@/components/mdx/components"
import { Layout } from "@/components/layout/Layout"
import "@/app/globals.css"

export default function PostPage({ source }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <Layout>
            <Head>
                <title>{source.frontmatter.title as string}</title>
            </Head>
            <MDXRemote
                {...source}
                components={{
                    h1: H1,
                    h2: H2,
                    p: P,
                }}
            />
        </Layout>
    )
}
export async function getStaticPaths() {
    return { paths: [], fallback: "blocking" }
}

export async function getStaticProps(
    ctx: GetStaticPropsContext<{
        slug: string
    }>,
) {
    const { slug } = ctx.params!
    const mdxFilePath = path.join(process.cwd(), "posts", `${slug}.mdx`)
    const postFile = fs.readFileSync(mdxFilePath, "utf-8")

    const mdxSource = await serialize(postFile, { parseFrontmatter: true })
    return {
        props: {
            source: mdxSource,
        },
        revalidate: 60,
    }
}
