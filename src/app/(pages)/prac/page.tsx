import getPostsData from "@/components/mdx/getMdx";
import PracPostList from "@/components/PostListDrawer/PracPostList";

export default async function Page() {
    const postsData = await getPostsData("prac");

    return (
        <>
            <PracPostList posts={postsData} />
        </>
    );
}
