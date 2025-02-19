import { roboto } from "@/util/font";
import getPostsData from "../getMdx";
import * as tw from "./MdxBanner.styles";
import PostsList from "./MdxBannerPosts";

interface MdxBannerProps {
    dir: string;
}

export default async function MdxBanner({ dir }: MdxBannerProps) {
    const postsData = await getPostsData(dir);

    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestPosts = sortedPostsData.slice(0, 3);

    return (
        <tw.Container>
            <tw.LabelWrap>
                <tw.Label className={roboto.className}>{dir} Dive</tw.Label>
            </tw.LabelWrap>

            <tw.BannerWrap />

            <PostsList latestPosts={latestPosts} />
        </tw.Container>
    );
}
