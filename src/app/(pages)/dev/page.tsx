import { Metadata } from "next";
import DevList from "@/components/dev-list/DevList";
import getPostsData from "@/components/mdx/getMdx";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
    title: "개발 노트",
    description: "API·아키텍처·구현 과정을 정리한 개발 문서.",
    path: "/dev",
});

export default async function Page() {
    const postsData = await getPostsData("dev");
    
    return (
        <>
            <DevList posts={postsData} />
        </>
    )
}