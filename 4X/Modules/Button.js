/*!
ARIA Button Module 1.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setButton" in $A)) {
    $A.import("RovingTabIndex", {
      name: "ButtonModule",
      props: props,
      once: true,
      call: function(props) {
        $A.extend({
          setButton: function(o, config) {
            if (this._4X) {
              config = o;
              o = this._X;
            }

            if ($A.isPlainObject(o)) {
              config = o;
              o = config.trigger || null;
            }

            var getState = function(
                o,
                attributeValue,
                hasAttribute,
                write,
                nodes
              ) {
                if (hasAttribute) {
                  var isRadio = $A.getAttr(o, "role") === "radio",
                    isToggle =
                      $A.hasAttr(o, "toggle") || $A.hasAttr(o, "aria-pressed"),
                    c = 0;
                  if (attributeValue === "true") c = 1;
                  else if (!isRadio && !isToggle && attributeValue === "mixed")
                    c = 2;
                  else attributeValue = "false";
                  $A.data(o, "check", c);
                  if (write) {
                    if (isRadio && $A.isArray(nodes))
                      $A.setAttr(nodes, "aria-checked", "false");
                    $A.setAttr(
                      o,
                      isToggle ? "aria-pressed" : "aria-checked",
                      attributeValue
                    );
                    if (attributeValue === "mixed") {
                      $A.remClass(o, config.toggleClass || "pressed checked");
                      $A.toggleClass(
                        o,
                        config.partialClass || "partially-checked",
                        true
                      );
                    } else {
                      $A.remClass(
                        o,
                        config.partialClass || "partially-checked"
                      );
                      $A.toggleClass(
                        o,
                        config.toggleClass ||
                          (isToggle ? "pressed" : "checked"),
                        attributeValue === "true"
                      );
                    }
                  }
                  return c;
                }
                var s = $A.data(o, "check");
                if (!$A.isNum(s)) return false;
                return s;
              },
              btns = [];

            $A.query(o, config.context || document, function(i, o) {
              var r =
                  ($A.isNode(o) &&
                    (($A.hasAttr(o, "controls") &&
                      $A.morph($A.getAttr(o, "controls"))) ||
                      ($A.isFn(o.querySelector) &&
                        o.querySelector("input")))) ||
                  false,
                n = $A.isNative(r) ? r : $A.isNative(o) ? o : null,
                s =
                  $A.isNode(r) && !$A.isNative(r)
                    ? r
                    : !$A.isNative(o)
                    ? o
                    : null,
                x = !$A.isNode(n) && $A.isNode(r) && s !== o ? r : null;
              if (x === s) s = o;
              if ($A.isNode(s)) {
                if ($A.isNode(n) && $A.isNode(s)) $A.bindObjects(n, s);
                var radio = getState(
                    s,
                    $A.getAttr(s, "radio"),
                    $A.hasAttr(s, "radio")
                  ),
                  check = getState(
                    s,
                    $A.getAttr(s, "check"),
                    $A.hasAttr(s, "check")
                  ),
                  press = getState(
                    s,
                    $A.getAttr(s, "toggle"),
                    $A.hasAttr(s, "toggle")
                  );
                if ($A.isNum(radio)) {
                  $A.setAttr(s, {
                    role: "radio",
                    "aria-checked": radio ? "true" : "false"
                  });
                  btns.push(s);
                } else if ($A.isNum(check)) {
                  if ($A.isNode(n) && n.checked) check = 1;
                  if ($A.isNode(x)) {
                    if (!x.id) x.id = $A.genId();
                    $A.setAttr(s, {
                      "aria-flowto": x.id,
                      "aria-controls": x.id
                    });
                  }
                  var c = "false";
                  if (check === 1) c = "true";
                  else if (check === 2) c = "mixed";
                  $A.setKBA11Y(s, "checkbox", function(ev, dc) {
                    var o = this,
                      isDisabled = $A.isDisabled(o),
                      check = getState(
                        o,
                        $A.getAttr(o, "aria-checked"),
                        $A.hasAttr(o, "aria-checked")
                      );
                    if (!isDisabled && $A.isFn(config.onActivate))
                      config.onActivate.apply(o, [
                        ev,
                        o,
                        check,
                        function(attributeValue) {
                          var check = getState(o, attributeValue, true, true),
                            c = "false";
                          if (check === 1) c = "true";
                          else if (check === 2) c = "mixed";
                          $A.setAttr(o, "aria-checked", c);
                        },
                        n
                      ]);
                  });
                  $A.setAttr(s, {
                    "aria-checked": c
                  });
                } else {
                  if (press !== false) {
                    $A.setAttr(s, "aria-pressed", press ? "true" : "false");
                    if ($A.isNode(x)) {
                      if (!x.id) x.id = $A.genId();
                      $A.setAttr(s, {
                        "aria-flowto": x.id,
                        "aria-controls": x.id
                      });
                    }
                  }
                  $A.setKBA11Y(s, "button", function(ev, dc) {
                    var o = this,
                      isDisabled = $A.isDisabled(o),
                      press = getState(
                        o,
                        $A.getAttr(o, "aria-pressed"),
                        $A.hasAttr(o, "aria-pressed")
                      ),
                      args =
                        press !== false
                          ? [
                              ev,
                              o,
                              press,
                              function(attributeValue) {
                                getState(o, attributeValue, true, true);
                                $A.setAttr(
                                  o,
                                  "aria-pressed",
                                  attributeValue === "true" ? "true" : "false"
                                );
                              },
                              dc || x
                            ]
                          : [ev, o, dc || x];
                    if (!isDisabled && $A.isFn(config.onActivate))
                      config.onActivate.apply(o, args);
                  });
                }
                if (radio !== false || check !== false || press !== false) {
                  $A.on(
                    s,
                    "attributeChange",
                    function(
                      MutationObject,
                      o,
                      attributeName,
                      attributeValue,
                      attributePriorValue,
                      DC,
                      SavedData
                    ) {
                      if ($A.isNode(n)) {
                        var check = getState(o, attributeValue, true);
                        n.checked = check ? true : false;
                      }
                    },
                    {
                      attributeFilter: ["aria-checked", "aria-pressed"]
                    }
                  );
                }
                $A.svgFix(s);
                if ($A.isNode(n) && n.disabled)
                  $A.setAttr(s, "aria-disabled", "true");
                $A.updateDisabled(s);
                $A.remAttr(s, [
                  "check",
                  "controls",
                  "radio",
                  "switch",
                  "toggle"
                ]);
              }
            });

            if (btns.length) {
              var container =
                (config.container && $A.morph(config.container)) ||
                $A.closest(btns[0], function(n) {
                  if ($A.getAttr(n, "role") === "radiogroup") return true;
                });

              if (!$A.isNode(container)) {
                (function(triggers) {
                  var f = [],
                    l = [];
                  $A.closest(triggers[0], function(n) {
                    if ($A.isNode(n)) f.push(n);
                    if (n === document.body) return true;
                  });
                  $A.closest(triggers[triggers.length - 1], function(n) {
                    if ($A.isNode(n)) l.push(n);
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
                })(btns);
              }
              $A.setAttr(container, "role", "radiogroup");

              var RTI = new $A.RovingTabIndex(
                $A.extend(
                  {
                    nodes: btns,
                    startIndex: 0,
                    orientation: 0,
                    autoLoop: true,
                    onClick: function(ev, radio, RTI, nativeInput) {
                      var o = radio,
                        isDisabled = $A.isDisabled(o),
                        check = getState(
                          o,
                          $A.getAttr(o, "aria-checked"),
                          $A.hasAttr(o, "aria-checked")
                        );
                      if (!isDisabled && $A.isFn(config.onActivate))
                        config.onActivate.apply(o, [
                          ev,
                          o,
                          check,
                          function(attributeValue) {
                            var check = getState(o, attributeValue, true, true);
                            $A.setAttr(
                              o,
                              "aria-checked",
                              check ? "true" : "false"
                            );
                          },
                          nativeInput
                        ]);
                    },
                    onSpace: function(ev, radio, RTI, nativeInput) {
                      RTI.onClick.apply(radio, arguments);
                    },
                    onFocus: function(ev, radio, RTI, nativeInput) {
                      if (RTI.arrowPressed && !$A.isTouch)
                        RTI.onClick.apply(radio, arguments);
                    }
                  },
                  config.extendRTI || {}
                )
              );
            }

            return $A._XR.call(this, o);
          }
        });

        // Set related aliases
        $A.extend({
          setCheckbox: $A["setButton"],
          setRadio: $A["setButton"]
        });
      }
    });
  }
})();
