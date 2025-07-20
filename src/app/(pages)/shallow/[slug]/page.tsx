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
} from "@/components/mdx/mdx-components/components";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import remarkGfm from "remark-gfm";
import { MDXContent } from "@/components/mdx/mdx-content/MDXContent";
import ShallowPostList from '@/components/posts-list/ShallowPostList';

interface PostData {
    imageUrl: string;
    label: string;
    title: string;
    subTitle: string;
    date: string;
    tags: [];
    mins: string;
    slug: string;
    postUrl: string;
}

const POSTS_FOLDER = path.join(process.cwd(), "posts/shallow")

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

    return compileMDX<PostData>({
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
    });
}
export default async function PostPage({ params }: { params: { slug: string } }) {
    const { content, frontmatter } = await compilePostMarkdown(params.slug)

    if (!content) notFound()

    // shallow 폴더의 모든 mdx 파일을 읽어서 PostList에 넘길 데이터 생성
    const files = await readdir(POSTS_FOLDER);
    const posts = await Promise.all(
        files.filter((file) => file.endsWith('.mdx')).map(async (file) => {
            const slug = file.replace(/\.mdx$/, "");
            const markdown = await readPostFile(slug);
            if (!markdown) return null;
            const { frontmatter } = await compileMDX<PostData>({
                source: markdown,
                options: { parseFrontmatter: true },
            });
            return {
                ...frontmatter,
                slug,
                postUrl: `/shallow/${slug}`,
            };
        })
    );
    const postList = posts.filter(Boolean) as PostData[];

    return (
        <div style={{ display: 'flex' }}>
            <ShallowPostList props={postList} />
            <div style={{ flex: 1, marginLeft: 320 }}>
                <MDXContent content={content} frontmatter={frontmatter} />
            </div>
        </div>
    )
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { frontmatter } = await compilePostMarkdown(params.slug);

    const metadata: Metadata = {
        title: frontmatter.title,
        description: frontmatter.subTitle,
    };

    return metadata;
}