import tw from "tailwind-styled-components";

export const H1 = tw.h1`
  font-bold
  text-(--text-strong)
  text-(--text)
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[30px] font-bold
  relative`;
export const H2 = tw.h2`
  font-semibold
  text-(--text-strong)
  text-(--text)
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[24px] font-semibold`;
export const H3 = tw.h3`
  font-medium
  text-(--text-strong)
  text-(--text)
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[20px] font-medium`;

export const H4 = tw.h4`text-base font-medium before:content-['|'] before:font-bold before:pr-[20px]`;


export const P = tw.p`
  text-(--text-strong)
  text-(--text)
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[16px]`;

  export const Span = tw.span`
  text-(--text-strong)
  text-(--text)
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[16px]`;

export const A = tw.a`
  text-(--text-strong)
  text-(--text)
  px-[2px] pt-[3px] pb-0
  outline-none
  cursor-text
  text-[16px]`;

export const Hr = tw.hr`my-10 w-full h-[1px] bg-t-main`;

export const Pre = tw.pre`my-0`;

// 리스트: 에디터와 맞춰 ul=점, ol=숫자 (마커 색은 본문색). 예전엔 Li가 항상 ●라 번호목록이 깨졌음.
export const Ul = tw.ul`list-disc pl-[1.6em] my-1 marker:text-(--text)`;
export const Ol = tw.ol`list-decimal pl-[1.6em] my-1 marker:text-(--text)`;
export const Li = tw.li`py-[3px] text-[16px] text-(--text)`;

// 노션식 코드블록: 어두운 배경 컨테이너 + 미니 언어라벨 + 모노. 색상은 hljs(atom-one-dark)가 담당.
export const CodeWrapC = tw.div`relative my-5 rounded-lg overflow-hidden bg-[#282c34] text-[13px] leading-relaxed`;
export const ClassWrap = tw.div`absolute top-0 right-0 z-10 px-3 py-2 select-none`;
export const ClassLabel = tw.span`text-[11px] font-mono lowercase text-white/40`;
export const CodeBoxC = tw.div`overflow-x-auto px-3 py-2`;
export const Code = tw.code`font-mono whitespace-pre`;

export const Strong = tw.strong`font-bold`;

export const Em = tw.em`text-sm font-semibold not-italic px-2 py-0.5 bg-(--text) rounded-xl text-(--page-bg)`;

export const ImgWrap = tw.span`w-full mx-auto py-6 text-center flex flex-col`;
export const Img = tw.img`mx-auto`;
export const ImgTitle = tw.span`w-full text-center text-xs text-gray-400`;

export const Table = tw.table`w-full my-4 table-fixed mb-8`;
export const Thead = tw.thead`bg-gray-50 text-left border-t border-t-gray-400 border-b border-b-gray-200 `;
export const Tbody = tw.tbody``;
export const Tr = tw.tr``;
export const Th = tw.th`text-2xs text-gray-500 font-medium px-3 py-1`;
export const Td = tw.td`text-3xs px-3 py-1.5 font-medium border-b`;
