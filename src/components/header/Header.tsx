"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import * as tw from "./Header.styles";
import { DownIcon, UpIcon } from "../ui/hover-header/svg/PostsSvg";
import { roboto } from "@/util/font";
import WeHubHoverMenu from "./WeHubHoverMenu";

// Header 컴포넌트
export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    
    const [isMenuOpenInternal, setIsMenuOpenInternal] = useState(false); 
    const [isMenuClicked, setIsMenuClicked] = useState(false); 
    
    // ⭐ TimeOut ID를 저장할 ref (렌더링에 영향을 주지 않음)
    const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 최종적으로 메뉴가 열려 있어야 하는 상태
    const isMenuOpen = isMenuOpenInternal || isMenuClicked; 
    
    const handleWeHubClick = () => {
        // 클릭 시 호버 상태는 비활성화하고, 클릭 고정 상태를 토글합니다.
        setIsMenuClicked(prev => !prev);
    };
    
    // ⭐ 마우스 영역 진입 핸들러: 타이머를 즉시 취소하고 메뉴를 M
    const handleMouseEnterWeHubArea = () => { 
        // 닫기 타이머가 작동 중이면 취소합니다.
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
        setIsMenuOpenInternal(true);
    };
    
    // ⭐ 마우스 영역 이탈 핸들러: 닫기 명령을 200ms 지연시킴
    const handleMouseLeaveWeHubArea = () => { 
        if (!isMenuClicked) {
            // 200ms 후에 메뉴를 닫도록 타이머를 설정합니다.
            leaveTimeoutRef.current = setTimeout(() => {
                 setIsMenuOpenInternal(false);
                 leaveTimeoutRef.current = null;
            }, 200); // 200ms는 마우스 이동 속도에 적절한 값입니다.
        }
    };


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
            // 스크롤 발생 시 클릭으로 고정된 메뉴를 닫습니다.
            if (isMenuClicked) setIsMenuClicked(false);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            // 컴포넌트 언마운트 시 타이머 정리
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
            }
        };
    }, [isMenuClicked]);
    
    // ... (경로 체크 및 navItems 생략) ...
    if (pathname.startsWith("/post") || pathname.startsWith("/newpage")) return null;

    const validPaths = ["/dev", "/prac", "/project"];
    const headerLayout = validPaths.some((path) => pathname.startsWith(path));

    const navItems = [
        { p: "POST", path: "/post" },
        { p: "PRAC", path: "/prac" },
        { p: "ME", path: "/me" },
        { p: "GITHUB", path: "https://github.com/weaall" },
        { p: "DEV", path: "/dev/intro" },
        { p: "PORTFOLIO", path: "/portfolio" },
    ];


    return (
        <tw.Container 
            $state={headerLayout} 
            $scrolled={scrolled}
        >
            <tw.LogoWrap>
                <tw.LogoBtn onClick={() => router.push("/")}>
                    <tw.Svg alt="" src={"../../assets/weaall-ui.png"} />
                </tw.LogoBtn>
            </tw.LogoWrap>

            <tw.NavWrap className={roboto.className}>
                <tw.Nav>
                    {/* 1. WeHub 버튼 래퍼 */}
                    <div 
                        className="relative h-full flex items-center" 
                        onMouseEnter={handleMouseEnterWeHubArea} // 들어오면 타이머 취소 및 메뉴 M
                        onMouseLeave={handleMouseLeaveWeHubArea} // 나가면 200ms 딜레이 후 끔
                    >
                        <button 
                            className={`text-sm flex font-medium rounded px-3 py-1.5 items-center justify-center 
                                        ${isMenuOpen ? 'bg-gray-100' : 'bg-white hover:bg-gray-100'}`}
                            onClick={handleWeHubClick}
                        >
                            WeHub
                            <div className="w-[14px] h-[14px] ml-2">
                                {isMenuOpen ? <UpIcon /> : <DownIcon />}
                            </div>
                        </button>
                    </div> 

                    {navItems.map((item, index) => (
                        <tw.NavDirectP key={index} href={`${item.path}`}>
                            {item.p}
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

            {/* 2. 메뉴 렌더링 래퍼 */}
            {isMenuOpen && (
                <div
                    // 메뉴 자체에 마우스가 들어오면 다시 onMouseEnter를 발생시켜 타이머를 취소합니다.
                    onMouseEnter={handleMouseEnterWeHubArea}
                    onMouseLeave={handleMouseLeaveWeHubArea}
                >
                    <WeHubHoverMenu />
                </div>
            )}
            
        </tw.Container>
    );
}