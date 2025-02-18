import * as tw from "./PostTitle.styles"

interface PostData {
    frontmatter: {
        imageUrl: string
        label: string
        title: string
        subTitle: string
        date: string
        tags: string[]
        mins: string
    }
}

export default function PracTitle({ frontmatter }: PostData, content: any) {
    return (
        <>
            <tw.Container>

                <tw.TitleWrap>
                    <tw.Title>{frontmatter.title}</tw.Title>
                    <tw.SubTitle>{frontmatter.subTitle}</tw.SubTitle>
                    <tw.SubWrap>
                        <tw.SubSvg alt="" src="../../assets/svg/calendar_icon.svg" />
                        <tw.SubText>{frontmatter.date}</tw.SubText>
                        <tw.SubSvg alt="" src="../../assets/svg/book_icon.svg" />
                        <tw.SubText>{frontmatter.mins}mins</tw.SubText>
                    </tw.SubWrap>
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
