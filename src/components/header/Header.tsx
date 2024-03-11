"use client"
import { useState } from "react"
import * as tw from "./Header.styles"

export default function Header() {
    const [navState, setNavState] = useState(true)
    const [searchInput, setSearchInput] = useState("")

    const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }

    const navItems = [
        { label: "SHALLOW", path: "/shallow" },
        { label: "DEEP", path: "/deep" },
        { label: "PRAC", path: "/prac" },
        { label: "PROJECT", path: "/project" },
    ]

    const navFunction = () => {
        if (navState === false) {
            setNavState(true)
        } else {
        }
    }

    const searchFunction = () => {
        if (navState === true) {
            setNavState(false)
        } else {
        }
    }

    return (
        <tw.Container>
            <tw.GnbBtn href={"/"}>
                <tw.GnbSvg alt="" src={"../../assets/svg/user_icon.svg"}></tw.GnbSvg>
            </tw.GnbBtn>

            <tw.NavWrap>
                <tw.Nav $state={navState}>
                    <tw.NavDrawerBtn $state={navState} onClick={navFunction}>
                        <tw.NavDrawerSvg alt="" src={"../../assets/svg/menu_icon.svg"} />
                    </tw.NavDrawerBtn>
                    {navItems.map((item, index) => (
                        <tw.NavDirectWrap $state={navState} key={index}>
                            <tw.NavDirectP href={`${item.path}`}>{item.label}</tw.NavDirectP>
                        </tw.NavDirectWrap>
                    ))}
                </tw.Nav>

                <tw.SearchWrap $state={navState}>
                    <tw.SearchInput $state={navState} value={searchInput} onChange={onChangeSearchInput}></tw.SearchInput>
                    <tw.SearchBtn onClick={searchFunction}>
                        <tw.SearchSvg alt="" src={"../../assets/svg/search_icon.svg"} />
                    </tw.SearchBtn>
                </tw.SearchWrap>
            </tw.NavWrap>

            <tw.DevBtn>
                <a href={"/dev"}>
                    <tw.DevLabel>dev</tw.DevLabel>
                </a>
            </tw.DevBtn>
        </tw.Container>
    )
}
