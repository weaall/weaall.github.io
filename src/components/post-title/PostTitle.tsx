import Head from "next/head"
import * as tw from "./PostTitle.styles"

interface PostData {
    frontmatter: {
        label: string
        title: string
        subTitle: string
        date: string
        tags: string[]
        mins: string
    }
}

export default function PostTitle({ frontmatter }: PostData, content: any) {
    return (
        <>
            <Head>
                <title>{frontmatter.title}</title>
                <meta name="description" content={frontmatter.subTitle}></meta>
            </Head>
            <tw.Container>
                <tw.ImgWrap>
                    <tw.Img></tw.Img>
                </tw.ImgWrap>

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
