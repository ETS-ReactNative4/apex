$A.import(["Animate", "TabList"], { defer: true }, function() {
  $A.setTabList('*[role="tablist"] *[role="tab"]', {
    // Preload HTML markup when pulling content from external resources to speed rendering
    preload: true,
    preloadImages: true,
    preloadCSS: true,

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

    isToggle: false,
    toggleClass: "active"
  });
});
