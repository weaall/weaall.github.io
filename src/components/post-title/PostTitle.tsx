import { BookIcon, CalendarIcon } from "../ui/hover-header/svg/PostsSvg";
import * as tw from "./PostTitle.styles";

interface PostData {
    frontmatter: {
        imageUrl: string;
        label: string;
        title: string;
        subTitle: string;
        date: string;
        tags: string[];
        mins: string;
    };
}

export default function PostTitle({ frontmatter }: PostData, content: any) {
    return (
        <>
            <tw.Container>
                <tw.ImgWrap>
                    <tw.Img alt="" src={`../../${frontmatter.imageUrl}`}></tw.Img>
                </tw.ImgWrap>

                <tw.TitleWrap>
                    <tw.Title>{frontmatter.title}</tw.Title>
                    <tw.SubTitle>{frontmatter.subTitle}</tw.SubTitle>
                    <tw.SubWrap>
                        <tw.SubSvg>
                            <CalendarIcon color={"#ffffffcf"} />
                        </tw.SubSvg>
                        <tw.SubText>{frontmatter.date}</tw.SubText>
                        <tw.SubSvg>
                            <BookIcon color={"#ffffffcf"} />
                        </tw.SubSvg>
                        <tw.SubText>{frontmatter.mins}mins</tw.SubText>
                    </tw.SubWrap>
                    <tw.TagWrap>
                        {frontmatter.tags.map((tag, index) => (
                            <tw.Tag key={index}>#{tag}</tw.Tag>
                        ))}
                    </tw.TagWrap>
                </tw.TitleWrap>
            </tw.Container>
        </>
    );
}
