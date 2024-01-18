import tw from "tailwind-styled-components";

export const Container = tw.div`w-full border-t mt-20 text-t-main`

export const FooterWrap = tw.div`mx-auto max-w-[1080px] h-40 justify-between flex`

export const LabelWrap = tw.div`flex flex-col m-auto text-center space-y-1 w-[33%]`
export const NameTag = tw.p`font-bold text-2xl`
export const EmailTag = tw.p`text-sm`

export const GnbSvg = tw.img`w-8 h-full m-auto group-hover:scale-110`

export const NavWrap = tw.div`flex m-auto space-x-4 w-[33%]`
export const NavTag = tw.a`font-bold text-base`