import Link from "next/link";
import tw from "tailwind-styled-components";

export const Container = tw.div`w-full flex justify-between items-center py-1.5 bg-(--panel-bg)/60 z-30 text-sm`;

export const LeftWrap = tw.div`px-2`
export const RightWrap = tw.div`px-2`

export const LabelBtn = tw.button`h-7 flex items-center justify-center rounded-md hover:bg-(--hover-bg) transition-colors text-(--text-strong) px-2`;
