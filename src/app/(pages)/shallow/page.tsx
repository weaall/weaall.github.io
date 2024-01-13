import Posts from "../../../components/post/Posts"
import * as tw from "./Shallow.styles"


export default function Page() {
    return (
        <tw.Container>
            <tw.BannerContainer>

                <tw.LabelWrap>
                    <tw.Label>Shallow Dive</tw.Label>
                </tw.LabelWrap>

                <tw.ImgWrap>
                    <tw.BannerImg src={"../../assets/writer.svg"} />
                </tw.ImgWrap>

                <tw.BannerWrap>
                    <tw.BannerText>
                        I prefer lake to waves. <br />
                        Sailing with calm rather than fluctuations.
                    </tw.BannerText>
                </tw.BannerWrap>
            </tw.BannerContainer>

            <Posts />
        </tw.Container>
    )
}

