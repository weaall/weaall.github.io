import tw from "tailwind-styled-components"
import Link from "next/link"

interface BarProps {
    $state: boolean
}

export const Container = tw.div`flex min-h-dvh space-y-3`

export const DrawerContainer = tw.div`flex flex-col h-auto mr-8 w-[240px] mobile:w-[28%] border-r`
export const DrawerWrap = tw(Link)`flex h-14 w-full items-center pl-6 rounded-2xl cursor-pointer
hover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500`
export const DrawerLabel = tw.p``
