import tw from "tailwind-styled-components";

export const Container = tw.div`flex flex-col w-full h-full mt-4 max-w-[1080px] mx-auto select-none
mobile:px-12`

export const FooterWrap = tw.div`flex max-w-[1200px] h-full pb-10 pt-16
mobile:flex-col-reverse`

export const LeftWrap = tw.div`flex flex-col text-left items-start w-[25%] 
mobile:w-full mobile:justify-center mobile:mx-auto mobile:text-center`
export const LogoSvg = tw.img`w-10 w-10 mobile:mx-auto`

export const RightWrap = tw.div`flex justify-end space-x-16 w-[75%] 
mobile:w-full mobile:justify-center mobile:mx-auto mobile:pb-10`
export const ColWrap = tw.div`flex flex-col space-y-1.5 text-left flex-1`
export const TopLabel = tw.label`text-base font-semibold`
export const Index = tw.a`text-[0.9375rem] font:thin hover:underline`

export const NavWrap = tw.div`flex w-full py-6 justify-end items-center space-x-6`
export const NavBtn = tw.a`w-5 h-5`
export const NavImg = tw.img`w-full h-full`