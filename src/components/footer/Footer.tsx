"use client";

import { roboto } from "@/util/font";
import { usePathname } from "next/navigation";

import * as tw from "./Footer.styles";

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith("/weaall-ui")) return null;
    return (
        <tw.Container>
            <tw.FooterWrap>
                <tw.LeftWrap className={roboto.className}>
                    <div className="flex">
                        <tw.LogoSvg alt="" src={"../../assets/weaall-ui.png"} />
                        <label className="pl-2 text-black text-2xl font-semibold my-auto">WeHub</label>
                    </div>
                    <div className="flex gap-1 mt-8">
                        <button className="w-8 h-8 bg-gray-200 rounded-lg"></button>
                        <button className="w-8 h-8 bg-gray-200 rounded-lg"></button>
                        <button className="w-8 h-8 bg-gray-200 rounded-lg"></button>
                        <button className="w-8 h-8 bg-gray-200 rounded-lg"></button>
                        <button className="w-8 h-8 bg-gray-200 rounded-lg"></button>
                    </div>
                    <div className="flex mt-16">
                        <button className="py-1 px-2 border rounded-lg">한국어</button>
                    </div>
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
                    <tw.NavImg alt="" src={"../../assets/footer/github.png"} />
                </tw.NavBtn>
                <tw.NavBtn href="https://www.instagram.com/wea_all/" target="_blank" rel="noopener noreferrer">
                    <tw.NavImg alt="" src={"../../assets/footer/instagram.png"} />
                </tw.NavBtn>
                <tw.NavBtn className="w-7 h-7" href="https://travelo.store/" target="_blank" rel="noopener noreferrer">
                    <tw.NavImg alt="" src={"../../assets/footer/travelo.png"} />
                </tw.NavBtn>
            </tw.NavWrap>
        </tw.Container>
    );
}
