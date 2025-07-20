import tw from "tailwind-styled-components";
import Link from "next/link";

interface HeaderLayout {
    $state: boolean;
}

export const Container = tw.div<HeaderLayout>`w-full px-6 py-3 flex items-center justify-between mb-20 m:mb-12
${(p) => (p.$state ? "" : "")}`;

export const LogoWrap = tw.div`flex w-1/3 items-center justify-start m:w-auto`;
export const LogoBtn = tw.button`w-10 h-10 bg-white rounded-full mr-2 `;
export const Svg = tw.img`w-full h-full m-auto`;

export const NavWrap = tw.nav`flex w-1/3 justify-center items-center m:hidden`;
export const Nav = tw.nav`w-auto items-center flex space-x-2`;
export const NavDirectP = tw(Link)`text-sm font-medium bg-white rounded px-3 py-1.5 items-center hover:bg-gray-100`;

export const RearWrap = tw.div`flex w-1/3 items-center justify-end m:w-auto`;
export const SubBtn = tw(Link)`text-sm font-medium text-white py-2 px-4 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors`;
