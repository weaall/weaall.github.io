import * as tw from "./PostTitle.styles"
import { PostFrontmatter } from "@/types/PostData"

export default function PracTitle({ frontmatter }: { frontmatter: PostFrontmatter }) {
    return (
        <>
            <tw.Container>

                <tw.TitleWrap>
                    <tw.Title>{frontmatter.title}</tw.Title>
                    <tw.SubTitle>{frontmatter.subTitle}</tw.SubTitle>
                    <tw.TagWrap>
                        {frontmatter.tags.map((tag, index) => (
                            <tw.Tag key={index}>{tag}</tw.Tag>
                        ))}
                    </tw.TagWrap>
                </tw.TitleWrap>
            </tw.Container>
        </>
    )
}
