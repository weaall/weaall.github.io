import * as tw from "./Footer.styles"

export default function Footer() {
    return (
        <tw.Container>
            <tw.FooterWrap>
                <tw.LabelWrap>
                    <tw.NameTag>Dong-Hyun Wi</tw.NameTag>
                    <tw.EmailTag>weaall@naver.com</tw.EmailTag>
                    <tw.EmailTag>weaall88@gmail.com</tw.EmailTag>
                </tw.LabelWrap>
                <tw.LabelWrap>
                    <tw.GnbSvg alt="" src={"../../assets/svg/user_icon.svg"}></tw.GnbSvg>
                </tw.LabelWrap>
                <tw.NavWrap>
                    <tw.NavTag href="/">Me</tw.NavTag>
                    <tw.NavTag href="/shallow">Shallow</tw.NavTag>
                    <tw.NavTag href="/deep">Deep</tw.NavTag>
                    <tw.NavTag href="/">About</tw.NavTag>
                </tw.NavWrap>
            </tw.FooterWrap>
        </tw.Container>
    )
}
