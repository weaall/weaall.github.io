"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// 경로는 사용자 환경에 맞게 수정이 필요할 수 있습니다.
import * as tw from "./Header.styles";
import { DownIcon, UpIcon } from "../ui/hover-header/svg/PostsSvg";
import { roboto } from "@/util/font";

// WeHubHoverMenu 컴포넌트
const WeHubHoverMenu = () => {
    // 이 컴포넌트는 tw.Container 바로 아래에 렌더링되며,
    // tw.Container가 일반적으로 창 너비만큼 확장되므로 w-full이 창 너비를 따릅니다.
    // absolute top-full left-0 right-0 w-full 클래스를 그대로 유지하여 헤더의 전체 너비를 차지하게 합니다.
    return (
        // 창 너비에 맞추기 위해 left-0, right-0, w-full을 유지합니다.
        <div className="absolute top-full left-0 right-0 pt-2 pb-8  bg-white shadow-lg border-b border-gray-100 z-50 w-full flex justify-center">
            <div className="flex justify-between max-w-7xl w-full px-4">
                <div className="w-1/2">
                    <p className="text-sm text-gray-400 pl-2 font-medium">기능</p>
                    <div className="w-full flex">
                        <div className="w-1/2 flex flex-col pr-10 pt-4">
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className={`text-xl font-semibold ${roboto.className}`}>WeHub AI</label>
                                <p className="text-xs text-gray-400">구축, 작성, 자동화를 위한 툴</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">에이전트</label>
                                <p className="text-xs text-gray-400">수동 작업 처리</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">기업 통합 검색</label>
                                <p className="text-xs text-gray-400">즉시 답변을 찾을 수 있는 기능</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">AI 노트</label>
                                <p className="text-xs text-gray-400">AI가 완벽하게 정리해 드립니다.</p>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col pr-10 pt-4">
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">문서</label>
                                <p className="text-xs text-gray-400">간단하면서도 강력한 툴</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">지식 베이스</label>
                                <p className="text-xs text-gray-400">모든 지식을 한데 모은 허브</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">프로젝트</label>
                                <p className="text-xs text-gray-400">어떤 프로젝트든 관리할 수 있는 툴</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">사이트</label>
                                <p className="text-xs text-gray-400">뭐든 빠르게 게시할 수 있는 툴</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2">
                    <p className="text-sm text-gray-400 pl-2 font-medium">시작하기</p>
                    <div className="w-full flex">
                        <div className="w-1/2 flex flex-col pr-10 pt-4">
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">WeHub AI</label>
                                <p className="text-xs text-gray-400">구축, 작성, 자동화를 위한 툴</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">에이전트</label>
                                <p className="text-xs text-gray-400">수동 작업 처리</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">기업 통합 검색</label>
                                <p className="text-xs text-gray-400">즉시 답변을 찾을 수 있는 기능</p>
                            </div>
                            <div className="w-full flex-1 flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-100">
                                <label className="text-xl font-semibold">AI 노트</label>
                                <p className="text-xs text-gray-400">AI가 완벽하게 정리해 드립니다.</p>
                            </div>
                        </div>
                        <div className="w-1/2 flex justify-center items-center">
                            <img src="../../assets/header_menu_image.webp" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Header 컴포넌트
export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    
    // 메뉴 호버 상태 (마우스가 영역에 있을 때)
    const [isHoveringWeHub, setIsHoveringWeHub] = useState(false); 
    
    // 메뉴 클릭 상태 (클릭으로 메뉴를 열었을 때 고정)
    const [isMenuClicked, setIsMenuClicked] = useState(false); 

    // 최종적으로 메뉴가 열려 있어야 하는 상태: 호버 중이거나, 클릭으로 고정된 상태
    const isMenuOpen = isHoveringWeHub || isMenuClicked; 
    
    // WeHub 버튼 클릭 핸들러: 클릭할 때마다 isMenuClicked 상태 토글
    const handleWeHubClick = () => {
        setIsMenuClicked(prev => !prev);
        // 클릭으로 열었을 때는 호버 상태를 강제로 true로 설정할 필요가 없습니다. 
        // isMenuOpen이 isMenuClicked를 포함하므로.
    };
    
    // ⭐ 마우스가 Header 영역을 벗어났을 때 호버 상태를 해제하는 핸들러
    const handleMouseLeaveHeader = () => {
        // 클릭으로 고정된 상태가 아니라면, 호버 상태를 해제합니다.
        // isMenuClicked가 true이면 클릭으로 고정되었으므로 닫히지 않습니다.
        if (!isMenuClicked) {
             setIsHoveringWeHub(false);
        }
    };
    
    // ⭐ 마우스가 버튼 영역에 진입했을 때 호버 상태를 설정하는 핸들러
    const handleMouseEnterHeader = () => {
        setIsHoveringWeHub(true);
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
        };
    }, [isMenuClicked]);

    if (pathname.startsWith("/weaall-ui") || pathname.startsWith("/post") || pathname.startsWith("/newpage")) return null;

    const validPaths = ["/dev", "/prac", "/project"];
    const headerLayout = validPaths.some((path) => pathname.startsWith(path));

    const navItems = [
        { label: "POST", path: "/post" },
        { label: "PRAC", path: "/prac" },
        { label: "ME", path: "/me" },
        { label: "GITHUB", path: "https://github.com/weaall" },
        { label: "DEV", path: "/dev/intro" },
        { label: "PORTFOLIO", path: "/portfolio" },
    ];

    return (
        // tw.Container에 마우스 이벤트 핸들러를 추가하여,
        // Header 영역 전체가 호버 영역이 되도록 합니다.
        // tw.Container가 position: relative 또는 position: fixed/sticky를 가질 것으로 가정합니다.
        <tw.Container 
            $state={headerLayout} 
            $scrolled={scrolled}
            // ⭐ Header 컴포넌트의 최상위 컨테이너에 호버 이벤트 추가
            onMouseEnter={handleMouseEnterHeader}
            onMouseLeave={handleMouseLeaveHeader}
        >
            <tw.LogoWrap>
                <tw.LogoBtn onClick={() => (window.location.href = "/")}>
                    <tw.Svg alt="" src={"../../assets/weaall-ui.png"} />
                </tw.LogoBtn>
            </tw.LogoWrap>

            <tw.NavWrap className={roboto.className}>
                <tw.Nav>
                    {/* 호버 이벤트를 tw.Container로 옮겼으므로, 이 div는 relative만 유지합니다. */}
                    <div className="relative">
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

            {/* ⭐ WeHubHoverMenu를 다시 tw.Container 바로 안으로 옮겨 전체 너비를 차지하도록 합니다. */}
            {isMenuOpen && <WeHubHoverMenu />}
            
        </tw.Container>
    );
}