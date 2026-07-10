"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostListDrawer from "@/components/PostListDrawer/PostListDrawer";
import HoverHeader from "@/components/ui/hover-header/HoverHeader";
import { MDXContent } from "@/components/mdx/mdx-content/MDXContent";
import { useHoverHeader } from "@/hooks/useHoverHeader";
import { PostData, PostFrontmatter } from "@/interface/PostData";
import { extractEditorData } from "@/app/(pages)/newpage/lib/exportMdx";
import { mdxToBlocks } from "@/app/(pages)/newpage/lib/mdxToBlocks";
import { saveDoc, setActivePointer } from "@/app/(pages)/newpage/lib/localDocs";

interface MDXContentProps {
    postsData: PostData[];
    content: React.ReactNode;
    frontmatter: PostFrontmatter;
    slug: string;
}

export default function PostLayout({ postsData, content, frontmatter, slug }: MDXContentProps) {
    const [collapsed, setCollapsed] = useState(false);
    const showHeader = useHoverHeader();
    const router = useRouter();

    // 기존 게시물 수정: 원문 mdx에서 에디터 데이터를 꺼내 로컬 문서로 만들고 에디터로 이동
    const editPost = async () => {
        try {
            const res = await fetch("/api/read-mdx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug }),
            });
            if (!res.ok) {
                alert("원문을 불러오지 못했습니다. (수정은 개발 모드에서만 가능)");
                return;
            }
            const { content: raw } = await res.json();
            // 에디터로 만든 글이면 무손실 복원, 아니면 본문을 블록으로 파싱(폴백)
            const data = extractEditorData(raw) ?? mdxToBlocks(raw);
            const id = crypto.randomUUID();
            saveDoc({
                id,
                sourceSlug: slug,
                title: data.title || frontmatter.title || "",
                icon: data.icon,
                label: data.label,
                subTitle: data.subTitle,
                tags: data.tags,
                imageUrl: data.imageUrl,
                blocks: data.blocks,
                blockColors: data.blockColors || {},
                blockFormattedRanges: data.blockFormattedRanges || {},
                updatedAt: Date.now(),
            });
            setActivePointer(id);
            router.push("/newpage");
        } catch {
            alert("수정 진입 중 오류가 발생했습니다.");
        }
    };

    return (
        <div
            id="main-bg-container"
            data-theme="light"
            className="w-full h-full flex flex-col bg-(--page-bg) relative"
            style={{
                paddingLeft: collapsed ? 50 : 350,
                transition: "padding-left 0.2s",
            }}
        >
            <HoverHeader visible={showHeader} collapsed={collapsed} onEdit={editPost} />
            <PostListDrawer posts={postsData} collapsed={collapsed} setCollapsed={setCollapsed} />
            <MDXContent content={content} frontmatter={frontmatter} collapsed={collapsed} />
        </div>
    );
}
