"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import * as tw from "./Header.styles";
// Assuming you have an UpIcon component in the same directory
import { DownIcon, UpIcon } from "../ui/hover-header/svg/PostsSvg";
import { roboto } from "@/util/font";

// --- New Component for the Hover Menu ---
// This is a placeholder for the content you want in the dropdown menu
const WeHubHoverMenu = () => {
    // Replace with your actual menu content, links, etc.
    return (
        // Key changes: left-0 right-0 and w-full for full-header-width spanning
        // This component MUST be placed inside the parent element that defines the full header width.
        <div className="absolute top-full left-0 right-0 p-4 bg-white shadow- border-b border-gray-100 z-50 w-full">
            <div className="max-w-6xl mx-auto px-4"> 
                {/* Use a wrapper here if tw.Container has a max-width, to center content */}
                <ul className="flex space-x-8"> 
                    {/* Example content using flex for horizontal layout */}
                    <li><a href="/weaall-hub-link1" className="block text-lg font-bold text-gray-800 hover:text-blue-600">WeHub Features</a></li>
                    <li><a href="/weaall-hub-link2" className="block text-lg font-bold text-gray-800 hover:text-blue-600">Documentation</a></li>
                    <li><a href="/weaall-hub-settings" className="block text-lg font-bold text-gray-800 hover:text-blue-600">Support</a></li>
                </ul>
            </div>
        </div>
    );
};
// ----------------------------------------


export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isHoveringWeHub, setIsHoveringWeHub] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    if (pathname.startsWith("/weaall-ui") || pathname.startsWith("/post") || pathname.startsWith("/newpage")) return null;

    const validPaths = ["/dev", "/prac", "/project"];
    const headerLayout = validPaths.some((path) => pathname.startsWith(path));

    const navItems = [
        { label: "POST", path: "/post" },
        { label: "PRAC", path: "/prac" },
        { label: "ME", path: "/me" },
        { label: "GITHUB", path: "https://github.com/weaall" },
        { label: "DEV", path: "/dev/intro" },
    ];

    return (
        <tw.Container $state={headerLayout} $scrolled={scrolled}>
            <tw.LogoWrap>
                <tw.LogoBtn onClick={() => (window.location.href = "/")}>
                    <tw.Svg alt="" src={"../../assets/weaall-ui.png"} />
                </tw.LogoBtn>
            </tw.LogoWrap>

            <tw.NavWrap className={roboto.className}>
                <tw.Nav>
                    {/* WeHub button with hover functionality 
                        Added 'relative' class to the parent of the button to correctly position the absolute menu
                    */}
                    <div
                        className="relative" 
                        onMouseEnter={() => setIsHoveringWeHub(true)}
                        onMouseLeave={() => setIsHoveringWeHub(false)}
                    >
                        <button className="text-sm flex font-medium bg-white rounded px-3 py-1.5 items-center justify-center hover:bg-gray-100">
                            WeHub
                            <div className="w-[14px] h-[14px] ml-2">
                                {isHoveringWeHub ? <UpIcon /> : <DownIcon />}
                            </div>
                        </button>
                    </div>

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
                    <tw.SubBtn href="/weaall-hub">WeHub 이용하기</tw.SubBtn>
                </tw.Nav>
            </tw.RearWrap>
                                                {isHoveringWeHub && <WeHubHoverMenu />}
        </tw.Container>
    );
}