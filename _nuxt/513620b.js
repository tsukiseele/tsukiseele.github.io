(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{341:function(t,e,r){"use strict";var n=r(3),c=r(342);n({target:"String",proto:!0,forced:r(343)("link")},{link:function(t){return c(this,"a","href",t)}})},342:function(t,e,r){var n=r(21),c=r(11),o=/"/g;t.exports=function(t,e,r,f){var l=c(n(t)),v="<"+e;return""!==r&&(v+=" "+r+'="'+c(f).replace(o,"&quot;")+'"'),v+">"+l+"</"+e+">"}},343:function(t,e,r){var n=r(6);t.exports=function(t){return n((function(){var e=""[t]('"');return e!==e.toLowerCase()||e.split('"').length>3}))}},363:function(t,e,r){},383:function(t,e,r){"use strict";r(363)},396:function(t,e,r){"use strict";r.r(e);r(29),r(32),r(27),r(28),r(7),r(50),r(26),r(51);var n=r(2),c=r(16),o=(r(341),r(49),r(33));function f(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var l={computed:function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(e){Object(c.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({},Object(o.c)(["friends"])),fetch:function(t){return Object(n.a)(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.store,t.params,e.next=3,r.dispatch("friends");case 3:case"end":return e.stop()}}),e)})))()},methods:{onLinkClick:function(t){window.open(t.link,"_blank")}}},v=l,d=(r(383),r(10)),component=Object(d.a)(v,(function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"content"}},[e("ul",{staticClass:"friends"},t._l(t.friends,(function(r,n){return e("li",{key:n,staticClass:"friend",style:{"--cover":"url(".concat(r.cover,")")},on:{click:function(e){return t.onLinkClick(r)}}},[e("img",{directives:[{name:"lazy",rawName:"v-lazy",value:r.avatar,expression:"friend.avatar"}],staticClass:"friend-avatar"}),e("span",{staticClass:"friend-name"},[t._v(t._s(r.name))])])})),0)])}),[],!1,null,"678d866e",null);e.default=component.exports}}]);