import tw from "tailwind-styled-components";

export const Container = tw.div`flex flex-col w-full h-full mt-10 text-main/[0.6] pt-4 px-10 select-none
mobile:px-12`

export const FooterWrap = tw.div`flex max-w-[1080px] h-full pb-10 border-t pt-16
mobile:flex-col-reverse`

export const LeftWrap = tw.div`flex flex-col text-left items-start w-[50%] 
mobile:w-full mobile:justify-center mobile:mx-auto mobile:text-center`
export const MainLabel = tw.p`font-semibold text-main/[0.8] text-lg py-2 mobile:mx-auto`
export const MainP = tw.p`text-xs py-0.5 mobile:mx-auto`
export const LogoSvg = tw.img`w-10 w-10 mobile:mx-auto`

export const RightWrap = tw.div`flex justify-end space-x-16 w-[50%] 
mobile:w-full mobile:justify-center mobile:mx-auto mobile:pb-10`
export const ColWrap = tw.div`flex flex-col space-y-2.5 text-left`
export const TopLabel = tw.label`text-xs font-semibold`
export const Index = tw.a`text-xs`

export const NavWrap = tw.div`flex border-t border-main/[0.6] w-full py-6 justify-end items-center space-x-6`
export const NavBtn = tw.a`w-5 h-5`
export const NavImg = tw.img`w-full h-full`