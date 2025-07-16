import tw from "tailwind-styled-components"
import Link from 'next/link'

interface HeaderLayout{
    $state: boolean;
}

export const Container = tw.div<HeaderLayout>`w-full px-6 py-2 flex items-center justify-between mb-4
${(p) => (p.$state ? "" : "")}`;

export const LogoWrap = tw.div`flex w-1/3 items-center justify-start`;
export const LogoBtn = tw.button`w-10 h-10 bg-white rounded-full mr-2 `;
export const Svg = tw.img`w-full h-full m-auto`;

export const NavWrap = tw.nav`flex w-1/3 justify-center items-center`;
export const Nav = tw.nav`w-auto items-center flex space-x-2`;
export const NavDirectWrap = tw.div`text-main text-xs bg-white rounded px-3 py-1.5 items-center hover:bg-gray-100`;
export const NavDirectP = tw(Link)`text-sm font-medium`;

export const RearWrap = tw.div`flex w-1/3 items-center justify-end`;
export const DevBtn = tw.button`text-main text-xs group`;
export const DevLabel = tw.p`px-0.5 group-hover:scale-105
hover:after:text-red-500 after:content-['.'] after:text-transparent`;
