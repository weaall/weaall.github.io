"use client";

import { useState } from "react";
import * as tw from "./MdxPostList.styles";

interface PostData {
    label: string;
    title: string;
    subTitle: string;
    date: string;
    tags: string[];
    slug: string;
    postUrl: string;
    imageUrl: string;
}

interface PostListProps {
    latestPosts: PostData[];
    collapsed: boolean;
}

export default function MdxPostList({ latestPosts, collapsed }: PostListProps) {
    // 최신 포스트가 맨 앞에 오도록 정렬
    const sortedPosts = [...latestPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const [currentIdx, setCurrentIdx] = useState(0);

    const currentPost = sortedPosts[currentIdx];

    const handlePrev = () => {
        setCurrentIdx((prev) => (prev > 0 ? prev - 1 : prev));
    };
    const handleNext = () => {
        setCurrentIdx((prev) => (prev < sortedPosts.length - 1 ? prev + 1 : prev));
    };

    return (
        <tw.Container
            style={{
                paddingLeft: collapsed ? 50 : 260,
                transition: "padding-left 0.2s",
            }}
        >
            {/* 가운데에 현재 포스트만 크게 */}
            <div className="flex flex-col items-center justify-center w-full h-full">
                <tw.MainPostWrap href={currentPost.postUrl}>
                    {currentPost.imageUrl && <img src={currentPost.imageUrl} alt={currentPost.title} className="w-full h-64 object-cover rounded-2xl mb-6" />}
                    <tw.TopWrap>
                        <tw.TopLabel>/ {currentPost.label}</tw.TopLabel>
                        <tw.TopLabel>{currentPost.date}</tw.TopLabel>
                    </tw.TopWrap>
                    <tw.MainTitle>{currentPost.title}</tw.MainTitle>
                    <tw.SubTitle>{currentPost.subTitle}</tw.SubTitle>
                    <tw.TagWrap>
                        {currentPost.tags?.map((tag, index) => (
                            <tw.Tag key={index}>{tag}</tw.Tag>
                        ))}
                    </tw.TagWrap>
                    {/* 넘기기 버튼 */}
                </tw.MainPostWrap>
                <div className="flex gap-4 mt-8">
                    <button onClick={handlePrev} disabled={currentIdx === 0} className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-40">
                        이전
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIdx === sortedPosts.length - 1}
                        className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-40"
                    >
                        다음
                    </button>
                </div>
                {/* 아래에 전체 포스트 리스트(카드형) */}
                <tw.PostContainer>
                    {sortedPosts.map((post, idx) => (
                        <tw.PostWrap
                            href={post.postUrl}
                            key={post.slug}
                            style={{
                                border: idx === currentIdx ? "2px solid #3b82f6" : "2px solid transparent",
                                opacity: idx === currentIdx ? 1 : 0.6,
                                transform: idx === currentIdx ? "scale(1.05)" : "scale(1)",
                                transition: "all 0.2s",
                            }}
                            onClick={() => setCurrentIdx(idx)}
                        >
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
                        </tw.PostWrap>
                    ))}
                </tw.PostContainer>
            </div>
        </tw.Container>
    );
}
