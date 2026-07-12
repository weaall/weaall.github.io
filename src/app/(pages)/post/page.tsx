import { Metadata } from "next";
import getPostsData from "@/components/mdx/getMdx";
import PostListLayout from "./PostListLayout";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
    title: "게시물",
    description: "개발하며 정리한 기록과 생각을 담은 게시물 모음.",
    path: "/post",
});

export default async function Page() {
    const postsData = await getPostsData("post");
    
    return <PostListLayout postsData={postsData} />;
}