import tw from "tailwind-styled-components"

export const Container = tw.div`text-(--text) mb-8`

export const ImgWrap = tw.div`w-[700px] max-w-full bg-main h-[400px] rounded-2xl content-center flex justify-center p-4 bg-white`
export const Img = tw.img`rounded-xl h-full w-full object-contain`

export const TitleWrap = tw.div`pb-8 space-y-3 border-b`
export const Title = tw.h1`text-[40px] font-bold pt-[11px] px-[2px] pb-[4px] text-(--text) relative w-full`
export const SubTitle = tw.p`text-lg pb-2`
export const TagWrap = tw.div`flex space-x-3 h-auto text-black font-medium`
export const Tag = tw.div`mt-1 text-xs bg-t-main px-3 py-1.5 rounded-full cursor-pointer`