"use client";

import { roboto } from "@/util/font";
import { usePathname } from "next/navigation";

import * as tw from "./Footer.styles";
import { InstagramLogo, LinkedInLogo, MetaLogo, XLogo, YoutubeLogo } from "../ui/hover-header/svg/LogosSvg";

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith("/weaall-ui") || pathname.startsWith("/post")) return null;
    return (
        <tw.Container>
            <tw.FooterWrap>
                <tw.LeftWrap className={roboto.className}>
                    <div className="flex">
                        <tw.LogoSvg alt="" src={"../../assets/weaall-ui.png"} />
                        <label className="pl-2 text-black text-[1.8rem] font-medium my-auto">WeHub</label>
                    </div>
                    <div className="flex gap-1 mt-6">
                        <a href="https://www.instagram.com/wea_all/"
                            className="w-8 h-8 p-1.5 rounded-lg bg-transparent hover:bg-gray-200 opacity-60 hover:opacity-100 transition-all duration-300"
                        >
                            <InstagramLogo color="#000" />
                        </a>
                        <a href="/"
                            className="w-8 h-8 p-[6px] rounded-lg 
                   bg-transparent hover:bg-gray-200 
                   opacity-60 hover:opacity-100 
                   transition-all duration-300"
                        >
                            <YoutubeLogo color="#000" />
                        </a>
                        <a href="/"
                            className="w-8 h-8 p-1 rounded-lg 
                   bg-transparent hover:bg-gray-200 
                   opacity-60 hover:opacity-100 
                   transition-all duration-300"
                        >
                            <LinkedInLogo color="#000" />
                        </a>
                        <a href="/"
                            className="w-8 h-8 p-1.5 rounded-lg 
                   bg-transparent hover:bg-gray-200 
                   opacity-60 hover:opacity-100 
                   transition-all duration-300"
                        >
                            <MetaLogo color="#000" />
                        </a>
                        <a href="/"
                            className="w-8 h-8 p-1.5 rounded-lg 
                   bg-transparent hover:bg-gray-200 
                   opacity-60 hover:opacity-100 
                   transition-all duration-300"
                        >
                            <XLogo color="#000" />
                        </a>
                    </div>
                    <div className="flex mt-16">
                        <button className="py-1 px-2 border rounded-lg">한국어</button>
                    </div>
                </tw.LeftWrap>

                <tw.RightWrap className={roboto.className}>
                    <tw.ColWrap>
                        <tw.TopLabel>소개</tw.TopLabel>
                        <tw.Index href="/me">WeHub 소개</tw.Index>
                        <tw.Index href="/me">보안</tw.Index>
                        <tw.Index href="/me">서비스 상태</tw.Index>
                        <tw.Index href="/me">이용약관 및 개인정보 보호 정책</tw.Index>
                        <tw.Index href="/me">개인정보 보호 권한</tw.Index>
                    </tw.ColWrap>
                    <tw.ColWrap>
                        <tw.TopLabel>포트폴리오</tw.TopLabel>
                        <tw.Index href="/prac">WeHub</tw.Index>
                        <tw.Index href="/portfolio/provelite">PROVE Lite</tw.Index>
                        <tw.Index href="/portfolio/mindsnavi">Minds. NAVI</tw.Index>
                        <tw.Index href="/shallow">Travelo</tw.Index>
                    </tw.ColWrap>
                    <tw.ColWrap>
                        <tw.TopLabel>자료</tw.TopLabel>
                        <tw.Index href="https://travelo.store/">Web</tw.Index>
                        <tw.Index href="/dev/intro">Dev</tw.Index>
                    </tw.ColWrap>
                    <tw.ColWrap>
                        <tw.TopLabel>용도별</tw.TopLabel>
                        <tw.Index href="https://travelo.store/">Web</tw.Index>
                        <tw.Index href="/dev/intro">Dev</tw.Index>
                    </tw.ColWrap>
                </tw.RightWrap>
            </tw.FooterWrap>

            <tw.NavWrap>
                <tw.NavBtn className="w-9 h-9" href="https://github.com/weaall" target="_blank" rel="noopener noreferrer">
                    <tw.NavImg alt="" src={"../../assets/footer/github.png"} />
                </tw.NavBtn>
            </tw.NavWrap>
        </tw.Container>
    );
}
