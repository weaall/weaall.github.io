"use client";
import { usePathname } from "next/navigation";
import { roboto } from "@/utils/font";
import * as tw from "./PostListDrawer.styles";
import { DocIcon, DotListIcon, HomeIcon, ListIcon, PlusIcon, PostIcon, ReduceIcon, RightIcon, SearchIcon } from "./SvgDrawer";
import { useEffect, useRef, useState } from "react";
import { AddDockIcon } from "../ui/icons/CommonSvg";
import { PostData } from "@/types/PostData";
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

    // 모바일 드로어 열림 상태 (데스크톱에서는 사용하지 않음)
    const [mobileOpen, setMobileOpen] = useState(false);
    // 경로가 바뀌면(메뉴에서 이동하면) 드로어를 닫는다.
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

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
        if (pathname !== "/newpage") window.location.href = "/newpage";
    };
    const newDoc = () => {
        setActivePointer(crypto.randomUUID());
        if (pathname !== "/newpage") window.location.href = "/newpage";
    };
    const removeDoc = (id: string) => {
        deleteDoc(id);
        // 지운 게 현재 활성 문서면 최근 문서로, 남은 게 없으면 새 빈 문서로 포인터 이동
        if (id === getActivePointer()) {
            const next = listDocs()[0]?.id ?? crypto.randomUUID();
            setActivePointer(next);
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
        <>
            {/* 모바일 전용 상단 앱바 */}
            <header className="hidden m:flex fixed top-0 left-0 z-30 w-full h-14 items-center px-3 bg-(--panel-bg)/80 backdrop-blur-md border-b border-(--border)">
                <button
                    type="button"
                    aria-label="메뉴 열기"
                    onClick={() => setMobileOpen(true)}
                    className="p-2 -ml-1 rounded-lg text-(--text-strong) hover:bg-(--hover-bg) active:scale-90 transition"
                >
                    <div className="w-[22px] h-[22px]">
                        <ListIcon color="currentColor" width="22" height="22" />
                    </div>
                </button>

                <a href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    <img src="/assets/weaall-ui.png" alt="WeHub" className="h-6 w-6 object-contain" />
                    <span className={`${roboto.className} text-[1.05rem] font-semibold tracking-tight text-(--text-strong)`}>
                        WeHub
                    </span>
                </a>
            </header>

            {/* 모바일 드로어 백드롭 */}
            {mobileOpen && (
                <div
                    className="hidden m:block fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] animate-fadeIn"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <tw.Container>
            <tw.SideContainer
                className={`m:w-[260px]! m:min-w-[260px]! m:z-50 m:shadow-2xl m:transition-transform m:duration-300 m:ease-out ${mobileOpen ? "m:translate-x-0" : "m:-translate-x-full"}`}
                style={{
                    width: collapsed ? 50 : 260,
                    minWidth: collapsed ? 50 : 260,
                    transition: "all 0.2s",
                }}
            >
                <tw.Fixedwrap>
                    <div className="flex items-center justify-between tracking-tight">
                        {/* 모바일: 닫기 버튼 / 데스크톱: 접기 버튼 */}
                        <button
                            type="button"
                            aria-label="메뉴 닫기"
                            onClick={() => setMobileOpen(false)}
                            className="hidden m:flex p-5px items-center justify-center rounded-md hover:bg-(--hover-bg) text-(--text-faint)"
                        >
                            <div className="w-5 h-5 rotate-45">
                                <PlusIcon color="currentColor" width="20" height="20" />
                            </div>
                        </button>
                        <tw.IconBtn className="m:hidden" onClick={() => setCollapsed(!collapsed)}>
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
                    <tw.PostLink
                        href="/newpage"
                        $active={pathname === "/newpage"}
                        className="m:hidden"
                        onClick={(e: React.MouseEvent) => {
                            // 항상 새 빈 문서로 시작 (마지막 초안 복원 방지)
                            e.preventDefault();
                            newDoc();
                        }}
                    >
                        <tw.SvgWrap>
                            <AddDockIcon color="currentColor" width="20" height="20" />
                        </tw.SvgWrap>
                        <tw.LabelWrap>
                            <tw.Label>새 페이지 추가</tw.Label>
                        </tw.LabelWrap>
                    </tw.PostLink>
                </tw.Fixedwrap>

                {/* 로컬 저장 문서 (에디터 초안) — 데스크탑에서만(모바일은 편집 비활성) */}
                {!collapsed && (
                    <div className="m:hidden">
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
        </>
    );
}
