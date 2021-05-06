$A.import(["Animate", "Accordion"], { defer: true }, function() {
  $A.setAccordion(".aria-accordion-trigger", {
    toggleClassName: "open",
    toggleHide: true,
    isToggle: true,
    allowMultiple: false,

    /*
  // Enable auto-rendering when the page loads.
  // When true, the hash tag in the URL will automatically open the associated DC object.
  // To render automatically, the hash tag must match the DC object id.
  // To set a hash tag within the address bar, use the $A.setPage() function.
  // For more details, view: Help/ARIA Development/Browser History and Permalinks
// Plus: Help/DC API/DC Object Configuration/Behaviors
    trackPage: true,
    afterRender: function(dc) {
      $A.setPage(
        dc.id,
        $A.getText(dc.triggerNode) + " ARIA Accordion - Apex 4X Technical Style Guide"
      );
    },
*/

    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.slideDownIn", {
          duration: 800,
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      },
      onRemove: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.slideDownOut", {
          delay: 0,
          duration: 0,
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      }
    }
  });
});
