"use client";

import { usePathname } from "next/navigation";
import * as tw from "./PostListDrawer.styles";
import { DocIcon, DotListIcon, HomeIcon, PlusIcon, PostIcon, ReduceIcon, RightIcon, SearchIcon } from "./SvgDrawer";
import { useEffect, useState } from "react";
import { AddDockIcon } from "../ui/hover-header/svg/PostsSvg";

interface PostData {
    label: string;
    title: string;
    subTitle: string;
    date: string;
    tags: string[];
    slug: string;
    postUrl: string;
}

interface PostsProps {
    props: PostData[];
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}

export default function PostListDrawer({ props, collapsed, setCollapsed }: PostsProps) {
    const pathname = usePathname();
    const activeCategory = props.find((post) => post.postUrl === pathname)?.label || null;

    // openCategory 상태를 localStorage에 저장/불러오기
    const [openCategory, setOpenCategory] = useState<string[]>(() => {
        if (typeof window !== "undefined") {
            const saved = window.localStorage.getItem("sidebarOpenCategory");
            if (saved) return JSON.parse(saved);
        }
        return activeCategory ? [activeCategory] : [];
    });
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

    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

    // 카테고리별 그룹핑
    const grouped = props.reduce((acc, post) => {
        (acc[post.label] = acc[post.label] || []).push(post);
        return acc;
    }, {} as Record<string, PostData[]>);

    // 카테고리 정렬: 각 카테고리 내 최신 포스트 날짜 기준 내림차순
    const sortedCategories = Object.entries(grouped).sort(([, postsA], [, postsB]) => {
        const latestA = postsA.reduce((max, p) => (new Date(p.date) > new Date(max.date) ? p : max), postsA[0]);
        const latestB = postsB.reduce((max, p) => (new Date(p.date) > new Date(max.date) ? p : max), postsB[0]);
        return new Date(latestB.date).getTime() - new Date(latestA.date).getTime();
    });

    const handleCategoryClick = (category: string) => {
        setOpenCategory((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
    };

    return (
        <tw.Container>
            <tw.SideContainer
                style={{
                    width: collapsed ? 50 : 260,
                    minWidth: collapsed ? 50 : 260,
                    transition: "all 0.2s",
                }}
            >
                <tw.Fixedwrap>
                    <div className="flex items-center justify-end tracking-tight">
                        <tw.IconBtn onClick={() => setCollapsed(!collapsed)}>
                            {collapsed ? <RightIcon color="currentColor" width="20" height="20" /> : <ReduceIcon color="currentColor" width="20" height="20" />}
                        </tw.IconBtn>
                    </div>
                    <tw.PostLink href="/" $active={pathname === "/"}>
                        <tw.SvgWrap>
                            <HomeIcon color="currentColor" width="20" height="20" />
                        </tw.SvgWrap>
                        <tw.LabelWrap>
                            <tw.Label>홈</tw.Label>
                        </tw.LabelWrap>
                    </tw.PostLink>
                    <tw.PostLink href="/post">
                        <tw.SvgWrap>
                            <PostIcon color="currentColor" width="20" height="20" />
                        </tw.SvgWrap>
                        <tw.LabelWrap>
                            <tw.Label>게시물</tw.Label>
                        </tw.LabelWrap>
                    </tw.PostLink>
                    <tw.PostLink href="/search" $active={pathname === "/search"}>
                        <tw.SvgWrap>
                            <SearchIcon color="currentColor" width="20" height="20" />
                        </tw.SvgWrap>
                        <tw.LabelWrap>
                            <tw.Label>검색</tw.Label>
                        </tw.LabelWrap>
                    </tw.PostLink>
                    <tw.PostLink href="/newpage" $active={pathname === "/newpage"}>
                        <tw.SvgWrap>
                            <AddDockIcon color="currentColor" width="20" height="20" />
                        </tw.SvgWrap>
                        <tw.LabelWrap>
                            <tw.Label>새 페이지 추가</tw.Label>
                        </tw.LabelWrap>
                    </tw.PostLink>
                </tw.Fixedwrap>
                {!collapsed &&
                    sortedCategories.map(([category, posts]) => (
                        <div key={category}>
                            <tw.CategoryButton onClick={() => handleCategoryClick(category)}>
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
                                                    <tw.SvgWrap>{isHover ? <RightIcon color="currentColor" /> : <DocIcon color="currentColor" />}</tw.SvgWrap>
                                                    <tw.LabelWrap>
                                                        <tw.Label>{post.title}</tw.Label>
                                                        {isHover && (
                                                            <tw.LabelIcons>
                                                                <tw.LabelIconBtn type="button" aria-label="옵션">
                                                                    <DotListIcon color="currentColor" width="16" height="16" />
                                                                </tw.LabelIconBtn>
                                                                <tw.LabelIconBtn type="button" aria-label="추가">
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
