import tw from "tailwind-styled-components"
import Link from 'next/link'

export const Container = tw.div`w-full flex items-center justify-between border-b
px-2 pt-4 pb-2 font-medium mobile:mt-0 mobile:rounded-none`

export const LeftWrap = tw.div`flex w-full justify-start items-center space-x-4`
export const Label = tw.label`text-base font-bold`

export const RigntWrap = tw.div`flex w-full justify-end items-center space-x-6`
export const NavBtn = tw.a`w-5 h-5`
export const NavImg = tw.img`w-full h-full`

export const SearchBtn = tw.button`bg-white rounded-full mr-2 `
export const SearchSvg = tw.img`min-w-7 min-h-7 p-0.5 m-auto hover:scale-105`