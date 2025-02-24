import tw from "tailwind-styled-components";

export const ContainerWrap = tw.div`flex flex-col`
export const Container = tw.div`relative flex justify-center items-center w-full h-[680px] px-8`

export const OuterWrap = tw.div`relative w-full max-w-4xl h-full bg-white overflow-hidden`

export const InnderWrap = tw.div`absolute w-full h-full flex justify-center items-center top-48`

export const SliderWrap = tw.div`flex flex-col w-full h-auto transition-transform duration-[1000ms] ease-in-out gap-0`

export const ImagesWrap = tw.div`w-full mt-0 transition-all duration-[1000ms] ease-in-out overflow-hidden`

export const ImageWrap = tw.div`relative w-full h-auto bg-main p-1 rounded-[10px] select-none mt-0 pb-[10px] group`

export const ProjectImgHeader = tw.div`h-8 w-full flex justify-between items-center bg-main px-4 relative`;
export const ProjectImgLabel = tw.label`absolute left-1/2 transform -translate-x-1/2 text-sm font-medium text-white select-none`;
export const ProjectImgLeftText = tw.p`text-xs text-gradient-gray select-none`;
export const ProjectImgRightText = tw.p`text-xs text-gradient-gray select-none`;

export const Img = tw.img`w-full h-full object-top object-cover select-none`

export const BtnWrap =tw.div`w-full justify-center flex gap-4 pt-1 pb-2 items-center`
export const Btn = tw.div`text-white bg-gray-800 w-2 h-2 flex justify-center items-center rounded-full
hover:bg-gray-600 cursor-pointer`

export const StateBarWrap = tw.div`flex gap-x-[10px] items-center relative h-[20px]`

export const EnlargeBtn = tw.button`absolute top-12 right-4 bg-main w-12 h-12 p-2.5 rounded-2xl z-10 opacity-0
group-hover:opacity-[50%]`
export const EnlageImg = tw.img``

export const ModalOverlay = tw.div`
    fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50
`;

export const ModalContent = tw.div`
    p-4 rounded-lg max-w-4xl w-full
`;