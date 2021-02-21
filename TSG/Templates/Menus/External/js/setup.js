$A.import(["Animate", "Menu"], { defer: true }, function() {
  $A.setMenu("button.aria-menu", {
    fetch: {
      url: "files/menus.htm",
      data: {
        selector: "#settings-menu"
      }
    },
    onActivate: function(ev, triggerNode, RTI, DC, checked, check, isRadio) {
      if ($A.isNum(checked)) {
        // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
        // if 0, the checked state is "false".
        // if 1, the checked state is "true".
        // if 2, the checked state is "mixed".
        // The 'check' argument is a function that will set the checkable item to a new state.
        // The new value must be a string consisting of "false", "true", or "mixed".
        if (checked === 0 || isRadio) {
          check("true");
          RTI.DC.top.remove(function() {
            alert("The new checked state for " + triggerNode.id + " is 'true'");
          });
        } else if (checked === 1) {
          check("mixed");
          RTI.DC.top.remove(function() {
            alert(
              "The new checked state for " + triggerNode.id + " is 'mixed'"
            );
          });
        } else if (checked === 2) {
          check("false");
          RTI.DC.top.remove(function() {
            alert(
              "The new checked state for " + triggerNode.id + " is 'false'"
            );
          });
        }
      } else if (
        triggerNode.href &&
        triggerNode.href.indexOf("https://") !== -1
      )
        RTI.DC.top.remove(function() {
          location.href = triggerNode.href;
        });
      else
        RTI.DC.top.remove(function() {
          alert(triggerNode.id);
        });
    },
    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideUpIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideUpOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });
});
