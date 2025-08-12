"use client";

import * as tw from "./MdxPostList.styles";

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
    collapsed: boolean;
}

export default function MdxPostList({ latestPosts, collapsed }: PostListProps) {
    return (
        <tw.Container style={{ marginLeft: collapsed ? 50 : 260, transition: "margin-left 0.2s" }}>
            <tw.PostContainer>
                {latestPosts.map((post) => (
                    <tw.StyledLink href={post.postUrl} key={post.slug}>
                        <tw.TopWrap>
                            <tw.TopLabel>/ {post.label}</tw.TopLabel>
                            <tw.TopLabel>{post.date}</tw.TopLabel>
                        </tw.TopWrap>
                        <tw.Title>{post.title}</tw.Title>
                        <tw.SubTitle>{post.subTitle}</tw.SubTitle>
                        <tw.TagWrap>
                            {post.tags?.map((tag, index) => (
                                <tw.Tag key={index}>{tag}</tw.Tag>
                            ))}
                        </tw.TagWrap>
                    </tw.StyledLink>
                ))}
            </tw.PostContainer>
        </tw.Container>
    );
}
