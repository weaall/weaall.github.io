import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { readFile, access, readdir } from "fs/promises";
import { Hr, H1, H2, Code, Strong, Pre, H3, H4, A, Li, Em, Img, Table, Thead, Tbody, Tr, Th, Td } from "@/components/weaall-ui/wui-mdx-components/WuiComponents"
import { notFound } from "next/navigation";
import { Metadata } from "next";
import remarkGfm from "remark-gfm";
import * as tw from "./page.styles";
import WuiHeader from "@/components/weaall-ui/wui-header/WuiHeader";
import WuiMdxList from "@/components/weaall-ui/wui-mdx-list/WuiMdxList";
import { WuiMdxContent } from "@/components/weaall-ui/wui-mdx-content/WuiMdxContent";
import WuiGetMdx from "@/components/weaall-ui/wui-getmdx/WuiGetMdx";

import { Button, CalendarPicker } from "weaall-ui";

interface PostData {
    label: string;
    title: string;
    subTitle: string;
    index: number;
}

const POSTS_FOLDER = path.join(process.cwd(), "posts/weaall-ui");

export const generateStaticParams = async () => {
    const files = await readdir(POSTS_FOLDER);
    const posts = files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""));

    return posts.map((post) => ({
        slug: post,
    }));
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
        options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } },
        components: {
            h1: H1,
            h2: H2,
            h3: H3,
            h4: H4,
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
            Button, CalendarPicker
        },
    });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const { content } = await compilePostMarkdown(params.slug);
    const postsData = await WuiGetMdx("weaall-ui");

    return (
        <>
            <WuiHeader />
            <tw.Container>
                <WuiMdxList props={postsData} />
                <tw.ContentsWrap> <WuiMdxContent content={content} /></tw.ContentsWrap>
            </tw.Container>
        </>
    );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { frontmatter } = await compilePostMarkdown(params.slug);

    const metadata: Metadata = {
        title: frontmatter.title,
        description: frontmatter.subTitle,
    };

    return metadata;
}
