(this.webpackJsonpmarvel=this.webpackJsonpmarvel||[]).push([[7],{215:function(t,e,c){},229:function(t,e,c){"use strict";c.r(e);var n=c(47),i=c(43),a=c(35),r=c(1),s=c(8),o=c(44),j=c(13),l=c(37),b=(c(215),c(0)),u=function(){var t=Object(r.useState)([]),e=Object(a.a)(t,2),c=e[0],n=e[1],u=Object(r.useState)(!1),m=Object(a.a)(u,2),O=m[0],d=m[1],f=Object(r.useState)(0),h=Object(a.a)(f,2),v=h[0],x=h[1],_=Object(r.useState)(!1),p=Object(a.a)(_,2),y=p[0],g=p[1],N=Object(o.a)(),S=N.loading,w=N.error,k=N.getAllComics;Object(r.useEffect)((function(){A(v,!0)}),[]);var A=function(t,e){d(!e),k(t).then(C)},C=function(t){var e=!1;t<8&&(e=!0),n([].concat(Object(i.a)(c),Object(i.a)(t))),d(!1),x(v+8),g(e)};var E=function(t){var e=t.map((function(t,e){var c=t.id,n=t.title,i=t.thumbnail,a=t.price;return Object(b.jsx)("li",{className:"comics__item",children:Object(b.jsxs)(s.b,{to:"/comics/".concat(c),children:[Object(b.jsx)("img",{src:i,alt:n,className:"comics__item-img"}),Object(b.jsx)("div",{className:"comics__item-name",children:n}),Object(b.jsx)("div",{className:"comics__item-price",children:a})]})},e)}));return Object(b.jsx)("ul",{className:"comics__grid",children:e})}(c),I=w?Object(b.jsx)(l.a,{}):null,J=S&&!O?Object(b.jsx)(j.a,{}):null;return Object(b.jsxs)("div",{className:"comics__list",children:[I,J,E,Object(b.jsx)("button",{className:"button button__main button__long",disabled:O,style:{display:y?"none":"block"},onClick:function(){return A(v)},children:Object(b.jsx)("div",{className:"inner",children:"load more"})})]})},m=c(101);e.default=function(){return Object(b.jsxs)(b.Fragment,{children:[Object(b.jsxs)(n.a,{children:[Object(b.jsx)("meta",{name:"description",content:"Page with list of our comics"}),Object(b.jsx)("title",{children:"Comics page"})]}),Object(b.jsx)(m.a,{}),Object(b.jsx)(u,{})]})}},43:function(t,e,c){"use strict";c.d(e,"a",(function(){return a}));var n=c(48);var i=c(45);function a(t){return function(t){if(Array.isArray(t))return Object(n.a)(t)}(t)||function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(i.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}}}]);
//# sourceMappingURL=7.f7a17cfa.chunk.js.map