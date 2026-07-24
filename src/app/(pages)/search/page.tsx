import { Metadata } from "next";
import getPostsData from "@/components/mdx/getMdx";
import SearchLayout from "./SearchLayout";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
    title: "검색",
    description: "게시물을 제목·카테고리·태그로 검색합니다.",
    path: "/search",
});

export default async function Page() {
    const postsData = await getPostsData("post");
    return <SearchLayout postsData={postsData} />;
}
