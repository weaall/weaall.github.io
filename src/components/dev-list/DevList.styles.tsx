import tw from "tailwind-styled-components"
import Link from "next/link"

interface BarProps {
    $state: boolean
}

export const Container = tw.div`flex flex-col min-h-dvh`

export const SideContainer = tw.div`flex h-auto mr-8 w-full mobile:w-[28%]`
export const SideWrap = tw.div<BarProps>`flex h-14 w-full items-center pl-6 rounded-2xl cursor-pointer
hover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500
${(p) => (p.$state === true ? "bg-[#eeeeee] font-bold after:text-red-500" : "")}`
export const SideSvg = tw.img`w-6 mr-4`
export const SideLabel = tw.p``

export const PostsContainer = tw.div`w-full space-y-10 h-auto flex flex-col mobile:w-[70%]`
export const PostWrap = tw(Link)`space-y-2 h-auto w-full items-center px-10 py-4 shadow-custom rounded-lg group 
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300 `
export const TopWrap = tw.div`flex justify-between`
export const TopLabel = tw.p`text-sm text-[#aaaaaa]`
export const Title = tw.p`text-2xl font-bold after:content-['.'] after:text-transparent group-hover:after:text-red-500 truncate`
export const SubTitle = tw.p`text-base font-bold text-[#aaaaaa] truncate`
export const tagWrap = tw.div`flex space-x-3 h-auto truncate`
export const tag = tw.div`mt-2 text-xs bg-[#eeeeee] px-2 py-1 rounded-lg`
