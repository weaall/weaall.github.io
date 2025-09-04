import tw from "tailwind-styled-components";

export const Container = tw.div`
  w-full flex justify-center py-16 flex-1 min-h-screen gap-2
`;

export const BlockWrap = tw.div` flex items-center relative transition-colors my-1
`;

export const InputWrap = tw.div`
  flex-1 transition-colors
  rounded-md
`;

export const Input = tw.input`
  outline-none w-full bg-transparent text-white placeholder:text-[#373737]
  focus:border-none 
  border-none
`;

export const PlusButton = tw.button`
  w-[24px] h-[24px] rounded hover:bg-[#252525] flex items-center justify-center text-xl p-[4px] cursor-grab
`;

export const DotButton = tw.button`
  w-[18px] h-[24px] rounded hover:bg-[#252525] flex items-center justify-center text-2xl cursor-grab
`;

export const EditableTitle = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-bold
  text-white
  caret-[rgba(255,255,255,0.81)]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  relative
  [&:empty]:before:content-['시작하기']
  [&:empty]:before:text-[#5a5a5a]
  [&:empty]:before:pointer-events-none
  [&:empty]:before:text-[40px]
  [&:empty]:before:font-bold
`;

export const TitleBlock = tw.div`
  text-[40px] font-bold py-1 text-[#ffffffcf] relative w-full
`;

export const PBlock = tw.div`
  text-[16px] font-medium py-[3px] text-[#ffffffcf] relative w-full
`;

export const H1Block = tw.div`
  text-[30px] font-bold py-[1px] text-[#ffffffcf] relative w-full
`;

export const H2Block = tw.div`
  text-[24px] font-semibold py-[1px] text-[#ffffffcf] relative w-full
`;

export const H3Block = tw.div`
  text-[20px] font-medium py-[1px] text-[#ffffffcf] relative w-full
`;

export const EditablePBlock = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-medium
  text-white
  caret-[rgba(255,255,255,0.81)]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[16px]
  font-medium
  relative
  [&:empty]:before:content-['텍스트']
  [&:empty]:before:text-[#5a5a5a]
  [&:empty]:before:pointer-events-none
  [&:empty]:before:text-[16px]
  [&:empty]:before:font-medium
`;

export const EditableH1Block = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-bold
  text-white
  caret-[rgba(255,255,255,0.81)]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[30px] font-bold
  relative
  [&:empty]:before:content-['제목1']
  [&:empty]:before:text-[#5a5a5a]
  [&:empty]:before:pointer-events-none
  [&:empty]:before:text-[30px]
  [&:empty]:before:font-bold
`;

export const EditableH2Block = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-semibold
  text-white
  caret-[rgba(255,255,255,0.81)]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[24px] font-semibold
  relative
  [&:empty]:before:content-['제목2']
  [&:empty]:before:text-[#5a5a5a]
  [&:empty]:before:pointer-events-none
  [&:empty]:before:text-[24px]
  [&:empty]:before:font-semibold
`;

export const EditableH3Block = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-medium
  text-white
  caret-[rgba(255,255,255,0.81)]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  relative
  text-[20px] font-medium
  [&:empty]:before:content-['제목3']
  [&:empty]:before:text-[#5a5a5a]
  [&:empty]:before:pointer-events-none
  [&:empty]:before:text-[20px]
  [&:empty]:before:font-medium
`;
