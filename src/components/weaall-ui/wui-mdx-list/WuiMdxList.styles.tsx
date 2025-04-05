import tw from "tailwind-styled-components"
import Link from "next/link"

interface BarProps {
    $state: boolean
}

export const Container = tw.div`min-w-60 flex min-h-dvh space-y-3 mobile:px-2 relative`

export const DrawerContainer = tw.div`fixed
  flex flex-col 
  w-60 overflow-y-auto
  border-r py-6
  mobile:w-40 mobile:mr-2 `

export const DrawerBtn = tw.button`
flex min-w-40 min-h-10 w-full items-center pl-4 cursor-pointer font-semibold hover:bg-gray-100
mobile:min-w-32 mobile:h-10 mobile:text-sm`

export const DrawerWrap = tw(Link)`
flex min-w-40 min-h-10 w-full items-center pl-4 cursor-pointer hover:bg-gray-100
mobile:min-w-32 mobile:h-10 mobile:text-sm`
export const DrawerLabel = tw.p``
