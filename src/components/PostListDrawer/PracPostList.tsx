"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as tw from "./PostListDrawer.styles";
import { PostData } from "@/interface/PostData";

interface PostsProps {
    posts: PostData[];
}

export default function PracPostList({ posts }: PostsProps) {
    const pathname = usePathname();
    const activeCategory = posts.find((post) => post.postUrl === pathname)?.label || null;
    const [openCategory, setOpenCategory] = useState<string | null>(activeCategory);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            setOpenCategory(activeCategory);
            isFirstRender.current = false;
        }
    }, [activeCategory]);

    const grouped = posts.reduce((acc, post) => {
        (acc[post.label] = acc[post.label] || []).push(post);
        return acc;
    }, {} as Record<string, PostData[]>);

    return (
        <tw.Container>
            <tw.SideContainer>
                {Object.entries(grouped).map(([category, posts]) => (
                    <div key={category}>
                        <tw.CategoryButton
                            style={{ minHeight: 32 }}
                            onClick={() => setOpenCategory(openCategory === category ? null : category)}
                        >
                            <span>{category}</span>
                            {/* <tw.CategoryArrow className={openCategory === category ? "rotate-90" : ""}>▶</tw.CategoryArrow> */}
                        </tw.CategoryButton>
                        {openCategory === category && (
                            <tw.CategoryList>
                                {posts.map((post) => {
                                    const isActive = pathname === post.postUrl;
                                    return (
                                        <tw.CategoryItem key={post.slug}>
                                            <tw.PostLink href={post.postUrl} $active={isActive}>
                                                {post.title}
                                            </tw.PostLink>
                                        </tw.CategoryItem>
                                    );
                                })}
                            </tw.CategoryList>
                        )}
                    </div>
                ))}
            </tw.SideContainer>
        </tw.Container>
    );
}
