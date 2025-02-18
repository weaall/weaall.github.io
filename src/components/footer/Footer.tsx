import * as tw from "./Footer.styles";

import { Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-roboto",
});

export default function Footer() {
    return (
        <tw.Container className={roboto.className}>
            <tw.FooterWrap>
                <tw.LabelWrap>
                    <tw.NameTag>Dong-Hyun Wi</tw.NameTag>
                    <tw.EmailTag href="mailto:weaall@naver.com">weaall@naver.com</tw.EmailTag>
                    <tw.EmailTag href="mailto:weaall88@gmail.com">weaall88@gmail.com</tw.EmailTag>
                </tw.LabelWrap>
                <tw.LabelWrap>
                    <a href="/">
                        <tw.GnbSvg alt="" src={"../../assets/svg/user_icon.svg"}></tw.GnbSvg>
                    </a>
                </tw.LabelWrap>
                <tw.NavWrap>
                    <tw.NavTag href="/shallow">shallow</tw.NavTag>
                    <tw.NavTag href="/deep">deep</tw.NavTag>
                    <tw.NavTag href="/me">me</tw.NavTag>
                    <tw.NavTag href="/dev/intro">dev</tw.NavTag>
                </tw.NavWrap>
            </tw.FooterWrap>
        </tw.Container>
    );
}
