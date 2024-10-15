import tw from "tailwind-styled-components"

export const Container = tw.div`mb-16`
export const BannerContainer = tw.div`relative h-60 pt-8`

export const LabelWrap = tw.div`absolute top-0 rounded-2xl py-3 px-6 bg-white w-fit ml-8` 
export const Label = tw.p`text-4xl font-bold after:content-['.'] after:text-red-500`

export const BannerWrap = tw.div`flex bg-main w-full h-52 rounded-2xl px-14 py-12 text-t-main space-y-1 items-center`
export const BannerText = tw.p`text-xl`

export const ImgWrap = tw.div`absolute top-3 right-28 w-60 mobile:hidden`
export const BannerImg = tw.img``