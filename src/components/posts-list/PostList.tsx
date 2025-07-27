"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as tw from "./PostList.styles";
import { DocIcon, DotListIcon, PlusIcon, RightIcon } from "./SvgDrawer";

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

export default function PostList({ props }: PostsProps) {
    const pathname = usePathname();
    const activeCategory = props.find((post) => post.postUrl === pathname)?.label || null;
    const [openCategory, setOpenCategory] = useState<string[]>(() => {
        if (typeof window !== "undefined") {
            const saved = window.localStorage.getItem("sidebarOpenCategory");
            if (saved) return JSON.parse(saved);
        }
        return activeCategory ? [activeCategory] : [];
    });
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (activeCategory && !openCategory.includes(activeCategory)) {
            setOpenCategory((prev) => [...prev, activeCategory]);
        }
    }, [pathname, activeCategory]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("sidebarOpenCategory", JSON.stringify(openCategory));
        }
    }, [openCategory]);

    const grouped = props.reduce((acc, post) => {
        (acc[post.label] = acc[post.label] || []).push(post);
        return acc;
    }, {} as Record<string, PostData[]>);

    const handleCategoryClick = (category: string) => {
        setOpenCategory((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    return (
        <tw.Container>
            <tw.SideContainer style={{ width: collapsed ? 56 : 240, minWidth: collapsed ? 56 : 240, transition: 'all 0.2s' }}>
                <div className="flex items-center justify-end mb-2" style={{ height: 32 }}>
                    <button
                        type="button"
                        aria-label={collapsed ? "사이드바 확장" : "사이드바 축소"}
                        onClick={() => setCollapsed((prev) => !prev)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                    >
                        {collapsed ? <RightIcon color="currentColor" width="20" height="20" /> : <DotListIcon color="currentColor" width="20" height="20" />}
                    </button>
                </div>
                {!collapsed && Object.entries(grouped).map(([category, posts]) => (
                    <div key={category}>
                        <tw.CategoryButton style={{ minHeight: 32 }} onClick={() => handleCategoryClick(category)}>
                            <span>{category}</span>
                        </tw.CategoryButton>
                        {openCategory.includes(category) && (
                            <tw.CategoryList>
                                {posts.map((post) => {
                                    const isActive = pathname === post.postUrl;
                                    const isHover = hoveredSlug === post.slug;
                                    return (
                                        <tw.CategoryItem
                                            key={post.slug}
                                            className="group"
                                            onMouseEnter={() => setHoveredSlug(post.slug)}
                                            onMouseLeave={() => setHoveredSlug(null)}
                                        >
                                            <tw.PostLink href={post.postUrl} $active={isActive}>
                                                <tw.SvgWrap>
                                                    {isHover ? (
                                                        <RightIcon color="currentColor" />
                                                    ) : (
                                                        <DocIcon color="currentColor" />
                                                    )}
                                                </tw.SvgWrap>
                                                <tw.LabelWrap>
                                                    <tw.Label>{post.title}</tw.Label>
                                                    {isHover && (
                                                        <tw.LabelIcons>
                                                            <tw.LabelIconBtn type="button" aria-label="">
                                                                <DotListIcon color="currentColor" width="16" height="16" />
                                                            </tw.LabelIconBtn>
                                                            <tw.LabelIconBtn type="button" aria-label="">
                                                                <PlusIcon color="currentColor" width="16" height="16" />
                                                            </tw.LabelIconBtn>
                                                        </tw.LabelIcons>
                                                    )}
                                                </tw.LabelWrap>
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
