import tw from "tailwind-styled-components"

export const Container = tw.div``

export const BannerWrap = tw.div`bg-t-main w-full h-auto px-14 pt-12 pb-6 relative z-50
text-main space-y-1 group rounded-b-[60px]`

export const ProfileWrap = tw.div`absolute bottom-0 right-0 px-20 mobile:px-auto`
export const ProfileBg = tw.div``
export const ProfilePic = tw.img`w-[24rem] mobile:w-full`

export const BannerLabelWrap = tw.div`relative w-fit p-2 pb-12 h-60 mobile:h-96`
export const BannerLabel = tw.p`text-9xl font-bold mobile:text-9xl after:content-['.'] after:text-red-500 z-10
text-shadow-custom custom-border-radius`
export const BannerUnderline = tw.div`w-full h-1 bg-main z-10 
scale-x-0 transition-transform duration-300 transform origin-left group-hover:scale-x-100 mobile:group-hover:scale-x-0`
export const BannerText = tw.p`text-lg font-medium pt-2
text-shadow-custom custom-border-radius`

export const MailWrap = tw.div`flex space-x-2`
export const MailSvg = tw.img`w-5`
export const MailText = tw.a`hover:text-white text-base after:content-['.'] after:text-red-500`

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
export const ProjectWrap = tw.div`flex flex-col gap-3 py-10`
export const ProjectTitle = tw.h2`text-center font-semibold text-2xl`
export const ProjectSubTitle = tw.label``
export const ProjectImg = tw.img``

export const RearWrap = tw.div`w-full h-60 bg-t-main rounded-b-[60px] relative -mt-36 pt-40 z-10`

