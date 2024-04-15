import{d,a9 as u,y as h,b as a,e as t,x as s,A as r,F as f,a7 as g,o as l,aa as v,l as x,g as b}from"../modules/vue-BXmsG0jI.js";import{u as y,j as N,c as _,b as k}from"../index-JOTi8wQD.js";import{N as w}from"./NoteDisplay-DT3KiKr0.js";import"../modules/shiki-D8IwEf5w.js";const D={id:"page-root"},L={class:"m-4"},T={class:"mb-10"},V={class:"text-4xl font-bold mt-2"},B={class:"opacity-50"},H={class:"text-lg"},S={class:"font-bold flex gap-2"},j={class:"opacity-50"},A=t("div",{class:"flex-auto"},null,-1),C={key:0,class:"border-main mb-8"},F=d({__name:"print",setup(M){const{slides:m,total:p}=y();u(`
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
`),N({title:`Notes - ${_.title}`});const i=h(()=>m.value.map(o=>{var n;return(n=o.meta)==null?void 0:n.slide}).filter(o=>o!==void 0&&o.noteHTML!==""));return(o,n)=>(l(),a("div",D,[t("div",L,[t("div",T,[t("h1",V,s(r(_).title),1),t("div",B,s(new Date().toLocaleString()),1)]),(l(!0),a(f,null,g(i.value,(e,c)=>(l(),a("div",{key:c,class:"flex flex-col gap-4 break-inside-avoid-page"},[t("div",null,[t("h2",H,[t("div",S,[t("div",j,s(e==null?void 0:e.no)+"/"+s(r(p)),1),v(" "+s(e==null?void 0:e.title)+" ",1),A])]),x(w,{"note-html":e.noteHTML,class:"max-w-full"},null,8,["note-html"])]),c<i.value.length-1?(l(),a("hr",C)):b("v-if",!0)]))),128))])]))}}),$=k(F,[["__file","/Users/lucas/Desktop/elixirconf_24_lucas_sifoni_lets_write_a_toy_language/node_modules/@slidev/client/pages/presenter/print.vue"]]);export{$ as default};
