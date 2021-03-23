$A.import(["Velocity", "VelocityUI"], {
  name: "AnimateModule",
  once: true,
  props: props,
  call: function(props) {
    $A.extend({
      hide: function(o, effect, config, fn) {
        if (this._4X) {
          fn = config;
          config = effect;
          effect = o;
          o = this._X;
        }
        o = $A.morph(o);
        if ($A.isFn(config)) {
          fn = config;
          config = null;
        }
        if ($A.isNode(o)) {
          Velocity(
            o,
            effect,
            $A.extend(
              {
                complete: function() {
                  if ($A.isFn(fn)) fn.call(o, o);
                }
              },
              config || {}
            )
          );
        }
        return $A._XR.call(this, o);
      },
      show: function(o, effect, config, fn) {
        if (this._4X) {
          fn = config;
          config = effect;
          effect = o;
          o = this._X;
        }
        o = $A.morph(o);
        if ($A.isFn(config)) {
          fn = config;
          config = null;
        }
        if ($A.isNode(o)) {
          $A.css(o, "display", "none");
          o.hidden = false;
          Velocity(
            o,
            effect,
            $A.extend(
              {
                complete: function() {
                  if ($A.isFn(fn)) fn.call(o, o);
                }
              },
              config || {}
            )
          );
        }
        return $A._XR.call(this, o);
      }
    });
  }
});
