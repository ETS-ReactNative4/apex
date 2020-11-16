/*!
ARIA Popup Module 2.0 for Apex 4X
Copyright 2020 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setPopup" in $A)) {
    $A.addWidgetTypeProfile("Popup", {
      configure: function(dc) {
        return {
          announce: true,
          isAlert: false,
          exposeBounds: true,
          forceFocus: true,
          returnFocus: true,
          exposeHiddenClose: true,
          displayHiddenClose: true,
          circularTabbing: true,
          preload: true,
          preloadImages: true,
          preloadCSS: true,
          className: "popup",
          escToClose: true,
          on: "click",
          click: function(ev, dc) {
            ev.stopPropagation();
          },
          onCreate: function(dc) {
            $A.setAttr(dc.trigger, "aria-expanded", "false");
          }
        };
      },
      role: function(dc) {
        return {
          role: "region",
          "aria-label": dc.role
        };
      },
      onRender: function(dc, container) {
        $A.setAttr(dc.triggerObj, "aria-expanded", "true");
        if (dc.isAlert) $A.announce(dc.container, true, true);
      },
      onRemove: function(dc, container) {
        $A.setAttr(dc.triggerObj, "aria-expanded", "false");
      }
    });

    $A.extend({
      setPopup: function(o, config) {
        if (this._4X) {
          config = o;
          o = this._X;
        }

        if ($A.isPlainObject(o)) {
          config = o;
          o = config.trigger || null;
        }
        if (!o) return null;

        var dcArray = [];
        $A.query(o, function(i, o) {
          dcArray.push(
            $A(o).toDC(
              $A.extend(
                {
                  widgetType: "Popup"
                },
                config || {}
              )
            )
          );
        });

        return dcArray.length === 1 ? dcArray[0] : dcArray;
      }
    });
  }
})();
