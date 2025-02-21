"use client";

import { useEffect, useRef, useState } from "react";
import LinkHandler from "./LinkHandler";
import * as tw from "./MdxBanner.styles";
import { roboto } from "@/util/font";

interface PostData {
    label: string;
    title: string;
    subTitle: string;
    date: string;
    tags: string[];
    slug: string;
    postUrl: string;
}

interface PostListProps {
    latestPosts: PostData[];
}

export default function PostsList({ latestPosts }: PostListProps) {
    const [isVisible, setIsVisible] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.5 },
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <tw.PostContainer
            ref={containerRef}
            className={`transition-opacity duration-700 ease-in-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
            {latestPosts.map((post) => (
                <tw.PostOuterWrap>
                    <LinkHandler url={post.postUrl} key={post.slug}>
                        <tw.PostInnerWrap>
                            <tw.TopWrap>
                                <tw.TopLabel>/ {post.label}</tw.TopLabel>
                                <tw.TopLabel>{post.date}</tw.TopLabel>
                            </tw.TopWrap>
                            <tw.Title>{post.title}</tw.Title>
                            <tw.SubTitle>{post.subTitle}</tw.SubTitle>
                            <tw.TagWrap className={roboto.className}>
                                {post.tags?.map((tag, index) => (
                                    <tw.Tag key={index}>{tag}</tw.Tag>
                                ))}
                            </tw.TagWrap>
                        </tw.PostInnerWrap>
                        <tw.SpanWrap>
                            <tw.Span />
                            <tw.Span />
                        </tw.SpanWrap>
                    </LinkHandler>
                </tw.PostOuterWrap>
            ))}
        </tw.PostContainer>
    );
}
