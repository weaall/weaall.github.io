import tw from "tailwind-styled-components";

export const Container = tw.div``;

export const BannerWrap = tw.div`bg-t-main w-full h-auto px-14 pt-12 pb-6 relative z-50
text-main space-y-1 group rounded-b-[60px]`;

export const ProfileWrap = tw.div`absolute bottom-0 right-0 px-20 mobile:px-auto`;
export const ProfileBg = tw.div``;
export const ProfilePic = tw.img`w-[24rem] mobile:w-full animate-fadeIn opacity-0`;

export const BannerLabelWrap = tw.div`relative w-fit p-2 pb-12 h-60 mobile:h-96`;
export const BannerLabelBox = tw.div``;
export const BannerLabel = tw.p`text-9xl font-bold mobile:text-9xl z-10 text-shadow-custom custom-border-radius`;
export const BannerUnderline = tw.div`w-full h-1 bg-main z-10 
scale-x-0 transition-transform duration-300 transform origin-left group-hover:scale-x-100 mobile:group-hover:scale-x-0`;
export const BannerText = tw.p`text-lg font-medium pt-2 animate-fadeIn opacity-0
text-shadow-custom custom-border-radius`;

export const MailWrap = tw.div`flex space-x-2`;
export const MailSvg = tw.img`w-5`;
export const MailText = tw.a`hover:text-white text-base after:content-['.'] after:text-red-500`;

export const SkillWrap = tw.div`w-full h-auto flex bg-white relative items-center rounded-b-[60px] -mt-10 pt-20 pb-10 z-40 px-20 justify-between
mobile:px-6 mobile:flex-wrap mobile:justify-between`;
export const BorderRotateWrap = tw.div`w-24 h-24 relative flex items-center justify-center overflow-hidden
opacity-0 animate-fadeIn 
mobile:w-1/3 mobile:h-full mobile:px-10`;
export const BorderRotate = tw.div`absolute w-32 h-32 inset-0 peer-hover:bg-red-500 peer-hover:animate-riseUpDiagonal
mobile:hidden`;
export const Skills = tw.img`bg-white h-[5.7rem] w-[5.7rem] m-auto p-2 z-10 peer 
mobile:w-full mobile:h-full`;

export const PartsWrap = tw.div`w-full h-auto flex flex-col bg-t-main rounded-b-[60px] relative -mt-36 pt-40 pb-10 px-20 z-30
mobile:px-20`;
export const PartsWrapTitle = tw.h2`text-center font-semibold text-3xl pt-10 pb-6
text-gradient`;
export const PartsLine = tw.div`h-[1px] w-auto my-10 mx-20 bg-black/[0.1]`;
export const PartList = tw.div`w-full flex mobile:flex-col px-14`;
export const PartWrap = tw.div`flex flex-col m-auto w-1/4 px-8 mobile:w-full py-4`;
export const PartSvg = tw.img`w-8`;
export const PartLabel = tw.label`text-sm font-medium py-3`;
export const PartText = tw.p`text-xs`;

export const ProjectsWrap = tw.div`w-full h-auto bg-white rounded-b-[60px] relative -mt-36 pt-40 pb-10 px-12
mobile:px-6`;

export const ProjectWrap = tw.div`flex flex-col gap-3 py-10`;
export const ProjectImgWrap = tw.div`
    relative w-full h-[60px] overflow-hidden cursor-pointer 
    transition-all duration-500 ease-in-out
    hover:h-[529px] mobile:h-auto mobile:hover:h-auto
`;
export const ProjectImgOuterWrap = tw.div`w-full h-full bg-main p-1 rounded-xl`
export const ProjectImgHeader = tw.div`h-8 w-full flex justify-between items-center bg-main px-4 relative`;
export const ProjectImgLabel = tw.label`absolute left-1/2 transform -translate-x-1/2 text-sm font-medium text-white`;
export const ProjectImgLeftText = tw.p`text-xs text-gradient-gray`;
export const ProjectImgRightText = tw.p`text-xs text-gradient-gray`;

export const ProjectImg = tw.img`
    object-top object-cover w-full h-auto
`;

export const ModalOverlay = tw.div`
    fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50
`;

export const ModalContent = tw.div`
    p-4 rounded-lg max-w-4xl w-full
`;


export const RearWrap = tw.div`w-full min-h-60 bg-t-main rounded-b-[60px] relative -mt-36 pt-40 px-20 z-10`;
