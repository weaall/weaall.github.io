import tw from "tailwind-styled-components";

export const H1 = tw.h1`text-[2rem] font-bold py-4 after:content-['.'] after:text-red-500 cursor-pointer`
export const H2 = tw.h2`text-[1.5rem] font-bold py-4 after:content-['.'] after:text-red-500 cursor-pointer`
export const H3 = tw.h3`text-[1.25rem] font-bold pt-4 ml-2`
export const H4 = tw.h4`text-[1rem] font-bold pt-4 ml-2`

export const Stack = tw.div`w-full max-w-md mx-auto my-8`;

export const P = tw.span`ml-4 text-base py-3`

export const A = tw.a`text-base font-bold text-red-500`

export const Hr= tw.hr`my-10 w-full h-[2px] bg-t-main`

export const Pre = tw.pre`text-t-main text-base`

export const Li = tw.li`pl-6 py-1 text-base before:content-['-'] before:font-bold before:pr-3`

export const CodeWrap = tw.div`relative bg-main rounded-xl text-t-main text-base p-6 tracking-tight leading-tight`

export const CodeMidWrap = tw.div`w-full h-10 text-base p-2 border-y border-gray-300 bg-main`
export const CodeWrapC = tw.div`rounded-b-xl p-4 text-base tracking-tight leading-tight bg-main`
export const Code = tw.code`text-xs`

export const Strong = tw.strong`font-bold`

export const Em = tw.em`text-sm font-semibold not-italic px-2 py-0.5 bg-rose-50 rounded-xl`

export const ImgWrap = tw.span`w-full mx-auto py-6 text-center flex flex-col`
export const Img = tw.img`mx-auto`
export const ImgTitle = tw.span`w-full text-center text-xs text-gray-400`

export const Table = tw.table`w-full my-4 table-fixed mb-8`
export const Thead = tw.thead`bg-gray-50 text-left border-t border-t-gray-400 border-b border-b-gray-200 `
export const Tbody = tw.tbody``
export const Tr = tw.tr``
export const Th = tw.th`text-5xl text-gray-500 font-medium px-3 py-3`
export const Td = tw.td`text-6xl px-3 py-1.5 font-medium border-b`