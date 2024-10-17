"use client"

import { useState } from "react"
import * as tw from "./PostList.styles"

interface PostData {
    label: string
    title: string
    subTitle: string
    date: string
    tags: []
    slug: string
    postUrl: string
}

interface PostsProps {
    props: PostData[]
}

export default function DeepPostList({ props }: PostsProps) {
    const [activeItem, setActiveItem] = useState("All");

    const sideItems = [
        { label: "All", src: "all" },
        { label: "Database", src: "db" },
        { label: "AWS", src: "aws" },
        { label: "React", src: "react" },
        { label: "NextJS", src: "nextjs" },
        { label: "Web", src: "web" },
        { label: "etc", src: "etc" },
    ];

    return (
        <tw.Container>
            <tw.SideContainer>
                {sideItems.map((item, index) => (
                    <tw.SideWrap 
                        $state={activeItem === item.label} 
                        key={index} 
                        onClick={() => setActiveItem(item.label)}
                    >
                        <tw.SideSvg src={`../../../assets/drawer-svg/${item.src}.svg`}></tw.SideSvg>
                        <tw.SideLabel>{item.label}</tw.SideLabel>
                    </tw.SideWrap>
                ))}
            </tw.SideContainer>

            <tw.PostsContainer>
                {props
                    .filter((postItem) => activeItem === "All" || postItem.label === activeItem)
                    .map((item) => (
                        <tw.PostWrap href={item.postUrl} key={item.slug}>
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
                    ))}
            </tw.PostsContainer>
        </tw.Container>
    )
}
