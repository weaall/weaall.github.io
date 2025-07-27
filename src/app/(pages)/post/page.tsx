import getPostsData from "@/components/mdx/getMdx";
import MdxMap from "@/components/mdx/mdx-map/MdxMap";
import PostList from "@/components/posts-list/PostList";

export default async function Page() {
    const postsData = await getPostsData("post");
    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <PostList props={postsData} />
            <div style={{ flex: 1, marginLeft: 320 }}>
                <MdxMap latestPosts={sortedPostsData} />
            </div>
        </>
    );
}
