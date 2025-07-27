"use client";
import { usePathname } from "next/navigation";

import * as tw from "./Header.styles";

export default function Header() {
    const pathname = usePathname();

    if (pathname.startsWith("/weaall-ui")) return null;

    const validPaths = ["/post", "/dev", "/prac", "/project"];

    const headerLayout = validPaths.some((path) => pathname.startsWith(path));

    const navItems = [
        { label: "POST", path: "/post" },
        { label: "PRAC", path: "/prac" },
        { label: "ME", path: "/me" },
        { label: "GITHUB", path: "https://github.com/weaall" },
        { label: "DEV", path: "/dev/intro" },
    ];

    return (
        <tw.Container $state={headerLayout}>
            <tw.LogoWrap>
                <tw.LogoBtn onClick={() => (window.location.href = "/")}>
                    <tw.Svg alt="" src={"../../assets/weaall-ui.png"} />
                </tw.LogoBtn>
            </tw.LogoWrap>

            <tw.NavWrap>
                <tw.Nav>
                    {navItems.map((item, index) => (
                        <tw.NavDirectP key={index} href={`${item.path}`}>
                            {item.label}
                        </tw.NavDirectP>
                    ))}
                </tw.Nav>
            </tw.NavWrap>

            <tw.RearWrap>
                <tw.Nav>
                    <tw.NavDirectP href="/login">로그인</tw.NavDirectP>
                    <tw.SubBtn href="/weaall-hub">Weaall Hub 이용하기</tw.SubBtn>
                </tw.Nav>
            </tw.RearWrap>
        </tw.Container>
    );
}
