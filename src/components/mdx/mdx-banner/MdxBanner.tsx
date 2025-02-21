import { roboto } from "@/util/font";
import getPostsData from "../getMdx";
import * as tw from "./MdxBanner.styles";
import PostsList from "./MdxBannerPosts";
import Link from "next/link";


interface MdxBannerProps {
    dir: string;
}

export default async function MdxBanner({ dir }: MdxBannerProps) {
    const postsData = await getPostsData(dir);

    const sortedPostsData = postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestPosts = sortedPostsData.slice(0, 3);

    return (
        <tw.Container>
            <tw.LabelWrap className={roboto.className}>
                <tw.LabelFlex>
                    <tw.Label>{dir} dive</tw.Label>
                    <Link href={`./${dir.toLowerCase()}`} passHref>
                        <tw.DirectBtn>
                            <tw.BtnP>Go To {dir}</tw.BtnP>
                            {/* <tw.BtnImg alt="" src={"../../assets/svg/go.svg"} /> */}
                        </tw.DirectBtn>
                    </Link>
                </tw.LabelFlex>
            </tw.LabelWrap>

            <tw.BannerWrap />

            <PostsList latestPosts={latestPosts} />
        </tw.Container>
    );
}
