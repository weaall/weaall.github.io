"use client";

import { useEffect } from "react";
import PostTitle from "@/components/post-title/PostTitle";

import * as tw from "./MDXContent.styles";
import { PostData, PostFrontmatter } from "@/types/PostData";
import ReadingProgress from "./ReadingProgress";
import PostNav from "./PostNav";

interface MDXContentProps {
    content: React.ReactNode;
    frontmatter: PostFrontmatter;
    collapsed: boolean;
    postsData?: PostData[];
    slug?: string;
}

export function MDXContent({ content, frontmatter, collapsed, postsData, slug }: MDXContentProps) {
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
            <ReadingProgress />
            <tw.ContentWrap>
                <PostTitle frontmatter={frontmatter} />
                <div className="post-content flex flex-col gap-[4px]">{content}</div>
                {postsData && slug && <PostNav postsData={postsData} slug={slug} />}
            </tw.ContentWrap>
        </tw.Container>
    );
}
