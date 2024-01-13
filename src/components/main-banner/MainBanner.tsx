import * as tw from "./MainBanner.styles"

export default function MainBanner() {
    return (
        <tw.BannerWrap>
            <tw.BannerLabel>Dong-Hyun Wi</tw.BannerLabel>
            <tw.BannerText>View Great, Create View</tw.BannerText>
            <tw.MailWrap>
                <tw.MailSvg alt="" src={"../../assets/svg/mail_icon.svg"} />
                <tw.MailText href="mailto:weaall@naver.com">weaall@naver.com</tw.MailText>
                <tw.MailText href="mailto:weaall88@gmail.com">weaall88@gmail.com</tw.MailText>
            </tw.MailWrap>
            <tw.BtnWrap>
                <tw.BannerBtn href="https://github.com/weaall" target="_blank">
                    <tw.BtnSvg alt="" src={"../../assets/svg/github.svg"} />
                    Github
                </tw.BannerBtn>
            </tw.BtnWrap>
        </tw.BannerWrap>
    )
}
