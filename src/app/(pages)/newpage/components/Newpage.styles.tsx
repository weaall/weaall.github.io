import Link from "next/link";
import tw from "tailwind-styled-components";

export const Container = tw.div`w-full flex justify-center py-16
  flex-1 w-full min-h-screen
`;

export const BlockWrap = tw.div`
  my-4
`;

export const Input = tw.input` text-white
  border-b outline-none w-full bg-transparent 
`;

export const PlusWrap = tw.div`
  relative mt-6
`;

export const PlusButton = tw.button`
  w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xl
`;

export const Menu = tw.div`
  absolute left-10 top-0 bg-white border rounded shadow p-2 z-10
`;

export const MenuButton = tw.button`
  block px-4 py-2 hover:bg-gray-100 w-full text-left
`;
