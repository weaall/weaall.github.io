import tw from "tailwind-styled-components";
export const ProjectsWrap = tw.div`hidden w-full h-auto bg-white rounded-b-[60px] relative -mt-36 pt-40 pb-10 px-12
mobile:px-6 mobile:block`;

export const ProjectWrap = tw.div`flex flex-col gap-3 py-10`;
export const ProjectImgWrap = tw.div`
    relative w-full h-[60px] overflow-hidden cursor-pointer 
    transition-all duration-500 ease-in-out
    hover:h-[529px] mobile:h-auto mobile:hover:h-auto
`;
export const ProjectImgOuterWrap = tw.div`w-full h-full bg-main p-1 rounded-xl`
export const ProjectImgHeader = tw.div`h-8 w-full flex justify-between items-center bg-main px-4 relative`;
export const ProjectImgLabel = tw.label`absolute left-1/2 transform -translate-x-1/2 text-sm font-medium text-white select-none`;
export const ProjectImgLeftText = tw.p`text-xs text-gradient-gray select-none`;
export const ProjectImgRightText = tw.p`text-xs text-gradient-gray select-none`;

export const ProjectImg = tw.img`
    object-top object-cover w-full h-auto
`;

export const ModalOverlay = tw.div`
    fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50
`;

export const ModalContent = tw.div`
    p-4 rounded-lg max-w-4xl w-full
`;