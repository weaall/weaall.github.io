import getPostsData from "@/components/mdx/getMdx";
import PracPostList from "@/components/PostListDrawer/PracPostList";

export default async function Page() {
    const postsData = await getPostsData("prac");
    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <PracPostList props={postsData} />
        </>
    );
}
