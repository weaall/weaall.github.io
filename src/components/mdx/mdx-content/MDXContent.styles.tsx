import tw from "tailwind-styled-components";

interface IndexProps{
    $active: boolean;
}

export const Container = tw.div`w-full flex space-x-6 px-10 justify-center text-(--text) py-16`
export const ContentWrap = tw.div`max-w-[712px] min-w-[712px] w-[712px] mx-10 min-h-screen`

export const IndexWrap = tw.div`relative w-72 flex flex-col items-end flex-grows mobile:hidden`
export const IndexList = tw.div`sticky top-16 border-l border-gray-200 rounded-none my-4 px-4 text-sm space-y-1`
export const IndexLabel = tw.p<IndexProps>`cursor-pointer text-(--text) font-[400] space-pre-wrap
hover:text-(--text) hover:font-bold 
${(p)=>(p.$active ? "font-bold underline" : "none")}`