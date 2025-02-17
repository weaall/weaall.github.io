import getPostsData from "../getMdx";
import LinkHandler from "./LinkHandler";
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
                    <LinkHandler url={post.postUrl} key={post.slug}>
                        <tw.TopWrap>
                            <tw.TopLabel>/ {post.label}</tw.TopLabel>
                            <tw.TopLabel>{post.date}</tw.TopLabel>
                        </tw.TopWrap>
                        <tw.Title>{post.title}</tw.Title>
                        <tw.SubTitle>{post.subTitle}</tw.SubTitle>
                        <tw.TagWrap>
                            {post.tags?.map((tag, index) => (
                                <tw.Tag key={index}>{tag}</tw.Tag>
                            ))}
                        </tw.TagWrap>
                    </LinkHandler>
                ))}
            </tw.PostContainer>
        </tw.Container>
    );
}
