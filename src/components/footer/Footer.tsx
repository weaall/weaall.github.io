import { roboto } from "@/util/font";

import * as tw from "./Footer.styles";

export default function Footer() {
    return (
        <tw.Container>
            <tw.FooterWrap>
                <tw.LeftWrap>
                    <tw.LogoSvg alt="" src={"../../assets/favicon.png"} />
                    <tw.MainLabel className={roboto.className}>Dong-Hyun Wi</tw.MainLabel>
                    <tw.MainP>더 나은 것을 만들어내기 위해 끊임없이 고민하며 나아갑니다.</tw.MainP>
                    <tw.MainP>복잡함 속에서도 효과적인 구조를 위해 노력합니다.</tw.MainP>
                </tw.LeftWrap>

                <tw.RightWrap className={roboto.className}>
                    <tw.ColWrap>
                        <tw.TopLabel>WEAALL</tw.TopLabel>
                        <tw.Index href="/">Home</tw.Index>
                        <tw.Index href="/me">Me</tw.Index>
                    </tw.ColWrap>
                    <tw.ColWrap>
                        <tw.TopLabel>POST</tw.TopLabel>
                        <tw.Index href="/shallow">Shallow Dive</tw.Index>
                        <tw.Index href="/deep">Deep Dive</tw.Index>
                        <tw.Index href="/prac">Practice</tw.Index>
                    </tw.ColWrap>
                    <tw.ColWrap>
                        <tw.TopLabel>TRAVELO</tw.TopLabel>
                        <tw.Index href="https://travelo.store/">Web</tw.Index>
                        <tw.Index href="/dev/intro">Dev</tw.Index>
                    </tw.ColWrap>
                </tw.RightWrap>
            </tw.FooterWrap>
            <tw.NavWrap>
                <tw.NavBtn className="w-9 h-9" href="https://github.com/weaall" target="_blank" rel="noopener noreferrer">
                    <tw.NavImg alt="" src={"../../assets/footer/github.png"}/>
                </tw.NavBtn>
                <tw.NavBtn href="https://www.instagram.com/wea_all/" target="_blank" rel="noopener noreferrer">
                    <tw.NavImg alt="" src={"../../assets/footer/instagram.png"}/>
                </tw.NavBtn>
                <tw.NavBtn className="w-7 h-7" href="https://travelo.store/" target="_blank" rel="noopener noreferrer">
                    <tw.NavImg alt="" src={"../../assets/footer/travelo.png"}/>
                </tw.NavBtn>
            </tw.NavWrap>
        </tw.Container>
    );
}
