/*!
ARIA Button Module 1.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/
"setButton"in $A||$A.import("RovingTabIndex",{name:"ButtonModule",props:props,once:!0,call:function(t){$A.extend({setButton:function(t,d){function l(i,t,e,r,s){if(e){var a=$A.getAttr(i,"role"),A="radio"===a,o="switch"===a,n=$A.hasAttr(i,"aria-pressed"),c=0;return"true"===t?c=1:A||n||o||"mixed"!==t?t="false":c=2,$A.data(i,"check",c),r&&(A&&$A.isArray(s)&&$A.loop(s,function(t,e){e!==i&&$A.setAttr(e,"aria-checked","false")},"array"),$A.setAttr(i,n?"aria-pressed":"aria-checked",t),"mixed"===t?($A.remClass(i,d.toggleClass||"pressed checked"),$A.toggleClass(i,d.partialClass||"partially-checked",!0)):($A.remClass(i,d.partialClass||"partially-checked"),$A.toggleClass(i,d.toggleClass||(n?"pressed":"checked"),"true"===t))),c}return!1}this._4X&&(d=t,t=this._X),$A.isPlainObject(t)&&(t=(d=t).trigger||null);var u=[];if($A.query(t,d.context||document,function(t,e){var i=$A.isNode(e)&&($A.hasAttr(e,"controls")&&$A.morph($A.getAttr(e,"controls"))||$A.isFn(e.querySelector)&&e.querySelector("input"))||!1,n=$A.isNative(i)?i:$A.isNative(e)?e:null,r=$A.isNode(i)&&!$A.isNative(i)?i:$A.isNative(e)?null:e,A=!$A.isNode(n)&&$A.isNode(i)&&r!==e?i:null;if(A===r&&(r=e),$A.isNode(r)){$A.isNode(n)&&$A.isNode(r)&&$A.bindObjects(n,r);var s=l(r,$A.getAttr(r,"radio"),$A.hasAttr(r,"radio")),a=l(r,$A.getAttr(r,"check"),$A.hasAttr(r,"check")),o=l(r,$A.getAttr(r,"toggle"),$A.hasAttr(r,"toggle")),c=l(r,$A.getAttr(r,"switch"),$A.hasAttr(r,"switch"));if($A.isNum(s))$A.setAttr(r,{role:"radio","aria-checked":s?"true":"false"}),u.push(r);else if($A.isNum(a)||$A.isNum(c)){$A.isNode(n)&&n.checked&&(a=1),$A.isNode(A)&&($A.remAttr(r,"controls"),A.id||(A.id=$A.genId()),$A.setAttr(r,{"aria-flowto":A.id,"aria-controls":A.id}));var $="false";1===a?$="true":$A.isNum(c)||2!==a||($="mixed"),$A.setKBA11Y(r,$A.isNum(c)?"switch":"checkbox",function(t,e){var i=this,r=$A.isDisabled(i),s=l(i,$A.getAttr(i,"aria-checked"),$A.hasAttr(i,"aria-checked"));!r&&$A.isFn(d.onActivate)&&d.onActivate.apply(i,[t,i,e||n,s,function(t){l(i,t,!0,!0)}])}),$A.setAttr(r,{"aria-checked":$})}else!1!==o&&($A.setAttr(r,"aria-pressed",o?"true":"false"),$A.isNode(A)&&(A.id||(A.id=$A.genId()),$A.setAttr(r,{"aria-flowto":A.id,"aria-controls":A.id}))),$A.setKBA11Y(r,"button",function(t,e){var i=this,r=$A.isDisabled(i),s=l(i,$A.getAttr(i,"aria-pressed"),$A.hasAttr(i,"aria-pressed")),a=!1!==s?[t,i,e||A,s,function(t){l(i,t,!0,!0)}]:[t,i,e||A];!r&&$A.isFn(d.onActivate)&&d.onActivate.apply(i,a)});!1===s&&!1===a&&!1===o&&!1===c||$A.on(r,"attributeChange",function(t,e,i,r,s,a,A){if($A.isNode(n)){var o=l(e,r,!0);n.checked=!!o}},{attributeFilter:["aria-checked","aria-pressed"]}),$A.svgFix(r),$A.isNode(n)&&n.disabled&&$A.setAttr(r,"aria-disabled","true"),$A.updateDisabled(r),$A.remAttr(r,["check","controls","radio","switch","toggle"])}}),u.length){var a=d.container&&$A.morph(d.container)||$A.closest(u[0],function(t){if("radiogroup"===$A.getAttr(t,"role"))return!0});$A.isNode(a)||function(t){var e=[],i=[];$A.closest(t[0],function(t){if($A.isNode(t)&&e.push(t),t===document.body)return!0}),$A.closest(t[t.length-1],function(t){if($A.isNode(t)&&i.push(t),t===document.body)return!0}),e=e.reverse(),i=i.reverse();for(var r=null,s=0;s<e.length;s++)if(e[s]===i[s])r=e[s];else if(e[s]!==i[s])break;a=r}(u),$A.setAttr(a,"role","radiogroup"),new $A.RovingTabIndex($A.extend({nodes:u,startIndex:0,orientation:0,autoLoop:!0,onClick:function(t,e,i,r){var s=e,a=$A.isDisabled(s),A=l(s,$A.getAttr(s,"aria-checked"),$A.hasAttr(s,"aria-checked"));!a&&$A.isFn(d.onActivate)&&d.onActivate.apply(s,[t,s,r,A,function(t){l(s,t,!0,!0,i.nodes)}])},onSpace:function(t,e,i,r){i.onClick.apply(e,arguments)},onFocus:function(t,e,i,r){i.arrowPressed&&!$A.isTouch&&i.onClick.apply(e,arguments)}},d.extendRTI||{}))}return $A._XR.call(this,t)}}),$A.extend({setCheckbox:$A.setButton,setRadio:$A.setButton,setSwitch:$A.setButton})}});