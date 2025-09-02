import tw from "tailwind-styled-components";

export const Menu = tw.div`
  absolute left-10 top-0
  bg-[#252525]
  border-[rgb(48,48,46)] 
  border
  rounded-[10px]
  p-[4px]
  z-10
  w-[265px]
  gap-[1px]
  flex flex-col
`;

export const Label = tw.p`
  flex
  items-center
  gap-[8px]
  px-[8px]
  mt-[6px]
  mb-[8px]
  text-[12px]
  font-[500]
  leading-[120%]
  text-[rgba(255,255,255,0.46)]
  user-select-none
`;

export const MenuButton = tw.button`
  flex items-center
  justify-between
  w-full
  h-[28px]
  px-[8px]
  text-left
  text-[14px]
  text-[#ffffffcf]
  rounded-[6px]
  user-select-none
  transition-[background] duration-75 ease-in
  cursor-pointer
  hover:bg-[#313131]
`;
export const LabelWrap = tw.div`
  flex
  items-center
  gap-[8px]
`;

export const SvgWrap = tw.div`
  h-4
  w-4
  text-white
`;

export const DrawerMenu = tw.div`
  gap-[1px]
  w-[205px]
  absolute
  left-[calc(100%+42px)]
  top-0
  bg-[#252525]
  border-[rgb(48,48,46)] 
  border
  rounded-[10px]
  p-[4px]
  z-[1100]
  flex flex-col
`;
