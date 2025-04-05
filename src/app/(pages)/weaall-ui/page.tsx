import WuiGetMdx from "@/components/weaall-ui/wui-getmdx/WuiGetMdx";
import WuiHeader from "@/components/weaall-ui/wui-header/WuiHeader";
import WuiMdxList from "@/components/weaall-ui/wui-mdx-list/WuiMdxList";

export default async function Page() {
    const postsData = await WuiGetMdx("weaall-ui");

    return (
        <>
            <WuiHeader />
            <WuiMdxList props={postsData} />
        </>
    );
}
