import tw from "tailwind-styled-components";

export const Menu = tw.div`
  absolute left-10 top-0
  bg-(--menu-bg)
  border-(--border)
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
  text-(--text-muted)
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
  text-(--text)
  rounded-[6px]
  user-select-none
  transition-[background] duration-75 ease-in
  cursor-pointer
  hover:bg-(--menu-hover-bg)
`;

export const LabelWrap = tw.div`
  flex
  items-center
  gap-[8px]
`;

export const SvgWrap = tw.div`
  h-4
  w-4
`;

export const ExpLabel = tw.div`
  text-(--text-faint)
  text-[12px]
`;

export const DrawerMenu = tw.div`
  gap-[1px]
  w-[205px]
  absolute
  left-[calc(100%+42px)]
  top-0
  bg-(--menu-bg)
  border-(--border)
  border
  rounded-[10px]
  p-[4px]
  z-[1100]
  flex flex-col
`;
