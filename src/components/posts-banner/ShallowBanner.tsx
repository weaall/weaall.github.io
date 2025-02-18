import * as tw from "./PostBanner.styles"

import { Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-roboto",
});

export default function ShallowBanner() {
    return (
        <tw.Container className={roboto.className}>
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
        </tw.Container>
    )
}
