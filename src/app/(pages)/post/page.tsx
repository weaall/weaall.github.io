import getPostsData from "@/components/mdx/getMdx";
import PostLayout from "./PostLayout";

export default async function Page() {
    const postsData = await getPostsData("post");
    return <PostLayout postsData={postsData} />;
}