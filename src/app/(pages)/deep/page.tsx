import getPostsData from "@/components/mdx/getMdx"
import DeepPostList from "@/components/posts-list/DeepPostList"

export default async function Page() {
    const postsData = await getPostsData("deep")
    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <>
            <DeepPostList props={sortedPostsData} />
        </>
    )
}
