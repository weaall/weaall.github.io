import tw from "tailwind-styled-components";

export const Container = tw.div`relative flex flex-col w-full space-y-8 h-auto text-main my-6 px-10 mobile:px-2`

export const LabelWrap = tw.div`absolute top-1 rounded-2xl py-3 px-6 bg-white w-fit ml-8` 
export const Label = tw.p`text-3xl font-bold after:content-['.'] after:text-red-500 mobile:text-2xl`
export const DirectBtn = tw.button`flex bg-white w-auto px-4 text-xs h-7 rounded-full items-center gap-x-1
hover:bg-gray-100 mobile:hover:bg-white`
export const BtnP = tw.p`font-medium`
export const BtnImg = tw.img`w-4`

export const BannerWrap = tw.div`bg-t-main w-full h-1 rounded-2xl`

export const PostContainer = tw.div`flex space-x-[2%] mobile:flex-col mobile:space-y-6 mobile:space-x-0`
export const PostWrap = tw.a`space-y-2 h-auto  w-[32%] items-center px-6 py-4 shadow-custom rounded-lg group 
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300 mobile:w-full`

export const TopWrap = tw.div`flex justify-between`
export const TopLabel = tw.p`text-sm text-[#aaaaaa]`
export const Title = tw.p`text-lg font-semibold truncate after:content-['.'] after:text-transparent group-hover:after:text-red-500`
export const SubTitle = tw.p`text-sm truncate`
export const TagWrap = tw.div`flex space-x-3 h-auto truncate`
export const Tag = tw.div`mt-2 text-xs bg-t-main px-2 py-1 rounded-lg`
export const SpanWrap = tw.div`flex space-x-[1.5px]`
export const Span = tw.span`h-8 w-[2px] bg-gray-300 rounded-full`