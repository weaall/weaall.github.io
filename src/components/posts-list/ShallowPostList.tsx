"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as tw from "./PostList.styles";
import { DocIcon, RightIcon } from "./SvgDrawer";

interface PostData {
    label: string;
    title: string;
    subTitle: string;
    date: string;
    tags: [];
    slug: string;
    postUrl: string;
}

interface PostsProps {
    props: PostData[];
}

export default function ShallowPostList({ props }: PostsProps) {
    const pathname = usePathname();
    const activeCategory = props.find((post) => post.postUrl === pathname)?.label || null;
    const [openCategory, setOpenCategory] = useState<string | null>(activeCategory);
    const isFirstRender = useRef(true);
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

    useEffect(() => {
        if (isFirstRender.current) {
            setOpenCategory(activeCategory);
            isFirstRender.current = false;
        }
    }, [activeCategory]);

    const grouped = props.reduce((acc, post) => {
        (acc[post.label] = acc[post.label] || []).push(post);
        return acc;
    }, {} as Record<string, PostData[]>);

    return (
        <tw.Container>
            <tw.SideContainer>
                {Object.entries(grouped).map(([category, posts]) => (
                    <div key={category}>
                        <tw.CategoryButton style={{ minHeight: 32 }} onClick={() => setOpenCategory(openCategory === category ? null : category)}>
                            <span>{category}</span>
                            <tw.CategoryArrow className={openCategory === category ? "rotate-90" : ""}>▶</tw.CategoryArrow>
                        </tw.CategoryButton>
                        {openCategory === category && (
                            <tw.CategoryList>
                                {posts.map((post) => {
                                    const isActive = pathname === post.postUrl;
                                    const isHover = hoveredSlug === post.slug;
                                    return (
                                        <tw.CategoryItem
                                            key={post.slug}
                                            onMouseEnter={() => setHoveredSlug(post.slug)}
                                            onMouseLeave={() => setHoveredSlug(null)}
                                        >
                                            <tw.PostLink href={post.postUrl} $active={isActive}>
                                                <tw.SvgWrap>{isHover ? <RightIcon color="currentColor" /> : <DocIcon color="currentColor" />}</tw.SvgWrap>
                                                <tw.Label>{post.title}</tw.Label>
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
