import getPostsData from "@/components/mdx/getMdx";
import PostList from "@/components/posts-list/PostList"
import PostBanner from "@/components/posts-banner/PostBanner";

export default async function Page() {
    const postsData = await getPostsData("shallow");
    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <>
            <PostBanner />
            <PostList props={sortedPostsData} />
        </>
    )
}

