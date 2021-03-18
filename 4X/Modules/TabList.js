/*!
ARIA TabList Module 2.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setTabList" in $A)) {
    $A.import("RovingTabIndex", {
      name: "TabListModule",
      props: props,
      once: true,
      call: function(props) {
        $A.addWidgetProfile("TabList", {
          configure: function(dc) {
            return {
              exposeBounds: true,
              isTab: true,
              ariaControls: true,
              ariaLabelledby: true,
              isToggle: false,
              allowMultiple: false,
              isFocusable: true,
              returnFocus: false,
              on: "activatetab",
              click: function(ev, dc) {
                ev.stopPropagation();
              },
              afterRender: function(dc, container) {
                if (dc.trackPage) $A.setPage(dc.id);
              }
            };
          },
          role: function(dc) {
            return {
              role: "tabpanel"
            };
          },
          duringRender: function(dc, container) {
            $A.setAttr(dc.triggerNode, {
              "aria-expanded": "true",
              "aria-selected": "true"
            });
          },
          afterRender: function(dc, container) {
            $A.setAttr(dc.triggerNode, {
              "aria-describedby": dc.containerId
            });
          },
          afterRemove: function(dc, container) {
            $A.setAttr(dc.triggerNode, {
              "aria-expanded": "false",
              "aria-selected": "false"
            });
            $A.remAttr(dc.triggerNode, "aria-describedby");
          }
        });

        $A.extend({
          setTabList: function(o, config) {
            if (this._4X) {
              config = o;
              o = this._X;
            }

            if ($A.isPlainObject(o)) {
              config = o;
              o = config.trigger || config.content || null;
            }
            if (!o) return null;

            var triggers = null,
              container = $A.morph(config.container);

            if ($A.isArray(o)) triggers = o;
            else if ($A.isStr(o))
              triggers = (config.context || document).querySelectorAll(o);

            if (!$A.isDOMNode(container)) {
              (function() {
                var f = [],
                  l = [];
                $A.closest(triggers[0], function(n) {
                  if ($A.isDOMNode(n)) f.push(n);
                  if (n === document.body) return true;
                });
                $A.closest(triggers[triggers.length - 1], function(n) {
                  if ($A.isDOMNode(n)) l.push(n);
                  if (n === document.body) return true;
                });
                f = f.reverse();
                l = l.reverse();
                var c = null;
                for (var i = 0; i < f.length; i++) {
                  if (f[i] === l[i]) c = f[i];
                  else if (f[i] !== l[i]) break;
                }
                container = c;
              })();
            }
            $A.setAttr(container, "role", "tablist");

            var dcArray = [],
              active = null,
              startIndex = 0;

            $A.loop(
              triggers,
              function(i, o) {
                $A.svgFix(o);
                var tree = [];
                if ($A.isDOMNode(container))
                  $A.closest(o, function(n) {
                    if (n === container) return true;
                    tree.push(n);
                  });
                if (
                  container !== document.body &&
                  $A.isDOMNode(container) &&
                  tree.length
                )
                  $A.setAttr(tree, "role", "presentation");
                if (!o.id) o.id = $A.genId();
                $A.setAttr(o, {
                  role: "tab",
                  "aria-expanded": "false",
                  "aria-selected": "false"
                });
                var panelContainer = $A.get($A.getAttr(o, "root")),
                  dc = $A.toDC(
                    o,
                    $A.extend(
                      {
                        widgetType: "TabList",
                        root: panelContainer,
                        append: true
                      },
                      config || {}
                    )
                  );
                dcArray.push(dc);
                if ($A.hasAttr(o, "active")) {
                  active = dc;
                  startIndex = i;
                }
              },
              "array"
            );

            $A.map({
              siblings: dcArray
            });

            var RTI = new $A.RovingTabIndex(
              $A.extend(
                {
                  nodes: triggers,
                  startIndex: startIndex,
                  orientation: 1,
                  autoSwitch: config.autoSwitch || "full",
                  autoLoop: true,
                  onClick: function(ev, tabNode, RTI, DC) {
                    DC.render();
                    ev.preventDefault();
                  },
                  onSpace: function(ev, tabNode, RTI, DC) {
                    RTI.onClick.apply(tabNode, arguments);
                    ev.preventDefault();
                  },
                  onEnter: function(ev, tabNode, RTI, DC) {
                    RTI.onClick.apply(tabNode, arguments);
                    ev.preventDefault();
                  }
                },
                config.extendRTI || {}
              )
            );

            $A.updateDisabled(RTI.nodes);

            if (!$A.hasHash(dcArray) && $A.isDC(active)) active.render();

            return dcArray.length === 1 ? dcArray[0] : dcArray;
          }
        });
      }
    });
  }
})();
