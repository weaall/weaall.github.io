import tw from "tailwind-styled-components"

export const Container = tw.div`pb-20`

export const PostWrap = tw.div`flex flex-col w-[75%] p-5 h-auto`

export const ImgWrap = tw.div`w-full bg-main h-96 rounded-lg`
export const Img = tw.img``

export const TitleWrap = tw.div`py-16 space-y-4 border-b-2`
export const Title = tw.h1`text-3xl text-main font-bold after:content-['.'] after:text-red-500`
export const SubTitle = tw.p`text-xl`
export const SubWrap = tw.div`flex h-auto`
export const SubSvg = tw.img`w-4 mr-3`
export const SubText = tw.p`text-sm text-main mr-10`
export const TagWrap = tw.div`flex space-x-3 h-auto`
export const Tag = tw.div`mt-2 text-xs bg-[#eeeeee] px-2 py-1 rounded-lg cursor-pointer`

export const IndexWrap = tw.div`bg-[#eeeeee] rounded-lg`