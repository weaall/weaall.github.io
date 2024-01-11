import tw from "tailwind-styled-components"
import Link from 'next/link'

interface NavStateProps {
    $state: boolean
}

export const Container = tw.div`max-w-[1080px] w-full pt-8 pb-12 flex items-center justify-between text-lg font-bold text-t-main`

export const NavWrap = tw.nav`
flex w-4/5 justify-between items-center`
export const Nav = tw.nav<NavStateProps>`
${(p) => (p.$state === true ? "w-[75%] px-12 duration-1000" : "w-14 duration-500")}
bg-main h-12 mx-4 flex relative rounded-3xl text-centerjustify-between transition-all ease-in`
export const NavDrawerBtn = tw.button<NavStateProps>`
${(p) => (p.$state === true ? "invisible opacity-0 w-[0px]" : "visible opacity-1")}
px-3 py-2 absolute transition-all ease-in duration-500 delay-500`
export const NavDrawerSvg = tw.img`w-8 hover:scale-110`
export const NavDirectWrap = tw.div<NavStateProps>`
${(p) => (p.$state === true ? "visible opacity-1 delay-1000" : "invisible opacity-0 w-[0px]")}
min-w-[90px] w-full transition-all ease-in duration-100 text-center m-auto`
export const NavDirectP = tw(Link)`hover:after:text-red-500 after:content-['.'] after:text-transparent`

export const SearchWrap = tw.div<NavStateProps>`
${(p) => (p.$state === true ? "w-14 duration-500" : "w-[75%] duration-1000")}
bg-main h-12 p-2 rounded-3xl flex justify-between transition-all ease-in `
export const SearchInput = tw.input<NavStateProps>`
${(p) => (p.$state === true ? "invisible w-[0px] duration-100" : "visible w-[80%] mx-8 duration-1000")}
bg-transparent text-xl transition-all outline-none ease-in`
export const SearchBtn = tw.button``
export const SearchSvg = tw.img`min-w-10 m-auto hover:scale-110`

export const GnbBtn = tw(Link)`bg-main min-w-14 h-12 mx-3 rounded-3xl group `
export const GnbSvg = tw.img`w-8 h-full m-auto group-hover:scale-110`
export const GnbText = tw.p`mb-1 group-hover:scale-110 text-xl`

export const EnBtn = tw.button`bg-main min-w-14 h-12 mx-3 rounded-3xl group`
