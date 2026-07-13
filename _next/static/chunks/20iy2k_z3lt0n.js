(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72048,e=>{"use strict";var t=e.i(83189),r=e.i(22016);let n=t.default.div`flex px-10 relative border-r border-(--border) tracking-tight`,o=t.default.div`
  h-auto mr-8 w-72 w-[260px] bg-(--panel-bg) py-1.5 px-2 text-(--text-faint) flex flex-col gap-1
  fixed top-0 left-0 z-40 min-h-screen overflow-y-auto
  border-(--border)
  border-r
`,i=t.default.div`flex flex-col gap-[1px] pb-4 tracking-tight`,l=t.default.button`p-5px flex items-center justify-center rounded-md hover:bg-(--hover-bg) transition-colors`,a=t.default.button`
  text-2xs font-semibold mb-[1px] focus:outline-none flex items-center w-full rounded-md px-2 py-1.5 transition-colors
  text-(--text-muted) hover:bg-(--hover-bg) max-w-[244px]
`,d=t.default.ul``,s=t.default.li`mb-[1px]`,u=(0,t.default)(r.default)`
  flex items-center max-w-[244px] px-2 py-5px rounded-md hover:bg-(--hover-bg) font-medium overflow-hidden text-(--text-faint)
  ${({$active:e})=>e?"bg-(--hover-bg) text-(--text-strong)":""}
`,x=t.default.div`
  flex items-center max-w-[244px] px-2 py-5px rounded-md hover:bg-(--hover-bg) font-medium overflow-hidden text-(--text-faint) cursor-pointer
  ${({$active:e})=>e?"bg-(--hover-bg) text-(--text-strong)":""}
`,f=t.default.div`w-5 h-5 flex-shrink-0 mr-2 flex items-center justify-center text-(--text-faint)`,c=t.default.div`flex items-center justify-between w-full min-w-0`,p=t.default.span`text-[0.85rem] truncate block whitespace-nowrap min-w-0 flex-1`,b=t.default.div`flex items-center ml-2 flex-shrink-0 text-(--text-faint) transition-colors duration-200`,m=t.default.button`
  p-0 m-0 bg-transparent border-none outline-none flex items-center justify-center cursor-pointer
  w-5 h-5 rounded-md transition-all duration-150 opacity-0 group-hover:opacity-100
  hover:bg-(--hover-bg) text-(--text-faint)
`;e.s(["CategoryButton",0,a,"CategoryItem",0,s,"CategoryList",0,d,"Container",0,n,"DocRow",0,x,"Fixedwrap",0,i,"IconBtn",0,l,"Label",0,p,"LabelIconBtn",0,m,"LabelIcons",0,b,"LabelWrap",0,c,"PostLink",0,u,"SideContainer",0,o,"SvgWrap",0,f])},6734,e=>{"use strict";var t=e.i(43476),r=e.i(71645),n=e.i(18566),o=e.i(72048);e.s(["default",0,function({posts:e}){let i=(0,n.usePathname)(),l=e.find(e=>e.postUrl===i)?.label||null,[a,d]=(0,r.useState)(l),s=(0,r.useRef)(!0);(0,r.useEffect)(()=>{s.current&&(d(l),s.current=!1)},[l]);let u=e.reduce((e,t)=>((e[t.label]=e[t.label]||[]).push(t),e),{});return(0,t.jsx)(o.Container,{children:(0,t.jsx)(o.SideContainer,{children:Object.entries(u).map(([e,r])=>(0,t.jsxs)("div",{children:[(0,t.jsx)(o.CategoryButton,{style:{minHeight:32},onClick:()=>d(a===e?null:e),children:(0,t.jsx)("span",{children:e})}),a===e&&(0,t.jsx)(o.CategoryList,{children:r.map(e=>{let r=i===e.postUrl;return(0,t.jsx)(o.CategoryItem,{children:(0,t.jsx)(o.PostLink,{href:e.postUrl,$active:r,children:e.title})},e.slug)})})]},e))})})}])}]);