import * as tw from "./page.styles"

export default async function Page() {
    const skillItems = [
        { src: "../../assets/mono/react_mono.svg", alt: "React" },
        { src: "../../assets/mono/nextjs_mono.svg", alt: "Next.js" },
        { src: "../../assets/mono/nodejs_mono.svg", alt: "Node.js" },
        { src: "../../assets/mono/mysql_mono.svg", alt: "MySQL" },
        { src: "../../assets/mono/mongodb_mono.svg", alt: "MongoDB" },
        { src: "../../assets/mono/aws_mono.svg", alt: "AWS" },
    ]

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
                {skillItems.map(({ src, alt }) => (
                    <tw.Skills key={alt} alt={alt} src={src} />
                ))}
            </tw.SkillWrap>
            <tw.ProjectWrap></tw.ProjectWrap>
        </tw.Container>
    )
}
