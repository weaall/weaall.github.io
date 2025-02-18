import tw from "tailwind-styled-components";

export const H1 = tw.h1`text-3xl font-bold`
export const H2 = tw.h2`text-[1.8rem] font-bold mt-0 mb-9 after:content-['.'] after:text-red-500 cursor-pointer
mobile:text-xl mobile:mb-4`
export const H3 = tw.h3`text-[1.4rem] font-bold mt-9 mb-6
mobile:text-lg mobile:mb-4`

export const CheckBoxWrap = tw.div`flex space-x-6 items-center my-3`
export const CheckBoxLabel = tw.p`text-lg`
export const H4 = tw.input`w-5 h-5 cursor-pointer outline-none accent-[#D9D9D9]/[.1]`

export const P = tw.span`text-lg py-3
mobile:text-base`

export const A = tw.a`text-6xl`

export const Hr= tw.hr`my-14 w-full h-[2px] bg-t-main`

export const Pre = tw.pre`text-t-main text-base`

export const Li = tw.li`pl-4 py-1 text-base before:content-['-'] before:font-bold before:pr-3
mobile:text-sm`

export const CodeWrap = tw.div`relative bg-main rounded-xl text-t-main text-sm p-6 mb-12 mt-4
mobile:text-xs`
export const CodeWrapC = tw.div`relative rounded-xl text-main text-base pt-8 mb-10 
mobile:text-xs mobile:pt-5 mobile:mb-6`
export const ClassWrap = tw.div`absolute top-0 right-0 rounded-2xl py-3 px-6 bg-white w-fit mr-8
mobile:py-1.5 mobile:px-4` 
export const ClassLabel = tw.span`text-2xl font-bold after:content-['.'] after:text-red-500
mobile:text-lg`
export const CodeBoxC = tw.div`bg-main p-6 pt-12 rounded-xl
mobile:pt-6`
export const Code = tw.code` rounded-xl text-t-main my-6 text-sm`

export const Strong = tw.strong`font-bold
mobile:text-sm`

export const Em = tw.em`text-base font-bold not-italic px-3 py-1 bg-rose-50 rounded-xl`

export const ImgWrap = tw.span`w-full mx-auto py-6 text-center`
export const Img = tw.img`mx-auto`
export const ImgTitle = tw.span`text-xs text-gray-400`

export const Table = tw.table`w-full my-4 table-fixed mb-12
mobile:mb-6 mobile:text-xs`
export const Thead = tw.thead`bg-gray-50 text-left border-t border-t-gray-400 border-b border-b-gray-200 `
export const Tbody = tw.tbody``
export const Tr = tw.tr``
export const Th = tw.th`text-5xl text-gray-500 font-medium px-5 py-3`
export const Td = tw.td`text-6xl px-5 py-1.5 font-medium border-b`