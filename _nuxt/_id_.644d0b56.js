import{o as a,c as s,a as i,F as m,r as h,n as p,t as k,_,b as l,e as f,w as I,f as C,u as g}from"./entry.c2f6f92b.js";import{_ as x}from"./index.fa895816.js";import{_ as y}from"./client-only.17a1b9c5.js";const w={class:"title-nav-view"},b={class:"title-nav"},A=["onClick"],N={class:"title-nav-text"};function $(e,n,r,u,v,t){return a(),s("div",w,[i("ul",b,[(a(!0),s(m,null,h(r.nav,(o,c)=>(a(),s("li",{class:p(["title-nav-item",[`h${o.level}`,t.isActive(c)]]),key:o.id,onClick:d=>t.onNavItemClick(o)},[i("span",N,k(o.title),1)],10,A))),128))])])}const M={props:{nav:{type:Array,default:()=>[]},activeIndex:{type:Number,default:null}},data:()=>({}),methods:{onNavItemClick(e){if(e&&e.id){const n=document.getElementById(e.id);n&&this.$emit("itemClick",{target:n,item:e})}},isActive(e){return this.activeIndex==e?"active":""}},mounted(){}},S=_(M,[["render",$],["__scopeId","data-v-5e76e6bb"]]),L={id:"content"},B={class:"article"},H={key:0,class:"aside card"},T={class:"markdown card"};function V(e,n,r,u,v,t){const o=S,c=x,d=y;return a(),s("div",L,[i("div",B,[!t.isMobile&&e.titles&&e.titles.length?(a(),s("div",H,[l(o,{nav:e.titles,activeIndex:e.titlesActiveIndex,onItemClick:t.onNavItemClick},null,8,["nav","activeIndex","onItemClick"])])):f("",!0),i("div",T,[l(d,null,{default:I(()=>[l(c,{title:t.current.title,content:t.current.markdown,offset:t.navHeight,onActiveChange:t.onMarkdownScroll,onImageClick:t.onImageClick,onLoaded:t.onMarkdownLoaded},null,8,["title","content","offset","onActiveChange","onImageClick","onLoaded"])]),_:1})])])])}const E={data:()=>({titlesActiveIndex:null,titles:null}),computed:{archive(){return this.$store.archive},isMobile(){return this.$store.isMobile},current(){return this.archive.currentItem},navHeight(){{const e=document.querySelector("#nav");if(e)return e.clientHeight}return 0}},methods:{onMarkdownLoaded({html:e,titles:n}){this.titles=n},onMarkdownScroll({index:e,item:n}){this.titlesActiveIndex=e},onImageClick(e){},onNavItemClick({target:e,item:n}){window.scrollTo({top:e.offsetTop-this.navHeight,behavior:"smooth"})}},mounted(){},setup(){const e=g(),n=C();e.$store.getArchive({...n.params})}},D=_(E,[["render",V],["__scopeId","data-v-f1d000e5"]]);export{D as default};
