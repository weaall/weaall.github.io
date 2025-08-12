import Link from "next/link";
import tw from "tailwind-styled-components";

export const Container = tw.div`w-auto p-10 justify-center items-center
  flex-1 ml-[300px] min-h-screen
`;

export const PostContainer = tw.div`
  flex flex-wrap w-full h-full gap-4
`;

export const StyledLink = tw(Link)`
space-y-2 h-auto w-[340px] items-center px-6 py-4 shadow-custom rounded-2xl group bg-dark1
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300`;

export const TopWrap = tw.div`flex justify-between`;
export const TopLabel = tw.p`text-sm text-[#aaaaaa]`;
export const Title = tw.p`text-lg font-semibold text-[#aaaaaa] truncate after:content-['.'] after:text-transparent group-hover:after:text-red-500`;
export const SubTitle = tw.p`text-sm truncate text-[#aaaaaa]`;
export const TagWrap = tw.div`flex space-x-3 h-auto truncate`;
export const Tag = tw.div`mt-2 text-xs bg-t-main px-2 py-1 rounded-lg`;
export const SpanWrap = tw.div`flex space-x-[1.5px]`;
export const Span = tw.span`h-8 w-[2px] bg-gray-300 rounded-full`;
