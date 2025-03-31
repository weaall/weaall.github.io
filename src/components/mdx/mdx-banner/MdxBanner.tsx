import { roboto } from "@/util/font";
import getPostsData from "../getMdx";
import PostsList from "./MdxBannerPosts";
import Link from "next/link";

import * as tw from "./MdxBanner.styles";

interface MdxBannerProps {
    dir: string;
}

export default async function MdxBanner({ dir }: MdxBannerProps) {
    const postsData = await getPostsData(dir);

    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestPosts = sortedPostsData.slice(0, 3);

    return (
        <tw.Container>
            <Link href={`./${dir.toLowerCase()}`} passHref>
                <tw.LabelWrap className={roboto.className}>
                    <tw.Label>{dir} dive</tw.Label>
                </tw.LabelWrap>
            </Link>

            <tw.BannerWrap />

            <PostsList latestPosts={latestPosts} />
        </tw.Container>
    );
}
