import tw from "tailwind-styled-components";

export const Container = tw.div`relative flex flex-col w-full space-y-10 h-auto text-main my-3 px-10 mobile:px-2`

export const LabelWrap = tw.div`absolute top-2 rounded-2xl py-3 px-6 bg-white w-fit ml-8`

export const LabelFlex = tw.div`flex bg-main w-auto h-auto items-center py-1.5 px-2.5 rounded-full gap-x-8`
export const Label = tw.p` text-2xl text-white font-medium after:content-['.'] after:text-red-500 pl-4
mobile:text-2xl`
export const DirectBtn = tw.button`flex bg-white w-auto px-4 text-xs h-7 rounded-full items-center gap-x-1
hover:bg-gray-100 mobile:hover:bg-white`
export const BtnP = tw.p`font-medium`
export const BtnImg = tw.img`w-3`

export const BannerWrap = tw.div`bg-t-main w-full h-1 rounded-2xl text-t-main`

export const PostContainer = tw.div`flex space-x-[2%] mobile:flex-col mobile:space-y-6 mobile:space-x-0`

export const PostOuterWrap = tw.div`h-auto w-[32%] hover:bg-gray-100 rounded-3xl`
export const PostWrap = tw.a`flex h-auto w-full items-center px-5 py-6 rounded-3xl group
 transition-all duration-300 mobile:w-full 
bg-main hover:w-[92%]`

export const PostInnerWrap = tw.div`flex flex-col space-y-2 w-full px-3 transition-all duration-300`

export const TopWrap = tw.div`flex w-full justify-between`
export const TopLabel = tw.p`text-xs text-[#aaaaaa]`
export const Title = tw.p`font-medium text-lg truncate text-white`
export const SubTitle = tw.p`text-sm truncate text-gray-200`
export const TagWrap = tw.div`flex space-x-3 h-auto truncate`
export const Tag = tw.div`mt-2 text-xs bg-gray-100 px-2 py-1 rounded-full`
export const SpanWrap = tw.div`flex space-x-[1.5px]`
export const Span = tw.span`h-8 w-[2px] bg-gray-300 rounded-full`