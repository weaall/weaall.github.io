import tw from "tailwind-styled-components"

export const Container = tw.div``

export const BannerWrap = tw.div`bg-t-main w-full h-auto px-14 pt-12 pb-6 relative z-50
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

export const SkillWrap = tw.div`w-full h-auto flex bg-white relative rounded-b-[60px] -mt-10 pt-20 pb-10 z-40 px-20
mobile:px-6 mobile:flex-wrap mobile:justify-between`
export const Skills = tw.img`w-20 h-auto m-auto hover:scale-105 mobile:w-1/3 mobile:px-12`

export const PartsWrap = tw.div`w-full h-auto flex flex-col bg-t-main rounded-b-[60px] relative -mt-36 pt-40 pb-10 px-20 z-30
mobile:px-20`
export const PartsWrapTitle = tw.h2`text-center font-semibold text-2xl py-10`
export const PartList = tw.div`w-full flex mobile:flex-col`
export const PartWrap = tw.div`flex flex-col m-auto w-1/4 px-8 mobile:w-full py-4`
export const PartSvg = tw.img`w-8`
export const PartLabel = tw.label`text-sm font-semibold py-2`
export const PartText = tw.p`text-xs`

export const ProjectsWrap = tw.div`w-full h-auto bg-white rounded-b-[60px] relative -mt-36 pt-40 pb-10 px-20 z-20
mobile:px-6`
export const ProjectWrap = tw.div`flex flex-col py-10`
export const ProjectTitle = tw.h2`text-center font-semibold text-2xl`
export const ProjectSubTitle = tw.label``
export const ProjectImg = tw.img``

export const RearWrap = tw.div`w-full h-60 bg-t-main rounded-b-[60px] relative -mt-36 pt-40 z-10`

