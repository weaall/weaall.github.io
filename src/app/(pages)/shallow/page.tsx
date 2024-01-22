import getPostsData from "@/components/mdx/getMdx";
import ShallowPostList from "@/components/posts-list/ShallowPostList"
import ShallowBanner from "@/components/posts-banner/shallow/ShallowBanner";

export default async function Page() {
    const postsData = await getPostsData("shallow");
    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <>
            <ShallowBanner />
            <ShallowPostList props={sortedPostsData} />
        </>
    )
}

