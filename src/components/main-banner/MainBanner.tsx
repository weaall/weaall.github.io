import * as tw from "./MainBanner.styles"

import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});


export default function MainBanner() {
    return (
        <tw.BannerWrap className={roboto.className}>
            <tw.BannerLabelWrap>
                <tw.BannerLabel >Dong-Hyun Wi</tw.BannerLabel>
                <tw.BannerUnderline />
            </tw.BannerLabelWrap>
            <tw.BannerText>View Great, Create View</tw.BannerText>
            <tw.MailWrap>
                <tw.MailSvg alt="" src={"../../assets/svg/mail_icon.svg"} />
                <tw.MailText href="mailto:weaall@naver.com">weaall@naver.com</tw.MailText>
                <tw.MailText href="mailto:weaall88@gmail.com">weaall88@gmail.com</tw.MailText>
            </tw.MailWrap>
            <tw.BtnWrap>
                <tw.BannerBtn href="/me">
                    <tw.BtnLabel>About Me</tw.BtnLabel>
                    <tw.BtnSvg alt="" src={"../../assets/svg/select.svg"} />
                </tw.BannerBtn>
            </tw.BtnWrap>
        </tw.BannerWrap>
    );
}
