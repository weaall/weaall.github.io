import tw from "tailwind-styled-components";
import Link from "next/link";

export const Container = tw.div`flex px-10 relative border-r border-(--border) tracking-tight`;
export const SideContainer = tw.div`
  h-auto mr-8 w-72 w-[260px] bg-(--panel-bg) py-1.5 px-2 text-(--text-faint) flex flex-col gap-1
  fixed top-0 left-0 z-40 min-h-screen overflow-y-auto
  border-(--border)
  border-r
`;

export const Fixedwrap = tw.div`flex flex-col gap-[1px] pb-4 tracking-tight`;
export const IconBtn = tw.button`p-5px flex items-center justify-center rounded-md hover:bg-(--hover-bg) transition-colors`;

export const CategoryButton = tw.button`
  text-2xs font-semibold mb-[1px] focus:outline-none flex items-center w-full rounded-md px-2 py-1.5 transition-colors
  text-(--text-muted) hover:bg-(--hover-bg) max-w-[244px]
`;
export const CategoryList = tw.ul``;
export const CategoryItem = tw.li`mb-[1px]`;
export const PostLink = tw(Link)<{ $active?: boolean }>`
  flex items-center max-w-[244px] px-2 py-5px rounded-md hover:bg-(--hover-bg) font-medium overflow-hidden text-(--text-faint)
  ${({ $active }) => ($active ? "bg-(--hover-bg) text-(--text-strong)" : "")}
`;
// 게시물 링크와 동일한 모양의 클릭 가능한 행 (로컬 저장 문서용 — Link가 아님)
export const DocRow = tw.div<{ $active?: boolean }>`
  flex items-center max-w-[244px] px-2 py-5px rounded-md hover:bg-(--hover-bg) font-medium overflow-hidden text-(--text-faint) cursor-pointer
  ${({ $active }) => ($active ? "bg-(--hover-bg) text-(--text-strong)" : "")}
`;

export const SvgWrap = tw.div`w-5 h-5 flex-shrink-0 mr-2 flex items-center justify-center text-(--text-faint)`;
export const LabelWrap = tw.div`flex items-center justify-between w-full min-w-0`;
export const Label = tw.span`text-[0.85rem] truncate block whitespace-nowrap min-w-0 flex-1`;
export const LabelIcons = tw.div`flex items-center ml-2 flex-shrink-0 text-(--text-faint) transition-colors duration-200`;
export const LabelIconBtn = tw.button`
  p-0 m-0 bg-transparent border-none outline-none flex items-center justify-center cursor-pointer
  w-5 h-5 rounded-md transition-all duration-150 opacity-0 group-hover:opacity-100
  hover:bg-(--hover-bg) text-(--text-faint)
`;
