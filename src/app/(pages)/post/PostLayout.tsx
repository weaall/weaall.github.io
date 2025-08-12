"use client";
import { useState } from "react";
import PostListDrawer from "@/components/PostListDrawer/PostListDrawer";
import MdxPostList from "@/components/mdx/mdx-postlist/MdxPostList";

interface PostData {
    label: string;
    title: string;
    subTitle: string;
    date: string;
    tags: [];
    slug: string;
    postUrl: string;
}

export default function PostLayout({ postsData }: { postsData: PostData[] }) {
    const [collapsed, setCollapsed] = useState(false);
    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="w-full h-full flex flex-col bg-darkbg">
            <PostListDrawer props={postsData} collapsed={collapsed} setCollapsed={setCollapsed} />
            <MdxPostList latestPosts={sortedPostsData} collapsed={collapsed} />
        </div>
    );
}
