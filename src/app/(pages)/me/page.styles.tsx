import tw from "tailwind-styled-components"

export const Container = tw.div``

export const BannerWrap = tw.div`bg-t-main w-full h-auto px-14 pt-12 pb-6 relative z-20
text-main space-y-1 group rounded-b-[60px]` 

export const BannerLabelWrap = tw.div`w-fit p-2`
export const BannerLabel = tw.p`text-7xl font-bold mobile:text-4xl after:content-['.'] after:text-red-500`
export const BannerUnderline = tw.div`w-full h-1 bg-main 
scale-x-0 transition-transform duration-300 transform origin-left group-hover:scale-x-100` 

export const BannerText = tw.p`text-base`

export const MailWrap = tw.div`flex space-x-2`
export const MailSvg = tw.img`w-5`
export const MailText = tw.a`hover:text-white text-base after:content-['.'] after:text-red-500`

export const BtnWrap = tw.div`w-full flex py-3 space-x-4 justify-end`
export const BannerBtn = tw.a`flex bg-[#D3FF55] text-main rounded-full items-center
cursor-pointer justify-center`
export const BtnSvg = tw.img`w-16 h-16 p-4 hover:scale-110`

export const SkillWrap = tw.div`h-60 bg-white rounded-b-[60px] relative -mt-10 pt-10 z-10 flex px-20`
export const Skills = tw.img`w-24 m-auto`
export const ProjectWrap = tw.div`h-60 bg-t-main rounded-b-[60px] relative -mt-10 z-0`
