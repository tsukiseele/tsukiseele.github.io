import{c,a as e,F as i,r as d,o as t,t as n,b as v,j as l,h,_ as k,f as y}from"./entry.b7d10dfa.js";import{_ as b}from"./index.61f87cd0.js";import{_ as f}from"./index.7c098bd8.js";const j={id:"content"},x={class:"projects"},g={class:"project-classify-name"},$={class:"project-list"},w=["onClick"],I={class:"project-cover-wrapper"},B={class:"project-description"},C={class:"project-name"},N={class:"project-desc"},S={class:"project-detail"},V={class:"project-type"};function F(o,D,E,L,P,a){const p=b,_=f;return t(),c("div",j,[e("div",x,[(t(!0),c(i,null,d(a.projects,(r,m)=>(t(),c("div",{class:"project-classify",key:m},[e("div",g,n(r.name),1),e("div",$,[(t(!0),c(i,null,d(r.items,(s,u)=>(t(),c("div",{class:"project-item",key:u,onClick:q=>a.onItemClick(s)},[e("div",I,[v(p,{class:"project-cover",src:s.cover,alt:s.name},null,8,["src","alt"])]),e("div",B,[e("div",C,n(s.name),1),e("div",N,n(s.desc),1),e("div",S,[e("span",null,n(s.desc),1)])]),e("div",V,[s.type=="github"?(t(),l(_,{key:0,name:"github"})):s.type=="website"?(t(),l(_,{key:1,name:"website"})):h("",!0)])],8,w))),128))])]))),128))])])}const A={data:()=>({}),computed:{projects(){return this.$store.projects}},methods:{onItemClick(o){o&&o.link&&window.open(o.link,"_blank")}},setup(){y().$store.getProjects()}},J=k(A,[["render",F],["__scopeId","data-v-718bc54b"]]);export{J as default};
