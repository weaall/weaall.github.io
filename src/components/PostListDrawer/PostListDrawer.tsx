"use client";

import { usePathname, useRouter } from "next/navigation";
import * as tw from "./PostListDrawer.styles";
import { DocIcon, DotListIcon, HomeIcon, PlusIcon, PostIcon, ReduceIcon, RightIcon, SearchIcon } from "./SvgDrawer";
import { useEffect, useRef, useState } from "react";
import { AddDockIcon } from "../ui/icons/PostsSvg";
import { PostData } from "@/interface/PostData";
import { LocalDocMeta, listDocs, deleteDoc, getDoc, getActivePointer, setActivePointer, subscribeDocsChanged } from "@/app/(pages)/newpage/lib/localDocs";
import { exportDoc } from "@/app/(pages)/newpage/lib/exportMdx";
import { PageIcon } from "@/app/(pages)/newpage/lib/pageIcon";

interface PostsProps {
    posts: PostData[];
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}

export default function PostListDrawer({ posts, collapsed, setCollapsed }: PostsProps) {
    const pathname = usePathname();
    const router = useRouter();

    // 로컬 저장 문서는 드로어가 직접 localStorage에서 읽어 어느 페이지에서든 표시한다.
    const [localDocs, setLocalDocs] = useState<LocalDocMeta[]>([]);
    const [activeDocId, setActiveDocId] = useState<string | null>(null);

    // 문서 옵션(⋯) 팝오버
    const [docMenuId, setDocMenuId] = useState<string | null>(null);
    const [docMenuPos, setDocMenuPos] = useState<{ top: number; left: number } | null>(null);
    const closeDocMenu = () => {
        setDocMenuId(null);
        setDocMenuPos(null);
    };
    const openDocMenu = (e: React.MouseEvent<HTMLElement>, id: string) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const menuWidth = 160;
        const left = Math.min(rect.right + 6, window.innerWidth - menuWidth - 12);
        setDocMenuId(id);
        setDocMenuPos({ top: rect.top, left });
    };

    useEffect(() => {
        const refresh = () => {
            setLocalDocs(listDocs());
            setActiveDocId(getActivePointer());
        };
        refresh();
        return subscribeDocsChanged(refresh);
    }, []);

    // 문서 선택: 활성 포인터를 바꾸고 /newpage로 이동(이미 있으면 이벤트로 전환)
    const openDoc = (id: string) => {
        setActivePointer(id);
        if (pathname !== "/newpage") router.push("/newpage");
    };
    const newDoc = () => {
        setActivePointer(crypto.randomUUID());
        if (pathname !== "/newpage") router.push("/newpage");
    };
    const removeDoc = (id: string) => {
        deleteDoc(id);
        // 지운 게 현재 활성 문서면 최근 문서로 포인터 이동
        if (id === getActivePointer()) {
            const next = listDocs()[0]?.id;
            if (next) setActivePointer(next);
        }
    };
    const activeCategory = posts.find((post) => post.postUrl === pathname)?.label || null;

    // 초기값은 서버 렌더와 동일해야 한다. localStorage는 클라이언트에서만 접근 가능하므로
    // 초기 상태에서 읽으면 서버/클라이언트 HTML이 달라져 하이드레이션 불일치가 난다.
    // → 초기값은 SSR-safe 하게 두고, localStorage 복원은 마운트 후 useEffect에서 처리한다.
    const [openCategory, setOpenCategory] = useState<string[]>(activeCategory ? [activeCategory] : []);
    const hydratedRef = useRef(false);

    // 마운트 후 localStorage에서 복원
    useEffect(() => {
        const saved = window.localStorage.getItem("sidebarOpenCategory");
        if (saved) {
            try {
                setOpenCategory(JSON.parse(saved));
            } catch {
                /* 손상된 값은 무시 */
            }
        }
    }, []);

    useEffect(() => {
        if (activeCategory && !openCategory.includes(activeCategory)) {
            setOpenCategory((prev) => [...prev, activeCategory]);
        }
    }, [pathname, activeCategory]);

    // 최초 마운트(복원 이전)에는 저장하지 않아 localStorage 값이 초기값으로 덮이는 것을 방지
    useEffect(() => {
        if (!hydratedRef.current) {
            hydratedRef.current = true;
            return;
        }
        window.localStorage.setItem("sidebarOpenCategory", JSON.stringify(openCategory));
    }, [openCategory]);

    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
    const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);

    // 카테고리별 그룹핑
    const grouped = posts.reduce((acc, post) => {
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

                {/* 로컬 저장 문서 (에디터 초안) — 어느 페이지에서든 표시 */}
                {!collapsed && (
                    <div>
                        <tw.CategoryButton onClick={newDoc} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>로컬 저장</span>
                            <span title="새 문서" className="flex items-center opacity-60 hover:opacity-100">
                                <PlusIcon color="currentColor" width="16" height="16" />
                            </span>
                        </tw.CategoryButton>
                        {localDocs.length === 0 ? (
                            <div className="px-2 py-1 text-xs text-(--text-faint)">저장된 문서 없음</div>
                        ) : (
                            <tw.CategoryList>
                                {localDocs.map((doc) => {
                                    const isActive = doc.id === activeDocId && pathname === "/newpage";
                                    const isHover = hoveredDocId === doc.id || docMenuId === doc.id;
                                    return (
                                        <tw.CategoryItem
                                            key={doc.id}
                                            className="group"
                                            onMouseEnter={() => setHoveredDocId(doc.id)}
                                            onMouseLeave={() => setHoveredDocId(null)}
                                        >
                                            <tw.DocRow $active={isActive} onClick={() => openDoc(doc.id)}>
                                                <tw.SvgWrap>
                                                    {doc.icon ? (
                                                        <PageIcon icon={doc.icon} size={18} />
                                                    ) : isHover ? (
                                                        <RightIcon color="currentColor" />
                                                    ) : (
                                                        <DocIcon color="currentColor" />
                                                    )}
                                                </tw.SvgWrap>
                                                <tw.LabelWrap>
                                                    <tw.Label>{doc.title || "제목 없음"}</tw.Label>
                                                    {isHover && (
                                                        <tw.LabelIcons>
                                                            <tw.LabelIconBtn
                                                                type="button"
                                                                aria-label="옵션"
                                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => openDocMenu(e, doc.id)}
                                                            >
                                                                <DotListIcon color="currentColor" width="16" height="16" />
                                                            </tw.LabelIconBtn>
                                                        </tw.LabelIcons>
                                                    )}
                                                </tw.LabelWrap>
                                            </tw.DocRow>
                                        </tw.CategoryItem>
                                    );
                                })}
                            </tw.CategoryList>
                        )}
                    </div>
                )}

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
                                                    <tw.SvgWrap>
                                                        {post.icon ? (
                                                            <PageIcon icon={post.icon} size={18} />
                                                        ) : isHover ? (
                                                            <RightIcon color="currentColor" />
                                                        ) : (
                                                            <DocIcon color="currentColor" />
                                                        )}
                                                    </tw.SvgWrap>
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

            {docMenuId && docMenuPos && (
                <>
                    <div className="fixed inset-0 z-[1000]" onClick={closeDocMenu} />
                    <div
                        className="fixed z-[1001] min-w-[160px] animate-popIn rounded-lg border border-(--border) bg-(--menu-bg) py-1 shadow-xl"
                        style={{ top: docMenuPos.top, left: docMenuPos.left, transformOrigin: "top left" }}
                    >
                        <button
                            className="flex w-full items-center px-3 py-1.5 text-sm text-(--text) hover:bg-(--hover-bg)"
                            onClick={() => {
                                const d = getDoc(docMenuId!);
                                if (d) exportDoc(d);
                                closeDocMenu();
                            }}
                        >
                            내보내기
                        </button>
                        <button
                            className="flex w-full items-center px-3 py-1.5 text-sm text-[#e65b58] hover:bg-(--hover-bg)"
                            onClick={() => {
                                removeDoc(docMenuId!);
                                closeDocMenu();
                            }}
                        >
                            삭제
                        </button>
                    </div>
                </>
            )}
        </tw.Container>
    );
}
