import{c as n,a,F as i,r as d,o as t,k as l,b as p,t as m,_ as u,m as k}from"./entry.b7d10dfa.js";import{_ as f}from"./index.61f87cd0.js";const v={id:"content"},h={class:"friends"},y=["onClick"],x={class:"friend-name"};function $(e,o,C,S,w,c){const r=f;return t(),n("div",v,[a("ul",h,[(t(!0),n(i,null,d(e.friends,(s,_)=>(t(),n("li",{class:"friend",key:_,onClick:B=>c.onLinkClick(s),style:l({"--cover":`url(${s.cover})`})},[p(r,{class:"friend-avatar",src:s.avatar},null,8,["src"]),a("span",x,m(s.name),1)],12,y))),128))])])}const g={computed:{...k(["friends"])},async fetch({store:e,params:o}){await e.dispatch("friends")},methods:{onLinkClick(e){window.open(e.link,"_blank")}}},F=u(g,[["render",$],["__scopeId","data-v-ed369c5e"]]);export{F as default};
