import getPostsData from "@/components/mdx/getMdx";
import ShallowPostList from "@/components/posts-list/ShallowPostList"

export default async function Page() {
    const postsData = await getPostsData("shallow");
    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <>
            <ShallowPostList props={sortedPostsData} />
        </>
    )
}