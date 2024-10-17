import Link from "next/link";
import tw from "tailwind-styled-components";

export const Container = tw.div`relative flex flex-col w-full space-y-10 h-auto text-main my-6 pb-10`

export const LabelWrap = tw.div`absolute top-2 rounded-2xl py-3 px-6 bg-white w-fit ml-8` 
export const Label = tw.p`text-3xl font-bold after:content-['.'] after:text-red-500`

export const BannerWrap = tw.div`bg-t-main w-full h-1 rounded-2xl text-t-main`

export const PostContainer = tw.div`flex space-x-[2%] mobile:flex-col mobile:space-y-6 mobile:space-x-0`
export const PostWrap = tw(Link)`space-y-2 h-auto w-[32%] items-center px-10 py-4 shadow-custom rounded-lg group 
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300  mobile:w-full`

export const TopWrap = tw.div`flex justify-between`
export const TopLabel = tw.p`text-sm text-[#aaaaaa]`
export const Title = tw.p`text-xl font-bold truncate after:content-['.'] after:text-transparent group-hover:after:text-red-500`
export const SubTitle = tw.p`text-sm font-medium text-[#aaaaaa] truncate`
export const TagWrap = tw.div`flex space-x-3 h-auto truncate`
export const tag = tw.div`mt-2 text-xs bg-t-main px-2 py-1 rounded-lg`