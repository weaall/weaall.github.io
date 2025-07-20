import tw from "tailwind-styled-components";

export const Container = tw.div`w-full h-auto flex m:flex-col-reverse`;

export const StartWrap = tw.div`w-1/2 flex flex-col gap-6 m:w-full m:items-center m:gap-4`;
export const Title = tw.h1`text-[4rem] font-semibold text-gray-900 tracking-tighter leading-none m:text-[2.5rem]`;
export const SubTitle = tw.p`text-[1.3rem] font-medium leading-none m:text-[1rem] m:leading-normal`;
export const BtnWrap = tw.div`flex items-start gap-4 text-base font-medium`;
export const SubBtn = tw.button`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors`;
export const ReqBtn = tw.button`px-6 py-3 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition-colors`;

export const EndWrap = tw.div`w-1/2 h-auto flex flex-col items-center justify-start m:w-full m:pb-12`;
export const ImgContainer = tw.div`flex w-full justify-center items-center my-auto mx-auto gap-4`;
export const ImgWrap = tw.div`w-40 h-40 flex items-center justify-center m:w-28 m:h-28`;
export const Img = tw.img`w-full h-full object-cover`;
export const BottomLabel = tw.span`w-full border-b border-gray-400 pb-2 m:hidden`;
