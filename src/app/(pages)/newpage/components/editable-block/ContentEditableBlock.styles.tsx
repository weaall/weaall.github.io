import tw from "tailwind-styled-components";

export const EditablePBlock = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  text-white
  text-[#ffffffcf]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[16px]
  relative
  [&:empty]:after:content-[attr(data-placeholder)]
  [&:empty]:after:text-[#5a5a5a]
  [&:empty]:after:pointer-events-none
  [&:empty]:after:text-[16px]
  [&:empty]:after:font-medium
`;

export const EditableH1Block = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-bold
  text-white
  text-[#ffffffcf]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[30px] font-bold
  relative
  [&:empty]:after:content-[attr(data-placeholder)]
  [&:empty]:after:text-[#5a5a5a]
  [&:empty]:after:pointer-events-none
  [&:empty]:after:text-[30px]
  [&:empty]:after:font-bold
`;

export const EditableH2Block = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-semibold
  text-white
  text-[#ffffffcf]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[24px] font-semibold
  relative
  [&:empty]:after:content-[attr(data-placeholder)]
  [&:empty]:after:text-[#5a5a5a]
  [&:empty]:after:pointer-events-none
  [&:empty]:after:text-[24px]
  [&:empty]:after:font-semibold
`;

export const EditableH3Block = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-medium
  text-white
  text-[#ffffffcf]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  relative
  text-[20px] font-medium
  [&:empty]:after:content-[attr(data-placeholder)]
  [&:empty]:after:text-[#5a5a5a]
  [&:empty]:after:pointer-events-none
  [&:empty]:after:text-[20px]
  [&:empty]:after:font-medium
`;

export const EditableUlBlockWrap = tw.div`flex items-start justify-start`;

export const EditableUlBlockTag = tw.div`
  pt-[10px]
  before:content-['']
  before:block
  before:w-[7px]
  before:h-[7px]
  before:bg-black
  before:rounded-full
  before:bg-[#ffffffcf]
  
  before:mr-[10px]
`;

export const EditableUlBlock = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  text-white
  text-[#ffffffcf]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[16px]
  relative
  [&:empty]:after:content-[attr(data-placeholder)]
  [&:empty]:after:text-[#5a5a5a]
  [&:empty]:after:pointer-events-none
  [&:empty]:after:text-[16px]
  [&:empty]:after:font-medium
`;

export const EditableNumberedListBlockWrap = tw.div`flex items-start justify-start`;
export const EditableNumberedListBlockTag = tw.div`
  pt-[3px] 
  before:content-[attr(data-number)'.']
  before:pr-[10px]
  before:text-[16px]
  before:px-[10px]
  before:h-[24px]
`;
export const EditableNumberedListBlock = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-medium
  text-white
  text-[#ffffffcf]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[16px]
  font-medium
  relative
  [&:empty]:after:content-[attr(data-placeholder)]
  [&:empty]:after:text-[#5a5a5a]
  [&:empty]:after:pointer-events-none
  [&:empty]:after:text-[16px]
  [&:empty]:after:font-medium
`;

export const EditableCheckedListBlockWrap = tw.div`flex item-start justify-start `;
export const EditableCheckbox = tw.input`
  w-4 h-4
  mx-[10px]
  appearance-none 
  border-2 border-[#616161] 
  rounded 
  bg-transparent
  checked:bg-blue-500 
  checked:border-transparent
  cursor-pointer
  flex-shrink-0
  relative
  focus:outline-none
  mt-[7px]

  checked:after:content-['']
  checked:after:absolute
  checked:after:left-[4px]
  checked:after:top-[0px]
  checked:after:w-[5px]
  checked:after:h-[10px]
  checked:after:border-r-[2px]
  checked:after:border-b-[2px]
  checked:after:border-white
  checked:after:rotate-45
`;
export const EditableCheckedListBlock = tw.div`
  notranslate
  w-full
  max-w-full
  min-h-[1em]
  font-medium
  text-white
  text-[#ffffffcf]
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[16px]
  font-medium
  relative
  [&:empty]:after:content-[attr(data-placeholder)]
  [&:empty]:after:text-[#5a5a5a]
  [&:empty]:after:pointer-events-none
  [&:empty]:after:text-[16px]
  [&:empty]:after:font-medium
`;
