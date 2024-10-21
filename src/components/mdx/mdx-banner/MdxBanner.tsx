import Link from "next/link";
import getPostsData from "../getMdx";
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
            <tw.LabelWrap>
                <tw.Label>{dir} Dive</tw.Label>
            </tw.LabelWrap>

            <tw.BannerWrap />

            <tw.PostContainer>
                {latestPosts.map((post) => (
                    <Link className="h-auto w-[32%]" href={post.postUrl} key={post.slug} passHref>
                        <tw.PostWrap>
                            <tw.TopWrap>
                                <tw.TopLabel>/ {post.label}</tw.TopLabel>
                                <tw.TopLabel>{post.date}</tw.TopLabel>
                            </tw.TopWrap>
                            <tw.Title>{post.title}</tw.Title>
                            <tw.SubTitle>{post.subTitle}</tw.SubTitle>
                            <tw.TagWrap>
                                {post.tags?.map((tag, index) => (
                                    <tw.tag key={index}>{tag}</tw.tag>
                                ))}
                            </tw.TagWrap>
                        </tw.PostWrap>
                    </Link>
                ))}
            </tw.PostContainer>
        </tw.Container>
    );
}
