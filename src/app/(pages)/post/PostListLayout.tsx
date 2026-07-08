"use client";

import { useState } from "react";
import PostListDrawer from "@/components/PostListDrawer/PostListDrawer";
import MdxPostList from "@/components/mdx/mdx-postlist/MdxPostList";
import HoverHeader from "@/components/ui/hover-header/HoverHeader";
import { useHoverHeader } from "@/hooks/useHoverHeader";
import { PostData } from "@/interface/PostData";

export default function PostListLayout({ postsData }: { postsData: PostData[] }) {
    const [collapsed, setCollapsed] = useState(false);
    const showHeader = useHoverHeader();

    return (
        <div id="main-bg-container" data-theme="light" className="w-full h-full flex flex-col bg-(--page-bg) relative">
            <HoverHeader visible={showHeader} collapsed={collapsed}/>
            <PostListDrawer posts={postsData} collapsed={collapsed} setCollapsed={setCollapsed} />
            <MdxPostList latestPosts={postsData} collapsed={collapsed} />
        </div>
    );
}