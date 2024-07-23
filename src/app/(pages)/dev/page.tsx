import DevList from "@/components/dev-list/DevList";
import getPostsData from "@/components/mdx/getMdx";

export default async function Page() {
    const postsData = await getPostsData("dev");
    
    return (
        <>
            <DevList props={postsData} />
        </>
    )
}