import tw from "tailwind-styled-components"

export const Container = tw.div``

export const BannerWrap = tw.div`bg-t-main w-full h-auto px-14 pt-12 pb-6
text-main space-y-1 group rounded-b-[60px] mobile:rounded-b-[30px] mobile:pt-0 mobile:pb-2` 

export const BannerLabelWrap = tw.div`w-fit p-2`
export const BannerLabel = tw.p`text-7xl font-bold mobile:text-4xl after:content-['.'] after:text-red-500 mobile:text-[3.5rem]`
export const BannerUnderline = tw.div`w-full h-1 bg-main 
scale-x-0 transition-transform duration-300 transform origin-left group-hover:scale-x-100` 

export const BannerText = tw.p`text-base`

export const MailWrap = tw.div`flex space-x-2`
export const MailSvg = tw.img`w-5`
export const MailText = tw.a`hover:text-white text-base after:content-['.'] after:text-red-500`

export const BtnWrap = tw.div`w-full flex py-3 space-x-4 justify-end mobile:justify-center mobile:py-10`
export const BannerBtn = tw.a`flex w-32 h-12 bg-main text-main rounded-full items-center flex gap-x-2
cursor-pointer justify-center hover:bg-main/[0.8]`
export const BtnLabel = tw.label`text-white text-xs font-medium cursor-pointer`
export const BtnSvg = tw.img`w-4 h-4`
