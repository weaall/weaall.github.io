import tw from "tailwind-styled-components";

export const Container = tw.div`flex flex-col w-full h-full border-t mt-20 text-main pt-16 px-28 select-none
`

export const FooterWrap = tw.div`flex max-w-[1080px] justify-between flex mobile:flex-col
pb-10`

export const LeftWrap = tw.div`flex flex-col text-left items-start w-[50%]`
export const MainLabel = tw.p`font-semibold text-main text-lg py-2`
export const MainP = tw.p`text-xs py-0.5`
export const LogoSvg = tw.img`w-10 w-10`

export const RightWrap = tw.div`flex justify-end space-x-16 w-[50%]`
export const ColWrap = tw.div`flex flex-col space-y-2.5 text-left`
export const TopLabel = tw.label`text-xs font-semibold`
export const Index = tw.a`text-xs`

export const NavWrap = tw.div`flex border-t border-main w-full py-6 justify-end items-center space-x-6`
export const NavBtn = tw.a`w-5 h-5`
export const NavImg = tw.img`w-full h-full`