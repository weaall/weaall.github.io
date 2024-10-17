import * as tw from "./PostBanner.styles"

export default function PracBanner() {
    return (
        <tw.Container>
            <tw.BannerContainer>
                <tw.LabelWrap>
                    <tw.Label>Practice</tw.Label>
                </tw.LabelWrap>

                <tw.ImgWrap>
                    <tw.BannerImg src={"../../assets/diver.svg"} />
                </tw.ImgWrap>

                <tw.BannerWrap>
                    <tw.BannerText>The group of subtle practice.</tw.BannerText>
                </tw.BannerWrap>
            </tw.BannerContainer>
        </tw.Container>
    )
}
