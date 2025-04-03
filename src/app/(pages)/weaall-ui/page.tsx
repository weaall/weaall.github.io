import DevList from "@/components/dev-list/DevList";
import getPostsData from "@/components/mdx/getMdx";
import WuiHeader from "@/components/weaall-ui/wui-header/WuiHeader";

export default async function Page() {
    const postsData = await getPostsData("dev");

    return (
        <>
            <WuiHeader />
            <DevList props={postsData} />
        </>
    );
}
