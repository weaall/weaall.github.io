"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import PostListDrawer from "@/components/PostListDrawer/PostListDrawer";
import HoverHeader from "@/components/ui/hover-header/HoverHeader";
import { useHoverHeader } from "@/hooks/useHoverHeader";
import { PostData } from "@/interface/PostData";
import { listDocs, deleteDoc, LocalDocMeta } from "./lib/localDocs";

// 에디터는 순수 클라이언트 도구(contentEditable, crypto.randomUUID 등)라
// SSR 시 서버/클라이언트 초기 상태가 어긋나 하이드레이션 불일치가 난다. 클라이언트에서만 렌더한다.
const NewPage = dynamic(() => import("./components/NewPage"), { ssr: false });

export default function NewPageLayout({ postsData }: { postsData: PostData[] }) {
    const [collapsed, setCollapsed] = useState(false);
    const showHeader = useHoverHeader();

    // 로컬 저장 문서 목록 + 현재 편집 중인 문서. 클라이언트에서만 초기화(localStorage/crypto).
    const [docs, setDocs] = useState<LocalDocMeta[]>([]);
    const [activeDocId, setActiveDocId] = useState<string | null>(null);

    const refreshDocs = useCallback(() => setDocs(listDocs()), []);

    useEffect(() => {
        const list = listDocs();
        setDocs(list);
        setActiveDocId(list[0]?.id ?? crypto.randomUUID()); // 최근 문서 or 새 문서
    }, []);

    const handleNewDoc = () => setActiveDocId(crypto.randomUUID());
    const handleSelectDoc = (id: string) => setActiveDocId(id);
    const handleDeleteDoc = (id: string) => {
        deleteDoc(id);
        const list = listDocs();
        setDocs(list);
        if (id === activeDocId) setActiveDocId(list[0]?.id ?? crypto.randomUUID());
    };

    return (
        <div id="main-bg-container" data-theme="light" className="w-full h-full flex flex-col bg-(--page-bg) relative">
            <HoverHeader visible={showHeader} collapsed={collapsed} />
            <PostListDrawer
                posts={postsData}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                localDocs={docs}
                activeDocId={activeDocId ?? undefined}
                onSelectDoc={handleSelectDoc}
                onNewDoc={handleNewDoc}
                onDeleteDoc={handleDeleteDoc}
            />
            {activeDocId && <NewPage key={activeDocId} collapsed={collapsed} docId={activeDocId} onSaved={refreshDocs} />}
        </div>
    );
}
