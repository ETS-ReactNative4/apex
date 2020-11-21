$A.import(["Animate", "TabList"], { defer: true }, function() {
  $A.setTabList({
    tabList: '.aria-tablist[role="tablist"]',

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
    },

    // Allow tabs to be toggled
    isToggle: false,

    toggleClass: "active"
  });
});
