import tw from "tailwind-styled-components";
import Link from "next/link";


export const Container = tw.div`flex px-10 relative`;
export const SideContainer = tw.div`
  h-auto mr-8 w-72 w-[240px] bg-drawer py-4 px-2 text-white/[0.4] flex flex-col gap-1
  fixed top-16 left-0 z-20 min-h-screen
`;
export const CategoryButton = tw.button`
  text-xs font-semibold mb-1 focus:outline-none flex items-center w-full rounded px-2 py-1 transition-colors
  text-[#bbb] hover:bg-white/[0.08]
`;
export const CategoryArrow = tw.span`
  transition-transform duration-200 ml-1
`;
export const CategoryList = tw.ul`ml-2 gap-1`;
export const CategoryItem = tw.li`mb-[2px]`;
export const PostLink = tw(Link)<{ $active?: boolean }>`
  text-sm truncate max-w-[200px] block px-2 py-1.5 rounded hover:bg-white/[0.1] font-medium
  ${({ $active }) =>
    $active
      ? "bg-white/[0.1] text-white"
      : ""}
`;
export const PostIcon = tw.img`
  inline-block w-4 h-4 mr-2 align-middle transition-all duration-150
`;


export const PostsContainer = tw.div`w-full space-y-10 h-auto flex flex-col mobile:w-[70%]`;
export const PostWrap = tw.div`space-y-2 h-auto w-full items-center px-10 py-4 shadow-custom rounded-lg group 
hover:shadow-custom-hover hover:translate-y-[6px] transition-all duration-300 `;
export const TopWrap = tw.div`flex justify-between`;
export const TopLabel = tw.p`text-sm text-[#aaaaaa]`;
export const Title = tw.p`text-xl font-bold after:content-['.'] after:text-transparent group-hover:after:text-red-500 truncate`;
export const SubTitle = tw.p`text-sm truncate`;
export const TagWrap = tw.div`flex space-x-3 h-auto truncate`;
export const Tag = tw.div`mt-2 text-xs bg-t-main px-2 py-1 rounded-lg`;