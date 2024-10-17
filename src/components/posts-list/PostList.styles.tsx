import tw from "tailwind-styled-components"
import Link from "next/link"

interface BarProps {
    $state: boolean
}

export const Container = tw.div`flex min-h-dvh px-10 mobile:px-2`

export const SideContainer = tw.div` h-auto mr-8 w-72 mobile:w-[28%]`
export const SideWrap = tw.div<BarProps>`flex h-14 w-full items-center pl-6 rounded-2xl cursor-pointer
hover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500
${(p) => (p.$state === true ? "bg-t-main font-bold after:text-red-500" : "")}`
export const SideSvg = tw.img`w-6 mr-4`
export const SideLabel = tw.p``

export const PostsContainer = tw.div`w-full space-y-10 h-auto flex flex-col mobile:w-[70%]`
export const PostWrap = tw(Link)`space-y-2 h-auto w-full items-center px-10 py-4 shadow-custom rounded-lg group 
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300 `
export const TopWrap = tw.div`flex justify-between`
export const TopLabel = tw.p`text-sm text-[#aaaaaa]`
export const Title = tw.p`text-xl font-bold after:content-['.'] after:text-transparent group-hover:after:text-red-500 truncate`
export const SubTitle = tw.p`text-sm truncate`
export const TagWrap = tw.div`flex space-x-3 h-auto truncate`
export const Tag = tw.div`mt-2 text-xs bg-t-main px-2 py-1 rounded-lg`
