(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{390:function(t,e,r){"use strict";var n=r(2),c=r(391);n({target:"String",proto:!0,forced:r(392)("link")},{link:function(t){return c(this,"a","href",t)}})},391:function(t,e,r){var n=r(4),c=r(27),o=r(15),f=/"/g,l=n("".replace);t.exports=function(t,e,r,n){var v=o(c(t)),d="<"+e;return""!==r&&(d+=" "+r+'="'+l(o(n),f,"&quot;")+'"'),d+">"+v+"</"+e+">"}},392:function(t,e,r){var n=r(3);t.exports=function(t){return n((function(){var e=""[t]('"');return e!==e.toLowerCase()||e.split('"').length>3}))}},412:function(t,e,r){t.exports={}},433:function(t,e,r){"use strict";r(412)},447:function(t,e,r){"use strict";r.r(e);r(35),r(36),r(33),r(34),r(10),r(54),r(32),r(55);var n=r(5),c=r(22),o=(r(390),r(53),r(37));function f(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}var l={computed:function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?f(Object(r),!0).forEach((function(e){Object(c.a)(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},Object(o.c)(["friends"])),fetch:function(t){return Object(n.a)(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.store,t.params,e.next=3,r.dispatch("friends");case 3:case"end":return e.stop()}}),e)})))()},methods:{onLinkClick:function(t){window.open(t.link,"_blank")}}},v=l,d=(r(433),r(21)),component=Object(d.a)(v,(function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"content"}},[e("ul",{staticClass:"friends"},t._l(t.friends,(function(r,n){return e("li",{key:n,staticClass:"friend",style:{"--cover":"url(".concat(r.cover,")")},on:{click:function(e){return t.onLinkClick(r)}}},[e("img",{directives:[{name:"lazy",rawName:"v-lazy",value:r.avatar,expression:"friend.avatar"}],staticClass:"friend-avatar"}),e("span",{staticClass:"friend-name"},[t._v(t._s(r.name))])])})),0)])}),[],!1,null,"678d866e",null);e.default=component.exports}}]);