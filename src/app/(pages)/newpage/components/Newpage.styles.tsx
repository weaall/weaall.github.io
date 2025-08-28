import tw from "tailwind-styled-components";

export const Container = tw.div`
  w-full flex justify-center py-16 flex-1 min-h-screen
`;

export const BlockWrap = tw.div` flex items-center relative transition-colors
`;

export const InputWrap = tw.div`
  flex-1 transition-colors px-2
  rounded-md
`;

export const Input = tw.input`
  outline-none w-full bg-transparent text-white
  focus:border-none
  border-none
`;

export const PlusButton = tw.button`
  w-[18px] h-[24px] rounded bg-[#252525] flex items-center justify-center text-xl mr-2
`;

export const Menu = tw.div`
  absolute left-10 top-0 bg-[#252525] border rounded shadow p-2 z-10
`;

export const MenuButton = tw.button`
  block px-4 py-2 hover:bg-gray-100 w-full text-left
`;

export const PBlock = tw.div`
  text-base py-1
`;

export const H1Block = tw.div`
  text-3xl font-bold py-1
`;

export const H2Block = tw.div`
  text-2xl font-semibold py-1
`;

export const H3Block = tw.div`
  text-xl font-medium py-1
`;