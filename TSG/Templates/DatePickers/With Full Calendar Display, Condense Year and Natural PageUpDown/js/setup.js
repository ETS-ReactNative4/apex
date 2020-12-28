$A.import(["Animate", "DatePicker"], { defer: true }, function() {
  $A.setDatePicker({
    // Unique ID for the date picker instance
    // After instantiation, can be referenced using: var DC = $A("UniqueCalendarId");
    id: "UniqueCalendarId",

    // Icon triggering element
    toggle: $A.getEl("dateIcon"),

    // Native or simulated input element
    input: $A.getEl("date"),

    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeOut", {
          complete: function() {
            complete();
          }
        });
      }
    },

    // Condense the year display by removing the year nav buttons
    condenseYear: true,

    // Draw the full calendar, including days in the previous and next months
    drawFullCalendar: true,

    // Set CSS positioning calculation for the calendar
    autoPosition: 3,
    // Customize with positive or negative offsets
    offsetTop: 0,
    offsetLeft: 5,

    // Set class for the calendar container
    className: "calendar"
  });
});
