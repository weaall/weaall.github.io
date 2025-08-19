"use client";

import { useState, useEffect, useRef } from "react";
import PostListDrawer from "@/components/PostListDrawer/PostListDrawer";
import MdxPostList from "@/components/mdx/mdx-postlist/MdxPostList";
import HoverHeader from "@/components/ui/hover-header/HoverHeader";

interface PostData {
    label: string;
    title: string;
    subTitle: string;
    date: string;
    tags: [];
    slug: string;
    postUrl: string;
    imageUrl: string;
}

export default function PostListLayout({ postsData }: { postsData: PostData[] }) {
    const [collapsed, setCollapsed] = useState(false);
    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // HoverHeader 표시 상태 관리
    const [showHeader, setShowHeader] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 마우스 움직임 감지 핸들러
    useEffect(() => {
        const handleMouseMove = () => {
            setShowHeader(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setShowHeader(false), 1000);
        };
        const container = document.getElementById("main-bg-container");
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
        }
        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
            }
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div id="main-bg-container" className="w-full h-full flex flex-col bg-darkbg relative">
            <HoverHeader visible={showHeader} collapsed={collapsed}/>
            <PostListDrawer props={postsData} collapsed={collapsed} setCollapsed={setCollapsed} />
            <MdxPostList latestPosts={sortedPostsData} collapsed={collapsed} />
        </div>
    );
}