import tw from "tailwind-styled-components"
import Link from "next/link"

interface BarProps {
    $state: boolean
}

export const Container = tw.div`flex min-h-dvh space-y-3 px-3`

export const IntroWrap = tw(Link)`
flex min-w-56 h-12 w-full items-center rounded-2xl cursor-pointer font-semibold text-lg
hover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500`

export const DrawerContainer = tw.div`flex flex-col h-auto mr-8 w-auto border-r`
export const DrawerWrap = tw(Link)`
flex min-w-56 h-12 w-full items-center pl-3 rounded-2xl cursor-pointer
hover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500`
export const DrawerLabel = tw.p``
