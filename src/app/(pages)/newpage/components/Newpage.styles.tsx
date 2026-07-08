import tw from "tailwind-styled-components";

export const Container = tw.div`
  w-full flex justify-center py-16 flex-1 min-h-screen gap-2
`;

export const BlockWrap = tw.div` flex items-center relative transition-colors
`;

export const InputWrap = tw.div`
  flex-1 transition-colors
  rounded-md
  py-[2px]
  hover:bg-(--hover-bg)
  focus-within:bg-(--hover-bg)
`;

export const PlusButton = tw.button`
  w-[24px] h-[24px] rounded hover:bg-(--grip-hover-bg) flex items-center justify-center text-xl p-[4px] cursor-grab
`;

export const DotButton = tw.button`
  w-[18px] h-[24px] rounded hover:bg-(--grip-hover-bg) flex items-center justify-center text-2xl cursor-grab
`;

export const EditableTitle = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-bold
  text-(--text-strong)
  text-(--text)
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  relative
  [&:empty]:after:content-[attr(data-placeholder)]
  [&:empty]:after:text-(--placeholder)
  [&:empty]:after:pointer-events-none
  [&:empty]:after:text-[40px]
  [&:empty]:after:font-bold
`;

export const TitleBlock = tw.div`
  text-[40px] font-bold pt-2 pb-4 text-(--text) relative w-full
`;