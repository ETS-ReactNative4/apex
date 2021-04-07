/*!
ARIA Tab Module 2.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/
"setTab"in $A||$A.import("RovingTabIndex",{name:"TabModule",props:props,once:!0,call:function(e){$A.addWidgetProfile("Tab",{configure:function(e){return{exposeBounds:!0,isTab:!0,ariaControls:!0,ariaLabelledby:!0,isToggle:!1,allowMultiple:!1,isFocusable:!0,returnFocus:!1,on:"activatetab",click:function(e,t){e.stopPropagation()},afterRender:function(e,t){e.trackPage&&$A.setPage(e.id)}}},role:function(e){return{role:"tabpanel"}},duringRender:function(e,t){$A.setAttr(e.triggerNode,{"aria-expanded":"true","aria-selected":"true"})},afterRender:function(e,t){$A.setAttr(e.triggerNode,{"aria-describedby":e.containerId})},afterRemove:function(e,t){$A.setAttr(e.triggerNode,{"aria-expanded":"false","aria-selected":"false"}),$A.remAttr(e.triggerNode,"aria-describedby")}}),$A.extend({setTab:function(e,a){if(this._4X&&(a=e,e=this._X),$A.isPlainObject(e)&&(e=(a=e).trigger||a.content||null),!e)return null;var o=null;$A.isArray(e)?o=e:$A.isStr(e)&&(o=(a.context||document).querySelectorAll(e));var i=a.container&&$A.morph(a.container)||$A.closest(o[0],function(e){if("tablist"===$A.getAttr(e,"role"))return!0});$A.isNode(i)||function(){var t=[],n=[];$A.closest(o[0],function(e){if($A.isNode(e)&&t.push(e),e===document.body)return!0}),$A.closest(o[o.length-1],function(e){if($A.isNode(e)&&n.push(e),e===document.body)return!0}),t=t.reverse(),n=n.reverse();for(var e=null,r=0;r<t.length;r++)if(t[r]===n[r])e=t[r];else if(t[r]!==n[r])break;i=e}(),$A.setAttr(i,"role","tablist");var s=[],l=null,d=0;$A.loop(o,function(e,t){$A.svgFix(t);var n=[];$A.isNode(i)&&$A.closest(t,function(e){if(e===i)return!0;n.push(e)}),i!==document.body&&$A.isNode(i)&&n.length&&$A.setAttr(n,"role","presentation"),t.id||(t.id=$A.genId()),$A.setAttr(t,{role:"tab","aria-expanded":"false","aria-selected":"false"});var r=$A.get($A.getAttr(t,"root")),o=$A.toDC(t,$A.extend({widgetType:"Tab",root:r,append:!0},a||{}));s.push(o),$A.hasAttr(t,"active")&&(l=o,d=e)},"array"),$A.map({siblings:s});var t=new $A.RovingTabIndex($A.extend({nodes:o,startIndex:d,orientation:1,autoSwitch:a.autoSwitch||"full",autoLoop:!0,onClick:function(e,t,n,r){r.render(),e.preventDefault()},onSpace:function(e,t,n,r){n.onClick.apply(t,arguments),e.preventDefault()},onEnter:function(e,t,n,r){n.onClick.apply(t,arguments),e.preventDefault()}},a.extendRTI||{}));return $A.updateDisabled(t.nodes),$A.remAttr(t.nodes,["active","controls","root"]),!$A.hasHash(s)&&$A.isDC(l)&&l.render(),1===s.length?s[0]:s}})}});