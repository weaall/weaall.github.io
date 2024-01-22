import * as tw from "./ShallowBanner.styles"

export default function ShallowBanner() {
    return (
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
    )
}
