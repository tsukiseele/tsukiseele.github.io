import{c as n,F as d,r,o as s,n as h,a as t,t as o,b as f,h as l,j as m,_ as y,m as k}from"./entry.b7d10dfa.js";import{_ as x}from"./index.61f87cd0.js";import{_ as b}from"./index.7c098bd8.js";const g={class:"experience",id:"content"},w=["data-name"],$={class:"classify__list"},B={key:0,class:"item__cover-wrapper"},I={class:"item__info"},S={class:"item__info-name"},C={class:"item__info-desc"},N={class:"item__info-detail"},V={class:"item__type"};function F(a,p,z,D,E,L){const u=x,c=b;return s(),n("div",g,[(s(!0),n(d,null,r(a.experience,(_,i)=>(s(),n("div",{class:h(["classify",`classify--${i}`]),key:i},[t("div",{class:"classify__name","data-name":_.title},o(_.title),9,w),t("div",$,[(s(!0),n(d,null,r(_.items,(e,v)=>(s(),n("div",{class:"classify__list-item",key:v},[e.cover?(s(),n("div",B,[f(u,{class:"item__cover",src:e.cover,alt:e.name},null,8,["src","alt"])])):l("",!0),t("div",I,[t("div",S,o(e.name),1),t("div",C,o(e.desc),1),t("div",N,[t("span",null,o(e.desc),1)])]),t("div",V,[e.type=="github"?(s(),m(c,{key:0,name:"mdi-github"})):e.type=="website"?(s(),m(c,{key:1,name:"mdi-web"})):l("",!0)])]))),128))])],2))),128))])}const j={data:()=>({}),computed:{...k(["experience"])},methods:{onItemClick(a){a&&a.link&&window.open(a.link,"_blank")}},async fetch({store:a,params:p}){await a.dispatch("experience")}},H=y(j,[["render",F],["__scopeId","data-v-470851a2"]]);export{H as default};
