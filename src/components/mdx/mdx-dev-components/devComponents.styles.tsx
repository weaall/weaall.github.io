import tw from "tailwind-styled-components";

export const H1 = tw.h1`text-3xl font-bold`
export const H2 = tw.h2`text-[1.8rem] font-bold mt-6 mb-2 after:content-['.'] after:text-red-500 cursor-pointer
mobile:text-xl mobile:mb-4`
export const H3 = tw.h3`text-[1.4rem] font-bold mt-6 mb-4
mobile:text-lg mobile:mb-4`

export const CheckBoxWrap = tw.div`flex space-x-6 items-center my-3`
export const CheckBoxLabel = tw.p`text-lg`
export const H4 = tw.input`w-5 h-5 cursor-pointer outline-none accent-[#D9D9D9]/[.1]`

export const P = tw.span`text-lg py-3
mobile:text-base`

export const A = tw.a`text-6xl`

export const Hr= tw.hr`my-14 w-full h-[2px] bg-t-main`

export const Pre = tw.pre`my-0`

export const Li = tw.li`pl-4 py-1 text-base before:content-['-'] before:font-bold before:pr-3
mobile:text-sm`

// 노션식 코드블록: 어두운 배경 컨테이너 + 미니 언어라벨 + 모노. 색상은 hljs가 담당.
export const CodeWrapC = tw.div`relative my-5 rounded-lg overflow-hidden bg-[#282c34] text-[13px] leading-relaxed`
export const ClassWrap = tw.div`absolute top-0 right-0 z-10 px-3 py-2 select-none`
export const ClassLabel = tw.span`text-[11px] font-mono lowercase text-white/40`
export const CodeBoxC = tw.div`px-3 py-2`
export const Code = tw.code`block font-mono whitespace-pre-wrap break-words [overflow-wrap:anywhere]`

export const Strong = tw.strong`font-bold
mobile:text-sm`

export const Em = tw.em`text-base font-bold not-italic px-3 py-1 bg-rose-50 rounded-xl`

export const ImgWrap = tw.span`w-full mx-auto py-6 text-center`
export const Img = tw.img`mx-auto`
export const ImgTitle = tw.span`text-xs text-gray-400`

export const Table = tw.table`w-full my-2 table-fixed mb-4
mobile:mb-6 mobile:text-xs`
export const Thead = tw.thead`bg-gray-50 text-left border-t border-t-gray-400 border-b border-b-gray-200 `
export const Tbody = tw.tbody``
export const Tr = tw.tr``
export const Th = tw.th`text-5xl text-gray-500 font-medium px-5 py-3`
export const Td = tw.td`text-6xl px-5 py-1.5 font-medium border-b`