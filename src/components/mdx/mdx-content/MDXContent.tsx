"use client";

import { useEffect, useState } from "react";
import PostTitle from "@/components/post-title/PostTitle";

import * as tw from "./MDXContent.styles";

interface MDXContentProps {
    content: React.ReactNode;
    frontmatter: {
        imageUrl: string;
        label: string;
        title: string;
        subTitle: string;
        date: string;
        tags: string[];
        mins: string;
    };
}

export function MDXContent({ content, frontmatter }: MDXContentProps) {
    const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const hash = window.location.hash;

        const headingElements = document.querySelectorAll("h1, h2, h3");
        const headingData = Array.from(headingElements).map((el) => {
            const text = el.textContent || "";
            const level = parseInt(el.tagName.replace("H", ""), 10); // 태그 레벨 추출 (h1, h2, h3)
            const id = text.replace(/\s+/g, "-").toLowerCase();
            el.id = id;
            return { id, text, level };
        });

        setHeadings(headingData);

        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 0);
            }
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        setActiveId(id); 
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        headingElements.forEach((el) => observer.observe(el));

        return () => {
            headingElements.forEach((el) => observer.unobserve(el));
        };
    }, [content]);

    const handleHeadingClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <tw.Container>
            <tw.ContentWrap>
                <PostTitle frontmatter={frontmatter} />
                {content}
            </tw.ContentWrap>
            <tw.IndexWrap>
                <tw.IndexList>
                    {headings.map((heading) => (
                        <tw.IndexLabel $active={heading.id === activeId}
                            key={heading.id}
                            style={{
                                marginLeft: `${(heading.level - 1) * 15}px`,
                            }}
                            onClick={() => handleHeadingClick(heading.id)}
                        >
                            {heading.text}
                        </tw.IndexLabel>
                    ))}
                </tw.IndexList>
            </tw.IndexWrap>
        </tw.Container>
    );
}
