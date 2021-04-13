/*!
ARIA Dialog Module 2.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/
"setDialog"in $A||($A.addWidgetProfile("Dialog",{track:[],configure:function(e){var o=this,r={};if(e.isModal&&o.track.length){var t=o.track[o.track.length-1].css("z-index")||1e3;r["z-index"]=t+2}return{style:r,isModal:!0,isAlert:!1,exposeBounds:!0,forceFocus:!0,forceFocusWithin:!0,returnFocus:!0,exposeHiddenClose:!0,circularTabbing:!0,preload:!0,preloadImages:!0,preloadCSS:!0,className:"modal",root:"body",append:!0,escToClose:!0,on:"click",click:function(e,o){e.stopPropagation()}}},role:function(e){var o={};return o.role=e.isAlert?"alertdialog":"dialog",o["aria-modal"]=e.isModal?"true":"false",o},beforeRender:function(o,e){o.isModal&&(o.backdrop=$A(this.backdrop).on({click:function(e){o.remove(),e.stopPropagation()}}).css($A.isNum(o.style["z-index"])&&1<o.style["z-index"]?{zIndex:o.style["z-index"]-1}:{}).appendTo("body").return())},afterRender:function(e,o){this.track.push(e),$A.hideBackground(e.wrapper),e.announce=!0===e.isAlert},afterRemove:function(e,o){var r=this;r.track.splice(r.track.length-1,1),r.track.length?(e.isModal&&$A.hideBackground(r.track[r.track.length-1].wrapper),e.rerouteFocus=r.track[r.track.length-1]):e.isModal&&$A.showBackground(),e.isModal&&$A.isNode(e.backdrop,null,null,11)&&$A.remove(e.backdrop)},backdrop:'<div class="modalBackdrop"></div>'}),$A.extend({setDialog:function(e,o){function r(e){t.push($A.toDC(e,$A.extend({widgetType:"Dialog"},o||{}))),$A.remAttr(e,["controls"])}this._4X&&(o=e,e=this._X),$A.isPlainObject(e)&&(e=(o=e).trigger||o.content||null);var t=[];return e?$A.query(e,o.context||document,function(e,o){r(o)}):r(),1===t.length?t[0]:t}}));