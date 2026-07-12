import { Metadata } from "next";
import getPostsData from "@/components/mdx/getMdx";
import { getBaseMetadata } from "@/utils/seo";

export const metadata: Metadata = getBaseMetadata({
    title: "연습",
    description: "알고리즘과 언어 연습 기록.",
    path: "/prac",
});
import PracPostList from "@/components/PostListDrawer/PracPostList";

export default async function Page() {
    const postsData = await getPostsData("prac");

    return (
        <>
            <PracPostList posts={postsData} />
        </>
    );
}
