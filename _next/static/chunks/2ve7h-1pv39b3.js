(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,65830,e=>{"use strict";var t=e.i(43476),n=e.i(71645),r=e.i(19418);let l={margin:0,padding:0,border:0,fontFamily:"SFMono-Regular, Menlo, Consolas, 'PT Mono', 'Liberation Mono', Courier, monospace",fontSize:"13.5px",lineHeight:"1.6",letterSpacing:"normal",whiteSpace:"pre-wrap",wordBreak:"break-word",overflowWrap:"anywhere",tabSize:2,boxSizing:"border-box"};function o({className:e,children:i}){let a=i?.toString()||"",s=e?e.replace("language-",""):"",{value:x,language:d}=(0,n.useMemo)(()=>(0,r.highlightCode)(a,s||"auto"),[a,s]),c=(0,n.useMemo)(()=>(0,r.splitHljsLines)(x),[x]),u=Math.max(28,9*String(c.length).length+16),[p,f]=(0,n.useState)(!1),h=async()=>{try{await navigator.clipboard.writeText(a),f(!0),setTimeout(()=>f(!1),1200)}catch{}};return(0,t.jsx)("div",{className:"code-block group relative my-4",children:(0,t.jsxs)("div",{className:"relative rounded-[10px] bg-[#f7f6f3]",style:{padding:"18px 20px"},children:[(0,t.jsxs)("div",{className:"absolute right-2 top-2 z-20 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",children:[d&&(0,t.jsx)("span",{className:"font-mono text-[11px] lowercase text-(--text-muted)",children:d}),(0,t.jsx)("button",{type:"button",onClick:h,"aria-label":"코드 복사",title:"코드 복사",className:"flex items-center rounded-sm bg-(--page-bg)/70 p-1 text-(--text-muted) hover:bg-(--page-bg) hover:text-(--text)",children:p?(0,t.jsx)("svg",{width:"15",height:"15",viewBox:"0 0 16 16",fill:"none","aria-hidden":!0,children:(0,t.jsx)("path",{d:"M3.5 8.5l3 3 6-6.5",stroke:"#22863a",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})}):(0,t.jsx)("svg",{width:"15",height:"15",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":!0,children:(0,t.jsx)("path",{d:"M3.25 1.375c-1.036 0-1.875.84-1.875 1.875v6c0 1.036.84 1.875 1.875 1.875h1.625v1.625c0 1.036.84 1.875 1.875 1.875h6c1.036 0 1.875-.84 1.875-1.875v-6c0-1.036-.84-1.875-1.875-1.875h-1.625V3.25c0-1.036-.84-1.875-1.875-1.875zM2.625 3.25c0-.345.28-.625.625-.625h6c.345 0 .625.28.625.625v1.625H6.75c-1.036 0-1.875.84-1.875 1.875v3.125H3.25a.625.625 0 0 1-.625-.625zm3.5 3.5c0-.345.28-.625.625-.625h6c.345 0 .625.28.625.625v6c0 .345-.28.625-.625.625h-6a.625.625 0 0 1-.625-.625z"})})})]}),c.map((e,n)=>(0,t.jsxs)("div",{className:"flex",style:{alignItems:"flex-start"},children:[(0,t.jsx)("div",{className:"shrink-0 select-none",style:{...l,width:u,paddingRight:14,textAlign:"right",color:"#b3afa4"},children:n+1}),(0,t.jsx)("div",{className:"hljs min-w-0 flex-1",style:{...l,background:"transparent",color:"#24292e"},dangerouslySetInnerHTML:{__html:""===e?"&nbsp;":e}})]},n))]})})}e.s(["makeCode",0,function(e){return function(n){return(0,t.jsx)(o,{...n,styles:e})}}],65830)},44649,e=>{"use strict";var t=e.i(43476),n=e.i(71645),r=e.i(83189);let l=r.default.h1`
  font-bold
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[30px] font-bold
  relative`,o=r.default.h2`
  font-semibold
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[24px] font-semibold`,i=r.default.h3`
  font-medium
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[20px] font-medium`,a=r.default.h4`text-base font-medium before:content-['|'] before:font-bold before:pr-[20px]`,s=r.default.p`
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[16px]`,x=r.default.span`
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[16px]`,d=r.default.a`
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[16px]`,c=r.default.hr`my-1.5 w-full h-[1px] rounded border-0 bg-[#d8d7d2]`,u=r.default.pre`my-0`,p=r.default.ul`
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
`,f=r.default.ol`list-decimal pl-[1.9em] my-0 marker:font-medium marker:text-(--text)`,h=r.default.li`py-[3px] text-[16px] leading-[1.4] text-(--text)`,m=r.default.div`relative my-4 rounded-[10px] overflow-hidden border border-(--border) bg-[#f7f6f3] text-[14px] leading-relaxed`,g=r.default.div`absolute top-0 right-0 z-10 px-3 py-2 select-none`,b=r.default.span`text-[11px] font-mono lowercase text-(--text-muted)`,y=r.default.div`px-[22px] py-[16px]`,j=r.default.code`block font-mono whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[13.5px]`,v=r.default.strong`font-bold`,w=r.default.em`text-sm font-semibold not-italic px-2 py-0.5 bg-(--text) rounded-xl text-(--page-bg)`,T=r.default.span`w-full mx-auto py-6 text-center flex flex-col`,k=r.default.img`mx-auto max-w-full h-auto rounded-lg`,C=r.default.span`w-full text-center text-xs text-gray-400`,N=r.default.table`post-table my-3 w-full border-collapse`,H=r.default.thead``,S=r.default.tbody``,L=r.default.tr``,M=r.default.th`border border-[#d3d2ce] bg-[#f4f3f1] px-[10px] py-[8px] text-left align-top text-[14px] font-semibold text-(--text-strong)`,I=r.default.td`border border-[#d3d2ce] px-[10px] py-[7px] text-left align-top text-[14px] text-(--text)`;e.s(["A",0,d,"ClassLabel",0,b,"ClassWrap",0,g,"Code",0,j,"CodeBoxC",0,y,"CodeWrapC",0,m,"Em",0,w,"H1",0,l,"H2",0,o,"H3",0,i,"H4",0,a,"Hr",0,c,"Img",0,k,"ImgTitle",0,C,"ImgWrap",0,T,"Li",0,h,"Ol",0,f,"P",0,s,"Pre",0,u,"Span",0,x,"Strong",0,v,"Table",0,N,"Tbody",0,S,"Td",0,I,"Th",0,M,"Thead",0,H,"Tr",0,L,"Ul",0,p],59088);var z=e.i(59088);let P=(0,e.i(65830).makeCode)(z);e.s(["A",0,function({href:e,children:n}){return(0,t.jsx)(z.A,{target:"_blank",href:e,children:n})},"Blockquote",0,function({children:e}){return(0,t.jsx)("blockquote",{className:"my-3 rounded-lg bg-[#f4f3f1] px-4 py-3 text-[14px] leading-relaxed text-(--text-muted) [&>p]:my-0",children:e})},"Code",0,P,"Column",0,function({children:e}){return(0,t.jsx)("div",{className:"min-w-0 flex-1",children:e})},"Columns",0,function({children:e}){return(0,t.jsx)("div",{className:"my-2 flex gap-12 m:flex-col m:gap-2",children:e})},"Em",0,function({children:e}){return(0,t.jsx)(z.Em,{children:e})},"H1",0,function({children:e}){return(0,t.jsx)(z.H1,{children:e})},"H2",0,function({children:e}){return(0,t.jsx)(z.H2,{children:e})},"H3",0,function({children:e}){return(0,t.jsx)(z.H3,{children:e})},"H4",0,function({children:e}){return(0,t.jsx)(z.H4,{children:e})},"Hr",0,function({children:e}){return(0,t.jsx)(z.Hr,{children:e})},"Img",0,function({title:e,src:n,width:r,children:l}){return(0,t.jsxs)(z.ImgWrap,{children:[(0,t.jsx)(z.Img,{src:n,loading:"lazy",style:r?{width:`${r}px`,maxWidth:"100%"}:void 0,children:l}),(0,t.jsx)(z.ImgTitle,{children:e})]})},"Li",0,function({className:e,children:n}){return(0,t.jsx)(z.Li,{className:e,children:n})},"Ol",0,function({className:e,children:n}){return(0,t.jsx)(z.Ol,{className:e,children:n})},"P",0,function({children:e}){return(0,t.jsx)(z.P,{children:e})},"Pre",0,function({className:e,children:n}){return(0,t.jsx)(z.Pre,{children:n})},"Span",0,function({children:e}){return(0,t.jsx)(z.Span,{children:e})},"Strong",0,function({children:e}){return(0,t.jsx)(z.Strong,{children:e})},"Table",0,function({children:e}){return(0,t.jsx)("div",{className:"my-3 w-full max-w-full overflow-x-auto",children:(0,t.jsx)(z.Table,{children:e})})},"Tbody",0,function({children:e}){return(0,t.jsx)(z.Tbody,{children:e})},"Td",0,function({children:e}){return(0,t.jsx)(z.Td,{children:e})},"Th",0,function({children:e}){return(0,t.jsx)(z.Th,{children:e})},"Thead",0,function({children:e}){return(0,t.jsx)(z.Thead,{children:e})},"ToggleText",0,function({text:e,heading:r,color:l,children:o}){let[i,a]=n.default.useState(!0),s={"":{arrow:16,lh:24,cls:"text-[16px]"},h3:{arrow:19,lh:28,cls:"text-[20px] font-medium"},h2:{arrow:23,lh:34,cls:"text-[24px] font-semibold"},h1:{arrow:28,lh:42,cls:"text-[30px] font-bold"}},x=s[r||""]??s[""],d=e=>(0,t.jsx)("span",{className:"flex shrink-0 items-center justify-center text-(--text-muted)",style:{height:x.lh+3,paddingTop:3,width:x.arrow+8},children:(0,t.jsx)("svg",{width:x.arrow,height:x.arrow,viewBox:"0 0 20 20",fill:"none",style:{transform:e?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.15s ease"},children:(0,t.jsx)("path",{d:"M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z",fill:"currentColor"})})});if(void 0===e)return(0,t.jsxs)("div",{className:"flex items-start",children:[d(!0),(0,t.jsx)("span",{className:"py-[3px] text-[16px] leading-[24px] text-(--text)",children:o})]});let c=e;try{c=decodeURIComponent(e)}catch{}return(0,t.jsxs)("div",{className:"my-[2px]",children:[(0,t.jsxs)("div",{className:"flex items-start",children:[(0,t.jsx)("button",{type:"button",className:"cursor-pointer",onClick:()=>a(e=>!e),"aria-label":"토글",children:d(i)}),(0,t.jsx)("span",{className:`px-[2px] text-(--text) ${x.cls}`,style:{color:l,lineHeight:`${x.lh}px`,paddingTop:3},children:c})]}),(0,t.jsx)("div",{className:"grid transition-all duration-200 ease-out",style:{marginLeft:x.arrow+8,gridTemplateRows:i?"1fr":"0fr",opacity:+!!i},children:(0,t.jsx)("div",{className:"overflow-hidden",children:o})})]})},"Tr",0,function({children:e}){return(0,t.jsx)(z.Tr,{children:e})},"Ul",0,function({className:e,children:n}){return(0,t.jsx)(z.Ul,{className:e,children:n})}],44649)}]);