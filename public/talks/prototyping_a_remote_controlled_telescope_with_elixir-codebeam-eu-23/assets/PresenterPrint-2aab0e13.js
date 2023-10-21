import{d as _,u as d,a as p,c as m,b as u,r as h,o as a,e as n,f as t,t as s,g as r,F as f,h as g,n as v,i as x,j as b,k as y,l as k,m as N,_ as P}from"./index-2fd2a7de.js";import{N as w}from"./NoteDisplay-de665003.js";const D={class:"m-4"},L={class:"mb-10"},S={class:"text-4xl font-bold mt-2"},V={class:"opacity-50"},B={class:"text-lg"},C={class:"font-bold flex gap-2"},T={class:"opacity-50"},j=t("div",{class:"flex-auto"},null,-1),E={key:0,class:"border-gray-400/50 mb-8"},H=_({__name:"PresenterPrint",setup(M){d(`
@page {
  size: A4;
  margin-top: 1.5cm;
  margin-bottom: 1cm;
}
* {
  -webkit-print-color-adjust: exact;
}
html,
html body,
html #app,
html #page-root {
  height: auto;
  overflow: auto !important;
}
`),p({title:`Notes - ${m.title}`});const c=u(()=>h.map(o=>{var l;return(l=o.meta)==null?void 0:l.slide}).filter(o=>o!==void 0&&o.noteHTML!==""));return(o,l)=>(a(),n("div",{id:"page-root",style:v(r(x))},[t("div",D,[t("div",L,[t("h1",S,s(r(m).title),1),t("div",V,s(new Date().toLocaleString()),1)]),(a(!0),n(f,null,g(c.value,(e,i)=>(a(),n("div",{key:i,class:"flex flex-col gap-4 break-inside-avoid-page"},[t("div",null,[t("h2",B,[t("div",C,[t("div",T,s(e==null?void 0:e.no)+"/"+s(r(b)),1),y(" "+s(e==null?void 0:e.title)+" ",1),j])]),k(w,{"note-html":e.noteHTML,class:"max-w-full"},null,8,["note-html"])]),i<c.value.length-1?(a(),n("hr",E)):N("v-if",!0)]))),128))])],4))}}),F=P(H,[["__file","/Users/lucas/Desktop/00_docs projets/02_CLOS/16_CODEBEAM_conf/codebeam/node_modules/@slidev/client/internals/PresenterPrint.vue"]]);export{F as default};
