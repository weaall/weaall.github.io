"use client";
import { usePathname } from "next/navigation";

import * as tw from "./Header.styles";

export default function Header() {
    const pathname = usePathname();

    if (pathname.startsWith("/weaall-ui")) return null;

    const validPaths = ["/shallow", "/deep", "/dev", "/prac", "/project"];

    const headerLayout = validPaths.some((path) => pathname.startsWith(path));

    const navItems = [
        { label: "SHALLOW", path: "/shallow" },
        { label: "DEEP", path: "/deep" },
        { label: "PRAC", path: "/prac" },
    ];

    return (
        <tw.Container $state={headerLayout}>
            <tw.LogoWrap>
                <tw.LogoBtn>
                    <tw.Svg alt="" src={"../../assets/weaall-ui.png"} />
                </tw.LogoBtn>
            </tw.LogoWrap>

            <tw.NavWrap>
                <tw.Nav>
                    {navItems.map((item, index) => (
                        <tw.NavDirectWrap key={index}>
                            <tw.NavDirectP href={`${item.path}`}>{item.label}</tw.NavDirectP>
                        </tw.NavDirectWrap>
                    ))}
                </tw.Nav>
            </tw.NavWrap>

            <tw.RearWrap>
                <tw.DevBtn>
                    <a href={"/"}>
                        <tw.DevLabel>home</tw.DevLabel>
                    </a>
                </tw.DevBtn>
                <tw.DevLabel>/</tw.DevLabel>
                <tw.DevBtn>
                    <a href={"/me"}>
                        <tw.DevLabel>me</tw.DevLabel>
                    </a>
                </tw.DevBtn>
                <tw.DevLabel>/</tw.DevLabel>
                <tw.DevBtn>
                    <a href="https://github.com/weaall" target="_blank" rel="noopener noreferrer">
                        <tw.DevLabel>github</tw.DevLabel>
                    </a>
                </tw.DevBtn>
                <tw.DevLabel>/</tw.DevLabel>
                <tw.DevBtn>
                    <a href={"/dev/intro"}>
                        <tw.DevLabel>dev</tw.DevLabel>
                    </a>
                </tw.DevBtn>
            </tw.RearWrap>
        </tw.Container>
    );
}
