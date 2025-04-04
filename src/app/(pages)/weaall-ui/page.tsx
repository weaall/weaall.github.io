import getPostsData from "@/components/mdx/getMdx";
import WuiHeader from "@/components/weaall-ui/wui-header/WuiHeader";
import WuiMdxList from "@/components/weaall-ui/wui-mdxList/WuiMdxList";

export default async function Page() {
    const postsData = await getPostsData("weaall-ui");

    return (
        <>
            <WuiHeader />
            <WuiMdxList props={postsData} />
        </>
    );
}
