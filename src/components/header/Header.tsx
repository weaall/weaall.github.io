"use client"
import * as tw from "./Header.styles"

export default function Header() {
    const headerLayout = ["/shallow", "/deep"].includes(window.location.pathname);

    const navItems = [
        { label: "SHALLOW", path: "/shallow" },
        { label: "DEEP", path: "/deep" },
        { label: "PRAC", path: "/prac" },
        { label: "PROJECT", path: "/project" },
    ];


    return (
        <tw.Container $state={headerLayout}>
            <tw.NavWrap>
                <tw.SearchBtn>
                        <tw.SearchSvg alt="" src={"../../assets/svg/search_icon.svg"} />
                </tw.SearchBtn>
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
                    <a href={"/dev/intro"}>
                        <tw.DevLabel>github</tw.DevLabel>
                    </a>
                </tw.DevBtn>
                <tw.DevLabel>/</tw.DevLabel>
                <tw.DevBtn>
                    <a href={"/dev/intro"}>
                        <tw.DevLabel>development</tw.DevLabel>
                    </a>
                </tw.DevBtn>
            </tw.RearWrap>
        </tw.Container>
    )
}
