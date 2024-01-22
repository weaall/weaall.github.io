import * as tw from "./DeepBanner.styles"

export default function DeepBanner() {
    return (
        <tw.BannerContainer>
            <tw.LabelWrap>
                <tw.Label>Deep Dive</tw.Label>
            </tw.LabelWrap>

            <tw.ImgWrap>
                <tw.BannerImg src={"../../assets/diver.svg"} />
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
