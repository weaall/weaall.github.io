import Link from "next/link";
import tw from "tailwind-styled-components";

export const Container = tw.div`w-full justify-center items-center py-16
  flex-1 w-full min-h-screen
`;


export const MainPostWrap = tw(Link)`
space-y-2 h-auto w-[600px] m:w-full items-center px-6 py-4 shadow-custom rounded-2xl group bg-(--panel-bg)
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300`;
export const MainTitle = tw.p`text-3xl font-semibold text-(--text) truncate after:content-['.'] after:text-transparent group-hover:after:text-red-500`;
export const PostContainer = tw.div`
  flex flex-wrap w-full h-full gap-4 p-10 m:p-2 items-center justify-center
`;

export const PostWrap = tw(Link)`
space-y-2 h-auto w-[340px] m:w-full items-center px-6 py-4 shadow-custom rounded-2xl group bg-(--panel-bg)
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300`;

export const TopWrap = tw.div`flex justify-between`;
export const TopLabel = tw.p`text-sm text-(--text-muted)`;
export const Title = tw.p`text-lg font-semibold text-(--text-muted) truncate after:content-['.'] after:text-transparent group-hover:after:text-red-500`;
export const SubTitle = tw.p`text-sm truncate text-(--text-muted)`;
export const TagWrap = tw.div`flex space-x-3 h-auto truncate`;
export const Tag = tw.div`mt-2 text-xs bg-t-main px-2 py-1 rounded-lg`;
export const SpanWrap = tw.div`flex space-x-[1.5px]`;
export const Span = tw.span`h-8 w-[2px] bg-gray-300 rounded-full`;