"use client";

import { useEffect } from "react";
import PostTitle from "@/components/post-title/PostTitle";

import * as tw from "./MDXContent.styles";
import { PostFrontmatter } from "@/types/PostData";

interface MDXContentProps {
    content: React.ReactNode;
    frontmatter: PostFrontmatter;
    collapsed: boolean;
}

export function MDXContent({ content, frontmatter, collapsed }: MDXContentProps) {
    // 헤딩에 id를 부여하고, 해시(#heading)로 진입 시 해당 위치로 스크롤한다.
    useEffect(() => {
        document.querySelectorAll("h1, h2, h3").forEach((el) => {
            const text = el.textContent || "";
            el.id = text.replace(/\s+/g, "-").toLowerCase();
        });

        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 0);
            }
        }
    }, [content]);

    return (
        <tw.Container>
            <tw.ContentWrap>
                <PostTitle frontmatter={frontmatter} />
                <div className="post-content flex flex-col gap-[4px]">{content}</div>
            </tw.ContentWrap>
        </tw.Container>
    );
}
