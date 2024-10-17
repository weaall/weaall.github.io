import tw from "tailwind-styled-components";

interface IndexProps{
    $active : boolean;
}

export const Container = tw.div`w-full`
export const ContentWrap = tw.div`relative w-full`

export const IndexWrap = tw.div`sticky bottom-0 flex flex-col items-end mobile:hidden`
export const IndexBtn = tw.button`w-12 h-12 text-xs rounded-full bg-main text-white font-bold mb-4`
export const IndexList = tw.div<IndexProps>`bg-main/[0.8] rounded-2xl opacity-0 text-[0px]
transform transition-all duration-300 ease-in-out 
${(p) => (p.$active ? "animate-grow-up mb-4 text-sm w-40  space-y-1.5 p-4" : "animate-shrink-down text-[0px]")}`
export const IndexLabel = tw.p<IndexProps>`cursor-pointer text-gray-300 
hover:text-t-main hover:font-bold
${(p)=>(p.$active ? "font-bold underline" : "none")}`