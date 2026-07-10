import * as tw from "./PostTitle.styles";
import { PostFrontmatter } from "@/interface/PostData";
import { PageIcon } from "@/app/(pages)/newpage/lib/pageIcon";

export default function PostTitle({ frontmatter }: { frontmatter: PostFrontmatter }) {
    return (
        <>
            <tw.Container>
                {frontmatter.imageUrl && frontmatter.imageUrl !== 'none' && (
                    <tw.ImgWrap>
                        <tw.Img alt={frontmatter.title} src={`../../${frontmatter.imageUrl}`}></tw.Img>
                    </tw.ImgWrap>
                )}
                {frontmatter.icon && (
                    <div className="mb-1">
                        <PageIcon icon={frontmatter.icon} size={56} />
                    </div>
                )}
                <tw.Title>{frontmatter.title}</tw.Title>
            </tw.Container>
        </>
    );
}
