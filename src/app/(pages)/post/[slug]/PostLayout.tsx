"use client";

import { useState } from "react";
import PostListDrawer from "@/components/PostListDrawer/PostListDrawer";
import HoverHeader from "@/components/ui/hover-header/HoverHeader";
import { MDXContent } from "@/components/mdx/mdx-content/MDXContent";
import { useHoverHeader } from "@/hooks/useHoverHeader";
import { PostData, PostFrontmatter } from "@/interface/PostData";

interface MDXContentProps {
    postsData: PostData[];
    content: React.ReactNode;
    frontmatter: PostFrontmatter;
}

export default function PostLayout({ postsData, content, frontmatter }: MDXContentProps) {
    const [collapsed, setCollapsed] = useState(false);
    const showHeader = useHoverHeader();

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
            <HoverHeader visible={showHeader} collapsed={collapsed} />
            <PostListDrawer posts={postsData} collapsed={collapsed} setCollapsed={setCollapsed} />
            <MDXContent content={content} frontmatter={frontmatter} collapsed={collapsed} />
        </div>
    );
}
