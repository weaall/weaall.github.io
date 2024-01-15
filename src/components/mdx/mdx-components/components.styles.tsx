import tw from "tailwind-styled-components";

export const H1 = tw.h1`text-3xl font-bold`
export const H2 = tw.h2`text-2xl font-bold mt-0 mb-9 after:content-['.'] after:text-red-500 cursor-pointer`
export const H3 = tw.h3`text-xl font-bold mt-9 mb-6`

export const CheckBoxWrap = tw.div`flex space-x-6 items-center my-3`
export const CheckBoxLabel = tw.p`text-lg`
export const H4 = tw.input`w-5 h-5 cursor-pointer outline-none accent-[#D9D9D9]/[.1]`

export const P = tw.p`text-lg my-6 p-3`

export const Hr= tw.hr`my-20 w-full h-[2px] bg-t-main`

export const Pre = tw.pre``

export const Code = tw.div`bg-main p-6 rounded-xl text-t-main my-6 `

export const Strong = tw.strong`font-bold`