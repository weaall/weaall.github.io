import tw from "tailwind-styled-components"

export const Container = tw.div`py-16 text-darktext`

export const PostWrap = tw.div`flex flex-col w-[75%] p-5 h-auto`

export const ImgWrap = tw.div`w-full bg-main h-[400px] rounded-basic content-center flex justify-center p-4 bg-white`
export const Img = tw.img`rounded-basic h-full w-full object-contain`

export const TitleWrap = tw.div`py-8 space-y-3 border-b`
export const Title = tw.h1`text-4xl font-medium pb-2`
export const SubTitle = tw.p`text-lg pb-2`
export const SubWrap = tw.div`flex h-auto`
export const SubSvg = tw.div`w-4 h-4 mr-2 mt-[3px]`
export const SubText = tw.p`text-sm mr-10`
export const TagWrap = tw.div`flex space-x-3 h-auto text-black font-medium`
export const Tag = tw.div`mt-1 text-xs bg-t-main px-3 py-1.5 rounded-full cursor-pointer`

export const IndexWrap = tw.div`bg-t-main rounded-lg`