(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,67585,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"BailoutToCSR",{enumerable:!0,get:function(){return l}});let r=e.r(32061);function l({reason:e,children:t}){if("u"<typeof window)throw Object.defineProperty(new r.BailoutToCSRError(e),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});return t}},9885,(e,t,n)=>{"use strict";function r(e){return e.split("/").map(e=>encodeURIComponent(e)).join("/")}Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"encodeURIPath",{enumerable:!0,get:function(){return r}})},52157,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"PreloadChunks",{enumerable:!0,get:function(){return s}});let r=e.r(43476),l=e.r(74080),o=e.r(63599),i=e.r(9885),a=e.r(43369);function s({moduleIds:e}){if("u">typeof window)return null;let t=o.workAsyncStorage.getStore();if(void 0===t)return null;let n=[];if(t.reactLoadableManifest&&e){let r=t.reactLoadableManifest;for(let t of e){if(!r[t])continue;let e=r[t].files;n.push(...e)}}if(0===n.length)return null;let d=(0,a.getAssetTokenQuery)();return(0,r.jsx)(r.Fragment,{children:n.map(e=>{let n=`${t.assetPrefix}/_next/${(0,i.encodeURIPath)(e)}${d}`;return e.endsWith(".css")?(0,r.jsx)("link",{precedence:"dynamic",href:n,rel:"stylesheet",as:"style",nonce:t.nonce},e):((0,l.preload)(n,{as:"script",fetchPriority:"low",nonce:t.nonce}),null)})})}},69093,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"default",{enumerable:!0,get:function(){return d}});let r=e.r(43476),l=e.r(71645),o=e.r(67585),i=e.r(52157);function a(e){return{default:e&&"default"in e?e.default:e}}let s={loader:()=>Promise.resolve(a(()=>null)),loading:null,ssr:!0},d=function(e){let t={...s,...e},n=(0,l.lazy)(()=>t.loader().then(a)),d=t.loading;function u(e){let a=d?(0,r.jsx)(d,{isLoading:!0,pastDelay:!0,error:null}):null,s=!t.ssr||!!t.loading,u=s?l.Suspense:l.Fragment,x=t.ssr?(0,r.jsxs)(r.Fragment,{children:["u"<typeof window?(0,r.jsx)(i.PreloadChunks,{moduleIds:t.modules}):null,(0,r.jsx)(n,{...e})]}):(0,r.jsx)(o.BailoutToCSR,{reason:"next/dynamic",children:(0,r.jsx)(n,{...e})});return(0,r.jsx)(u,{...s?{fallback:a}:{},children:x})}return u.displayName="LoadableComponent",u}},70703,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"default",{enumerable:!0,get:function(){return l}});let r=e.r(55682)._(e.r(69093));function l(e,t){let n={};"function"==typeof e&&(n.loader=e);let l={...n,...t};return(0,r.default)({...l,modules:l.loadableGenerated?.modules})}("function"==typeof n.default||"object"==typeof n.default&&null!==n.default)&&void 0===n.default.__esModule&&(Object.defineProperty(n.default,"__esModule",{value:!0}),Object.assign(n.default,n),t.exports=n.default)},65830,e=>{"use strict";var t=e.i(43476);let n=(0,e.i(70703).default)(()=>e.A(38461),{loadableGenerated:{modules:[75908]},ssr:!1});e.s(["makeCode",0,function(e){return function(r){return(0,t.jsx)(n,{...r,styles:e})}}])},44649,e=>{"use strict";var t=e.i(43476),n=e.i(71645),r=e.i(83189);let l=r.default.h1`
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
  text-[16px]`,d=r.default.span`
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[16px]`,u=r.default.a`
  text-(--text-strong)
  text-(--text)
  px-[2px] py-[3px] leading-[1.4]
  outline-none
  cursor-text
  text-[16px]`,x=r.default.hr`my-1.5 w-full h-[2px] rounded border-0 bg-[#d0cfca]`,c=r.default.pre`my-0`,f=r.default.ul`
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
`,p=r.default.ol`list-decimal pl-[1.9em] my-0 marker:font-medium marker:text-(--text)`,m=r.default.li`py-[3px] text-[16px] leading-[1.4] text-(--text)`,h=r.default.div`relative my-4 rounded-[10px] overflow-hidden border border-(--border) bg-[#f7f6f3] text-[14px] leading-relaxed`,b=r.default.div`absolute top-0 right-0 z-10 px-3 py-2 select-none`,g=r.default.span`text-[11px] font-mono lowercase text-(--text-muted)`,y=r.default.div`px-[22px] py-[16px]`,j=r.default.code`block font-mono whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[13.5px]`,w=r.default.strong`font-bold`,v=r.default.em`text-sm font-semibold not-italic px-2 py-0.5 bg-(--text) rounded-xl text-(--page-bg)`,T=r.default.span`w-full mx-auto py-6 text-center flex flex-col`,P=r.default.img`mx-auto`,k=r.default.span`w-full text-center text-xs text-gray-400`,C=r.default.table`my-3 border-collapse`,_=r.default.thead``,O=r.default.tbody``,H=r.default.tr``,S=r.default.th`border border-[#d3d2ce] px-[9px] py-[7px] text-left align-top text-[14px] font-normal text-(--text)`,I=r.default.td`border border-[#d3d2ce] px-[9px] py-[7px] text-left align-top text-[14px] text-(--text)`;e.s(["A",0,u,"ClassLabel",0,g,"ClassWrap",0,b,"Code",0,j,"CodeBoxC",0,y,"CodeWrapC",0,h,"Em",0,v,"H1",0,l,"H2",0,o,"H3",0,i,"H4",0,a,"Hr",0,x,"Img",0,P,"ImgTitle",0,k,"ImgWrap",0,T,"Li",0,m,"Ol",0,p,"P",0,s,"Pre",0,c,"Span",0,d,"Strong",0,w,"Table",0,C,"Tbody",0,O,"Td",0,I,"Th",0,S,"Thead",0,_,"Tr",0,H,"Ul",0,f],59088);var L=e.i(59088);let N=(0,e.i(65830).makeCode)(L);e.s(["A",0,function({href:e,children:n}){return(0,t.jsx)(L.A,{target:"_blank",href:e,children:n})},"Code",0,N,"Em",0,function({children:e}){return(0,t.jsx)(L.Em,{children:e})},"H1",0,function({children:e}){return(0,t.jsx)(L.H1,{children:e})},"H2",0,function({children:e}){return(0,t.jsx)(L.H2,{children:e})},"H3",0,function({children:e}){return(0,t.jsx)(L.H3,{children:e})},"H4",0,function({children:e}){return(0,t.jsx)(L.H4,{children:e})},"Hr",0,function({children:e}){return(0,t.jsx)(L.Hr,{children:e})},"Img",0,function({title:e,src:n,width:r,children:l}){return(0,t.jsxs)(L.ImgWrap,{children:[(0,t.jsx)(L.Img,{src:n,loading:"lazy",style:r?{width:`${r}px`,maxWidth:"100%"}:void 0,children:l}),(0,t.jsx)(L.ImgTitle,{children:e})]})},"Li",0,function({className:e,children:n}){return(0,t.jsx)(L.Li,{className:e,children:n})},"Ol",0,function({className:e,children:n}){return(0,t.jsx)(L.Ol,{className:e,children:n})},"P",0,function({children:e}){return(0,t.jsx)(L.P,{children:e})},"Pre",0,function({className:e,children:n}){return(0,t.jsx)(L.Pre,{children:n})},"Span",0,function({children:e}){return(0,t.jsx)(L.Span,{children:e})},"Strong",0,function({children:e}){return(0,t.jsx)(L.Strong,{children:e})},"Table",0,function({children:e}){return(0,t.jsx)(L.Table,{children:e})},"Tbody",0,function({children:e}){return(0,t.jsx)(L.Tbody,{children:e})},"Td",0,function({children:e}){return(0,t.jsx)(L.Td,{children:e})},"Th",0,function({children:e}){return(0,t.jsx)(L.Th,{children:e})},"Thead",0,function({children:e}){return(0,t.jsx)(L.Thead,{children:e})},"ToggleText",0,function({text:e,heading:r,color:l,children:o}){let[i,a]=n.default.useState(!0),s={"":{arrow:16,lh:24,cls:"text-[16px]"},h3:{arrow:19,lh:28,cls:"text-[20px] font-medium"},h2:{arrow:23,lh:34,cls:"text-[24px] font-semibold"},h1:{arrow:28,lh:42,cls:"text-[30px] font-bold"}},d=s[r||""]??s[""],u=e=>(0,t.jsx)("span",{className:"flex shrink-0 items-center justify-center text-(--text-muted)",style:{height:d.lh+3,paddingTop:3,width:d.arrow+8},children:(0,t.jsx)("svg",{width:d.arrow,height:d.arrow,viewBox:"0 0 20 20",fill:"none",style:{transform:e?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.15s ease"},children:(0,t.jsx)("path",{d:"M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z",fill:"currentColor"})})});if(void 0===e)return(0,t.jsxs)("div",{className:"flex items-start",children:[u(!0),(0,t.jsx)("span",{className:"py-[3px] text-[16px] leading-[24px] text-(--text)",children:o})]});let x=e;try{x=decodeURIComponent(e)}catch{}return(0,t.jsxs)("div",{className:"my-[2px]",children:[(0,t.jsxs)("div",{className:"flex items-start",children:[(0,t.jsx)("button",{type:"button",className:"cursor-pointer",onClick:()=>a(e=>!e),"aria-label":"토글",children:u(i)}),(0,t.jsx)("span",{className:`px-[2px] text-(--text) ${d.cls}`,style:{color:l,lineHeight:`${d.lh}px`,paddingTop:3},children:x})]}),i&&(0,t.jsx)("div",{style:{marginLeft:d.arrow+8},children:o})]})},"Tr",0,function({children:e}){return(0,t.jsx)(L.Tr,{children:e})},"Ul",0,function({className:e,children:n}){return(0,t.jsx)(L.Ul,{className:e,children:n})}],44649)},38461,e=>{e.v(t=>Promise.all(["static/chunks/1of0avtptsng4.js","static/chunks/1evdzmrq699bl.js"].map(t=>e.l(t))).then(()=>t(75908)))}]);