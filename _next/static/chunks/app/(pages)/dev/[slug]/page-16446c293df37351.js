(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[565],{8751:function(t,e,n){Promise.resolve().then(n.bind(n,3480)),Promise.resolve().then(n.bind(n,1373))},3480:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return b}});var r=n(7437),o=n(230),i=n(5878),u=n(1396),l=n.n(u);function c(){let t=(0,o._)(["flex min-h-dvh space-y-3 px-3"]);return c=function(){return t},t}function f(){let t=(0,o._)(["\nflex min-w-40 h-12 w-full items-center rounded-2xl cursor-pointer font-semibold text-lg\nhover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500"]);return f=function(){return t},t}function s(){let t=(0,o._)(["flex flex-col h-auto mr-8 w-auto border-r"]);return s=function(){return t},t}function a(){let t=(0,o._)(["\nflex min-w-40 h-12 w-full items-center pl-3 rounded-2xl cursor-pointer\nhover:font-bold after:content-['.'] after:text-transparent hover:after:text-red-500"]);return a=function(){return t},t}function d(){let t=(0,o._)([""]);return d=function(){return t},t}let h=i.Z.div(c()),x=(0,i.Z)(l())(f()),m=i.Z.div(s()),p=(0,i.Z)(l())(a()),v=i.Z.p(d());function b(t){let{props:e}=t;return(0,r.jsx)(h,{children:(0,r.jsxs)(m,{children:[(0,r.jsx)(x,{href:"./intro",children:"시작하기"}),e.map(t=>!t.label.startsWith("intro")&&(0,r.jsx)(p,{href:t.postUrl,children:(0,r.jsx)(v,{children:t.title})},t.slug))]})})}},1373:function(t,e,n){"use strict";n.r(e),n.d(e,{DevMDXContent:function(){return w}});var r=n(7437),o=n(2265),i=n(230),u=n(5878);function l(){let t=(0,i._)(["w-full"]);return l=function(){return t},t}function c(){let t=(0,i._)(["relative w-full"]);return c=function(){return t},t}function f(){let t=(0,i._)(["sticky bottom-0 flex flex-col items-end mobile:hidden"]);return f=function(){return t},t}function s(){let t=(0,i._)(["w-12 h-12 text-xs rounded-full bg-main text-white font-bold mb-4"]);return s=function(){return t},t}function a(){let t=(0,i._)(["bg-main/[0.8] rounded-2xl opacity-0 text-[0px]\ntransform transition-all duration-300 ease-in-out \n",""]);return a=function(){return t},t}function d(){let t=(0,i._)(["cursor-pointer text-gray-300 \nhover:text-t-main hover:font-bold\n",""]);return d=function(){return t},t}let h=u.Z.div(l()),x=u.Z.div(c()),m=u.Z.div(f()),p=u.Z.button(s()),v=u.Z.div(a(),t=>t.$active?"animate-grow-up mb-4 text-sm w-40  space-y-1.5 p-4":"animate-shrink-down text-[0px]"),b=u.Z.p(d(),t=>t.$active?"font-bold underline":"none");function w(t){let{content:e}=t,[n,i]=(0,o.useState)([]),[u,l]=(0,o.useState)(!0),[c,f]=(0,o.useState)("");(0,o.useEffect)(()=>{let t=window.location.hash,e=document.querySelectorAll("h1, h2, h3");if(i(Array.from(e).map(t=>{let e=t.textContent||"",n=parseInt(t.tagName.replace("H",""),10),r=e.replace(/\s+/g,"-").toLowerCase();return t.id=r,{id:r,text:e,level:n}})),t){let e=document.querySelector(t);e&&setTimeout(()=>{e.scrollIntoView({behavior:"smooth"})},0)}let n=new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting&&f(t.target.id)})},{rootMargin:"0px 0px -80% 0px"});return e.forEach(t=>n.observe(t)),()=>{e.forEach(t=>n.unobserve(t))}},[e]);let s=t=>{let e=document.getElementById(t);e&&e.scrollIntoView({behavior:"smooth"})};return(0,r.jsxs)(h,{children:[(0,r.jsx)(x,{children:e}),(0,r.jsxs)(m,{children:[(0,r.jsx)(p,{onClick:()=>{l(t=>!t)},children:"index"}),(0,r.jsx)(v,{$active:u,children:n.map(t=>(0,r.jsx)(b,{$active:t.id===c,style:{marginLeft:"".concat((t.level-1)*10,"px")},onClick:()=>s(t.id),children:t.text},t.id))})]})]})}},1396:function(t,e,n){t.exports=n(5250)}},function(t){t.O(0,[229,250,971,938,744],function(){return t(t.s=8751)}),_N_E=t.O()}]);