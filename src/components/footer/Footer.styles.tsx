import tw from "tailwind-styled-components";

export const Container = tw.div`flex flex-col w-full h-full mt-4 max-w-[1080px] mx-auto select-none px-6
m:px-6`

export const FooterWrap = tw.div`flex max-w-[1200px] h-full pb-10 pt-16
m:flex-col-reverse m:gap-10 m:pt-10`

export const LeftWrap = tw.div`flex flex-col text-left items-start w-[25%]
m:w-full m:items-center m:text-center`
export const LogoSvg = tw.img`w-10 w-10 m:mx-auto`

export const RightWrap = tw.div`flex justify-end space-x-16 w-[75%]
m:w-full m:space-x-0 m:grid m:grid-cols-2 m:gap-x-6 m:gap-y-8`
export const ColWrap = tw.div`flex flex-col space-y-1.5 text-left flex-1`
export const TopLabel = tw.label`text-base font-semibold`
export const Index = tw.a`text-[0.9375rem] font:thin hover:underline`

export const NavWrap = tw.div`flex w-full py-6 justify-end items-center space-x-6`
export const NavBtn = tw.a`w-5 h-5`
export const NavImg = tw.img`w-full h-full`