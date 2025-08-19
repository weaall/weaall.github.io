import getPostsData from "@/components/mdx/getMdx";
import NewPageLayout from "./NewPageLayout";

export default async function Page() {
    const postsData = await getPostsData("post");
    
    return <NewPageLayout postsData={postsData} />;
}