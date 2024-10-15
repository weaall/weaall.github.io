import tw from "tailwind-styled-components"
import Link from 'next/link'

interface HeaderLayout{
    $state: boolean;
}

export const Container = tw.div<HeaderLayout>`max-w-[1080px] w-full flex items-center justify-between rounded-t-[60px] mt-4
bg-t-main px-8 py-10 font-medium mobile:mt-0 mobile:rounded-none 
${(p)=> (p.$state ? "rounded-[60px] mb-10" : "")}`

export const NavWrap = tw.nav`flex w-auto justify-between items-center`
export const Nav = tw.nav`w-auto items-center flex space-x-2`
export const NavDirectWrap = tw.div`text-main text-xs bg-white rounded-full px-2 py-1.5 items-center`
export const NavDirectP = tw(Link)`
hover:after:text-red-500 after:content-['.'] after:text-transparent`

export const SearchBtn = tw.button`bg-white rounded-2xl mr-2`
export const SearchSvg = tw.img`w-7 h-7 m-auto hover:scale-105`

export const RearWrap = tw.div`flex`
export const DevBtn = tw.button`text-main text-xs group`
export const DevLabel = tw.p`px-0.5 group-hover:scale-105
hover:after:text-red-500 after:content-['.'] after:text-transparent`
