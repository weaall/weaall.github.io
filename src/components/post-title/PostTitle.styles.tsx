import tw from "tailwind-styled-components"

export const Container = tw.div`pb-20`

export const PostWrap = tw.div`flex flex-col w-[75%] p-5 h-auto`

export const ImgWrap = tw.div`w-full bg-main h-96 rounded-xl mobile:h-60 content-center flex justify-center p-6 `
export const Img = tw.img`rounded-xl h-full w-auto`

export const TitleWrap = tw.div`py-8 space-y-3 border-b-2`
export const Title = tw.h1`text-2xl text-main font-bold after:content-['.'] after:text-red-500`
export const SubTitle = tw.p`text-base`
export const SubWrap = tw.div`flex h-auto`
export const SubSvg = tw.img`w-4 mr-3`
export const SubText = tw.p`text-sm text-main mr-10`
export const TagWrap = tw.div`flex space-x-3 h-auto`
export const Tag = tw.div`mt-2 text-xs bg-t-main px-2 py-1 rounded-lg cursor-pointer`

export const IndexWrap = tw.div`bg-t-main rounded-lg`