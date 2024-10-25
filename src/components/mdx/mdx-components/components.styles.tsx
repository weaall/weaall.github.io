import tw from "tailwind-styled-components";

export const H1 = tw.h1`text-2xl font-bold`
export const H2 = tw.h2`text-xl font-bold mt-0 mb-9 after:content-['.'] after:text-red-500 cursor-pointer`
export const H3 = tw.h3`text-base font-bold my-6`

export const CheckBoxWrap = tw.div`flex space-x-6 items-center my-3`
export const CheckBoxLabel = tw.p`text-base`
export const H4 = tw.input`w-5 h-5 cursor-pointer outline-none accent-[#D9D9D9]/[.1]`

export const P = tw.p`text-base py-3`

export const A = tw.a`text-base font-bold text-red-500`

export const Hr= tw.hr`my-10 w-full h-[2px] bg-t-main`

export const Pre = tw.pre`text-t-main text-base`

export const Li = tw.li`pl-6 py-2 text-base before:content-['-'] before:font-bold before:pr-3`

export const CodeWrap = tw.div`relative bg-main rounded-xl text-t-main text-base p-6 mb-10`
export const CodeWrapC = tw.div`relative rounded-xl text-base pt-6 mb-10`
export const ClassWrap = tw.div`absolute right-4 top-0 text-main rounded-2xl py-2 px-4 bg-white w-fit mr-4` 
export const ClassLabel = tw.p`text-xl font-bold after:content-['.'] after:text-red-500`
export const CodeBoxC = tw.div`bg-main p-6 pt-6 rounded-xl`
export const Code = tw.code`whitespace-pre-wrap rounded-xl text-t-main my-6 text-sm`

export const Strong = tw.strong`font-bold`

export const Em = tw.em`text-sm font-semibold not-italic px-2 py-0.5 bg-rose-50 rounded-xl`

export const ImgWrap = tw.div`w-full mx-auto py-6 text-center`
export const Img = tw.img`mx-auto`
export const ImgTitle = tw.p`text-xs text-gray-400`

export const Table = tw.table`w-full my-4 table-fixed mb-8`
export const Thead = tw.thead`bg-gray-50 text-left border-t border-t-gray-400 border-b border-b-gray-200 `
export const Tbody = tw.tbody``
export const Tr = tw.tr``
export const Th = tw.th`text-5xl text-gray-500 font-medium px-3 py-3`
export const Td = tw.td`text-6xl px-3 py-1.5 font-medium border-b`