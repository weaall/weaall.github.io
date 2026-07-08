import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { readFile, access, readdir } from "fs/promises";
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
    H4,
    P,
    Span,
} from "@/components/mdx/mdx-components/components";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import remarkGfm from "remark-gfm";
import PostLayout from "./PostLayout";
import getPostsData from "@/components/mdx/getMdx";
import { PostFrontmatter } from "@/interface/PostData";

const POSTS_FOLDER = path.join(process.cwd(), "posts/post")

export const generateStaticParams = async () => {
    try {
        const files = await readdir(POSTS_FOLDER);
        const posts = files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""));
        
        return posts.map((post) => ({
            slug: post,
        }));
    } catch (error) {
        console.error("Error reading posts folder:", error);
        return [];
    }
};

async function readPostFile(slug: string) {
    const filePath = path.resolve(path.join(POSTS_FOLDER, `${slug}.mdx`));

    try {
        await access(filePath);
        return await readFile(filePath, { encoding: "utf8" });
    } catch (err) {
        return null;
    }
}

async function compilePostMarkdown(slug: string) {
    const markdown = await readPostFile(slug);

    if (!markdown) {
        notFound();
    }

    return compileMDX<PostFrontmatter>({
        source: markdown,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
            },
        },
        components: {
            h1: H1,
            h2: H2,
            h3: H3,
            h4: H4,
            a: A,
            p: P,
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
            span: Span,
        },
    });
}
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { content, frontmatter } = await compilePostMarkdown(slug)

    if (!content) notFound()

    const postsData = await getPostsData("post");

    return (
        <PostLayout postsData={postsData} content={content} frontmatter={frontmatter} />
    )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { frontmatter } = await compilePostMarkdown(slug);

    const metadata: Metadata = {
        title: frontmatter.title,
        description: frontmatter.subTitle,
    };

    return metadata;
}