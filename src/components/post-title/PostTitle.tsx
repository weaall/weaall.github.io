import * as tw from "./PostTitle.styles";
import { PostFrontmatter } from "@/interface/PostData";

export default function PostTitle({ frontmatter }: { frontmatter: PostFrontmatter }) {
    return (
        <>
            <tw.Container>
                {frontmatter.imageUrl && frontmatter.imageUrl !== 'none' && (
                    <tw.ImgWrap>
                        <tw.Img alt={frontmatter.title} src={`../../${frontmatter.imageUrl}`}></tw.Img>
                    </tw.ImgWrap>
                )}
                <tw.Title>{frontmatter.title}</tw.Title>
            </tw.Container>
        </>
    );
}
