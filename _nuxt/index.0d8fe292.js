import{o,c as l,t as d,f as c,a as h,b as w,w as u,T as m,_ as p}from"./entry.96c148e9.js";const v={class:"markdown-preview"},_={key:0,class:"markdown-title"},f=["innerHTML"];function g(e,t,i,n,s,r){return o(),l("div",v,[i.title?(o(),l("div",_,d(i.title),1)):c("",!0),h("div",{class:"markdown-content",innerHTML:r.markdown,ref:"contentRef"},null,8,f),w(m,{name:"zoom"},{default:u(()=>[e.previewEl?(o(),l("div",{key:0,class:"markdown-image-preview-modal",onClick:t[0]||(t[0]=(...a)=>r.cancelPreview&&r.cancelPreview(...a))})):c("",!0)]),_:1})])}const y={props:{title:{type:String,default:null},content:{type:String,default:null},offset:{type:Number,default:0}},data:()=>({_timer:null,preview:null,previewEl:null,titles:null}),computed:{markdown(){try{if(!this.$markdown)return null;const e=this.$markdown(this.content);return this.$emit("loaded",e),this.titles=e.titles,e.html}catch(e){console.error(e)}return null}},methods:{getNavPosition(){const e=document.querySelectorAll(".markdown [id^='md-title']");if(!e.length)return;let t,i;for(i=0;i<e.length;i++){t=e[i];const n=t.getBoundingClientRect();if(n.top-n.height>this.offset)break}this.$emit("activeChange",{index:i-1,item:t})},onScroll(){this._timer||(this._timer=setTimeout(()=>{this.getNavPosition(),this.cancelPreview(),this._timer=null},200))},cancelPreview(){this.previewEl&&(this.previewEl.style.transform="none",this.previewEl.style.zIndex=0,this.previewEl=null)},openPreview(e){if(e){this.previewEl=e;const t=this.previewEl.getBoundingClientRect(),i=(window.innerHeight-t.height)/2,n=(window.innerWidth-t.width)/2,s=t.width/t.height>window.innerWidth/window.innerHeight?window.innerWidth/t.width:window.innerHeight/t.height;this.previewEl.style.transform=`translate(${n-t.left}px, ${i-t.top}px) scale(${s})`,this.previewEl.style.zIndex=16}},initCopy(){document.querySelectorAll(".markdown-content .code-options [data-copy]").forEach(e=>e.onclick=t=>navigator.clipboard.writeText(document.getElementById(e.getAttribute("data-copy")).textContent))},initPreview(){document.querySelectorAll(".markdown-content img").forEach(e=>e.addEventListener("click",t=>this.$nextTick(()=>this.previewEl?this.cancelPreview():this.openPreview(t.target))))}},created(){},finish(){},mounted(){setTimeout(()=>{this.initCopy(),this.initPreview(),window.addEventListener("scroll",this.onScroll)},500)},beforeDestroy(){window.removeEventListener("scroll",this.onScroll)}},E=p(y,[["render",g],["__scopeId","data-v-0fd70cc0"]]);export{E as _};
