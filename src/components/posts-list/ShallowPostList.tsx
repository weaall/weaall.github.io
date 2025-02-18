"use client";

import { useEffect, useRef, useState } from "react";
import * as tw from "./PostList.styles";

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

export default function ShallowPostList({ props }: PostsProps) {
    const [activeItem, setActiveItem] = useState("All");
    const [visibleCount, setVisibleCount] = useState(3);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const sideItems = [
        { label: "All", src: "all" },
        { label: "Database", src: "db" },
        { label: "AWS", src: "aws" },
        { label: "React", src: "react" },
        { label: "NextJS", src: "nextjs" },
        { label: "Web", src: "web" },
        { label: "etc", src: "etc" },
    ];

    const filteredPosts = props.filter((postItem) => activeItem === "All" || postItem.label === activeItem);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 3, filteredPosts.length));
                }
            },
            { threshold: 1.0 },
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [filteredPosts]);

    return (
        <tw.Container>
            <tw.SideContainer>
                {sideItems.map((item, index) => (
                    <tw.SideWrap
                        $state={activeItem === item.label}
                        key={index}
                        onClick={() => {
                            setActiveItem(item.label);
                            setVisibleCount(3);
                        }}
                    >
                        <tw.SideSvg src={`../../../assets/drawer-svg/${item.src}.svg`} />
                        <tw.SideLabel>{item.label}</tw.SideLabel>
                    </tw.SideWrap>
                ))}
            </tw.SideContainer>

            <tw.PostsContainer>
                {filteredPosts.slice(0, visibleCount).map((item) => (
                    <a href={item.postUrl} key={item.slug}>
                        <tw.PostWrap>
                            <tw.TopWrap>
                                <tw.TopLabel>/ {item.label}</tw.TopLabel>
                                <tw.TopLabel>{item.date}</tw.TopLabel>
                            </tw.TopWrap>
                            <tw.Title>{item.title}</tw.Title>
                            <tw.SubTitle>{item.subTitle}</tw.SubTitle>
                            <tw.TagWrap>
                                {item.tags?.map((tag, index) => (
                                    <tw.Tag key={index}>{tag}</tw.Tag>
                                ))}
                            </tw.TagWrap>
                        </tw.PostWrap>
                    </a>
                ))}
                {visibleCount < filteredPosts.length && <div ref={observerRef} />}
            </tw.PostsContainer>
        </tw.Container>
    );
}
