import tw from "tailwind-styled-components";

export const ModalWrap = tw.div`
	fixed z-[2000] shadow-xl min-w-[220px] max-w-[480px] bg-[#252525] py-2
  border-[rgb(48,48,46)] 
  border
  rounded-[10px]
`;
export const ModalDesc = tw.div`
	text-xs text-[#aaa] px-3 py-2
`;
export const EmojiListWrap = tw.div`
	flex flex-wrap gap-2 overflow-y-auto max-h-[168px] px-4
`;
export const EmojiButton = tw.button`
	flex cursor-pointer flex-col items-center border-none bg-none p-1 text-xl
`;
export const NoResult = tw.div`
	text-xs text-[#aaa] py-2
`;
export const CloseButton = tw.button`
	mt-2 w-full cursor-pointer rounded-md border-none bg-[#313131] px-0 py-1.5 text-white
`;