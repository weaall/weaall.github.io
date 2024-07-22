import DevList from "@/components/dev-list/DevList";
import getPostsData from "@/components/mdx/getMdx";

export default async function Page() {
    const postsData = await getPostsData("dev");
    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <>
            <DevList props={sortedPostsData} />
        </>
    )
}