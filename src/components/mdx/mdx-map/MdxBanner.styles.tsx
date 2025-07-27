import tw from "tailwind-styled-components";

export const PostContainer = tw.div`flex space-x-[2%] mobile:flex-col mobile:space-y-6 mobile:space-x-0`;
export const PostWrap = tw.a`space-y-2 h-auto  w-[32%] items-center px-6 py-4 shadow-custom rounded-lg group 
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300 mobile:w-full`;

export const TopWrap = tw.div`flex justify-between`;
export const TopLabel = tw.p`text-sm text-[#aaaaaa]`;
export const Title = tw.p`text-lg font-semibold truncate after:content-['.'] after:text-transparent group-hover:after:text-red-500`;
export const SubTitle = tw.p`text-sm truncate`;
export const TagWrap = tw.div`flex space-x-3 h-auto truncate`;
export const Tag = tw.div`mt-2 text-xs bg-t-main px-2 py-1 rounded-lg`;
export const SpanWrap = tw.div`flex space-x-[1.5px]`;
export const Span = tw.span`h-8 w-[2px] bg-gray-300 rounded-full`;
