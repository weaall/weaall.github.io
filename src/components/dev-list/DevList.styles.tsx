import tw from "tailwind-styled-components"
import Link from "next/link"

interface BarProps {
    $state: boolean
}

export const Container = tw.div`flex min-h-dvh space-y-3 px-3 mobile:px-2`

export const IntroWrap = tw(Link)`
flex min-w-40 h-12 w-full items-center pl-1 rounded-2xl cursor-pointer font-semibold text-lg
hover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500
mobile:min-w-32 mobile:h-10 mobile:text-base`

export const DrawerContainer = tw.div`flex flex-col h-auto mr-8 w-auto border-r mobile:mr-2`

export const DrawerWrap = tw(Link)`
flex min-w-40 h-12 w-full items-center pl-3 rounded-2xl cursor-pointer 
hover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500
mobile:min-w-32 mobile:h-10 mobile:text-sm`
export const DrawerLabel = tw.p``
