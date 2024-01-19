import tw from "tailwind-styled-components"

export const Container = tw.div``

export const BannerWrap = tw.div`bg-main w-full h-auto rounded-2xl px-14 pt-12 pb-6 text-t-main space-y-1`
export const BannerLabel = tw.p`text-7xl font-bold py-4 after:content-['.'] after:text-red-500`
export const BannerText = tw.p`text-base`

export const MailWrap = tw.div`flex space-x-2`
export const MailSvg = tw.img`w-5`
export const MailText = tw.a`hover:text-white text-base after:content-['.'] after:text-red-500`

export const BtnWrap = tw.div`flex py-3 space-x-4`
export const BannerBtn = tw.a`flex bg-white text-main px-5 py-2 rounded-lg items-center hover:bg-t-main cursor-pointer`
export const BtnSvg = tw.img`w-6 mr-2`