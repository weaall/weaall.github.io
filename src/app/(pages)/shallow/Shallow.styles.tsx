import tw from "tailwind-styled-components"

interface BarProps {
    $state: boolean
}

export const Container = tw.div`text-main`

export const BannerContainer = tw.div`relative h-60 pt-8 mb-16`

export const LabelWrap = tw.div`absolute top-0 rounded-2xl py-3 px-6 bg-white w-fit ml-8` 
export const Label = tw.p`text-4xl font-bold after:content-['.'] after:text-red-500`

export const BannerWrap = tw.div`flex bg-main w-full h-52 rounded-2xl px-14 py-12 text-t-main space-y-1 items-center`
export const BannerText = tw.p`text-xl`

export const ImgWrap = tw.div`absolute top-5 right-28 w-60`
export const BannerImg = tw.img``

export const MainContainer = tw.div`flex min-h-dvh`

export const SideContainer = tw.div`space-y-3 h-auto mr-12`
export const SideWrap = tw.div<BarProps>`flex h-14 w-64 items-center pl-6 rounded-2xl cursor-pointer 
hover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500
${(p) => (p.$state === true ? "bg-[#eeeeee] font-bold after:text-red-500" : "")}`
export const SideSvg = tw.img`w-6 mr-4`
export const SideLabel = tw.p``

export const PostsContainer = tw.div`w-full space-y-10 h-auto`
export const PostWrap = tw.div`space-y-2 h-36 w-full items-center px-10 shadow-custom rounded-lg cursor-pointer group 
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300`
export const PostLabel = tw.p`text-sm text-[#aaaaaa]`
export const Title = tw.p`text-2xl font-bold after:content-['.'] after:text-transparent group-hover:after:text-red-500`
export const SubTitle = tw.p`text-base font-bold text-[#aaaaaa]`
export const tagWrap = tw.div`flex space-x-3 h-auto`
export const tag = tw.div`mt-2 text-xs bg-[#eeeeee] px-2 py-1 rounded-lg`