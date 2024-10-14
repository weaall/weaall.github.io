import * as tw from "./page.styles"

export default async function Page() {
    return (
        <tw.Container>
            <tw.BannerWrap>
                <tw.BannerLabelWrap>
                    <tw.BannerLabel>Dong-Hyun Wi</tw.BannerLabel>
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
                        <tw.BtnSvg alt="" src={"../../assets/svg/right_icon.svg"} />
                    </tw.BannerBtn>
                </tw.BtnWrap>
            </tw.BannerWrap>

            <tw.SkillWrap>

            </tw.SkillWrap>
            <tw.ProjectWrap>
                
            </tw.ProjectWrap>
        </tw.Container>
    )
}
