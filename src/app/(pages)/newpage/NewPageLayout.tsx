"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PostListDrawer from "@/components/PostListDrawer/PostListDrawer";
import HoverHeader from "@/components/ui/hover-header/HoverHeader";
import { useHoverHeader } from "@/hooks/useHoverHeader";
import { PostData } from "@/types/PostData";
import { listDocs, getActivePointer, setActivePointer, subscribeDocsChanged } from "./lib/localDocs";
import EditorSkeleton from "./components/EditorSkeleton";

// 에디터는 순수 클라이언트 도구(contentEditable, crypto.randomUUID 등)라
// SSR 시 서버/클라이언트 초기 상태가 어긋나 하이드레이션 불일치가 난다. 클라이언트에서만 렌더한다.
const NewPage = dynamic(() => import("./components/NewPage"), { ssr: false, loading: () => <EditorSkeleton /> });

export default function NewPageLayout({ postsData }: { postsData: PostData[] }) {
    const [collapsed, setCollapsed] = useState(false);
    const showHeader = useHoverHeader();

    // 현재 편집 문서 id. 드로어에서 선택한 활성 포인터(localStorage)를 따라간다.
    const [activeDocId, setActiveDocId] = useState<string | null>(null);

    // 모바일에선 에디터(작성/편집)를 비활성화 — 데스크탑 전용 안내만 표시
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 1024px)");
        const apply = () => setIsMobile(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    useEffect(() => {
        const resolve = () => {
            const pointer = getActivePointer();
            if (pointer) {
                setActiveDocId(pointer);
                return;
            }
            // 포인터가 없으면 최근 문서, 그것도 없으면 새 문서를 만들어 포인터로 설정
            const list = listDocs();
            const id = list[0]?.id ?? crypto.randomUUID();
            setActivePointer(id);
            setActiveDocId(id);
        };
        resolve();
        // 드로어에서 다른 문서를 고르면(포인터 변경 이벤트) 여기서 전환
        return subscribeDocsChanged(() => {
            const pointer = getActivePointer();
            if (pointer) setActiveDocId(pointer);
        });
    }, []);

    // 기존 게시물의 카테고리(label) 목록 — 카테고리 선택 제안용
    const postCategories = Array.from(new Set(postsData.map((p) => p.label).filter(Boolean)));

    return (
        <div id="main-bg-container" data-theme="light" className="w-full h-full flex flex-col bg-(--page-bg) relative">
            <HoverHeader visible={showHeader} collapsed={collapsed} />
            <PostListDrawer posts={postsData} collapsed={collapsed} setCollapsed={setCollapsed} />
            {isMobile ? (
                <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-8 text-center">
                    <p className="text-lg font-semibold text-(--text)">글쓰기는 데스크탑에서 이용해 주세요</p>
                    <p className="mt-2 text-sm text-(--text-muted)">작성·편집 기능은 큰 화면에 최적화되어 있어요. PC에서 열어 주세요.</p>
                    <a href="/post" className="mt-6 rounded-lg border border-(--border) px-4 py-2 text-sm text-(--text-muted) hover:bg-(--hover-bg) hover:text-(--text)">
                        게시물 보기
                    </a>
                </div>
            ) : activeDocId ? (
                <NewPage key={activeDocId} collapsed={collapsed} docId={activeDocId} categories={postCategories} />
            ) : (
                <EditorSkeleton collapsed={collapsed} />
            )}
        </div>
    );
}
