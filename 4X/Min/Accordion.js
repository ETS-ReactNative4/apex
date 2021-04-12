/*!
ARIA Accordion Module 3.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/
"setAccordion"in $A||$A.import("RovingTabIndex",{name:"AccordionModule",props:props,once:!0,call:function(e){$A.addWidgetProfile("Accordion",{configure:function(e){return{exposeBounds:!0,exposeHiddenClose:!1,ariaControls:!0,ariaLabelledby:!0,isToggle:!1,allowMultiple:!1,escToClose:!1,returnFocus:!1,click:function(e,t){e.stopPropagation()},onCreate:function(e){$A.setAttr(e.trigger,"aria-expanded","false")},afterRender:function(e,t){e.trackPage&&$A.setPage(e.id)}}},role:function(e){return{role:"region"}},duringRender:function(e,t){$A.setAttr(e.triggerNode,"aria-expanded","true")},beforeRemove:function(e,t){$A.setAttr(e.triggerNode,"aria-expanded","false")}}),$A.extend({setAccordion:function(e,r){if(this._4X&&(r=e,e=this._X),$A.isPlainObject(e)&&(e=(r=e).trigger||r.content||null),!e)return null;var t=null;$A.isArray(e)?t=e:$A.isStr(e)&&(t=(r.context||document).querySelectorAll(e));var i=[],a=[],c=0;return $A.loop(t,function(e,t){$A.svgFix(t);var n=$A.get($A.getAttr(t,"root")),o=$A.toDC(t,$A.extend({widgetType:"Accordion",root:n},r||{}));i.push(o),$A.hasAttr(t,"active")&&(a.push(o),c=e),$A.remAttr(t,["active","controls","root"])}),$A.map({siblings:i}),$A.updateDisabled(i),r.singleTabStop&&new $A.RovingTabIndex($A.extend({nodes:t,startIndex:c,orientation:2,autoSwitch:r.autoSwitch||"full",autoLoop:!0,onClick:function(e,t,n,o){o.render(),e.preventDefault()},onSpace:function(e,t,n,o){o.render(),e.preventDefault()},onEnter:function(e,t,n,o){o.render(),e.preventDefault()}},r.extendRTI||{})),$A.hasHash(i)||$A.loop(a,function(e,t){t.render()},"array"),1===i.length?i[0]:i}})}});