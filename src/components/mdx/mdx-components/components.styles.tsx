import tw from "tailwind-styled-components";

export const H1 = tw.h1`
  font-bold
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[30px] font-bold
  relative`;
export const H2 = tw.h2`
  font-semibold
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[24px] font-semibold`;
export const H3 = tw.h3`
  font-medium
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[20px] font-medium`;

export const H4 = tw.h4`text-base font-medium before:content-['|'] before:font-bold before:pr-[20px]`;


export const P = tw.p`
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[16px]`;

  export const Span = tw.span`
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[16px]`;

export const A = tw.a`
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[16px]`;

export const Hr = tw.hr`my-1.5 w-full h-[2px] rounded border-0 bg-[#d0cfca]`;

export const Pre = tw.pre`my-0`;

// 리스트: 에디터 블록과 픽셀 단위로 맞춤.
//  - ul: 마커 없애고 7px 원을 before로 직접 그림 (에디터 EditableUlBlockTag과 동일: left 13.5px / top 11px / 32px 들여쓰기)
//  - ol: native 숫자 마커 (본문색·중간굵기)
//  - 태스크리스트(- [ ])는 .task-list-item으로 구분해 점/들여쓰기 제외 (체크박스는 globals.css에서 스타일)
export const Ul = tw.ul`
  list-none pl-0 my-0
  [&>li:not(.task-list-item)]:relative
  [&>li:not(.task-list-item)]:pl-[32px]
  [&>li:not(.task-list-item)]:before:absolute
  [&>li:not(.task-list-item)]:before:left-[13px]
  [&>li:not(.task-list-item)]:before:top-[11px]
  [&>li:not(.task-list-item)]:before:h-[7px]
  [&>li:not(.task-list-item)]:before:w-[7px]
  [&>li:not(.task-list-item)]:before:rounded-full
  [&>li:not(.task-list-item)]:before:bg-(--text)
  [&>li:not(.task-list-item)]:before:content-['']
`;
export const Ol = tw.ol`list-decimal pl-[1.9em] my-0 marker:font-medium marker:text-(--text)`;
export const Li = tw.li`py-[3px] text-[16px] leading-[1.4] text-(--text)`;

// 노션식 코드블록(라이트): 연한 회색 배경 + 라운드 + 여유 패딩 + 미니 언어라벨.
// 구문 색은 .post-content .hljs 스코프(globals.css)의 라이트 팔레트가 담당.
export const CodeWrapC = tw.div`relative my-4 rounded-[10px] overflow-hidden border border-(--border) bg-[#f7f6f3] text-[14px] leading-relaxed`;
export const ClassWrap = tw.div`absolute top-0 right-0 z-10 px-3 py-2 select-none`;
export const ClassLabel = tw.span`text-[11px] font-mono lowercase text-(--text-muted)`;
export const CodeBoxC = tw.div`px-[22px] py-[16px]`;
export const Code = tw.code`block font-mono whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[13.5px]`;

export const Strong = tw.strong`font-bold`;

export const Em = tw.em`text-sm font-semibold not-italic px-2 py-0.5 bg-(--text) rounded-xl text-(--page-bg)`;

export const ImgWrap = tw.span`w-full mx-auto py-6 text-center flex flex-col`;
export const Img = tw.img`mx-auto`;
export const ImgTitle = tw.span`w-full text-center text-xs text-gray-400`;

// 표: 에디터 TableBlock과 동일한 노션풍 보더 테이블 (내용 폭에 맞춤, 셀 보더 + 헤더 음영)
export const Table = tw.table`my-3 border-collapse`;
export const Thead = tw.thead``;
export const Tbody = tw.tbody``;
export const Tr = tw.tr``;
// 노션 심플 테이블 기본은 헤더 음영 없음 → th도 td와 동일 플레인 (에디터 표와 일치)
export const Th = tw.th`border border-[#d3d2ce] px-[9px] py-[7px] text-left align-top text-[14px] font-normal text-(--text)`;
export const Td = tw.td`border border-[#d3d2ce] px-[9px] py-[7px] text-left align-top text-[14px] text-(--text)`;
