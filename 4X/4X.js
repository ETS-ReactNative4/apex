/*!
Apex 4X: The Comprehensive ARIA Development Suite (2020.1)
Copyright 2020 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  var moduleFolder = "/4X/Modules/",
    Version = "2020.1",
    $A = function(dc, dcA, dcI, onReady, disableAsync) {
      if (!arguments.length && this === $A) {
        return $A;
      } else if ($A.isChain(dc) && arguments.length === 1) {
        return dc;
      } else if ($A.isFn(dc) && arguments.length === 1) {
        if ($A.isDocLoaded) {
          dc();
        } else {
          $A.on("load", function() {
            dc();
          });
        }
        return $A;
      } else if (
        dc &&
        $A.isArray(dc) &&
        dc.length &&
        dc[0] &&
        typeof dc[0] === "object" &&
        dc[0].id &&
        !dc[0].nodeType
      ) {
        disableAsync = onReady;
        onReady = dcI;
        dcI = dcA;
        dcA = dc;
        dc = null;
      } else if (
        ((dc && $A.isDC(dc)) || $A.reg.has(dc)) &&
        dcA &&
        $A.isArray(dcA) &&
        dcA.length &&
        dcA[0] &&
        typeof dcA[0] === "object" &&
        dcA[0].id &&
        !$A.isDOMNode(dcA, window, document, 11)
      ) {
        if ($A.reg.has(dc)) dc = $A.reg.get(dc);
      } else if (dc || (this && this !== $A)) {
        if (this && $A.isStr(this)) {
          dcI = dcA;
          dcA = dc;
          dc = this;
        }

        if (dc && $A.reg.has(dc)) {
          return $A.reg.get(dc);
        }

        if ($A.isStr(dc)) dc = $A.morph(dc);
        return $A._clone(dc);
      }

      $A.lastCreated = [];

      var fn = function(dcA, dcI, dc) {
        var w = $A._GenDC(dcA, dcI, dc);
        if ($A._lastCreatedCallback && $A.isFn($A._lastCreatedCallback))
          $A._lastCreatedCallback.call($A, w);
        $A._lastCreatedCallback = false;
        for (var i = 0; i < w.length; i++) {
          var dc = w[i];

          if (dc.preloadImages && !dc.preload) dc.preload = true;

          if (dc.preload && !dc.loading && !dc.loaded) {
            if (dc.mode === 1 && dc.fetch.url) {
              dc.source = $A.toNode();
              $A.load(dc.fetch.url, dc.source, dc.fetch.data, function(
                content
              ) {
                if (dc.preloadImages) $A.preloadImg(content);
                $A.getModule(dc, "onFetch", content);
              });
              dc.mode = 0;
            } else if (dc.preloadImages && !dc.mode && dc.source)
              $A.preloadImg(dc.source);
          }
          if (dc.preloadCSS && dc.importCSS && !dc.loading && !dc.loaded) {
            dc.fn.style = $A.toNode();
            $A.import(dc.importCSS, {}, dc.fn.style);
          }
        }
        return w;
      };

      if (onReady && !$A.isDocLoaded) {
        $A.on("load", function() {
          fn.call(window, dcA, dcI, dc);
        });
      } else fn.call(window, dcA, dcI, dc);
      return $A.lastCreated;
    },
    nowI = 0,
    now = function() {
      return new Date().getTime() + nowI++;
    };

  $A.isArray = function(v) {
    return (
      [
        "[object Array]",
        "[object NodeList]",
        "[object HTMLCollection]"
      ].indexOf(Object.prototype.toString.call(v)) !== -1 &&
      !(v instanceof Element || v instanceof HTMLDocument)
    );
  };
  // extend derived from jQuery core for cross platform compatibility
  $A.extend = function() {
    var options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }
    if (typeof target !== "object" && typeof target !== "function") {
      target = {};
    }
    if (length === i) {
      target = $A;
      --i;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) !== null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (
            deep &&
            copy &&
            ($A.isPlainObject(copy) || (copyIsArray = $A.isArray(copy)))
          ) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && $A.isArray(src) ? src : [];
            } else {
              clone = src && $A.isPlainObject(src) ? src : {};
            }
            target[name] = $A.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  // isPlainObject derived from jQuery core for cross platform compatibility
  $A.isPlainObject = function(obj) {
    var hasOwn = Object.prototype.hasOwnProperty;
    if (
      !obj ||
      typeof obj !== "object" ||
      obj instanceof Element ||
      obj instanceof HTMLDocument ||
      obj.nodeType ||
      "setInterval" in obj ||
      (obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))
    )
      return false;
    var key;
    for (key in obj) break;
    return key === undefined || hasOwn.call(obj, key);
  };

  $A.extend({
    debug: true,
    parseDebug: function(e) {
      if ($A.debug) {
        throw e;
      }
    },

    setGlobal: function(o, retroactive) {
      if (o && typeof o === "object") {
        $A.extend(true, {}, $A.fn.globalDC, o);
        if (retroactive) $A.mergeGlobal();
      }
    },

    mergeGlobal: function() {
      $A.queryDC(function(dc) {
        $A.extend(true, {}, $A.fn.globalDC, dc);
      });
    },

    reg: new Map(),

    fn: {
      globalDC: {}
    },

    _version: Version,

    lastCreated: [],
    _lastCreatedCallback: false,
    lastCreatedCallback: function(fn) {
      if ($A.isFn(fn)) $A._lastCreatedCallback = fn;
    },
    props: {},
    isDocLoaded: false,
    isDOMContentLoaded: false,

    _boundRefO: new Map(),
    _boundObjectIds: new Map(),

    setIdFor: function(o) {
      if (this._4X) {
        o = this._X;
      }
      var id = $A.hasIdFor(o) ? $A.getIdFor(o) : null;
      if (!id) {
        id = $A.genId();
        $A._boundObjectIds.set(o, id);
        $A._boundRefO.set(id, o);
      }
      return id;
    },

    remIdFor: function(o) {
      if (this._4X) {
        o = this._X;
      }
      var id = $A.hasIdFor(o) ? $A.getIdFor(o) : null;
      if (id) {
        $A._boundRefO.delete(id);
        $A._boundObjectIds.delete(o);
        return true;
      }
      return false;
    },

    getIdFor: function(o) {
      if (this._4X) {
        o = this._X;
      }
      return $A._boundObjectIds.has(o) ? $A._boundObjectIds.get(o) : null;
    },

    hasIdFor: function(o) {
      if (this._4X) {
        o = this._X;
      }
      return $A._boundObjectIds.has(o);
    },

    getFromId: function(id) {
      if (this._4X) {
        id = this._X;
      }
      return $A._boundRefO.has(id) ? $A._boundRefO.get(id) : null;
    },

    _boundObjects: new Map(),

    bindObjects: function(o, dc) {
      if (this._4X) {
        dc = o;
        o = this._X;
      }
      $A._boundObjects.set(o, dc);
      $A._boundObjects.set(dc, o);
      if (this._4X) {
        this._X = o;
        return this;
      } else return o;
    },

    unbindObjects: function(o) {
      if (this._4X) {
        o = this._X;
      }
      $A._boundObjects.delete($A._boundObjects.get(o));
      $A._boundObjects.delete(o);
      if (this._4X) {
        this._X = o;
        return this;
      } else return o;
    },

    boundTo: function(o) {
      if (this._4X) {
        o = this._X;
      }
      var r = $A._boundObjects.get(o);
      return r;
    },

    hasBound: function(o) {
      if (this._4X) {
        o = this._X;
      }
      var r = $A._boundObjects.has(o);
      return r;
    },

    getSelectorFromURI: function(u) {
      if (!$A.isStr(u)) return "";
      var x = u.indexOf("#");
      return x !== -1 ? u.slice(x) : "";
    },

    isPath: function(p) {
      return p && $A.isStr(p) && p.indexOf("/") !== -1 ? true : false;
    },

    toDC: function(o, config) {
      if (this._4X) {
        config = o;
        o = this._X;
      }
      if ($A.isPlainObject(o)) {
        config = o;
        o = null;
      }
      if (!$A.isPlainObject(config)) config = {};
      if (o) o = $A.morph(o);

      var t = config.trigger,
        fetch = (config.fetch && config.fetch.url) || false,
        data = (fetch && config.fetch.data) || false,
        ref =
          (!fetch && $A.isDOMNode(o) && $A.getAttr(o, "data-controls")) ||
          false,
        isPath = $A.isPath(ref),
        sel =
          (fetch &&
            config.fetch &&
            config.fetch.data &&
            config.fetch.data.selector) ||
          (!fetch && ref && $A.isSelector("#" + ref) && "#" + ref) ||
          (!fetch && isPath && $A.getSelectorFromURI(ref)) ||
          false,
        isSel = $A.isSelector(sel),
        id = "";

      if (!config.source && o) config.source = o;

      if (!t && !fetch && ref && !isPath && isSel) ref = sel;

      if (fetch && isSel) {
        isPath = true;
        ref = fetch;
        delete config.fetch;
      }

      if (!isPath && ref && isSel) {
        ref = $A.morph(sel);
        t = o;
        config.source = ref;
      } else if (isPath && ref && isSel) {
        t = o;
        config.source = $A.toNode();
        $A.load(
          ref,
          config.source,
          $A.extend(
            {
              selector: sel
            },
            data || {}
          ),
          function(content) {
            if (config.preloadImages) $A.preloadImg(content);
            $A.getModule(config, "onFetch", content);
          }
        );
      }

      if (t) {
        if (!$A.isDOMNode(t)) t = $A.morph(t);
        if ($A.isDOMNode(t)) {
          if (!t.id) t.id = $A.genId();
          id = t.id;
        }
      } else if ($A.isDOMNode(config.source)) {
        if (!config.source.id) config.source.id = $A.genId();
        id = config.source.id;
      }

      if (!id) id = $A.genId();

      var rendered =
        $A.isDOMNode(config.source) &&
        $A.isWithin(config.source) &&
        !$A.isHidden(config.source);

      if (
        $A.isDOMNode(config.source, null, null, 11) &&
        rendered &&
        !config.root &&
        !t &&
        !config.targetObj
      ) {
        if ($A.isDOMNode($A.next(config.source))) {
          config.root = $A.next(config.source);
          config.before = true;
        } else if ($A.isDOMNode($A.previous(config.source))) {
          config.root = $A.previous(config.source);
          config.after = true;
        } else if ($A.isDOMNode(config.source.parentNode)) {
          config.root = config.source.parentNode;
          config.append = true;
        }
      }
      config.isRendered = rendered;
      config.widgetType =
        config.widgetType || $A.getAttr(o, "data-widget-type") || null;

      return $A([
        $A.extend(
          true,
          {
            id: id,
            fn: {
              isMorphedDC: true
            },
            autoRender: rendered,
            trigger: t,
            on: "click"
          },
          config
        )
      ])[0];
    },

    _store: function(f, arrayOnly) {
      if (f && f.nodeType === 11) {
        var nl = [];
        for (var i = 0; i < f.childNodes.length; i++) {
          var o = f.childNodes[i];
          if ($A.isDOMNode(o)) nl.push(o);
        }
        $A.data(nl, "StoredFrag", f);
        $A.data(f, "StoredNodeList", nl);
        if (arrayOnly) return nl;
      }
      return f;
    },

    _check: function(f, rNode) {
      var isA = $A.isArray(f);
      if ($A.isChain(f)) return $A._check(f.return(), rNode);
      else if (isA)
        return rNode ? $A.data(f, "StoredFrag") || $A.toNode(f, true) : f;
      else if (f && f.nodeType === 11) {
        var nl = $A.data(f, "StoredNodeList") || [];
        if (nl.length) return rNode ? f : nl;
        else if (f.childNodes.length) return $A._store(f, rNode ? false : true);
        else if (rNode) return null;
        else return [];
      } else if (!rNode && !isA) return [f];
      return f;
    },

    toNode: function(s, elementOnly, arrayOnly) {
      if (this._4X) {
        elementOnly = s;
        s = this._X;
      }
      if (!s) {
        return document.createDocumentFragment();
      } else if ($A.isStr(s)) {
        try {
          s = $A._store(
            document.createRange().createContextualFragment(s),
            arrayOnly
          );
        } catch (e) {
          var f = document.createDocumentFragment();
          $A.insertMarkup(s, f);
          s = $A._store(f, arrayOnly);
        }
      } else if (elementOnly && $A.isArray(s)) {
        var f = document.createDocumentFragment();
        var loop = function(o) {
          var s = o;
          if (s && s.nodeType === 11) s = $A._store(s, true);
          $A.loop(
            s,
            function(i, n) {
              if (n && n.nodeType === 11) loop(n);
              else if ($A.isDOMNode(n)) f.appendChild(n);
            },
            "array"
          );
        };
        loop(s);
        s = $A._store(f);
      }
      if (
        !arrayOnly &&
        !$A.isArray(s) &&
        s &&
        s.nodeType === 11 &&
        s.childNodes &&
        s.childNodes.length === 1
      )
        s = s.childNodes[0];
      if (arrayOnly && !$A.isArray(s)) s = [s];
      if (this._4X) {
        this._X = s;
        return this;
      } else return s;
    },

    _clone: function(o) {
      if ($A.isChain(o)) return o;
      var f = function(o) {
        this._4X = true;
        this._X = o;
      };
      f.prototype = $A;
      return new f(o);
    },

    return: function(o) {
      if (this._4X) {
        o = this._X;
      }
      return o;
    },

    getNode: function(o) {
      if (this._4X) {
        o = this._X;
      }
      return o;
    },

    getDC: function(o, includeFromBound) {
      if (this._4X) {
        includeFromBound = o;
        o = this._X;
      }
      if ($A.isDC(o)) {
        return o;
      } else if ($A.reg.has(o)) {
        return $A.reg.get(o);
      } else if (includeFromBound && $A.hasDC(o, includeFromBound)) {
        return $A.data(o, "DC");
      }
      return null;
    },

    isChain: function(o) {
      return o && typeof o === "object" && o._4X ? true : false;
    },

    isDC: function(o) {
      return o && typeof o === "object" && o.fn && o.fn.isDCI ? true : false;
    },

    hasDC: function(o, includeFromBound) {
      if (this._4X) {
        includeFromBound = o;
        o = this._X;
      }
      return (
        $A.isDC(o) || $A.reg.has(o) || (includeFromBound && $A.data(o, "DC"))
      );
    },

    preloadImg: function(a) {
      if (this._4X) {
        a = this._X;
      }
      var c = $A.morph(a);
      if ($A.isDOMNode(c)) {
        $A.on("load", function() {
          if (!$A._imageMap) $A._imageMap = {};
          var images = [];
          $A.query("img[src]", c, function(i, o) {
            if (!($A._imageMap[o.src] && $A._imageMap[o.src].parentNode))
              images.push(o.src);
          });
          if (images.length)
            $A("<div hidden></div>")
              .import(images, {
                tag: "img",
                callOnAll: true,
                call: function(g) {
                  $A._imageMap[g.src] = g;
                }
              })
              .appendTo(document.body);
        });
      }
      if (this._4X) {
        this._X = a;
        return this;
      } else return a;
    },

    isMarkup: function(s) {
      if (this._4X) {
        s = this._X;
      }
      if (!s || !$A.isStr(s)) {
        return false;
      }
      return stringAnnounce.iterate(s, /</g) > 1 &&
        stringAnnounce.iterate(s, />/g) > 1
        ? true
        : false;
    },

    morph: function(o, retArray, context) {
      if ($A.isArray(o)) {
        return o;
      } else if ($A.isStr(o)) {
        if ($A.isMarkup(o)) {
          return $A.toNode(o, false, retArray);
        } else {
          if (!$A.isSelector(o)) return $A.toText(o);
          if (!$A.isDOMNode(context, null, document, 11)) context = document;
          var r = context.querySelectorAll(o);
          if (!retArray && r.length === 1) r = r[0];
          else if (!retArray && !r.length) r = null;
          return r;
        }
      } else if ($A.isNum(o)) {
        o = $A.toText(o.toString());
        return retArray ? [o] : o;
      }
      return retArray && !$A.isArray(o) ? [o] : o;
    },

    isMap: function(o) {
      try {
        Map.prototype.has.call(o);
        return true;
      } catch (e) {
        return false;
      }
    },

    loop: function(o, fn, type) {
      if (this._4X) {
        type = fn;
        fn = o;
        o = this._X;
      }
      if (!$A.isFn(fn)) {
        if (this._4X) {
          this._X = o;
          return this;
        } else return o;
      }
      if (!$A.isArray(o) && type === "array") o = [o];
      if ((!type || type === "map") && $A.isMap(o) && $A.isFn(o.forEach)) {
        o.forEach(function(v, k) {
          fn.call(v, k, v);
        });
      } else if ((!type || type === "array") && $A.isArray(o)) {
        for (var i = 0; i < o.length; i++) {
          fn.call(o[i], i, o[i]);
        }
      } else if ((!type || type === "object") && o && typeof o === "object") {
        for (var n in o) {
          fn.call(o[n], n, o[n]);
        }
      } else if ((!type || type === "string") && $A.isStr(o)) {
        for (var i = 0; i < o.length; i++) {
          fn.call(o.charAt(i), i, o.charAt(i));
        }
      } else if ($A.isDOMNode(o)) {
        fn.call(o, 0, o);
      } else if (o && type === "other") fn.call(o, 0, o);
      if (this._4X) {
        this._X = o;
        return this;
      } else return o;
    },

    isSelector: function(s) {
      if (s && $A.isStr(s)) {
        try {
          return document.querySelectorAll(s) ? true : false;
        } catch (e) {
          return false;
        }
      }
      return false;
    },

    isDOMNode: function(n, win, doc) {
      var isType = function(args) {
        var i = 3;
        while (args[i]) {
          if (n.nodeType === args[i]) return true;
          i++;
        }
        return false;
      };
      return n &&
        !$A.isArray(n) &&
        (n instanceof Element ||
          (doc && doc instanceof HTMLDocument && n instanceof HTMLDocument) ||
          (win && n === win) ||
          isType(arguments))
        ? true
        : false;
    },

    isArray: function(v) {
      if (this._4X) {
        v = this._X;
      }
      return (
        [
          "[object Array]",
          "[object NodeList]",
          "[object HTMLCollection]"
        ].indexOf(Object.prototype.toString.call(v)) !== -1 &&
        !(v instanceof Element || v instanceof HTMLDocument)
      );
    },

    inArray: function(searchFor, inStack) {
      if (this._4X) {
        inStack = searchFor;
        searchFor = this._X;
      }
      if (!searchFor || !inStack) return -1;
      if (inStack.indexOf) {
        var r = inStack.indexOf(searchFor);
        return r;
      }
      for (var i = 0; i < inStack.length; i++) {
        if (inStack[i] === searchFor) {
          return i;
        }
      }
      return -1;
    },

    isFn: function(o) {
      return typeof o === "function";
    },

    isStr: function(o) {
      return typeof o === "string";
    },

    isNum: function(o) {
      return typeof o === "number";
    },

    isBool: function(o) {
      return typeof o === "boolean";
    },

    isTouch: false,

    isIE: function() {
      return !window.ActiveXObject && "ActiveXObject" in window ? true : false;
    },

    trim: function(s) {
      if (this._4X) {
        s = this._X;
      }
      if ($A.isStr(s)) s = s.replace(/^\s+|\s+$/g, "");
      return s;
    },

    query: function(sel, con, call) {
      if (this._4X) {
        call = con;
        con = this._X;
      }

      if ($A.isFn(con)) {
        call = con;
        con = null;
      }

      if (!$A.isDOMNode(con, null, document, 11)) con = document;

      var r = [],
        isA = true,
        isO = false;

      if (!sel) {
        if (this._4X) {
          this._X = r;
          return this;
        } else return r;
      }

      if ($A.isMarkup(sel)) {
        r = $A.toNode(sel, false, true);
      } else if ($A.isSelector(sel) && $A.isFn(con.querySelectorAll)) {
        r = con.querySelectorAll(sel);
      } else if ($A.isDOMNode(sel)) {
        r.push(sel);
      } else {
        isA = $A.isArray(sel);
        isO = $A.isPlainObject(sel);
        if (isA || isO) r = sel;
      }

      var q = [];

      if (call && $A.isFn(call)) {
        if (isA) {
          for (var i = 0; i < r.length; i++) {
            if (call.apply(r[i], [i, r[i]]) !== false) q.push(r[i]);
          }
        } else if (isO) {
          for (var n in r) {
            if (call.apply(r[n], [n, r[n]]) !== false) q.push(r[n]);
          }
        } else Array.prototype.push.apply(q, r);
      } else Array.prototype.push.apply(q, r);

      if (this._4X) {
        this._X = q;
        return this;
      } else return q;
    },

    getText: function(n) {
      if (this._4X) {
        n = this._X;
      }
      if (!n) return "";
      if ($A.isDOMNode(n)) return n.innerText || n.textContent || "";
      if (n && n.nodeType === 3) return n.data;
      return "";
    },

    queryDC: function(ids, fn) {
      if ($A.isFn(ids)) {
        fn = ids;
        ids = null;
      }
      var dcs = [];
      if (!$A.isFn(fn)) return dcs;
      if (ids)
        $A.loop(
          ids,
          function(i, id) {
            if ($A.hasDC(id)) {
              var dc = $A.getDC(id);
              if (fn.call(dc, dc) !== false) dcs.push(dc);
            }
          },
          "array"
        );
      else
        $A.loop(
          $A.reg,
          function(id, dc) {
            if ($A.isDC(dc)) {
              if (!fn.call(dc, dc)) dcs.push(dc);
            }
          },
          "map"
        );
      return dcs;
    },

    get: function(o) {
      /* Syntax of array, may include multiple fetch objects to chain them in succession
[
{
url: "resourcePath",
data: {returnType: "html", selector: "#myWidget"},
success: function(content, promise){},
error: function(error, promise){}
}
]
*/

      var config = {
          // 4X related properties
          returnType: "html", // Options: "html", "text", "xml", "json"
          selector: "", // Sets a CSS query selector to return the first matching node within the newly loaded html or xml.

          // These properties are part of the Fetch Standard
          method: "GET",
          headers: {}, // request headers. format is the identical to that accepted by the Headers constructor
          body: null, // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
          cache: $A.noCache ? "no-cache" : "default", // The cache mode you want to use for the request: default, no-store, reload, no-cache, force-cache, or only-if-cached.
          redirect: "follow", // The redirect mode to use: follow (automatically follow redirects), error (abort with an error if a redirect occurs), or manual (handle redirects manually). In Chrome the default is follow (before Chrome 47 it defaulted to manual).
          keepalive: false, // The keepalive option can be used to allow the request to outlive the page. Fetch with the keepalive flag is a replacement for the Navigator.sendBeacon() API.
          mode: "cors" // The mode you want to use for the request, e.g., cors, no-cors, or same-origin.
          // credentials: 'omit', // The request credentials you want to use for the request: omit, same-origin, or include. To automatically send cookies for the current domain, this option must be provided. Starting with Chrome 50, this property also takes a FederatedCredential instance or a PasswordCredential instance.
          // referrer: 'client', // A USVString specifying no-referrer, client, or a URL. The default is client.
          // referrerPolicy: 'no-referrer', // Specifies the value of the referer HTTP header. May be one of no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, unsafe-url.
          // signal: null, // An AbortSignal object instance; allows you to communicate with a fetch request and abort it if desired via an AbortController.
          // integrity: null, // Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
        },
        i = 0,
        load = function(url, data, success, error) {
          var options = $A.extend({}, config, data || {});

          window
            .fetch(url, options)
            .then(function(response) {
              if (response.status >= 200 && response.status < 300) {
                // text or html or xml
                if (
                  ["html", "text", "xml"].indexOf(
                    options.returnType.toLowerCase()
                  ) >= 0
                )
                  response.text().then(function(content) {
                    if (
                      $A.isStr(content) &&
                      options.returnType.toLowerCase() === "xml"
                    )
                      content = $A.toXML(content);
                    else if (
                      $A.isStr(content) &&
                      options.returnType.toLowerCase() === "html"
                    )
                      content = $A.toNode(content);
                    if (
                      $A.isDOMNode(content, null, document, 11) &&
                      $A.isSelector(options.selector)
                    )
                      content = content.querySelector(options.selector);
                    if ($A.isFn(success)) success.call(this, content, response);
                    i++;
                    if (o[i])
                      load(o[i].url, o[i].data, o[i].success, o[i].error);
                  });
                // json
                else if (options.returnType.toLowerCase() === "json")
                  response.json().then(function(json) {
                    if ($A.isFn(success)) success.call(this, json, response);
                    i++;
                    if (o[i])
                      load(o[i].url, o[i].data, o[i].success, o[i].error);
                  });
              } else if ($A.isFn(error)) {
                error.call(this, response.statusText, response);
              }
            })
            .catch(function(errorMsg) {
              if ($A.isFn(error)) error.call(this, errorMsg, this);
            });
        };

      if (!$A.isArray(o)) o = [o];

      load(o[i].url, o[i].data, o[i].success, o[i].error);
    },

    toXML: function(data) {
      if (!data) data = "";
      var doc;
      if (window.DOMParser) {
        var parser = new DOMParser();
        doc = parser.parseFromString(data, "text/xml");
      } else {
        doc = new window.ActiveXObject("Microsoft.XMLDOM");
        doc.async = "false";
        doc.loadXML(data);
      }
      return doc;
    },

    moduleFolder: moduleFolder,
    noCache: false,

    _ICB: [],
    _ICBD: [],
    _cssCache: {},
    _jsCache: {},
    _cacheName: {},

    clearCache: function() {
      $A._cssCache = {};
      $A._jsCache = {};
      $A._cacheName = {};
    },

    import: function(source, config, context) {
      if (this._4X) {
        context = this._X;
      }
      if ($A.isFn(config)) config = { call: config };
      else if ($A.isDOMNode(config, null, null, 11)) {
        context = config;
        config = {};
      }
      if (!config) config = {};
      var nC = $A.isBool(config.noCache) ? config.noCache : $A.noCache;
      if ($A.isFn(context)) {
        config.call = context;
        context = null;
      }
      if ($A.isDOMNode(config.context, null, null, 11))
        context = config.context;
      if (!$A.isDOMNode(context, null, null, 11)) context = null;
      if (!config.props) config.props = {};
      var pDeferred = config.props._Defer ? true : false;
      if (pDeferred) config.defer = true;
      if (config.defer) config.props._Defer = true;
      var impId = config.props._ImpId ? config.props._ImpId : $A.genId();
      config.props._ImpId = impId;
      if (!$A.isFn(config.call)) config.call = function() {};
      var refs = [],
        m = !$A.isArray(source) ? 0 : source.length - 1,
        cb = function(iA, i, rs) {
          if (iA.length) {
            iA[iA.length - 1].call(window, iA[iA.length - 1]["_props"], rs);
            if (i === m) iA.splice(iA.length - 1, 1);
          }
        };
      if (
        !source ||
        ($A.isArray(source) && !source.length) ||
        (!nC && config.name && $A._cacheName[config.name])
      ) {
        if ($A.isFn($A._cacheName[config.name])) {
          if (!pDeferred && config.defer && !$A.isDocLoaded)
            $A.on("load", function() {
              $A._cacheName[config.name].call(window, config.props);
            });
          else $A._cacheName[config.name].call(window, config.props);
        }
      } else if (
        config.tag === "img" &&
        $A.isDOMNode(context, null, null, 11)
      ) {
        $A.loop(
          source,
          function(i, s) {
            var r = $A.createEl("img", {
              src: s,
              alt: ""
            });
            context.appendChild(r);
            if ((config.callOnAll || i === m) && $A.isFn(config.call))
              config.call.call(context, config.props, r);
          },
          "array"
        );
      } else {
        if ($A.isFn(config.call)) {
          config.call["_props"] = config.props || {};
          $A[config.defer ? "_ICBD" : "_ICB"].push(config.call);
        }
        $A.loop(
          source,
          function(i, s) {
            var isCSS = s.slice(-4).toLowerCase() === ".css",
              u =
                (!$A.isPath(s) ? $A.moduleFolder : "") +
                (isCSS
                  ? s
                  : s.slice(-3).toLowerCase() === ".js"
                  ? s
                  : s + ".js");
            if (!nC && isCSS && $A._cssCache[u]) {
              if (!$A.getEl($A._cssCache[u].id))
                (context || document.head || document.body).appendChild(
                  $A._cssCache[u].cloneNode(true)
                );
              if ($A.isFn(config.call) && (config.callOnAll || i === m)) {
                config.call.call(window, config.call["_props"]);
              }
            } else if (
              !nC &&
              !isCSS &&
              $A._jsCache[u] &&
              $A._jsCache[u]._ImpId !== impId
            ) {
              var rs;
              if (!$A._jsCache[u].once) {
                try {
                  rs = $A._jsCache[u].call(
                    window,
                    window,
                    document,
                    $A,
                    config.props,
                    config.props.DC
                  );
                } catch (e) {
                  $A.parseDebug(e);
                }
              }

              if ((config.callOnAll || i === m) && $A.isFn(config.call)) {
                if (!pDeferred && config.defer && !$A.isDocLoaded)
                  $A.on("load", function() {
                    cb($A._ICBD, i, rs);
                  });
                else cb($A[config.defer ? "_ICBD" : "_ICB"], i, rs);
              }
            } else
              refs.push(
                $A.extend(
                  true,
                  {
                    url: u,
                    data: {
                      returnType: "text"
                    },
                    success: function(content, promise) {
                      var rs = false;
                      if (content) {
                        if (isCSS) {
                          rs = $A.createEl("style", {
                            type: "text/css",
                            id: $A.genId()
                          });
                          rs.innerHTML = content;
                          if (!nC) $A._cssCache[u] = rs;
                          (
                            context ||
                            document.head ||
                            document.body
                          ).appendChild(rs.cloneNode(true));
                        } else {
                          try {
                            var f =
                              $A._jsCache[u] ||
                              new Function(
                                "window,document,$A,props,DC",
                                content
                              );
                            rs =
                              $A._jsCache[u] && $A._jsCache[u].once
                                ? null
                                : f.call(
                                    window,
                                    window,
                                    document,
                                    $A,
                                    config.props,
                                    config.props.DC
                                  );
                            if (!nC && config.once) f.once = true;
                            f._ImpId = impId;
                            if (!nC && !$A._jsCache[u]) $A._jsCache[u] = f;
                          } catch (e) {
                            $A.parseDebug(e);
                          }
                        }
                        if (!nC && config.name)
                          $A._cacheName[config.name] = config.call;
                      }
                      if (
                        (config.callOnAll || i === m) &&
                        $A.isFn(config.call)
                      ) {
                        if (!pDeferred && config.defer && !$A.isDocLoaded)
                          $A.on("load", function() {
                            cb($A._ICBD, i, rs);
                          });
                        else cb($A[config.defer ? "_ICBD" : "_ICB"], i, rs);
                      }
                    }
                  },
                  config.override || {}
                )
              );
          },
          "array"
        );
        $A.get(refs);
      }
      if (this._4X) {
        this._X = context;
        return this;
      } else return context;
    },

    getScript: function(source, config, context) {
      if ($A.isFn(config)) config = { callback: config };
      config = config || {};
      var max = $A.isArray(source) ? 0 : source.length - 1;
      $A.loop(
        source,
        function(i, s) {
          var t = $A.createEl("script", {
            src:
              (!$A.isPath(s) ? $A.moduleFolder : "") +
              (s.slice(-3).toLowerCase() === ".js" ? s : s + ".js"),
            async: config.disableAsync ? false : true,
            defer: config.defer ? true : false
          });
          if ((config.callbackOnAll || i === max) && $A.isFn(config.callback))
            t.addEventListener("load", function(ev) {
              config.callback.call(window, config.props || ev);
            });
          (context || document.head || document.body).appendChild(t);
        },
        "array"
      );
    },

    _parseURLWithSelector: function(u) {
      var ss = u.split(/\s+/);
      return {
        url: ss[0],
        selector: u.substring(ss[0].length)
      };
    },

    load: function(target, context, data, cb, errorCB) {
      if (this._4X) {
        errorCB = cb;
        cb = data;
        data = context;
        context = this._X;
      }
      if ($A.isFn(data)) {
        errorCB = cb;
        cb = data;
        data = null;
      }
      var config = {
        returnType: "html"
      };
      $A.extend(config, data || {});

      $A.get({
        url: target,
        data: config,
        success: function(node, promise) {
          $A.insert(node, context);
          if ($A.isFn(cb)) cb.call(this, node, promise);
        },
        error: function(errorMsg, promise) {
          if ($A.isFn(errorCB)) errorCB.call(this, errorMsg, promise);
        }
      });
      if (this._4X) {
        this._X = context;
        return this;
      } else return context;
    },

    detachObserver: function(o, e) {
      var m = $A.data(o, "_MutationObserver") || false;
      if (!m || !(e && m[e])) return false;
      if (e && m[e]) m[e].disconnect();
      else for (e in m) m[e].disconnect();
      return true;
    },

    isObserverConfig: function(o) {
      return $A.isPlainObject(o) &&
        (o.context ||
          o.subtree ||
          o.childList ||
          o.attributes ||
          o.attributeFilter ||
          o.attributeOldValue ||
          o.characterData ||
          o.characterDataOldValue)
        ? true
        : false;
    },

    observer: function(o, e, fn, attributeFilter, override) {
      e = e.toLowerCase();
      if (
        ",remove,add,attributechange,subtreechange,contentchange,".indexOf(
          "," + e + ","
        ) === -1
      )
        return false;
      var t = o,
        config = {};
      if (e === "remove" || e === "add") {
        config = { childList: true, subtree: true };
        if (override.context) {
          t = override.context;
          delete override.context;
        } else if (e === "remove") t = document;
      } else if (e === "attributechange") {
        config = { attributes: true, attributeOldValue: true };
        if ($A.isArray(attributeFilter) && attributeFilter.length)
          config.attributeFilter = attributeFilter;
      } else if (e === "subtreechange") {
        config = { childList: true, subtree: true };
      } else if (e === "contentchange") {
        config = {
          characterData: true,
          childList: true,
          subtree: true,
          characterDataOldValue: true
        };
        $A.data(o, "_CurrentText", $A.getText(o));
      } else {
        return false;
      }
      $A.extend(config, override || {});
      if (!$A.data(o, "_MutationObserver")) $A.data(o, "_MutationObserver", {});
      var m = $A.data(o, "_MutationObserver");
      if (!m[e])
        m[e] = new MutationObserver(function(MTS) {
          MTS.forEach(function(M) {
            var MT = M.target,
              BO = $A.boundTo(MT) || $A.data(MT, "DC"),
              SP = $A.data(MT, "SavedEventParameters");
            if (M.type === "childList") {
              if (
                e === "remove" &&
                $A.isArray(M.removedNodes) &&
                M.removedNodes.length &&
                ($A.isFn(Array.from)
                  ? Array.from(M.removedNodes)
                  : [].slice(M.removedNodes)
                ).indexOf(o) !== -1
              ) {
                fn.call(MT, M, MT, M.removedNodes, BO, SP);
              } else if (
                e === "add" &&
                $A.isArray(M.addedNodes) &&
                M.addedNodes.length
              ) {
                fn.call(MT, M, MT, M.addedNodes, BO, SP);
              } else if (
                e === "subtreechange" &&
                (($A.isArray(M.addedNodes) && M.addedNodes.length) ||
                  ($A.isArray(M.removedNodes) && M.removedNodes.length))
              ) {
                fn.call(MT, M, MT, M.addedNodes, M.removedNodes, BO, SP);
              } else if (e === "contentchange") {
                $A.data(MT, "_OldText", $A.data(MT, "_CurrentText"));
                $A.data(MT, "_CurrentText", $A.getText(MT));
                fn.call(
                  MT,
                  M,
                  MT,
                  $A.data(MT, "_CurrentText"),
                  $A.data(MT, "_OldText"),
                  BO,
                  SP
                );
              }
            } else if (M.type === "attributes") {
              if (e === "attributechange") {
                fn.call(
                  MT,
                  M,
                  MT,
                  M.attributeName,
                  $A.getAttr(MT, M.attributeName),
                  M.oldValue,
                  BO,
                  SP
                );
              }
            } else if (M.type === "characterData") {
              if (e === "contentchange") {
                $A.data(MT, "_OldText", $A.data(MT, "_CurrentText"));
                $A.data(MT, "_CurrentText", $A.getText(MT));
                fn.call(
                  MT,
                  M,
                  MT,
                  $A.data(MT, "_CurrentText"),
                  $A.data(MT, "_OldText"),
                  BO,
                  SP
                );
              }
            }
          });
        });
      m[e].observe(t, config);
      $A.data(o, "_MutationObserver", m);
      return true;
    },

    keyEvent: function(e) {
      return e.which || e.keyCode;
    },

    event: {
      on: window.bean.on,
      add: window.bean.add,
      one: window.bean.one,
      off: window.bean.off,
      remove: window.bean.off,
      fire: window.bean.fire,
      Event: window.bean.Event
    },

    on: function(ta, e, fn, save, ns, attributeFilter, override) {
      var isLoaded = function(e) {
        return (
          ($A.isDOMContentLoaded && e === "DOMContentLoaded") ||
          ($A.isDocLoaded && e === "load")
        );
      };
      if (this._4X) {
        override = attributeFilter;
        attributeFilter = ns;
        ns = save;
        save = fn;
        fn = e;
        e = ta;
        ta = this._X;
      }
      if ($A.isFn($A.isObserverConfig) && $A.isObserverConfig(fn)) {
        override = fn;
        fn = null;
      } else if ($A.isFn($A.isObserverConfig) && $A.isObserverConfig(save)) {
        override = save;
        save = null;
      } else if ($A.isFn($A.isObserverConfig) && $A.isObserverConfig(ns)) {
        override = ns;
        ns = null;
      } else override = {};
      attributeFilter = override.attributeFilter || false;
      if (
        (ta === "DOMContentLoaded" || ta === "load" || ta === "touchchange") &&
        $A.isFn(e)
      ) {
        ns = save;
        save = fn;
        fn = e;
        e = ta;
        ta = document;
      }
      if ($A.isStr(fn) && fn[0] === ".") {
        ns = fn;
        fn = null;
      } else if ($A.isStr(save) && save[0] === ".") {
        ns = save;
        save = null;
      }
      if (fn && !$A.isFn(fn)) {
        ns = save;
        save = fn;
        fn = null;
      }
      if (!ta || !e) return this._4X ? this : ta;

      if ($A.isStr(ta)) ta = $A.morph(ta);
      var obj = $A._check(ta);
      if ($A.isStr(e)) e = e.split(/\s+/);
      if (!$A.isStr(ns)) ns = "";
      $A.loop(
        obj,
        function(i, o) {
          if ($A.isDOMNode(o, window, document, 11)) {
            if (save) $A.data(o, "SavedEventParameters", save);
            $A.loop(
              e,
              function(j, p) {
                if ($A.isStr(j) && $A.isFn(p)) {
                  j = j.split(/\s+/);
                  $A.loop(
                    j,
                    function(k, q) {
                      var dc = $A.data(o, "DC");
                      if ($A.isDC(dc) && $A.data(o, "DC-ON") === true)
                        dc.triggerObj = o;
                      if (isLoaded(q)) {
                        p.call(o, null, dc, $A.data(o, "SavedEventParameters"));
                      } else if (
                        !$A.isFn($A.observer) ||
                        !$A.observer(o, q, p, attributeFilter, override)
                      )
                        $A.event.on(o, q + ns, function(ev) {
                          p.call(o, ev, dc, $A.data(o, "SavedEventParameters"));
                        });
                    },
                    "array"
                  );
                } else if ($A.isStr(p) && $A.isFn(fn)) {
                  var dc = $A.data(o, "DC");
                  if ($A.isDC(dc) && $A.data(o, "DC-ON") === true)
                    dc.triggerObj = o;
                  if (isLoaded(p)) {
                    fn.call(o, null, dc, $A.data(o, "SavedEventParameters"));
                  } else if (
                    !$A.isFn($A.observer) ||
                    !$A.observer(o, p, fn, attributeFilter, override)
                  )
                    $A.event.on(o, p + ns, function(ev) {
                      fn.call(o, ev, dc, $A.data(o, "SavedEventParameters"));
                    });
                }
              },
              $A.isArray(e) ? "array" : "object"
            );
          }
        },
        "array"
      );
      if (this._4X) {
        this._X = ta;
        return this;
      } else return ta;
    },

    off: function(ta, e) {
      if (this._4X) {
        e = ta;
        ta = this._X;
      }
      if (!ta) return this._4X ? this : ta;
      var events = e;

      if ($A.isStr(ta)) ta = $A.morph(ta);
      var obj = $A._check(ta);
      if (!$A.isArray(obj)) obj = [obj];
      if ($A.isStr(events)) events = events.split(/\s+/);
      $A.loop(
        obj,
        function(i, o) {
          if ($A.isDOMNode(o, window, document, 11)) {
            $A.removeData(o, "SavedEventParameters");
            if (!e) {
              $A.detachObserver(o);
              $A.event.off(o);
            } else {
              $A.loop(
                events,
                function(j, p) {
                  if ($A.isStr(p)) {
                    $A.detachObserver(o, p);
                    $A.event.off(o, p);
                  }
                },
                $A.isArray(events) ? "array" : "object"
              );
            }
          }
        },
        "array"
      );
      if (this._4X) {
        this._X = ta;
        return this;
      } else return ta;
    },

    trigger: function(ta, e) {
      if (this._4X) {
        e = ta;
        ta = this._X;
      }
      if (!ta || !e) return this._4X ? this : ta;
      var events = e;

      if ($A.isStr(ta)) ta = $A.morph(ta);
      var obj = $A._check(ta);
      if ($A.isStr(events)) events = events.split(/\s+/);
      $A.loop(
        obj,
        function(i, o) {
          if ($A.isDOMNode(o, window, document)) {
            $A.loop(
              events,
              function(j, p) {
                if ($A.isStr(p)) $A.event.fire(o, p);
              },
              "array"
            );
          }
        },
        "array"
      );
      if (this._4X) {
        this._X = ta;
        return this;
      } else return ta;
    },

    isNatActEl: function(node) {
      if (this._4X) {
        node = this._X;
      }
      if (!$A.isDOMNode(node)) return false;
      var nodeName = node.nodeName.toLowerCase(),
        href = $A.getAttr(node, "href") ? true : false;
      return (nodeName === "a" && href) ||
        ["button", "input", "select", "textarea", "details"].indexOf(
          nodeName
        ) !== -1
        ? true
        : false;
    },

    getActEl: function(c, onlyFocusable) {
      var c = $A.isDOMNode(c) ? c : document;
      return $A.query(
        "a[href], button, input, textarea, select, details, *[tabindex]",
        c,
        function(i, o) {
          if (onlyFocusable) return $A.isFocusable(o);
        }
      );
    },

    setCircTab: function(c, activeElements) {
      if (this._4X) {
        activeElements = c;
        c = this._X;
      }
      if ($A.isArray(c)) {
        activeElements = c;
        c = null;
      }
      if (!$A.isArray(activeElements) && !$A.isDOMNode(c, null, null, 11))
        return [];
      if (!$A.isArray(activeElements) && $A.isDOMNode(c, null, null, 11))
        activeElements = $A.getActEl(c, true);
      if (activeElements.length) {
        var f = activeElements[0],
          l = activeElements[activeElements.length - 1];
        $A.on(
          f,
          "keydown",
          function(ev) {
            var k = $A.keyEvent(ev);
            if (k === 9 && ev.shiftKey && !ev.altKey && !ev.ctrlKey) {
              $A.focus(l);
              ev.preventDefault();
            }
          },
          ".circularTabbing"
        );
        $A.on(
          l,
          "keydown",
          function(ev) {
            var k = $A.keyEvent(ev);
            if (k === 9 && !ev.shiftKey && !ev.altKey && !ev.ctrlKey) {
              $A.focus(f);
              ev.preventDefault();
            }
          },
          ".circularTabbing"
        );
      }
      if (this._4X) {
        this._X = activeElements;
        return this;
      } else return activeElements;
    },

    addWidgetTypeProfile: function(widgetType, config) {
      if (!$A.module[widgetType]) $A.module[widgetType] = {};
      $A.extend($A.module[widgetType], config);
    },

    module: {},

    getModule: function(dc, action, content) {
      if ($A.module[dc.widgetType] && $A.isFn($A.module[dc.widgetType][action]))
        return $A.module[dc.widgetType][action](dc, content);
    },

    _widgetTypes: [],
    _regWidgets: new Map(),
    _dataMap: new Map(),

    data: function(obj, key, val) {
      if (this._4X) {
        val = key;
        key = obj;
        obj = this._X;
      }
      if (!obj) return this._4X ? this : obj;
      if (obj && key && typeof val === "undefined") {
        if ($A._dataMap.has(obj) && $A._dataMap.get(obj).has(key)) {
          var r = $A._dataMap.get(obj).get(key);
          if (this._4X) {
            this._X = r;
            return this;
          } else return r;
        }
        if (this._4X) {
          this._X = null;
          return this;
        } else return null;
      } else if (obj && key && typeof val !== "undefined") {
        if (!$A._dataMap.has(obj)) $A._dataMap.set(obj, new Map());
        $A._dataMap.get(obj).set(key, val);
      }
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    removeData: function(obj, key) {
      if (this._4X) {
        key = obj;
        obj = this._X;
      }
      if (obj && key) {
        if ($A._dataMap.has(obj) && $A._dataMap.get(obj).has(key))
          $A._dataMap.get(obj).delete(key);
      } else if (obj) {
        if ($A._dataMap.has(obj)) $A._dataMap.delete(obj);
      }
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    insert: function(obj, root, fn, skip) {
      if (this._4X) {
        fn = root;
        root = this._X;
      }
      obj = $A.morph(obj);
      root = $A.morph(root);
      if (
        !$A.isDOMNode(root, null, null, 11) ||
        !$A.isDOMNode(obj, null, null, 11, 3)
      )
        return this._4X ? this : obj;
      $A.empty(root);
      root.appendChild(obj);
      if (fn && $A.isFn(fn)) fn.apply(obj, [obj]);
      if ($A.bootstrap && !skip) $A.bootstrap(root);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    insertWithin: function(root, obj, fn) {
      if (this._4X) {
        fn = obj;
        obj = this._X;
      }
      obj = $A.insert(obj, root, fn);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    before: function(obj, existingNode, fn) {
      if (this._4X) {
        fn = existingNode;
        existingNode = obj;
        obj = this._X;
      }
      obj = $A._insertBefore(obj, existingNode, fn);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    _insertBefore: function(obj, existingNode, fn) {
      if (this._4X) {
        fn = existingNode;
        existingNode = obj;
        obj = this._X;
      }
      obj = $A.morph(obj);
      existingNode = $A.morph(existingNode);
      if (!$A.isDOMNode(existingNode) || !$A.isDOMNode(obj, null, null, 11))
        return this._4X ? this : obj;
      existingNode.parentNode.insertBefore(obj, existingNode);
      if (fn && $A.isFn(fn)) fn.apply(obj, [obj]);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    replace: function(obj, existingNode, fn) {
      if (this._4X) {
        fn = existingNode;
        existingNode = obj;
        obj = this._X;
      }
      obj = $A._replaceChild(obj, existingNode, fn);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    _replaceChild: function(obj, existingNode, fn) {
      obj = $A.morph(obj);
      existingNode = $A.morph(existingNode);
      if (!$A.isDOMNode(existingNode) || !$A.isDOMNode(obj, null, null, 11))
        return obj;
      existingNode.parentNode.replaceChild(obj, existingNode);
      if (fn && $A.isFn(fn)) fn.apply(obj, [obj]);
      return obj;
    },

    after: function(obj, existingNode, fn) {
      if (this._4X) {
        fn = existingNode;
        existingNode = obj;
        obj = this._X;
      }
      obj = $A._insertAfter(obj, existingNode, fn);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    _insertAfter: function(obj, existingNode, fn) {
      obj = $A.morph(obj);
      existingNode = $A.morph(existingNode);
      if (!$A.isDOMNode(existingNode) || !$A.isDOMNode(obj, null, null, 11))
        return obj;
      var ns = $A.nextSibling(existingNode);
      if (ns) ns.parentNode.insertBefore(obj, ns);
      else existingNode.parentNode.appendChild(obj);
      if (fn && $A.isFn(fn)) fn.apply(obj, [obj]);
      return obj;
    },

    prepend: function(obj, root, fn) {
      if (this._4X) {
        fn = root;
        root = this._X;
      }
      obj = $A.morph(obj);
      root = $A.morph(root);
      if (
        $A.isDOMNode(root, null, null, 11) &&
        $A.isDOMNode(obj, null, null, 11)
      ) {
        var fc = $A.firstChild(root);
        if (fc) $A._insertBefore(obj, fc);
        else root.appendChild(obj);
      }
      if (fn && $A.isFn(fn)) fn.apply(obj, [obj]);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    prependTo: function(root, obj, fn) {
      if (this._4X) {
        fn = obj;
        obj = this._X;
      }
      obj = $A.prepend(obj, root, fn);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    append: function(obj, root, fn) {
      if (this._4X) {
        fn = root;
        root = this._X;
      }
      obj = $A.morph(obj);
      root = $A.morph(root);
      if (
        $A.isDOMNode(root, null, null, 11) &&
        $A.isDOMNode(obj, null, null, 11)
      ) {
        if ($A.isStr(obj)) obj = $A.morph(obj);
        root.appendChild(obj);
      }
      if (fn && $A.isFn(fn)) fn.apply(obj, [obj]);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    appendTo: function(root, obj, fn) {
      if (this._4X) {
        fn = obj;
        obj = this._X;
      }
      obj = $A.append(obj, root, fn);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    insertMarkup: function(obj, root, pos, fn) {
      if (this._4X) {
        fn = pos;
        pos = root;
        root = this._X;
      }
      if ($A.isFn(pos)) {
        fn = pos;
        pos = null;
      }
      root = $A.morph(root);
      if ($A.isDOMNode(root)) {
        if ($A.isNum(obj)) obj = obj.toString();
        if ($A.isStr(obj)) {
          var locale = {
            prepend: "afterbegin",
            append: "beforeend",
            before: "beforebegin",
            after: "afterend"
          };
          if (locale[pos]) root.insertAdjacentHTML(locale[pos], obj);
          else {
            $A.empty(root);
            root.innerHTML = obj;
          }
        }
      }
      if (fn && $A.isFn(fn)) fn.apply(root, [root]);
      if (this._4X) {
        this._X = root;
        return this;
      } else return root;
    },

    _deleteNode: function(o) {
      try {
        var range = document.createRange();
        range.selectNode(o);
        range.deleteContents();
      } catch (e) {
        if (o && o.parentNode) o.parentNode.removeChild(o);
      }
    },

    cloneNodes: function(o, noFrag) {
      if (this._4X) {
        noFrag = o;
        o = this._X;
      }
      var r;
      try {
        var range = document.createRange();
        range.selectNodeContents(o);
        r = range.cloneContents();
      } catch (e) {
        r = $A.toNode();
        if ($A.isDOMNode(o) && o.firstChild) {
          var node = o.firstChild;
          while (node) {
            if (node.cloneNode) r.appendChild(node.cloneNode(true));
            node = o.nextSibling;
          }
        }
      }
      r = $A._store(r);
      if (this._4X) {
        this._X = r;
        return this;
      } else return r;
    },

    extractNodes: function(o, noFrag) {
      if (this._4X) {
        noFrag = o;
        o = this._X;
      }
      var r;
      try {
        var range = document.createRange();
        range.selectNodeContents(o);
        r = range.extractContents();
      } catch (e) {
        r = $A.toNode();
        if ($A.isDOMNode(o) && o.firstChild) {
          var node = o.firstChild;
          while (node) {
            r.appendChild(o.removeChild(node));
            node = o.firstChild;
          }
        }
      }
      r = $A._store(r);
      if (this._4X) {
        this._X = r;
        return this;
      } else return r;
    },

    empty: function(obj, removeParent) {
      if (this._4X) {
        removeParent = obj;
        obj = this._X;
      }
      if (obj && obj.getElementsByTagName) {
        var items = obj.getElementsByTagName("*");
        if (items.length)
          for (var i = items.length; i--; ) {
            $A.remove(items[i], true);
          }
        obj.innerHTML = "";
      }
      if (removeParent) {
        $A.remove(obj);
        obj = null;
      }
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    _cleanAll: function(obj, includeParent, skipDel) {
      if (obj && obj.getElementsByTagName) {
        var items = obj.getElementsByTagName("*");
        for (var i = items.length; i--; ) {
          $A._clean(items[i], skipDel);
        }
        if (includeParent) $A._clean(obj, skipDel);
      }
    },

    _clean: function(obj, sD) {
      var dc = $A.data(obj, "DC");
      if ($A.isDC(dc) && dc.loaded && !dc.closing && !dc.loading) {
        dc.fn.bypass = true;
        dc.remove();
        dc.fn.bypass = false;
      }
      $A.detachObserver(obj);
      $A.removeData(obj);
      $A.event.off(obj);
    },

    remove: function(obj, skipDelete) {
      if (this._4X) {
        skipDelete = obj;
        obj = this._X;
      }

      if (obj && obj.nodeType === 11) {
        var o = $A._check(obj);
        if (o && o.length) {
          for (var i = o.length; i--; ) {
            $A.remove(o[i], skipDelete);
          }
        }
        $A._clean(obj, skipDelete);
        obj = null;
      } else if (obj && obj.nodeType) {
        $A._clean(obj, skipDelete);
        if (!skipDelete) {
          $A._deleteNode(obj);
          obj = null;
        }
      }

      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    destroy: function(id, p) {
      var r = null;
      if ($A.isDC(id)) r = id;
      else r = $A.reg.get(id);
      if (!$A.isDC(id)) return false;
      var a = r.outerNode,
        c = r.container;
      if (p && r.loaded) {
        if (r.sourceOnly) {
          $A.before(c, a);
          c = null;
        } else $A.before($A.extractNodes(c), a);
      }
      if (r.loaded) {
        r.fn.bypass = true;
        r.remove();
        r.fn.bypass = false;
      }
      if ($A.isFn(r.runBeforeDestroy)) r.runBeforeDestroy(r);
      $A.removeData(r.id);
      r.id = r.outerNode = r.container = a = c = null;
      if (r.widgetType && r.autoCloseWidget) {
        var wtI = $A._widgetTypes.indexOf(r.id);
        if (wtI !== -1) {
          $A._widgetTypes.splice(wtI, 1);
        }
      }
      if (r.widgetType && r.autoCloseSameWidget) {
        var wtA = $A._regWidgets.get(r.widgetType),
          wtI = wtA.indexOf(r.id);
        if (wtI !== -1) {
          wtA.splice(wtI, 1);
          $A._regWidgets.set(r.widgetType, wtA);
        }
      }
      var iv = r.indexVal,
        wh = r.siblings;
      wh.splice(iv, 1);
      for (var i = 0; i < wh.length; i++) {
        wh[i].indexVal = i;
        wh[i].siblings = wh;
      }

      if (r.parent && r.parent.children && r.parent.children.length) {
        var pc = -1,
          cn = r.parent.children;
        for (var i = 0; i < cn.length; i++) {
          if (cn[i].id === id) pc = i;
        }
        if (pc >= 0) r.parent.children.splice(pc, 1);
      }
      $A.reg.delete(id);
      return true;
    },

    getEl: function(e, con, fn) {
      if (this._4X) {
        fn = con;
        con = this._X;
      }
      if ($A.isFn(con)) {
        fn = con;
        con = null;
      }
      con = $A.isDOMNode(con, null, document) ? con : document;
      if (!e || !$A.isStr(e)) return null;
      if (e[0] !== "#") e = "#" + e;

      // Get the first node matching the referenced selector.
      // document.getElementById cannot be used because it doesn't always work correctly
      var r = con.querySelector(e);
      if ($A.isDOMNode(r) && $A.isFn(fn)) fn.call(r, r);

      if (this._4X) {
        this._X = r;
        return this;
      } else return r;
    },

    createEl: function(t) {
      var o = document.createElement(t);
      if (arguments.length === 1 || !$A.isDOMNode(o)) return o;
      if (arguments[1]) $A.setAttr(o, arguments[1]);
      if (arguments[2]) $A.css(o, arguments[2]);
      if (arguments[3]) $A.addClass(o, arguments[3]);
      if (arguments[4]) $A.insert(arguments[4], o);
      return o;
    },

    toText: function(s) {
      if ($A.isDOMNode(s, null, null, 3)) return s;
      else if (!$A.isStr(s)) s = "";
      return document.createTextNode(s);
    },

    getAttr: function(e, n) {
      if (this._4X) {
        n = e;
        e = this._X;
      }
      e = $A.morph(e);
      var E = $A._check(e, true);
      if (!$A.isDOMNode(E) || !n) return null;
      return E.getAttribute(n);
    },

    hasAttr: function(e, n) {
      if (this._4X) {
        n = e;
        e = this._X;
      }
      e = $A.morph(e);
      var E = $A._check(e, true);
      if (!$A.isDOMNode(E) || !n) return null;
      return E.hasAttribute(n);
    },

    remAttr: function(e, n) {
      if (this._4X) {
        n = e;
        e = this._X;
      }
      e = $A.morph(e);
      var E = $A._check(e);
      var o = $A.isArray(E) ? E : [E];
      for (var x = 0; x < o.length; x++) {
        if ($A.isDOMNode(o[x])) {
          var a = $A.isArray(n) ? n : [n];
          for (var i = 0; i < a.length; i++) {
            o[x].removeAttribute(a[i]);
          }
        }
      }

      if (this._4X) {
        this._X = e;
        return this;
      } else return e;
    },

    setAttr: function(e, name, value) {
      if (this._4X) {
        value = name;
        name = e;
        e = this._X;
      }
      e = $A.morph(e);
      var E = $A._check(e);
      var o = $A.isArray(E) ? E : [E];
      for (var x = 0; x < o.length; x++) {
        if ($A.isDOMNode(o[x])) {
          if ($A.isStr(name)) {
            if (value === null) o[x].removeAttribute(name);
            else o[x].setAttribute(name, value);
          } else if (typeof name === "object") {
            for (var n in name) {
              if (name[n] === null) o[x].removeAttribute(n);
              else o[x].setAttribute(n, name[n]);
            }
          }
        }
      }

      if (this._4X) {
        this._X = e;
        return this;
      } else return e;
    },

    prevSibling: function(e, t) {
      if (this._4X) {
        t = e;
        e = this._X;
      }
      e = $A.morph(e);
      e = $A._check(e, true);
      if (!$A.isDOMNode(e, null, null, 11)) return this._4X ? this : e;
      e = e.previousSibling;
      while (e) {
        if ($A.isDOMNode(e) && (!$A.isFn(t) || ($A.isFn(t) && t(e) === true)))
          break;
        e = e.previousSibling;
      }
      if (this._4X) {
        this._X = e;
        return this;
      } else return e;
    },

    nextSibling: function(e, t) {
      if (this._4X) {
        t = e;
        e = this._X;
      }
      e = $A.morph(e);
      e = $A._check(e, true);
      if (!$A.isDOMNode(e, null, null, 11)) return this._4X ? this : e;
      e = e.nextSibling;
      while (e) {
        if ($A.isDOMNode(e) && (!$A.isFn(t) || ($A.isFn(t) && t(e) === true)))
          break;
        e = e.nextSibling;
      }
      if (this._4X) {
        this._X = e;
        return this;
      } else return e;
    },

    firstChild: function(e, t) {
      if (this._4X) {
        t = e;
        e = this._X;
      }
      e = $A.morph(e);
      e = $A._check(e, true);
      if (!$A.isDOMNode(e, null, null, 11)) return this._4X ? this : e;
      e = e.firstChild;
      while (e) {
        if ($A.isDOMNode(e) && (!$A.isFn(t) || ($A.isFn(t) && t(e) === true)))
          break;
        e = e.nextSibling;
      }
      if (this._4X) {
        this._X = e;
        return this;
      } else return e;
    },

    lastChild: function(e, t) {
      if (this._4X) {
        t = e;
        e = this._X;
      }
      e = $A.morph(e);
      e = $A._check(e, true);
      if (!$A.isDOMNode(e, null, null, 11)) return this._4X ? this : e;
      e = e.lastChild;
      while (e) {
        if ($A.isDOMNode(e) && (!$A.isFn(t) || ($A.isFn(t) && t(e) === true)))
          break;
        e = e.previousSibling;
      }
      if (this._4X) {
        this._X = e;
        return this;
      } else return e;
    },

    closestParent: function(node, fn) {
      if (this._4X) {
        fn = node;
        node = this._X;
      }
      node = $A.morph(node);
      while ($A.isDOMNode(node)) {
        node = node.parentNode;
        if (!$A.isFn(fn) || ($A.isFn(fn) && fn(node) === true)) break;
      }
      if (this._4X) {
        this._X = node;
        return this;
      } else return node;
    },

    _getStyleObject: function(node) {
      var style = {};
      if (document.defaultView && document.defaultView.getComputedStyle) {
        style = document.defaultView.getComputedStyle(node, "");
      } else if (node.currentStyle) {
        style = node.currentStyle;
      }
      return style;
    },

    css: function(ob, p, v) {
      if (this._4X) {
        v = p;
        p = ob;
        ob = this._X;
      }
      ob = $A.morph(ob);
      var obj = $A._check(ob);
      if (!obj || !p) return this._4X ? this : ob;
      if (!$A.isArray(obj)) obj = [obj];
      if (
        obj.length === 1 &&
        $A.isDOMNode(obj[0]) &&
        $A.isStr(p) &&
        !$A.isStr(v) &&
        !$A.isNum(v) &&
        !v
      ) {
        return $A._getStyleObject(obj[0])[p];
      }
      var isNumProp = function(n) {
        if (!n) return false;
        var list = ["top", "left", "bottom", "right", "width", "height"];
        for (var l = 0; l < list.length; l++) {
          if (list[l].substr(list[l].length - n.length) === n) return true;
        }
        return false;
      };
      var setProp = function(o, prop, val) {
        val = isNumProp(prop) && $A.isNum(val) ? val + "px" : val;
        try {
          if (!(val || $A.isNum(val)) && o.style.removeProperty) {
            o.style.removeProperty(prop);
          } else {
            prop = $A._camelize(prop);
            o.style[prop] = val;
          }
        } catch (e) {}
      };
      for (var z = 0; z < obj.length; z++) {
        if ($A.isDOMNode(obj[z])) {
          if ($A.isStr(p)) setProp(obj[z], p, v);
          else if (typeof p === "object") {
            for (var n in p) {
              var v = p[n];
              setProp(obj[z], n, v);
            }
          }
        }
      }
      if (this._4X) {
        this._X = ob;
        return this;
      } else return ob;
    },

    hasClass: function(O, cn) {
      if (this._4X) {
        cn = O;
        O = this._X;
      }
      var t = $A.morph(O);
      var o = $A._check(t, true);
      if (!$A.isDOMNode(o) || !o.className || !cn || !$A.isStr(cn))
        return false;
      var names = cn.split(/\s+/),
        i = 0,
        n = 0;
      try {
        var cL = o.classList;
        for (n = 0; n < names.length; n++) {
          if (cL.contains(names[n])) i += 1;
        }
      } catch (e) {
        var oClasses = o.className ? o.className.split(/\s+/) : [];
        for (n = 0; n < names.length; n++) {
          if (oClasses.indexOf(names[n]) !== -1) i += 1;
        }
      }
      return i === names.length;
    },

    addClass: function(obj, cn) {
      if (this._4X) {
        cn = obj;
        obj = this._X;
      }
      obj = $A.morph(obj);
      var o = $A._check(obj);
      if (!o || !cn || !$A.isStr(cn)) return this._4X ? this : obj;
      if (!$A.isArray(o)) o = [o];
      var names = cn.split(/\s+/);
      for (var x = 0; x < o.length; x++) {
        var n = 0;
        try {
          var cL = o[x].classList;
          for (n = 0; n < names.length; n++) cL.add(names[n]);
        } catch (e) {
          if ($A.isDOMNode(o[x]) && !$A.hasClass(o[x], cn)) {
            var oClasses = o[x].className ? o[x].className.split(/\s+/) : [];
            for (n = 0; n < names.length; n++) {
              if (oClasses.indexOf(names[n]) === -1) oClasses.push(names[n]);
            }
            o[x].className = oClasses.join(" ");
          }
        }
      }

      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    remClass: function(obj, cn) {
      if (this._4X) {
        cn = obj;
        obj = this._X;
      }
      obj = $A.morph(obj);
      var o = $A._check(obj);
      if (!o || !cn || !$A.isStr(cn)) return this._4X ? this : obj;
      if (!$A.isArray(o)) o = [o];
      var names = cn.split(/\s+/);

      for (var x = 0; x < o.length; x++) {
        var n = 0;
        try {
          var cL = o[x].classList;
          for (n = 0; n < names.length; n++) cL.remove(names[n]);
        } catch (e) {
          if ($A.isDOMNode(o[x]) && $A.hasClass(o[x], cn)) {
            var oClasses = o[x].className ? o[x].className.split(/\s+/) : [],
              nc = [];
            for (n = 0; n < oClasses.length; n++) {
              if (names.indexOf(oClasses[n]) === -1) nc.push(oClasses[n]);
            }
            o[x].className = nc.join(" ");
          }
        }
      }

      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    toggleClass: function(obj, cn, isTrue, fn) {
      if (this._4X) {
        fn = isTrue;
        isTrue = cn;
        cn = obj;
        obj = this._X;
      }
      if ($A.isFn(isTrue)) {
        fn = isTrue;
        isTrue = null;
      }
      obj = $A.morph(obj);
      var O = $A._check(obj);
      if (!O || !cn || !$A.isStr(cn)) return this._4X ? this : obj;
      if (!$A.isArray(O)) O = [O];
      for (var x = 0; x < O.length; x++) {
        var o = O[x];
        if (!$A.isBool(isTrue)) isTrue = !$A.hasClass(o, cn);
        $A[isTrue ? "addClass" : "remClass"](o, cn);
        if ($A.isFn(fn)) fn.apply(o, [isTrue]);
      }
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    setOffScreen: function(obj) {
      if (this._4X) {
        obj = this._X;
      }
      $A.css(obj, $A.sraCSS);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    clearOffScreen: function(obj) {
      if (this._4X) {
        obj = this._X;
      }
      $A.css(obj, $A.sraCSSClear);
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    sraCSS: {
      position: "absolute",
      clip: "rect(1px 1px 1px 1px)",
      clip: "rect(1px, 1px, 1px, 1px)",
      clipPath: "inset(50%)",
      padding: 0,
      border: 0,
      height: "1px",
      width: "1px",
      overflow: "hidden",
      whiteSpace: "nowrap"
    },

    sraCSSClear: {
      position: "",
      clip: "auto",
      clipPath: "none",
      padding: "",
      height: "",
      width: "",
      overflow: "",
      whiteSpace: "normal"
    },

    _calcPosition: function(dc, objArg, posVal) {
      var obj = objArg || dc.posAnchor;
      if (obj && $A.isStr(obj)) obj = $A.query(obj)[0];
      else if (!obj) obj = dc.triggerObj;
      if (!obj) return;
      var autoPosition = posVal || dc.autoPosition,
        pos = {},
        aPos = {
          height: $A.elementHeight(dc.outerNode),
          width: $A.elementWidth(dc.outerNode)
        },
        oPos = $A.offset(obj),
        position = $A.css(dc.outerNode, "position");
      if (position === "absolute" && $A.css(obj, "position") !== "fixed")
        oPos = $A.offset(obj, true);
      if (autoPosition === 1) {
        pos.left = oPos.left;
        pos.top = oPos.top - aPos.height;
      } else if (autoPosition === 2) {
        pos.left = oPos.right;
        pos.top = oPos.top - aPos.height;
      } else if (autoPosition === 3) {
        pos.left = oPos.right;
        pos.top = oPos.top;
      } else if (autoPosition === 4) {
        pos.left = oPos.right;
        pos.top = oPos.bottom;
      } else if (autoPosition === 5) {
        pos.left = oPos.left;
        pos.top = oPos.bottom;
      } else if (autoPosition === 6) {
        pos.left = oPos.left - aPos.width;
        pos.top = oPos.bottom;
      } else if (autoPosition === 7) {
        pos.left = oPos.left - aPos.width;
        pos.top = oPos.top;
      } else if (autoPosition === 8) {
        pos.left = oPos.left - aPos.width;
        pos.top = oPos.top - aPos.height;
      } else if (autoPosition === 9) {
        pos.left = oPos.left;
        pos.top = oPos.top;
      } else if (autoPosition === 10) {
        pos.left = oPos.right - aPos.width;
        pos.top = oPos.top - aPos.height;
      } else if (autoPosition === 11) {
        pos.left = oPos.right - aPos.width;
        pos.top = oPos.top;
      } else if (autoPosition === 12) {
        pos.left = oPos.right - aPos.width;
        pos.top = oPos.bottom;
      }
      if ($A.isNum(dc.offsetTop) && (dc.offsetTop < 0 || dc.offsetTop > 0))
        pos.top += dc.offsetTop;
      if ($A.isNum(dc.offsetLeft) && (dc.offsetLeft < 0 || dc.offsetLeft > 0))
        pos.left += dc.offsetLeft;
      $A.css(dc.outerNode, pos);
    },

    getWindow: function(w) {
      var w = $A.isDOMNode(w, window) ? w : window;
      return {
        width:
          w.document.documentElement.clientWidth || w.document.body.clientWidth,
        height:
          w.document.documentElement.clientHeight ||
          w.document.body.clientHeight
      };
    },

    _getAbsolutePos: function(obj) {
      if (!obj) return obj;
      var curleft = 0;
      var curtop = 0;
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while ((obj = obj.offsetParent));
      return {
        left: curleft,
        top: curtop
      };
    },

    offset: function(c, forceAbsolute, forceRelative, returnTopLeftOnly) {
      if (this._4X) {
        returnTopLeftOnly = forceRelative;
        forceRelative = forceAbsolute;
        forceAbsolute = c;
        c = this._X;
      }
      if (!$A.isDOMNode(c, window)) return c;
      var r = {},
        position = $A.css(c, "position");
      if (forceAbsolute || position === "absolute") r = $A._getAbsolutePos(c);
      else if (forceRelative || position === "relative") {
        r.top = c.offsetTop;
        r.left = c.offsetLeft;
        r.height = $A.elementHeight(c);
        r.width = $A.elementWidth(c);
        r.right = r.left + r.width;
        r.bottom = r.top + r.height;
      } else {
        var br = c.getBoundingClientRect();
        r = {
          top: br.top,
          left: br.left,
          right: br.right,
          bottom: br.bottom,
          height: br.height,
          width: br.width
        };
      }
      if (returnTopLeftOnly) {
        // Ensure only top and left properties are returned if returnTopLeftOnly = true
        r = {
          top: r.top,
          left: r.left
        };
      }
      return r;
    },

    _camelize: function(cssPropStr) {
      if (!$A.isStr(cssPropStr)) cssPropStr = "";
      var i, c, a, s;
      a = cssPropStr.split("-");
      s = a[0];
      for (i = 1; i < a.length; i++) {
        c = a[i].charAt(0);
        s += a[i].replace(c, c.toUpperCase());
      }
      return s;
    },

    _getComputedStyle: function(e, p, i) {
      if (!e) return e;
      var s,
        v = "undefined",
        dv = document.defaultView;
      if (dv && dv.getComputedStyle) {
        if (e === document) e = document.body;
        s = dv.getComputedStyle(e, "");
        if (s) v = s.getPropertyValue(p);
      } else if (e.currentStyle) v = e.currentStyle[$A._camelize(p)];
      else return null;
      return i ? parseInt(v, 10) || 0 : v;
    },

    _num: function() {
      for (var i = 0; i < arguments.length; i++) {
        if (isNaN(arguments[i]) || !$A.isNum(arguments[i])) return false;
      }
      return true;
    },

    _def: function() {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === "undefined") return false;
      }
      return true;
    },

    _str: function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!$A.isStr(arguments[i])) return false;
      }
      return true;
    },

    elementHeight: function(e, h) {
      var css,
        pt = 0,
        pb = 0,
        bt = 0,
        bb = 0;
      if (!e) return 0;
      if ($A._num(h)) {
        if (h < 0) h = 0;
        else h = Math.round(h);
      } else h = -1;
      css = $A._def(e.style);
      if (css && $A._def(e.offsetHeight) && $A._str(e.style.height)) {
        if (h >= 0) {
          if (document.compatMode === "CSS1Compat") {
            pt = $A._getComputedStyle(e, "padding-top", 1);
            if (pt !== null) {
              pb = $A._getComputedStyle(e, "padding-bottom", 1);
              bt = $A._getComputedStyle(e, "border-top-width", 1);
              bb = $A._getComputedStyle(e, "border-bottom-width", 1);
            } else if ($A._def(e.offsetHeight, e.style.height)) {
              e.style.height = h + "px";
              pt = e.offsetHeight - h;
            }
          }
          h -= pt + pb + bt + bb;
          if (isNaN(h) || h < 0) return;
          else e.style.height = h + "px";
        }
        h = e.offsetHeight;
      } else if (css && $A._def(e.style.pixelHeight)) {
        if (h >= 0) e.style.pixelHeight = h;
        h = e.style.pixelHeight;
      }
      return h;
    },

    elementWidth: function(e, w) {
      var css,
        pl = 0,
        pr = 0,
        bl = 0,
        br = 0;
      if (!e) return 0;
      if ($A._num(w)) {
        if (w < 0) w = 0;
        else w = Math.round(w);
      } else w = -1;
      css = $A._def(e.style);
      if (css && $A._def(e.offsetWidth) && $A._str(e.style.width)) {
        if (w >= 0) {
          if (document.compatMode === "CSS1Compat") {
            pl = $A._getComputedStyle(e, "padding-left", 1);
            if (pl !== null) {
              pr = $A._getComputedStyle(e, "padding-right", 1);
              bl = $A._getComputedStyle(e, "border-left-width", 1);
              br = $A._getComputedStyle(e, "border-right-width", 1);
            } else if ($A._def(e.offsetWidth, e.style.width)) {
              e.style.width = w + "px";
              pl = e.offsetWidth - w;
            }
          }
          w -= pl + pr + bl + br;
          if (isNaN(w) || w < 0) return;
          else e.style.width = w + "px";
        }
        w = e.offsetWidth;
      } else if (css && $A._def(e.style.pixelWidth)) {
        if (w >= 0) e.style.pixelWidth = w;
        w = e.style.pixelWidth;
      }
      return w;
    },

    _top: function(e, iY) {
      var css = $A._def(e.style);
      if (css && $A._str(e.style.top)) {
        if ($A._num(iY)) e.style.top = iY + "px";
        else {
          iY = parseInt(e.style.top, 10);
          if (isNaN(iY)) iY = $A._getComputedStyle(e, "top", 1);
          if (isNaN(iY)) iY = 0;
        }
      } else if (css && $A._def(e.style.pixelTop)) {
        if ($A._num(iY)) e.style.pixelTop = iY;
        else iY = e.style.pixelTop;
      }
      return iY;
    },

    _left: function(e, iX) {
      var css = $A._def(e.style);
      if (css && $A._str(e.style.left)) {
        if ($A._num(iX)) e.style.left = iX + "px";
        else {
          iX = parseInt(e.style.left, 10);
          if (isNaN(iX)) iX = $A._getComputedStyle(e, "left", 1);
          if (isNaN(iX)) iX = 0;
        }
      } else if (css && $A._def(e.style.pixelLeft)) {
        if ($A._num(iX)) e.style.pixelLeft = iX;
        else iX = e.style.pixelLeft;
      }
      return iX;
    },

    isPointerWithin: function(n) {
      if (
        $A.isDOMNode(n) &&
        $A.event.pointer &&
        $A.isDOMNode($A.event.pointer.target)
      ) {
        return $A.isWithin($A.event.pointer.target, n);
      }
      return false;
    },

    addIdRef: function(obj, attr, ids) {
      if (this._4X) {
        ids = attr;
        attr = obj;
        obj = this._X;
      }
      obj = $A.morph(obj);
      var t = $A._check(obj),
        ni = (ids || "").split(/\s+/);
      $A.loop(
        t,
        function(i, o) {
          var ds = ($A.getAttr(o, attr) || "").split(/\s+/);
          for (var z = 0; z < ni.length; z++) {
            var d = ni[z];
            if (ds.indexOf(d) === -1) ds.push(d);
          }
          $A.setAttr(o, attr, ds.join(" "));
        },
        "array"
      );
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    remIdRef: function(obj, attr, ids) {
      if (this._4X) {
        ids = attr;
        attr = obj;
        obj = this._X;
      }
      obj = $A.morph(obj);
      var t = $A._check(obj),
        ni = (ids || "").split(/\s+/);
      $A.loop(
        t,
        function(i, o) {
          var n = [],
            ds = ($A.getAttr(o, attr) || "").split(/\s+/);
          for (var z = 0; z < ds.length; z++) {
            var d = ds[z];
            if (ni.indexOf(d) === -1) n.push(d);
          }
          $A.setAttr(o, attr, n.join(" "));
        },
        "array"
      );
      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    genId: function(obj) {
      if (this._4X) {
        obj = this._X;
      }
      var id = "DC4X" + now();
      if (obj && $A.isStr(obj)) {
        obj = $A.morph(obj);
        obj = $A._check(obj, true);
      }
      if ($A.isDOMNode(obj)) {
        obj.id = id;
        if (this._4X) {
          this._X = obj;
          return this;
        } else return obj;
      }
      return id;
    },

    announce: function(str, noRepeat, aggr) {
      if (this._4X) {
        aggr = noRepeat;
        noRepeat = str;
        str = this._X;
      }
      if (str) announceString.apply(str, [str, noRepeat, aggr]);
      if (this._4X) {
        this._X = str;
        return this;
      } else return str;
    },

    // Derived from isOutOfViewport.js by Chris Ferdinandi
    // https://vanillajstoolkit.com/helpers/isoutofviewport/
    isOutOfView: function(elem) {
      var bounding = elem.getBoundingClientRect();
      var out = {
        bounding: bounding
      };
      out.top = bounding.top < 0;
      out.left = bounding.left < 0;
      out.bottom =
        bounding.bottom >
        (window.innerHeight || document.documentElement.clientHeight);
      out.right =
        bounding.right >
        (window.innerWidth || document.documentElement.clientWidth);
      out.any = out.top || out.left || out.bottom || out.right;
      out.all = out.top && out.left && out.bottom && out.right;
      return out;
    },

    getOrientation: function(nodes) {
      if (this._4X) {
        nodes = this._X;
      }
      if (!$A.isArray(nodes)) {
        nodes = $A.morph(nodes);
        nodes = $A._check(nodes);
      }
      var r = {};
      if (
        !nodes ||
        !$A.isArray(nodes) ||
        nodes.length < 2 ||
        !$A.isDOMNode(nodes[0])
      )
        return r;
      var nt = [],
        nl = [],
        fn,
        ln;
      $A.loop(
        nodes,
        function(i, n) {
          var o = $A.offset(n);
          if (i === 0) fn = o;
          else if (i === nodes.length - 1) ln = o;
          nt.push(o.top);
          nl.push(o.left);
        },
        "array"
      );
      var max = function(a, b) {
          return Math.max(a, b);
        },
        min = function(a, b) {
          return Math.min(a, b);
        },
        maxT = nt.reduce(max),
        minT = nt.reduce(min),
        maxL = nl.reduce(max),
        minL = nl.reduce(min),
        diffT = maxT - minT,
        diffL = maxL - minL;
      r.orientation = diffL > diffT ? "horizontal" : "vertical";
      r.lineWrap =
        r.orientation === "horizontal" && (ln.bottom - fn.top) * 0.8 > fn.height
          ? true
          : false;
      return r;
    },

    focus: function(obj, f) {
      if (this._4X) {
        f = obj;
        obj = this._X;
      }

      obj = $A.morph(obj);
      if (!$A.isDOMNode(obj)) return this._4X ? this : obj;

      $A._setFocus(obj);

      if ($A.isFn(f)) f.call(obj, obj);

      if (this._4X) {
        this._X = obj;
        return this;
      } else return obj;
    },

    isFocusWithin: function(o) {
      if (this._4X) {
        o = this._X;
      }
      if ($A.isDOMNode(o, null, document) && o.querySelectorAll) {
        return o.querySelectorAll("*:focus").length > 0;
      }
      return false;
    },

    isHidden: function(node) {
      if (this._4X) {
        node = this._X;
      }
      var hidden = function(node) {
        if (!$A.isDOMNode(node)) return false;
        else if (node.hidden || node.getAttribute("hidden")) return true;
        else {
          var style = $A._getStyleObject(node);
          return (
            style["display"] === "none" || style["visibility"] === "hidden"
          );
        }
      };
      var n = node;
      while ($A.isDOMNode(n)) {
        if (hidden(n)) return true;
        n = n.parentNode;
      }
      return false;
    },

    isWithin: function(node, container) {
      if (this._4X) {
        container = node;
        node = this._X;
      }
      var n = node,
        d = $A.isDOMNode(container, null, null, 11) ? container : document.body;
      while ($A.isDOMNode(n, null, null, 11, 3)) {
        if (n === d) return true;
        n = n.parentNode;
      }
      return false;
    },

    setKBA11Y: function(node, role, name, noSpacebar) {
      if (this._4X) {
        noSpacebar = name;
        name = role;
        role = node;
        node = this._X;
      }
      var nodes = $A.query(node, function(i, node) {
        if ($A.isDOMNode(node) && !$A.isNatActEl(node)) {
          $A.setAttr(node, "tabindex", "0");
          if (role) $A.setAttr(node, "role", role);
          if (name) $A.setAttr(node, "aria-label", name);
          $A.on(node, {
            keydown: function(ev) {
              var k = $A.keyEvent(ev);
              if (k === 13 || (!noSpacebar && k === 32)) {
                $A.trigger(node, "click");
                ev.preventDefault();
              }
            }
          });
          return true;
        }
        return false;
      });
      if (nodes.length === 0) node = null;
      else if (nodes.length === 1) node = nodes[0];
      else node = nodes;
      if (this._4X) {
        this._X = node;
        return this;
      } else return node;
    },

    isFocusable: function(node, usingFocus) {
      if (this._4X) {
        usingFocus = node;
        node = this._X;
      }
      if (!$A.isDOMNode(node) || $A.isHidden(node) || !$A.isWithin(node))
        return false;
      var tabI = parseInt($A.getAttr(node, "tabindex"));
      return (usingFocus && $A.isNum(tabI)) ||
        (!usingFocus && $A.isNum(tabI) && tabI >= 0) ||
        ($A.isNatActEl(node) && !node.disabled)
        ? true
        : false;
    },

    _setFocus: function(o) {
      if ($A.isDOMNode(o)) {
        if (!$A.isFocusable(o)) $A.setAttr(o, "tabindex", -1);
        o.focus();
      }
      return o;
    },

    _GenDC: function(DCObjects, gImport, parentDC) {
      var wheel = [],
        changeTabs = function(DC, isClose) {
          var dc = wheel[DC.indexVal];
          if ((dc.isTab || dc.isToggle) && dc.toggleClassName) {
            if (isClose && (dc.trigger || dc.triggerObj)) {
              $A.query(dc.trigger || dc.triggerObj, function(i, o) {
                $A.toggleClass(o, dc.toggleClassName, false);
              });
            } else if (dc.trigger || dc.triggerObj) {
              $A.query(dc.trigger || dc.triggerObj, function(i, o) {
                $A.toggleClass(
                  o,
                  dc.toggleClassName,
                  o === dc.triggerObj ? true : false
                );
              });
            }
          }
          return dc;
        },
        parseScripts = function(DC, type, next) {
          var dc = wheel[DC.indexVal],
            toGet = [],
            toRun = [],
            rn = function(typ, isOnce, DC) {
              var ran = "ran" + typ,
                run = "run" + typ;
              if (
                !$A.isFn(DC[run]) &&
                !$A.isStr(DC[run]) &&
                !$A.isArray(DC[run])
              )
                return;
              if (!isOnce || (isOnce && !DC[ran])) {
                if (isOnce && !DC[ran]) DC[ran] = true;
                if ($A.isFn(DC[run])) toRun.push(DC[run]);
                else if ($A.isStr(DC[run])) toGet.push(DC[run]);
                else if ($A.isArray(DC[run]))
                  Array.prototype.push.apply(toGet, DC[run]);
              }
            },
            fns = ["JSOnce" + type, "Once" + type, "JS" + type, type];
          if (dc.reverseJSOrder) fns = fns.reverse();

          var lp = function(mDC) {
            $A.loop(
              fns,
              function(i, f) {
                rn(f, f.indexOf("Once") !== -1, mDC);
              },
              "array"
            );
          };

          lp(dc);
          if (dc.allowCascade) {
            lp(dc.fn.proto);
            lp($A.fn.globalDC);
          }
          if ($A.isFn(next)) toRun.push(next);

          var cont = function() {
            $A.loop(
              toRun,
              function(i, r) {
                r(dc);
              },
              "array"
            );
          };

          if (toGet.length)
            $A.import(toGet, {
              props: {
                DC: dc
              },
              call: function() {
                cont();
              }
            });
          else cont();

          return dc;
        },
        DCR1 = function(DC) {
          var dc = wheel[DC.indexVal];
          if (
            (dc.loaded && !dc.allowReopen && !dc.isToggle) ||
            dc.fn.override ||
            dc.lock ||
            dc.loading ||
            dc.closing
          ) {
            return dc;
          } else if (dc.loaded && (dc.allowReopen || dc.isToggle)) {
            dc.fn.bypass = true;
            closeDC(dc);
            dc.fn.bypass = false;
            if (dc.isToggle) return dc;
          }
          var w = 0,
            wt = null,
            wtA = [];
          if (dc.widgetType && $A._widgetTypes.length) {
            for (w = 0; w < $A._widgetTypes.length; w++) {
              wt = $A.reg.get($A._widgetTypes[w]);
              if (
                wt &&
                wt.autoCloseWidget &&
                wt.loaded &&
                wt.widgetType !== dc.widgetType
              ) {
                wt.fn.bypass = true;
                wt.remove();
                wt.fn.bypass = false;
              }
            }
          }
          if (
            dc.widgetType &&
            dc.autoCloseSameWidget &&
            $A._regWidgets.has(dc.widgetType)
          ) {
            wtA = $A._regWidgets.get(dc.widgetType);
            for (w = 0; w < wtA.length; w++) {
              wt = $A.reg.get(wtA[w]);
              if (wt && wt.loaded) {
                wt.fn.bypass = true;
                wt.remove();
                wt.fn.bypass = false;
              }
            }
          }
          dc.cancel = false;

          dc.fn.baseId = $A.genId();
          dc.outerNodeId = dc.fn.baseId + "ON";
          dc.containerId = dc.fn.baseId + "IN";

          parseScripts(dc, "Before", DCR2);

          return dc;
        },
        DCR2 = function(DC) {
          var dc = wheel[DC.indexVal];

          if (dc.cancel) {
            dc.cancel = dc.loading = false;
            return dc;
          }

          dc.loading = true;

          switch (dc.mode) {
            case 1:
              dc.source = $A.toNode();
              $A.load(
                dc.fetch.url,
                dc.source,
                dc.fetch.data,
                function(content, promise) {
                  if (dc.preloadImages) $A.preloadImg(content);
                  $A.getModule(dc, "onFetch", content);
                  dc.fetch.success(content, promise, dc);
                  DCR3(dc);
                },
                function(errorMsg, promise) {
                  dc.fetch.error(errorMsg, promise, dc);
                }
              );
              break;
            case 2:
              dc.source = $A.toNode();
              $A.get({
                url: dc.fetch.url,
                data: dc.fetch.data,
                success: function(content, promise) {
                  if (dc.preloadImages) $A.preloadImg(content);
                  $A.getModule(dc, "onFetch", content);
                  dc.fetch.success(content, promise, dc);
                  DCR3(dc);
                },
                error: function(errorMsg, promise) {
                  dc.fetch.error(errorMsg, promise, dc);
                }
              });
              break;
            default:
              DCR3(dc);
          }

          return dc;
        },
        DCR3 = function(DC) {
          var dc = wheel[DC.indexVal];

          if (dc.cancel) {
            dc.cancel = dc.loading = false;
            return dc;
          }

          if (dc.importCSS) {
            dc.fn.style = $A.toNode();
            $A.import(dc.importCSS, {}, dc.fn.style);
          }

          if (dc.exposeBounds) dc.sourceOnly = false;

          if (!dc.sourceOnly) {
            dc.outerNode = $A.createEl("div", {
              id: dc.outerNodeId
            });
            dc.container = $A.createEl("div", {
              id: dc.containerId
            });
            dc.outerNode.appendChild(dc.container);
            if ($A.isStr(dc.source) && $A.isMarkup(dc.source))
              $A.insertMarkup(dc.source, dc.container);
            else $A.insert(dc.source, dc.container, null, true);
            var fC = $A.firstChild(dc.container);
            if (fC && fC.hidden) fC.hidden = false;
          } else {
            dc.source = $A.morph(dc.source);
            dc.source = $A._check(dc.source, true);
            dc.outerNode = dc.container = dc.source;
            if (!dc.source.id) dc.source.id = dc.fn.baseId;
            dc.outerNodeId = dc.containerId = dc.source.id;
            if (dc.source.hidden) dc.source.hidden = false;
          }

          var scripts = dc.container.querySelectorAll("script");
          if (scripts.length) {
            $A.loop(
              scripts,
              function(i, s) {
                if (s.src) {
                  if (!$A.isArray(dc.runJSAfter)) dc.runJSAfter = [];
                  dc.runJSAfter.push(s.src);
                } else {
                  if (!$A.isArray(dc.embeddedJS)) dc.embeddedJS = [];
                  dc.embeddedJS.push(
                    new Function("window,document,$A,DC,dc", s.innerHTML)
                  );
                }
                s.parentNode.removeChild(s);
              },
              "array"
            );
          }

          if (dc.fn.style) $A.prepend(dc.fn.style, dc.outerNode);

          if (dc.className) dc.addClass(dc.className);
          if (dc.displayInline)
            $A.css([dc.outerNode, dc.container], "display", "inline");
          if (dc.style) dc.css(dc.style);

          if (dc.exposeBounds) {
            dc.setAttr("role", "region");
          }

          if (
            $A.module[dc.widgetType] &&
            $A.isFn($A.module[dc.widgetType].role)
          )
            dc.setAttr($A.module[dc.widgetType].role(dc));
          if (
            $A.module[dc.widgetType] &&
            $A.isFn($A.module[dc.widgetType].innerRole)
          )
            $A.setAttr(dc.container, $A.module[dc.widgetType].innerRole(dc));

          if (dc.ariaLabelledby && dc.triggerObj) {
            if (!dc.triggerObj.id) dc.triggerObj.id = $A.genId();
            $A.addIdRef(dc.outerNode, "aria-labelledby", dc.triggerObj.id);
          } else if (dc.role) dc.setAttr("aria-label", dc.role);

          if (dc.ariaControls && dc.triggerObj) {
            $A.setAttr(dc.triggerObj, "aria-controls", dc.outerNodeId);
          }

          parseScripts(dc, "During", DCR4);

          return dc;
        },
        DCR4 = function(DC) {
          var dc = wheel[DC.indexVal];

          if (dc.cancel) {
            dc.cancel = dc.loading = false;
            return dc;
          }

          for (var w = 0; w < dc.siblings.length; w++) {
            var sb = dc.siblings[w];
            if (sb.loaded && !sb.allowMultiple) {
              sb.fn.bypass = true;
              sb.remove();
              sb.fn.bypass = false;
            }
          }

          if (!dc.isRendered) {
            if (dc.root) {
              if ($A.isChain(dc.root)) dc.root = dc.root.return();

              if (dc.before) {
                if ($A.isFn(dc.before))
                  dc.before.apply(dc, [dc.outerNode, dc.root]);
                else $A.before(dc.outerNode, dc.root);
              } else if (dc.prepend) {
                if ($A.isFn(dc.prepend))
                  dc.prepend.apply(dc, [dc.outerNode, dc.root]);
                else {
                  try {
                    $A.prepend(dc.outerNode, dc.root);
                  } catch (e) {
                    $A.before(dc.outerNode, dc.root);
                  }
                }
              } else if (dc.append) {
                if ($A.isFn(dc.append))
                  dc.append.apply(dc, [dc.outerNode, dc.root]);
                else {
                  try {
                    $A.append(dc.outerNode, dc.root);
                  } catch (e) {
                    $A.after(dc.outerNode, dc.root);
                  }
                }
              } else if (dc.after) {
                if ($A.isFn(dc.after))
                  dc.after.apply(dc, [dc.outerNode, dc.root]);
                else $A.after(dc.outerNode, dc.root);
              } else {
                $A.insert(dc.outerNode, dc.root, null, true);
              }
            } else if (dc.targetObj)
              $A._insertAfter(dc.outerNode, dc.targetObj);
            else if (dc.triggerObj)
              $A._insertAfter(dc.outerNode, dc.triggerObj);
            dc.isRendered = true;
          }

          if (dc.sourceOnly) dc.source = dc.container.cloneNode(true);
          else dc.source = $A.cloneNodes(dc.container);

          var complete = function() {
            if (dc.autoPosition > 0 && !dc.root && !dc.autoFix)
              $A._calcPosition(dc);
            if (dc.autoFix) {
              sizeAutoFix(dc);
              setAutoFix(dc);
            }
            if (dc.exposeHiddenClose) {
              dc.closeId = dc.fn.baseId + "CL";
              dc.fn.closeLink = $A.createEl(
                "a",
                {
                  id: dc.closeId,
                  href: "#close"
                },
                $A.sraCSS,
                dc.closeClassName
              );
              dc.fn.closeLink.innerHTML = dc.hiddenCloseName;
              $A.append(dc.fn.closeLink, dc.outerNode);
              $A.on(dc.fn.closeLink, {
                click: function(ev) {
                  dc.remove();
                  ev.preventDefault();
                }
              });
              if (dc.displayHiddenClose)
                $A.on(dc.fn.closeLink, {
                  focus: function(ev) {
                    var disableC =
                      $A.isFn(dc.tabOut) && dc.tabOut(ev, dc) ? true : false;
                    if (!disableC) {
                      $A.clearOffScreen(this);
                    }
                  },
                  blur: function(ev) {
                    $A.setOffScreen(this);
                  }
                });
              else $A.setAttr(dc.fn.closeLink, "tabindex", "-1");
            }
            $A.query("." + dc.closeClassName, dc.container, function(i, c) {
              $A.on(c, "click.closeDC", function(ev) {
                dc.remove();
                ev.preventDefault();
              });
            });
            $A.data(dc.outerNode, "DC-O", dc);
            if (dc.escToClose)
              $A.on(dc.outerNode, "keydown", function(ev) {
                var k = $A.keyEvent(ev);
                if (k === 27) {
                  dc.remove();
                  ev.stopPropagation();
                }
              });
            $A.getModule(dc, "onRender", dc.container);
            dc.activeElements = $A.getActEl(dc.container, true);
            if (dc.circularTabbing) $A.setCircTab(dc.activeElements);
            var toBind = {};
            $A.data(dc.id, "DC", dc);
            $A.loop(
              dc.events,
              function(i, e) {
                if ($A.isFn(dc[e])) {
                  toBind[e.toLowerCase().replace(/^on/, "")] = function(ev) {
                    dc[e].apply(dc.outerNode, [ev, dc]);
                  };
                }
              },
              "array"
            );
            $A.on(dc.outerNode, toBind);
            dc.loading = false;
            dc.loaded = true;
            if (dc.isTab || dc.isToggle) changeTabs(dc);
            if ($A.isArray(dc.embeddedJS) && dc.embeddedJS.length) {
              $A.loop(
                dc.embeddedJS,
                function(i, f) {
                  f.call(dc.container, window, document, $A, dc, dc);
                },
                "array"
              );
            }
            parseScripts(dc, "After", function() {
              if (dc.scrollIntoView) {
                if ($A.isFn(dc.scrollIntoView))
                  dc.scrollIntoView.call(dc.container, dc, dc.container);
                else
                  dc.container.scrollIntoView({
                    behavior: "smooth"
                  });
              }
              $A.lastLoaded = dc;
              if (dc.forceFocus) $A.focus(dc.container);
              if (dc.announce) $A.announce(dc.container);
              if ($A.bootstrap) $A.bootstrap(dc.container);
              if ($A.isNum(dc.delayTimeout) && dc.delayTimeout > 0) {
                if (dc.fn.timer) clearTimeout(dc.fn.timer);
                dc.fn.timer = setTimeout(function() {
                  dc.timeout(dc);
                }, dc.delayTimeout);
              }
            });
          };

          if (dc.animate && $A.isFn(dc.animate.onRender)) {
            dc.animate.onRender.call(dc.outerNode, dc, dc.outerNode, complete);
          } else complete();

          return dc;
        },
        closeDC = function(DC) {
          var dc = wheel[DC.indexVal];
          if (!dc.loaded || dc.lock || dc.closing) return dc;
          dc.closing = true;
          dc.cancel = false;

          parseScripts(dc, "BeforeClose", function() {
            if (!dc.loaded || dc.lock || dc.cancel) {
              dc.closing = dc.cancel = false;
              return dc;
            }
            dc.loaded = false;

            var complete = function() {
              $A.getModule(dc, "onRemove", dc.container);
              $A._cleanAll(dc.container, true);
              if (dc.fn.style) $A.remove(dc.fn.style);
              if (dc.fn.closeLink) $A.remove(dc.fn.closeLink);
              if (dc.sourceOnly) {
                if (dc.container.parentNode)
                  dc.source = dc.container.parentNode.removeChild(dc.container);
              } else dc.source = $A.extractNodes(dc.container);
              $A.empty(dc.outerNode, true);
              dc.isRendered = false;
              dc.loaded = dc.fn.override = false;
              if (dc.ariaControls) $A.remAttr(dc.triggerObj, "aria-controls");
              if (dc.isTab || dc.isToggle) changeTabs(dc, true);
              dc.closing = false;
              parseScripts(dc, "AfterClose", function() {
                if (
                  dc.returnFocus &&
                  dc.triggerObj &&
                  !dc.fn.bypass &&
                  !dc.rerouteFocus
                ) {
                  $A.focus(dc.triggerObj);
                } else if (dc.rerouteFocus) {
                  $A.focus(dc.rerouteFocus);
                  dc.rerouteFocus = null;
                }
              });
            };

            if (dc.animate && $A.isFn(dc.animate.onRemove)) {
              dc.animate.onRemove.call(
                dc.outerNode,
                dc,
                dc.outerNode,
                complete
              );
            } else complete();
          });

          return dc;
        },
        unsetTrigger = function(DC) {
          var dc = wheel[DC.indexVal];
          if (!dc.trigger || !dc.on) return dc;
          var events = [];
          if ($A.isPlainObject(dc.on)) {
            $A.loop(
              dc.on,
              function(e, f) {
                events.push(e);
              },
              "object"
            );
          } else if ($A.isStr(dc.on)) {
            events = dc.on.split(/\s+/);
          }
          $A.query(dc.trigger, function(i, o) {
            $A.off(o, events);
          });
          return dc;
        },
        setTrigger = function(DC) {
          var dc = wheel[DC.indexVal];
          unsetTrigger(dc);
          setBindings(dc);
          return dc;
        },
        setAutoFix = function(DC) {
          var dc = wheel[DC.indexVal];
          if (!dc.loading && !dc.loaded) return dc;
          var cs = {
            position: "fixed",
            right: "",
            bottom: "",
            top: "",
            left: ""
          };
          switch (dc.autoFix) {
            case 1:
              cs.top = 0;
              cs.left = "40%";
              break;
            case 2:
              cs.top = 0;
              cs.right = 0;
              break;
            case 3:
              cs.top = "40%";
              cs.right = 0;
              break;
            case 4:
              cs.bottom = 0;
              cs.right = 0;
              break;
            case 5:
              cs.bottom = 0;
              cs.left = "40%";
              break;
            case 6:
              cs.bottom = 0;
              cs.left = 0;
              break;
            case 7:
              cs.top = "40%";
              cs.left = 0;
              break;
            case 8:
              cs.top = 0;
              cs.left = 0;
              break;
            case 9:
              cs.top = "40%";
              cs.left = "40%";
              break;
            default:
              cs = dc.style;
          }
          $A.css(dc.outerNode, cs);
          return dc;
        },
        sizeAutoFix = function(DC) {
          var dc = wheel[DC.indexVal];
          if (!dc.loading && !dc.loaded) return dc;
          var win = $A.getWindow();
          var bodyW = win.width,
            bodyH = win.height,
            aW = $A.elementWidth(dc.outerNode),
            aH = $A.elementHeight(dc.outerNode);
          var npw = 50;
          if (bodyW > aW) npw = parseInt(((aW / bodyW) * 100) / 2, 10);
          var nph = 50;
          if (bodyH > aH) nph = parseInt(((aH / bodyH) * 100) / 2, 10);
          switch (dc.autoFix) {
            case 1:
            case 5:
              $A.css(dc.outerNode, "left", 50 - npw + "%");
              break;
            case 3:
            case 7:
              $A.css(dc.outerNode, "top", 50 - nph + "%");
              break;
            case 9:
              $A.css(dc.outerNode, {
                left: 50 - npw + "%",
                top: 50 - nph + "%"
              });
              break;
            default:
          }
          if (
            dc.offsetTop < 0 ||
            dc.offsetTop > 0 ||
            dc.offsetLeft < 0 ||
            dc.offsetLeft > 0
          ) {
            var cs = $A.offset(dc.outerNode);
            cs.top += dc.offsetTop;
            cs.left += dc.offsetLeft;
            $A.css(dc.outerNode, cs);
          }
          return dc;
        },
        setBindings = function(dc) {
          var dc = wheel[DC.indexVal];
          $A.data(dc.id, "DC-ON", true);
          if (dc.trigger)
            $A.query(dc.trigger, function(i, o) {
              if (!dc.triggerObj) dc.triggerObj = o;
              $A.data(o, "DC", dc);
              $A.data(o, "DC-ON", true);
              if (dc.on) {
                if ($A.isStr(dc.on)) {
                  $A.on(o, dc.on, function(ev, DC) {
                    DC.render();
                    ev.preventDefault();
                  });
                  if (dc.on === "click") $A.setKBA11Y(o, "button");
                } else if ($A.isPlainObject(dc.on)) {
                  $A.on(o, dc.on);
                }
              }
              if (dc.escToClose)
                $A.on(o, "keydown", function(ev) {
                  var k = $A.keyEvent(ev);
                  if (k === 27) {
                    dc.remove();
                    ev.stopPropagation();
                  }
                });
            });
          return dc;
        },
        DCInit = function(dc) {
          if ($A.reg.has(dc.id)) {
            $A.destroy(dc.id);
          }
          var f = function() {};
          f.prototype = dc;
          var nDC = new f();
          nDC.props.DC = nDC.DC = nDC;
          $A.lastCreated.push(nDC);
          if (nDC.widgetType && nDC.autoCloseWidget) {
            $A._widgetTypes.push(nDC.id);
          }
          if (nDC.widgetType && nDC.autoCloseSameWidget) {
            if (!$A._regWidgets.has(nDC.widgetType))
              $A._regWidgets.set(nDC.widgetType, []);
            $A._regWidgets.get(nDC.widgetType).push(nDC.id);
          }
          $A.reg.set(nDC.id, nDC);
          return nDC;
        },
        render = [],
        svs = [
          "runJSOnceBefore",
          "runOnceBefore",
          "runJSBefore",
          "runBefore",
          "runJSOnceDuring",
          "runOnceDuring",
          "runJSDuring",
          "runDuring",
          "runJSOnceAfter",
          "runOnceAfter",
          "runJSAfter",
          "runAfter",
          "runJSOnceBeforeClose",
          "runOnceBeforeClose",
          "runJSBeforeClose",
          "runBeforeClose",
          "runJSOnceAfterClose",
          "runOnceAfterClose",
          "runJSAfterClose",
          "runAfterClose"
        ];

      var a = 0,
        s = 0;

      for (a = 0; a < DCObjects.length; a++) {
        var dc = {
            //            id: "",
            //            role: "",
            //            loaded: false,

            fn: {
              isDCI: true
            },
            props: {},

            setOffScreen: function() {
              var dc = this;
              $A.setOffScreen(dc.outerNode);
              return dc;
            },

            clearOffScreen: function() {
              var dc = this;
              $A.clearOffScreen(dc.outerNode);
              return dc;
            },

            hasDC: function() {
              return true;
            },

            getDC: function() {
              return this;
            },

            offset: function(forceAbsolute, forceRelative, returnTopLeftOnly) {
              var dc = this;
              return $A.offset(
                dc.outerNode,
                forceAbsolute,
                forceRelative,
                returnTopLeftOnly
              );
            },

            //            trigger: "",
            setTrigger: function(dc) {
              var dc = dc || this;
              if (!dc.trigger || !dc.on) {
                return dc;
              }
              return setTrigger(dc);
            },
            unsetTrigger: function(dc) {
              var dc = dc || this;
              if (!dc.trigger || !dc.on) return dc;
              return unsetTrigger(dc);
            },
            //            targetObj: null,

            hiddenCloseName: "Close",
            //            exposeHiddenClose: false,
            displayHiddenClose: true,
            //            exposeBounds: false,

            query: function(sel, con, call) {
              var dc = this;
              call = con;
              con = dc.container;
              return $A.query(sel, con, call);
            },

            //            source: "",
            sourceOnly: true,

            //            on: "",
            //            displayInline: false,

            //            widgetType: "",
            //            autoCloseWidget: false,
            //            autoCloseSameWidget: false,

            allowCascade: true,
            // reverseJSOrder: false,

            /*
            runJSOnceBefore: [],
            runOnceBefore: function(dc) {},
            runJSBefore: [],
            runBefore: function(dc) {},
            runJSOnceDuring: [],
            runOnceDuring: function(dc) {},
            runJSDuring: [],
            runDuring: function(dc) {},
            runJSOnceAfter: [],
            runOnceAfter: function(dc) {},
            runJSAfter: [],
            runAfter: function(dc) {},
            runJSOnceBeforeClose: [],
            runOnceBeforeClose: function(dc) {},
            runJSBeforeClose: [],
            runBeforeClose: function(dc) {},
            runJSOnceAfterClose: [],
            runOnceAfterClose: function(dc) {},
            runJSAfterClose: [],
            runAfterClose: function(dc) {},
            runBeforeDestroy: function(dc) {},
*/

            destroy: function(p) {
              var dc = this;
              setTimeout(function() {
                $A.destroy(dc, p);
              }, 1);
              return true;
            },

            getAttr: function(n) {
              var dc = this;
              return $A.getAttr(dc.outerNode, n);
            },
            hasAttr: function(n) {
              var dc = this;
              return $A.hasAttr(dc.outerNode, n);
            },
            remAttr: function(n) {
              var dc = this;
              $A.remAttr(dc.outerNode, n);
              return dc;
            },
            setAttr: function(n, v) {
              var dc = this;
              $A.setAttr(dc.outerNode, n, v);
              return dc;
            },

            hasClass: function(cn) {
              var dc = this;
              return $A.hasClass(dc.outerNode, cn);
            },

            addClass: function(cn) {
              var dc = this;
              $A.addClass(dc.outerNode, cn);
              return dc;
            },

            remClass: function(cn) {
              var dc = this;
              $A.remClass(dc.outerNode, cn);
              return dc;
            },

            toggleClass: function(cn, isTrue, fn) {
              var dc = this;
              $A.toggleClass(dc.outerNode, cn, isTrue, fn);
              return dc;
            },

            focus: function() {
              var dc = this;
              if (dc.loaded) {
                $A.focus(dc.container);
              }
              return dc;
            },

            allowMultiple: false,
            //            allowReopen: false,
            //            isToggle: false,
            //            toggleClassName: "",
            //            forceFocus: false,
            returnFocus: true,

            //            root: "",
            //            before: false,
            //            prepend: false,
            //            append: false,
            //            after: false,

            //            isTab: false,
            //            autoRender: false,
            //            lock: false,
            //            mode: 0,

            //            announce: false,
            speak: function(alert) {
              var dc = this;
              $A.announce(dc.container, false, alert);
              return dc;
            },

            load: function(url, data, sCb) {
              var dc = this;
              if ($A.isFn(data)) {
                sCb = data;
                data = null;
              }
              $A.load(url, dc.container, data, sCb);
              return dc;
            },

            fetch: {
              url: "",
              data: {
                returnType: "html"
              },
              success: function(content, promise, dc) {
                dc.source = content;
                return dc;
              },
              error: function(errorMsg, promise, dc) {
                dc.error = errorMsg;
                return dc;
              }
            },

            isFocusWithin: function(dc) {
              var dc = dc || this;
              return $A.isFocusWithin(dc.container);
            },

            render: function(dc) {
              var dc = dc || this;
              if ($A.isNum(dc.delay) && dc.delay > 0) {
                if (dc.fn.Delay) clearTimeout(dc.fn.Delay);
                dc.fn.Delay = setTimeout(function() {
                  DCR1(dc);
                }, dc.delay);
              } else DCR1(dc);
              return dc;
            },

            setProps: function(conf) {
              var dc = this;
              $A.extend(true, dc.props, conf || {});
              dc.props.DC = dc;
              return dc;
            },

            insert: function(node) {
              var dc = this;
              $A.insert(node, dc.container);
              return dc;
            },

            prependWithin: function(node) {
              var dc = this;
              $A.prepend(node, dc.container);
              return dc;
            },

            appendWithin: function(node) {
              var dc = this;
              $A.append(node, dc.container);
              return dc;
            },

            openWithin: function(node, conf) {
              var dc = this;
              dc.before = dc.prepend = dc.append = dc.after = false;
              $A.extend(
                dc,
                {
                  root: node
                },
                conf || {}
              );
              dc.reopen();
              return dc;
            },

            insertBefore: function(node, conf) {
              var dc = this;
              dc.before = dc.prepend = dc.append = dc.after = false;
              $A.extend(
                dc,
                {
                  root: node,
                  before: true
                },
                conf || {}
              );
              dc.reopen();
              return dc;
            },

            prependTo: function(node, conf) {
              var dc = this;
              dc.before = dc.prepend = dc.append = dc.after = false;
              $A.extend(
                dc,
                {
                  root: node,
                  prepend: true
                },
                conf || {}
              );
              dc.reopen();
              return dc;
            },

            appendTo: function(node, conf) {
              var dc = this;
              dc.before = dc.prepend = dc.append = dc.after = false;
              $A.extend(
                dc,
                {
                  root: node,
                  append: true
                },
                conf || {}
              );
              dc.reopen();
              return dc;
            },

            insertAfter: function(node, conf) {
              var dc = this;
              dc.before = dc.prepend = dc.append = dc.after = false;
              $A.extend(
                dc,
                {
                  root: node,
                  after: true
                },
                conf || {}
              );
              dc.reopen();
              return dc;
            },

            reopen: function(dc) {
              var dc = dc || this;
              dc.remove().render();
              return dc;
            },

            remove: function(dc) {
              var dc = dc || this;
              return closeDC(dc);
            },

            events: [
              "mouseOver",
              "mouseOut",
              "resize",
              "scroll",
              "click",
              "dblClick",
              "mouseDown",
              "mouseUp",
              "mouseMove",
              "mouseEnter",
              "mouseLeave",
              "keyDown",
              "keyPress",
              "keyUp",
              "error",
              "focusIn",
              "focusOut",
              "onRemove"
            ],

            /*
// Index of events plus returned arguments when set withinDC objects
mouseOver: function(ev, dc){ },
mouseOut: function(ev, dc){ },
resize: function(ev, dc){ },
scroll: function(ev, dc){ },
click: function(ev, dc){ },
dblClick: function(ev, dc){ },
mouseDown: function(ev, dc){ },
mouseUp: function(ev, dc){ },
mouseMove: function(ev, dc){ },
mouseEnter: function(ev, dc){ },
mouseLeave: function(ev, dc){ },
keyDown: function(ev, dc){ },
keyPress: function(ev, dc){ },
keyUp: function(ev, dc){ },
error: function(ev, dc){ },
focusIn: function(ev, dc){ },
focusOut: function(ev, dc){ },
onRemove: function(mutationRecordObject, dc){ },
*/

            //            tabOut: function(ev, dc) {},
            //            delayTimeout: 0,
            timeout: function(dc) {
              dc.remove();
              return dc;
            },

            // escToClose: false,
            //            className: "",
            closeClassName: "CloseDC",
            style: {},
            //            importCSS: "",
            css: function(prop, val, mergeCSS) {
              var dc = this;
              if ($A.isBool(val)) {
                mergeCSS = val;
                val = null;
              }
              if ($A.isStr(prop) && !$A.isStr(val) && !$A.isNum(val)) {
                return $A.css(dc.outerNode, prop);
              } else if (prop && $A.isStr(prop) && mergeCSS) {
                dc.style[prop] = val;
              } else if (prop && typeof prop === "object" && mergeCSS) {
                $A.extend(dc.style, prop);
              }
              $A.css(dc.outerNode, prop, val);
              return dc;
            },

            map: function(o, extend) {
              var dc = this;
              if (!o) o = {};

              var inList = function(DC, dcA) {
                for (var i = 0; i < dcA.length; i++) {
                  if (dcA[i].id === DC.id) {
                    return true;
                  }
                }
                return false;
              };

              if ($A.isDC(o.parent)) {
                dc.parent = o.parent;
              }

              if ($A.isArray(o.children)) {
                if (!extend) dc.children = [];
                for (var i = 0; i < o.children.length; i++) {
                  if ($A.isDC(o.children[i])) {
                    o.children[i].parent = dc;
                    if (!inList(o.children[i], dc.children))
                      dc.children.push(o.children[i]);
                  }
                }
              }

              if ($A.isArray(o.siblings)) {
                if (!extend) dc.siblings = [dc];
                for (var i = 0; i < o.siblings.length; i++) {
                  if ($A.isDC(o.siblings[i])) {
                    if (!inList(o.siblings[i], dc.siblings))
                      dc.siblings.push(o.siblings[i]);
                  }
                }
              }

              dc.top = dc;
              var p = dc.parent;
              while (
                $A.isDC(p) &&
                (!dc.widgetType || dc.widgetType === p.widgetType)
              ) {
                dc.top = p;
                p = p.parent;
              }

              if (dc.parent && !extend) dc.parent.children = [];
              for (var x = 0; x < dc.siblings.length; x++) {
                var DCX = dc.siblings[x];
                if ($A.isDC(DCX)) {
                  DCX.parent = dc.parent;
                  DCX.siblings = dc.siblings;
                  if (dc.parent && !inList(DCX, dc.parent.children))
                    dc.parent.children.push(DCX);
                }
              }

              var setTop = function(a) {
                for (var i = 0; i < a.length; i++) {
                  if ($A.isDC(a[i]) && a[i].children.length) {
                    for (var x = 0; x < a[i].children.length; x++) {
                      var DCX = a[i].children[x];
                      if ($A.isDC(DCX)) {
                        setTop(DCX.siblings);
                      }
                    }
                  }
                  if ($A.isDC(a[i])) a[i].top = dc.top;
                }
              };
              setTop(dc.siblings);

              return dc;
            },

            children: [],
            siblings: [],
            //            parent: null,
            //            top: null,

            //            autoPosition: 0,
            //            offsetTop: 0,
            //            offsetLeft: 0,
            //            posAnchor: null,

            setPosition: function(obj, posVal, save) {
              var dc = this;
              if ($A.isNum(obj)) {
                save = posVal;
                posVal = obj;
                obj = null;
              }
              if (save) {
                dc.posAnchor = obj || dc.posAnchor;
                dc.autoPosition = posVal || dc.autoPosition;
              }
              $A._calcPosition(dc, obj, posVal);
              return dc;
            },

            setFix: function(posVal, save) {
              var dc = this;
              if (save) {
                dc.autoFix = posVal || dc.autoFix;
              }
              setAutoFix(dc);
              if (posVal > 0) sizeAutoFix(dc);
              return dc;
            }
          },
          aO = DCObjects[a],
          gImport = gImport || {},
          gO = {},
          iO = {};

        $A.extend(dc, {
          getAttribute: dc["getAttr"],
          hasAttribute: dc["hasAttr"],
          removeAttribute: dc["remAttr"],
          setAttribute: dc["setAttr"],
          removeClass: dc["remClass"]
        });

        if (!$A.isBool(aO.allowCascade)) {
          if ($A.isBool(gImport.allowCascade))
            aO.allowCascade = gImport.allowCascade;
          else if ($A.isBool($A.fn.globalDC.allowCascade))
            aO.allowCascade = $A.fn.globalDC.allowCascade;
          else aO.allowCascade = false;
        }

        if (aO.allowCascade) {
          for (s = 0; s < svs.length; s++) {
            gO[svs[s]] = $A.fn.globalDC[svs[s]];
            iO[svs[s]] = gImport[svs[s]];
          }
        }

        if (
          $A.module[aO.widgetType] &&
          $A.isFn($A.module[aO.widgetType].configure)
        )
          $A.extend(true, dc, $A.module[aO.widgetType].configure(aO) || {});

        $A.extend(true, dc, $A.fn.globalDC);

        $A.extend(true, dc, gImport);

        $A.extend(true, dc, aO);

        if (dc.allowCascade) {
          for (s = 0; s < svs.length; s++) {
            $A.fn.globalDC[svs[s]] = gO[svs[s]];
          }
          dc.fn.proto = iO;
        }

        if (dc.id) {
          dc.indexVal = wheel.length;
          wheel[dc.indexVal] = DCInit(dc);
          var DC = wheel[dc.indexVal];
          if ($A.isDC(DC)) {
            setBindings(DC);
            if (DC.autoRender) render.push(DC);

            if ($A.isDC(parentDC)) {
              var chk = -1,
                p = parentDC,
                c = DC;
              for (var i = 0; i < p.children.length; i++) {
                if (c.id === p.children[i].id) chk = i;
              }
              if (chk >= 0) p.children.slice(chk, 1, c);
              else p.children.push(c);
              c.parent = p;
              var t = c;
              while (t.parent) t = t.parent;
              c.top = t;
            } else DC.top = DC;

            if (DC.onCreate && $A.isFn(DC.onCreate)) {
              DC.onCreate.apply(DC, [DC]);
            }
          }
        }
      }

      for (a = 0; a < wheel.length; a++) wheel[a].siblings = wheel;

      for (s = 0; s < render.length; s++) {
        var dc = render[s];
        dc.render();
      }

      return wheel;
    }
  });

  $A.extend({
    // Expanded variable method names for alternative usage
    isFunction: $A["isFn"],
    isString: $A["isStr"],
    isNumber: $A["isNum"],
    isBoolean: $A["isBool"],
    getElement: $A["getEl"],
    createElement: $A["createEl"],
    getAttribute: $A["getAttr"],
    hasAttribute: $A["hasAttr"],
    removeAttribute: $A["remAttr"],
    setAttribute: $A["setAttr"],
    previousSibling: $A["prevSibling"],
    previous: $A["prevSibling"],
    next: $A["nextSibling"],
    first: $A["firstChild"],
    last: $A["lastChild"],
    parent: $A["closestParent"],
    removeClass: $A["remClass"],
    addIdReference: $A["addIdRef"],
    removeIdReference: $A["remIdRef"],
    preloadImages: $A["preloadImg"],
    setCircularTabbing: $A["setCircTab"],
    isNativeActiveElement: $A["isNatActEl"],
    getActiveElements: $A["getActEl"],
    setKeyboardA11Y: $A["setKBA11Y"],
    generateId: $A["genId"],
    toTextNode: $A["toText"]
  });

  var announceString = function(strm, noRep, aggr, loop) {
    var str = strm;
    if (!arguments.length || $A.isBool(str)) {
      loop = aggr;
      aggr = noRep;
      noRep = str;
      strm = this;
      str = strm;
    }
    if ($A.isNum(str)) {
      str = str.toString();
    } else if (str && str.nodeType) {
      str = $A.getText(str);
    }
    if (str && $A.isStr(str)) {
      var uA = function() {
        if (stringAnnounce.loaded) {
          if (
            !stringAnnounce.liveRendered &&
            !aggr &&
            stringAnnounce.placeHolder
          ) {
            stringAnnounce.liveRendered = true;
            document.body.appendChild(stringAnnounce.placeHolder);
          }
          if (
            !stringAnnounce.alertRendered &&
            aggr &&
            stringAnnounce.placeHolder2
          ) {
            stringAnnounce.alertRendered = true;
            document.body.appendChild(stringAnnounce.placeHolder2);
          }
        }
        if (!loop && $A.inArray(str, stringAnnounce.alertMsgs) === -1)
          stringAnnounce.alertMsgs.push(str);
        if (stringAnnounce.alertMsgs.length === 1 || loop) {
          var timeLength =
            stringAnnounce.baseDelay +
            stringAnnounce.iterate(
              stringAnnounce.alertMsgs[0],
              /\s|,|\.|:|;|!|\(|\)|\/|\?|@|#|\$|%|\^|&|\*|\\|-|_|\+|=/g
            ) *
              stringAnnounce.charMultiplier;
          if (
            !(noRep && stringAnnounce.lastMsg === stringAnnounce.alertMsgs[0])
          ) {
            stringAnnounce.lastMsg = stringAnnounce.alertMsgs[0];
            if (aggr)
              $A.insertMarkup(
                stringAnnounce.alertMsgs[0],
                stringAnnounce.placeHolder2
              );
            else
              $A.insertMarkup(
                stringAnnounce.alertMsgs[0],
                stringAnnounce.placeHolder
              );
          }
          stringAnnounce.alertTO = setTimeout(function() {
            $A.insertMarkup("", stringAnnounce.placeHolder);
            $A.insertMarkup("", stringAnnounce.placeHolder2);
            stringAnnounce.alertMsgs.shift();
            if (stringAnnounce.alertMsgs.length >= 1)
              announceString(stringAnnounce.alertMsgs[0], noRep, aggr, true);
          }, timeLength);
        }
      };
      if (!$A.isDocLoaded)
        $A.on("load", function() {
          uA();
        });
      else uA();
    }
    return strm;
  };

  String.prototype.announce = announceString;

  var stringAnnounce = {
    alertMsgs: [],
    clear: function() {
      if (this.alertTO) clearTimeout(this.alertTO);
      this.alertMsgs = [];
    },
    baseDelay: 500,
    charMultiplier: 1,
    lastMsg: "",
    iterate: function(str, regExp) {
      var iCount = 0;
      str.replace(regExp, function() {
        iCount++;
      });
      return iCount;
    },
    loaded: false,
    liveRendered: false,
    alertRendered: false
  };

  $A.on(document, {
    touchstart: function() {
      if (!$A.isTouch) {
        $A.isTouch = true;
        $A.event.fire(document, "touchchange");
      }
    },
    keyup: function() {
      if ($A.isTouch) {
        $A.isTouch = false;
        $A.event.fire(document, "touchchange");
      }
    }
  });
  $A.on(window, {
    DOMContentLoaded: function() {
      $A.isDOMContentLoaded = true;
    },
    load: function() {
      $A.isDocLoaded = true;
      if (!stringAnnounce.placeHolder) {
        stringAnnounce.placeHolder = $A.createEl(
          "div",
          {
            "aria-live": "polite"
          },
          $A.sraCSS
        );
        stringAnnounce.placeHolder2 = $A.createEl(
          "div",
          {
            role: "alert"
          },
          $A.sraCSS
        );
      }
      stringAnnounce.loaded = true;

      $A.on(document.body, "mouseover.MouseCoordTracker", function(e) {
        $A.event.pointer = e;
      });
    }
  });

  if ("Import4X" in window && window.Import4X.length) {
    $A.import(window.Import4X);
  }

  (function() {
    var scripts = document.querySelectorAll("script[src]"),
      path = scripts[scripts.length - 1].src.replace(/\/|\\|<|>/g, "") || "",
      x = path.indexOf("#"),
      ext = x !== -1 ? path.slice(x + 1) : "",
      mods = ext ? ext.split(",") : [];
    if (mods.length) $A.import(mods);
  })();

  window[window.Namespace4X ? window.Namespace4X : "$A"] = $A;
})(
  (function() {
    /*@! Dependencies */

    (function() {
      /*@! Promise */
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined"
          ? factory()
          : typeof define === "function" && define.amd
          ? define(factory)
          : factory();
      })(this, function() {
        "use strict";

        /**
         * @this {Promise}
         */
        function finallyConstructor(callback) {
          var constructor = this.constructor;
          return this.then(
            function(value) {
              // @ts-ignore
              return constructor.resolve(callback()).then(function() {
                return value;
              });
            },
            function(reason) {
              // @ts-ignore
              return constructor.resolve(callback()).then(function() {
                // @ts-ignore
                return constructor.reject(reason);
              });
            }
          );
        }

        // Store setTimeout reference so promise-polyfill will be unaffected by
        // other code modifying setTimeout (like sinon.useFakeTimers())
        var setTimeoutFunc = setTimeout;

        function isArray(x) {
          return Boolean(x && typeof x.length !== "undefined");
        }

        function noop() {}

        // Polyfill for Function.prototype.bind
        function bind(fn, thisArg) {
          return function() {
            fn.apply(thisArg, arguments);
          };
        }

        /**
         * @constructor
         * @param {Function} fn
         */
        function Promise(fn) {
          if (!(this instanceof Promise))
            throw new TypeError("Promises must be constructed via new");
          if (typeof fn !== "function") throw new TypeError("not a function");
          /** @type {!number} */
          this._state = 0;
          /** @type {!boolean} */
          this._handled = false;
          /** @type {Promise|undefined} */
          this._value = undefined;
          /** @type {!Array<!Function>} */
          this._deferreds = [];

          doResolve(fn, this);
        }

        function handle(self, deferred) {
          while (self._state === 3) {
            self = self._value;
          }
          if (self._state === 0) {
            self._deferreds.push(deferred);
            return;
          }
          self._handled = true;
          Promise._immediateFn(function() {
            var cb =
              self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
              (self._state === 1 ? resolve : reject)(
                deferred.promise,
                self._value
              );
              return;
            }
            var ret;
            try {
              ret = cb(self._value);
            } catch (e) {
              reject(deferred.promise, e);
              return;
            }
            resolve(deferred.promise, ret);
          });
        }

        function resolve(self, newValue) {
          try {
            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if (newValue === self)
              throw new TypeError("A promise cannot be resolved with itself.");
            if (
              newValue &&
              (typeof newValue === "object" || typeof newValue === "function")
            ) {
              var then = newValue.then;
              if (newValue instanceof Promise) {
                self._state = 3;
                self._value = newValue;
                finale(self);
                return;
              } else if (typeof then === "function") {
                doResolve(bind(then, newValue), self);
                return;
              }
            }
            self._state = 1;
            self._value = newValue;
            finale(self);
          } catch (e) {
            reject(self, e);
          }
        }

        function reject(self, newValue) {
          self._state = 2;
          self._value = newValue;
          finale(self);
        }

        function finale(self) {
          if (self._state === 2 && self._deferreds.length === 0) {
            Promise._immediateFn(function() {
              if (!self._handled) {
                Promise._unhandledRejectionFn(self._value);
              }
            });
          }

          for (var i = 0, len = self._deferreds.length; i < len; i++) {
            handle(self, self._deferreds[i]);
          }
          self._deferreds = null;
        }

        /**
         * @constructor
         */
        function Handler(onFulfilled, onRejected, promise) {
          this.onFulfilled =
            typeof onFulfilled === "function" ? onFulfilled : null;
          this.onRejected =
            typeof onRejected === "function" ? onRejected : null;
          this.promise = promise;
        }

        /**
         * Take a potentially misbehaving resolver function and make sure
         * onFulfilled and onRejected are only called once.
         *
         * Makes no guarantees about asynchrony.
         */
        function doResolve(fn, self) {
          var done = false;
          try {
            fn(
              function(value) {
                if (done) return;
                done = true;
                resolve(self, value);
              },
              function(reason) {
                if (done) return;
                done = true;
                reject(self, reason);
              }
            );
          } catch (ex) {
            if (done) return;
            done = true;
            reject(self, ex);
          }
        }

        Promise.prototype["catch"] = function(onRejected) {
          return this.then(null, onRejected);
        };

        Promise.prototype.then = function(onFulfilled, onRejected) {
          // @ts-ignore
          var prom = new this.constructor(noop);

          handle(this, new Handler(onFulfilled, onRejected, prom));
          return prom;
        };

        Promise.prototype["finally"] = finallyConstructor;

        Promise.all = function(arr) {
          return new Promise(function(resolve, reject) {
            if (!isArray(arr)) {
              return reject(new TypeError("Promise.all accepts an array"));
            }

            var args = Array.prototype.slice.call(arr);
            if (args.length === 0) return resolve([]);
            var remaining = args.length;

            function res(i, val) {
              try {
                if (
                  val &&
                  (typeof val === "object" || typeof val === "function")
                ) {
                  var then = val.then;
                  if (typeof then === "function") {
                    then.call(
                      val,
                      function(val) {
                        res(i, val);
                      },
                      reject
                    );
                    return;
                  }
                }
                args[i] = val;
                if (--remaining === 0) {
                  resolve(args);
                }
              } catch (ex) {
                reject(ex);
              }
            }

            for (var i = 0; i < args.length; i++) {
              res(i, args[i]);
            }
          });
        };

        Promise.resolve = function(value) {
          if (
            value &&
            typeof value === "object" &&
            value.constructor === Promise
          ) {
            return value;
          }

          return new Promise(function(resolve) {
            resolve(value);
          });
        };

        Promise.reject = function(value) {
          return new Promise(function(resolve, reject) {
            reject(value);
          });
        };

        Promise.race = function(arr) {
          return new Promise(function(resolve, reject) {
            if (!isArray(arr)) {
              return reject(new TypeError("Promise.race accepts an array"));
            }

            for (var i = 0, len = arr.length; i < len; i++) {
              Promise.resolve(arr[i]).then(resolve, reject);
            }
          });
        };

        // Use polyfill for setImmediate for performance gains
        Promise._immediateFn =
          // @ts-ignore
          (typeof setImmediate === "function" &&
            function(fn) {
              // @ts-ignore
              setImmediate(fn);
            }) ||
          function(fn) {
            setTimeoutFunc(fn, 0);
          };

        Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
          if (typeof console !== "undefined" && console) {
            console.warn("Possible Unhandled Promise Rejection:", err); // eslint-disable-line no-console
          }
        };

        /** @suppress {undefinedVars} */
        var globalNS = (function() {
          // the only reliable means to get the global object is
          // `Function('return this')()`
          // However, this causes CSP violations in Chrome apps.
          if (typeof self !== "undefined") {
            return self;
          }
          if (typeof window !== "undefined") {
            return window;
          }
          if (typeof global !== "undefined") {
            return global;
          }
          throw new Error("unable to locate global object");
        })();

        if (typeof globalNS["Promise"] !== "function") {
          globalNS["Promise"] = Promise;
        } else if (!globalNS.Promise.prototype["finally"]) {
          globalNS.Promise.prototype["finally"] = finallyConstructor;
        }
      });
    })();

    (function() {
      /*@! Fetch */
      var support = {
        searchParams: "URLSearchParams" in self,
        iterable: "Symbol" in self && "iterator" in Symbol,
        blob:
          "FileReader" in self &&
          "Blob" in self &&
          (function() {
            try {
              new Blob();
              return true;
            } catch (e) {
              return false;
            }
          })(),
        formData: "FormData" in self,
        arrayBuffer: "ArrayBuffer" in self
      };

      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj);
      }

      if (support.arrayBuffer) {
        var viewClasses = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ];

        var isArrayBufferView =
          ArrayBuffer.isView ||
          function(obj) {
            return (
              obj &&
              viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
            );
          };
      }

      function normalizeName(name) {
        if (typeof name !== "string") {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") {
          throw new TypeError("Invalid character in header field name");
        }
        return name.toLowerCase();
      }

      function normalizeValue(value) {
        if (typeof value !== "string") {
          value = String(value);
        }
        return value;
      }

      // Build a destructive iterator for the value list
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return { done: value === undefined, value: value };
          }
        };

        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }

        return iterator;
      }

      function Headers(headers) {
        this.map = {};

        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }

      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ", " + value : value;
      };

      Headers.prototype["delete"] = function(name) {
        delete this.map[normalizeName(name)];
      };

      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
      };

      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name));
      };

      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };

      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };

      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items);
      };

      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items);
      };

      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items);
      };

      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }

      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError("Already read"));
        }
        body.bodyUsed = true;
      }

      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        });
      }

      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
      }

      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise;
      }

      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);

        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join("");
      }

      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0);
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer;
        }
      }

      function Body() {
        this.bodyUsed = false;

        this._initBody = function(body) {
          /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
          this.bodyUsed = this.bodyUsed;
          this._bodyInit = body;
          if (!body) {
            this._bodyText = "";
          } else if (typeof body === "string") {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (
            support.formData &&
            FormData.prototype.isPrototypeOf(body)
          ) {
            this._bodyFormData = body;
          } else if (
            support.searchParams &&
            URLSearchParams.prototype.isPrototypeOf(body)
          ) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            // IE 10-11 can't handle a DataView body.
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (
            support.arrayBuffer &&
            (ArrayBuffer.prototype.isPrototypeOf(body) ||
              isArrayBufferView(body))
          ) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }

          if (!this.headers.get("content-type")) {
            if (typeof body === "string") {
              this.headers.set("content-type", "text/plain;charset=UTF-8");
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set("content-type", this._bodyBlob.type);
            } else if (
              support.searchParams &&
              URLSearchParams.prototype.isPrototypeOf(body)
            ) {
              this.headers.set(
                "content-type",
                "application/x-www-form-urlencoded;charset=UTF-8"
              );
            }
          }
        };

        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }

            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as blob");
            } else {
              return Promise.resolve(new Blob([this._bodyText]));
            }
          };

          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
            } else {
              return this.blob().then(readBlobAsArrayBuffer);
            }
          };
        }

        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }

          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob);
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(
              readArrayBufferAsText(this._bodyArrayBuffer)
            );
          } else if (this._bodyFormData) {
            throw new Error("could not read FormData body as text");
          } else {
            return Promise.resolve(this._bodyText);
          }
        };

        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode);
          };
        }

        this.json = function() {
          return this.text().then(JSON.parse);
        };

        return this;
      }

      // HTTP methods whose capitalization should be normalized
      var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];

      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method;
      }

      function Request(input, options) {
        options = options || {};
        var body = options.body;

        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError("Already read");
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit !== null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }

        this.credentials =
          options.credentials || this.credentials || "same-origin";
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || "GET");
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;

        if ((this.method === "GET" || this.method === "HEAD") && body) {
          throw new TypeError("Body not allowed for GET or HEAD requests");
        }
        this._initBody(body);
      }

      Request.prototype.clone = function() {
        return new Request(this, { body: this._bodyInit });
      };

      function decode(body) {
        var form = new FormData();
        body
          .trim()
          .split("&")
          .forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split("=");
              var name = split.shift().replace(/\+/g, " ");
              var value = split.join("=").replace(/\+/g, " ");
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
        return form;
      }

      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(":");
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(":").trim();
            headers.append(key, value);
          }
        });
        return headers;
      }

      Body.call(Request.prototype);

      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }

        this.type = "default";
        this.status = options.status === undefined ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = "statusText" in options ? options.statusText : "";
        this.headers = new Headers(options.headers);
        this.url = options.url || "";
        this._initBody(bodyInit);
      }

      Body.call(Response.prototype);

      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        });
      };

      Response.error = function() {
        var response = new Response(null, { status: 0, statusText: "" });
        response.type = "error";
        return response;
      };

      var redirectStatuses = [301, 302, 303, 307, 308];

      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError("Invalid status code");
        }

        return new Response(null, {
          status: status,
          headers: { location: url }
        });
      };

      var DOMException = self.DOMException;
      try {
        new DOMException();
      } catch (err) {
        DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        DOMException.prototype = Object.create(Error.prototype);
        DOMException.prototype.constructor = DOMException;
      }

      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);

          if (request.signal && request.signal.aborted) {
            return reject(new DOMException("Aborted", "AbortError"));
          }

          var xhr = new XMLHttpRequest();

          function abortXhr() {
            xhr.abort();
          }

          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || "")
            };
            options.url =
              "responseURL" in xhr
                ? xhr.responseURL
                : options.headers.get("X-Request-URL");
            var body = "response" in xhr ? xhr.response : xhr.responseText;
            setTimeout(function() {
              resolve(new Response(body, options));
            }, 0);
          };

          xhr.onerror = function() {
            setTimeout(function() {
              reject(new TypeError("Network request failed"));
            }, 0);
          };

          xhr.ontimeout = function() {
            setTimeout(function() {
              reject(new TypeError("Network request failed"));
            }, 0);
          };

          xhr.onabort = function() {
            setTimeout(function() {
              reject(new DOMException("Aborted", "AbortError"));
            }, 0);
          };

          function fixUrl(url) {
            try {
              return url === "" && self.location.href
                ? self.location.href
                : url;
            } catch (e) {
              return url;
            }
          }

          xhr.open(request.method, fixUrl(request.url), true);

          if (request.credentials === "include") {
            xhr.withCredentials = true;
          } else if (request.credentials === "omit") {
            xhr.withCredentials = false;
          }

          if ("responseType" in xhr) {
            if (support.blob) {
              xhr.responseType = "blob";
            } else if (
              support.arrayBuffer &&
              request.headers
                .get("Content-Type")
                .indexOf("application/octet-stream") !== -1
            ) {
              xhr.responseType = "arraybuffer";
            }
          }

          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });

          if (request.signal) {
            request.signal.addEventListener("abort", abortXhr);

            xhr.onreadystatechange = function() {
              // DONE (success or failure)
              if (xhr.readyState === 4) {
                request.signal.removeEventListener("abort", abortXhr);
              }
            };
          }

          xhr.send(
            typeof request._bodyInit === "undefined" ? null : request._bodyInit
          );
        });
      }

      fetch.polyfill = true;

      if (!self.fetch) {
        self.fetch = fetch;
        self.Headers = Headers;
        self.Request = Request;
        self.Response = Response;
      }
    })();

    (function() {
      /*@! Bean */
      /*
       * Bean - copyright (c) Jacob Thornton 2011-2012
       * https://github.com/fat/bean
       * MIT license
       */
      (function(name, context, definition) {
        if (typeof module !== "undefined" && module.exports)
          module.exports = definition();
        else if (typeof define === "function" && define.amd) define(definition);
        else context[name] = definition();
      })("bean", window, function(name, context) {
        name = name || "listener";
        context = context || window;

        var win = window,
          old = context[name],
          namespaceRegex = /[^\.]*(?=\..*)\.|.*/,
          nameRegex = /\..*/,
          addEvent = "addEventListener",
          removeEvent = "removeEventListener",
          doc = document || {},
          root = doc.documentElement || {},
          W3C_MODEL = root[addEvent],
          eventSupport = W3C_MODEL ? addEvent : "attachEvent",
          ONE = {}, // singleton for quick matching making add() do one()
          slice = Array.prototype.slice,
          str2arr = function(s, d) {
            return s.split(d || " ");
          },
          isString = function(o) {
            return typeof o === "string";
          },
          isFunction = function(o) {
            return typeof o === "function";
          },
          // events that we consider to be 'native', anything not in this list will
          // be treated as a custom event
          standardNativeEvents =
            "click dblclick mouseup mousedown contextmenu " + // mouse buttons
            "mousewheel mousemultiwheel DOMMouseScroll " + // mouse wheel
            "mouseover mouseout mousemove selectstart selectend " + // mouse movement
            "keydown keypress keyup " + // keyboard
            "orientationchange " + // mobile
            "focus blur change reset select submit " + // form elements
            "load unload beforeunload resize move DOMContentLoaded " + // window
            "readystatechange message " + // window
            "error abort scroll ", // misc
          // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
          // that doesn't actually exist, so make sure we only do these on newer browsers
          w3cNativeEvents =
            "show " + // mouse buttons
            "input invalid " + // form elements
            "touchstart touchmove touchend touchcancel " + // touch
            "gesturestart gesturechange gestureend " + // gesture
            "textinput " + // TextEvent
            "readystatechange pageshow pagehide popstate " + // window
            "hashchange offline online " + // window
            "afterprint beforeprint " + // printing
            "dragstart dragenter dragover dragleave drag drop dragend " + // dnd
            "loadstart progress suspend emptied stalled loadmetadata " + // media
            "loadeddata canplay canplaythrough playing waiting seeking " + // media
            "seeked ended durationchange timeupdate play pause ratechange " + // media
            "volumechange cuechange " + // media
            "checking noupdate downloading cached updateready obsolete ", // appcache
          // convert to a hash for quick lookups
          nativeEvents = (function(hash, events, i) {
            for (i = 0; i < events.length; i++)
              events[i] && (hash[events[i]] = 1);
            return hash;
          })(
            {},
            str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ""))
          ),
          // custom events are events that we *fake*, they are not provided natively but
          // we can use native events to generate them
          customEvents = (function() {
            var isAncestor =
                "compareDocumentPosition" in root
                  ? function(element, container) {
                      return (
                        container.compareDocumentPosition &&
                        (container.compareDocumentPosition(element) & 16) === 16
                      );
                    }
                  : "contains" in root
                  ? function(element, container) {
                      container =
                        container.nodeType === 9 || container === window
                          ? root
                          : container;
                      return (
                        container !== element && container.contains(element)
                      );
                    }
                  : function(element, container) {
                      while ((element = element.parentNode))
                        if (element === container) return 1;
                      return 0;
                    },
              check = function(event) {
                var related = event.relatedTarget;
                return !related
                  ? related === null
                  : related !== this &&
                      related.prefix !== "xul" &&
                      !/document/.test(this.toString()) &&
                      !isAncestor(related, this);
              };

            return {
              mouseenter: { base: "mouseover", condition: check },
              mouseleave: { base: "mouseout", condition: check },
              mousewheel: {
                base: /Firefox/.test(navigator.userAgent)
                  ? "DOMMouseScroll"
                  : "mousewheel"
              }
            };
          })(),
          // we provide a consistent Event object across browsers by taking the actual DOM
          // event object and generating a new one from its properties.
          Event = (function() {
            // a whitelist of properties (for different event types) tells us what to check for and copy
            var commonProps = str2arr(
                "altKey attrChange attrName bubbles cancelable ctrlKey currentTarget " +
                  "detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey " +
                  "srcElement target timeStamp type view which propertyName"
              ),
              mouseProps = commonProps.concat(
                str2arr(
                  "button buttons clientX clientY dataTransfer " +
                    "fromElement offsetX offsetY pageX pageY screenX screenY toElement"
                )
              ),
              mouseWheelProps = mouseProps.concat(
                str2arr(
                  "wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ " + "axis"
                )
              ), // 'axis' is FF specific
              keyProps = commonProps.concat(
                str2arr(
                  "char charCode key keyCode keyIdentifier " +
                    "keyLocation location"
                )
              ),
              textProps = commonProps.concat(str2arr("data")),
              touchProps = commonProps.concat(
                str2arr("touches targetTouches changedTouches scale rotation")
              ),
              messageProps = commonProps.concat(str2arr("data origin source")),
              stateProps = commonProps.concat(str2arr("state")),
              overOutRegex = /over|out/,
              // some event types need special handling and some need special properties, do that all here
              typeFixers = [
                {
                  // key events
                  reg: /key/i,
                  fix: function(event, newEvent) {
                    newEvent.keyCode = event.keyCode || event.which;
                    return keyProps;
                  }
                },
                {
                  // mouse events
                  reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i,
                  fix: function(event, newEvent, type) {
                    newEvent.rightClick =
                      event.which === 3 || event.button === 2;
                    newEvent.pos = { x: 0, y: 0 };
                    if (event.pageX || event.pageY) {
                      newEvent.clientX = event.pageX;
                      newEvent.clientY = event.pageY;
                    } else if (event.clientX || event.clientY) {
                      newEvent.clientX =
                        event.clientX + doc.body.scrollLeft + root.scrollLeft;
                      newEvent.clientY =
                        event.clientY + doc.body.scrollTop + root.scrollTop;
                    }
                    if (overOutRegex.test(type)) {
                      newEvent.relatedTarget =
                        event.relatedTarget ||
                        event[
                          (type === "mouseover" ? "from" : "to") + "Element"
                        ];
                    }
                    return mouseProps;
                  }
                },
                {
                  // mouse wheel events
                  reg: /mouse.*(wheel|scroll)/i,
                  fix: function() {
                    return mouseWheelProps;
                  }
                },
                {
                  // TextEvent
                  reg: /^text/i,
                  fix: function() {
                    return textProps;
                  }
                },
                {
                  // touch and gesture events
                  reg: /^touch|^gesture/i,
                  fix: function() {
                    return touchProps;
                  }
                },
                {
                  // message events
                  reg: /^message$/i,
                  fix: function() {
                    return messageProps;
                  }
                },
                {
                  // popstate events
                  reg: /^popstate$/i,
                  fix: function() {
                    return stateProps;
                  }
                },
                {
                  // everything else
                  reg: /.*/,
                  fix: function() {
                    return commonProps;
                  }
                }
              ],
              typeFixerMap = {}, // used to map event types to fixer functions (above), a basic cache mechanism
              Event = function(event, element, isNative) {
                if (!arguments.length) return;
                event =
                  event ||
                  (
                    (element.ownerDocument || element.document || element)
                      .parentWindow || win
                  ).event;
                this.originalEvent = event;
                this.isNative = isNative;
                this.isBean = true;

                if (!event) return;

                var type = event.type,
                  target = event.target || event.srcElement,
                  i,
                  l,
                  p,
                  props,
                  fixer;

                this.target =
                  target && target.nodeType === 3 ? target.parentNode : target;

                if (isNative) {
                  // we only need basic augmentation on custom events, the rest expensive & pointless
                  fixer = typeFixerMap[type];
                  if (!fixer) {
                    // haven't encountered this event type before, map a fixer function for it
                    for (i = 0, l = typeFixers.length; i < l; i++) {
                      if (typeFixers[i].reg.test(type)) {
                        // guaranteed to match at least one, last is .*
                        typeFixerMap[type] = fixer = typeFixers[i].fix;
                        break;
                      }
                    }
                  }

                  props = fixer(event, this, type);
                  for (i = props.length; i--; ) {
                    if (!((p = props[i]) in this) && p in event)
                      this[p] = event[p];
                  }
                }
              };

            // preventDefault() and stopPropagation() are a consistent interface to those functions
            // on the DOM, stop() is an alias for both of them together
            Event.prototype.preventDefault = function() {
              if (this.originalEvent.preventDefault)
                this.originalEvent.preventDefault();
              else this.originalEvent.returnValue = false;
            };
            Event.prototype.stopPropagation = function() {
              if (this.originalEvent.stopPropagation)
                this.originalEvent.stopPropagation();
              else this.originalEvent.cancelBubble = true;
            };
            Event.prototype.stop = function() {
              this.preventDefault();
              this.stopPropagation();
              this.stopped = true;
            };
            // stopImmediatePropagation() has to be handled internally because we manage the event list for
            // each element
            // note that originalElement may be a Bean#Event object in some situations
            Event.prototype.stopImmediatePropagation = function() {
              if (this.originalEvent.stopImmediatePropagation)
                this.originalEvent.stopImmediatePropagation();
              this.isImmediatePropagationStopped = function() {
                return true;
              };
            };
            Event.prototype.isImmediatePropagationStopped = function() {
              return (
                this.originalEvent.isImmediatePropagationStopped &&
                this.originalEvent.isImmediatePropagationStopped()
              );
            };
            Event.prototype.clone = function(currentTarget) {
              //TODO: this is ripe for optimisation, new events are *expensive*
              // improving this will speed up delegated events
              var ne = new Event(this, this.element, this.isNative);
              ne.currentTarget = currentTarget;
              return ne;
            };

            return Event;
          })(),
          // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
          targetElement = function(element, isNative) {
            return !W3C_MODEL &&
              !isNative &&
              (element === doc || element === win)
              ? root
              : element;
          },
          /**
           * Bean maintains an internal registry for event listeners. We don't touch elements, objects
           * or functions to identify them, instead we store everything in the registry.
           * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
           */
          RegEntry = (function() {
            // each handler is wrapped so we can handle delegation and custom events
            var wrappedHandler = function(element, fn, condition, args) {
                var call = function(event, eargs) {
                    return fn.apply(
                      element,
                      args
                        ? slice.call(eargs, event ? 0 : 1).concat(args)
                        : eargs
                    );
                  },
                  findTarget = function(event, eventElement) {
                    return fn.__beanDel
                      ? fn.__beanDel.ft(event.target, element)
                      : eventElement;
                  },
                  handler = condition
                    ? function(event) {
                        var target = findTarget(event, this); // deleated event
                        if (condition.apply(target, arguments)) {
                          if (event) event.currentTarget = target;
                          return call(event, arguments);
                        }
                      }
                    : function(event) {
                        if (fn.__beanDel)
                          event = event.clone(findTarget(event)); // delegated event, fix the fix
                        return call(event, arguments);
                      };
                handler.__beanDel = fn.__beanDel;
                return handler;
              },
              RegEntry = function(
                element,
                type,
                handler,
                original,
                namespaces,
                args,
                root
              ) {
                var customType = customEvents[type],
                  isNative;

                if (type === "unload") {
                  // self clean-up
                  handler = once(
                    removeListener,
                    element,
                    type,
                    handler,
                    original
                  );
                }

                if (customType) {
                  if (customType.condition) {
                    handler = wrappedHandler(
                      element,
                      handler,
                      customType.condition,
                      args
                    );
                  }
                  type = customType.base || type;
                }

                this.isNative = isNative =
                  nativeEvents[type] && !!element[eventSupport];
                this.customType = !W3C_MODEL && !isNative && type;
                this.element = element;
                this.type = type;
                this.original = original;
                this.namespaces = namespaces;
                this.eventType =
                  W3C_MODEL || isNative ? type : "propertychange";
                this.target = targetElement(element, isNative);
                this[eventSupport] = !!this.target[eventSupport];
                this.root = root;
                this.handler = wrappedHandler(element, handler, null, args);
              };

            // given a list of namespaces, is our entry in any of them?
            RegEntry.prototype.inNamespaces = function(checkNamespaces) {
              var i,
                j,
                c = 0;
              if (!checkNamespaces) return true;
              if (!this.namespaces) return false;
              for (i = checkNamespaces.length; i--; ) {
                for (j = this.namespaces.length; j--; ) {
                  if (checkNamespaces[i] === this.namespaces[j]) c++;
                }
              }
              return checkNamespaces.length === c;
            };

            // match by element, original fn (opt), handler fn (opt)
            RegEntry.prototype.matches = function(
              checkElement,
              checkOriginal,
              checkHandler
            ) {
              return (
                this.element === checkElement &&
                (!checkOriginal || this.original === checkOriginal) &&
                (!checkHandler || this.handler === checkHandler)
              );
            };

            return RegEntry;
          })(),
          registry = (function() {
            // our map stores arrays by event type, just because it's better than storing
            // everything in a single array.
            // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
            // rootListeners so we can look them up fast
            var map = {},
              // generic functional search of our registry for matching listeners,
              // `fn` returns false to break out of the loop
              forAll = function(element, type, original, handler, root, fn) {
                var pfx = root ? "r" : "$";
                if (!type || type === "*") {
                  // search the whole registry
                  for (var t in map) {
                    if (t.charAt(0) === pfx) {
                      forAll(element, t.substr(1), original, handler, root, fn);
                    }
                  }
                } else {
                  var i = 0,
                    l,
                    list = map[pfx + type],
                    all = element === "*";
                  if (!list) return;
                  for (l = list.length; i < l; i++) {
                    if (
                      (all || list[i].matches(element, original, handler)) &&
                      !fn(list[i], list, i, type)
                    )
                      return;
                  }
                }
              },
              has = function(element, type, original, root) {
                // we're not using forAll here simply because it's a bit slower and this
                // needs to be fast
                var i,
                  list = map[(root ? "r" : "$") + type];
                if (list) {
                  for (i = list.length; i--; ) {
                    if (
                      !list[i].root &&
                      list[i].matches(element, original, null)
                    )
                      return true;
                  }
                }
                return false;
              },
              get = function(element, type, original, root) {
                var entries = [];
                forAll(element, type, original, null, root, function(entry) {
                  return entries.push(entry);
                });
                return entries;
              },
              put = function(entry) {
                var has =
                    !entry.root &&
                    !this.has(entry.element, entry.type, null, false),
                  key = (entry.root ? "r" : "$") + entry.type;
                (map[key] || (map[key] = [])).push(entry);
                return has;
              },
              del = function(entry) {
                forAll(
                  entry.element,
                  entry.type,
                  null,
                  entry.handler,
                  entry.root,
                  function(entry, list, i) {
                    list.splice(i, 1);
                    entry.removed = true;
                    if (list.length === 0)
                      delete map[(entry.root ? "r" : "$") + entry.type];
                    return false;
                  }
                );
              },
              // dump all entries, used for onunload
              entries = function() {
                var t,
                  entries = [];
                for (t in map) {
                  if (t.charAt(0) === "$") entries = entries.concat(map[t]);
                }
                return entries;
              };

            return { has: has, get: get, put: put, del: del, entries: entries };
          })(),
          // we need a selector engine for delegated events, use querySelectorAll if it exists
          // but for older browsers we need Qwery, Sizzle or similar
          selectorEngine,
          setSelectorEngine = function(e) {
            if (!arguments.length) {
              selectorEngine = doc.querySelectorAll
                ? function(s, r) {
                    return r.querySelectorAll(s);
                  }
                : function() {
                    throw new Error("Bean: No selector engine installed"); // eeek
                  };
            } else {
              selectorEngine = e;
            }
          },
          // we attach this listener to each DOM event that we need to listen to, only once
          // per event type per DOM element
          rootListener = function(event, type) {
            if (
              !W3C_MODEL &&
              type &&
              event &&
              event.propertyName !== "_on" + type
            )
              return;

            var listeners = registry.get(this, type || event.type, null, false),
              l = listeners.length,
              i = 0;

            event = new Event(event, this, true);
            if (type) event.type = type;

            // iterate through all handlers registered for this type, calling them unless they have
            // been removed by a previous handler or stopImmediatePropagation() has been called
            for (; i < l && !event.isImmediatePropagationStopped(); i++) {
              if (!listeners[i].removed) listeners[i].handler.call(this, event);
            }
          },
          // add and remove listeners to DOM elements
          listener = W3C_MODEL
            ? function(element, type, add) {
                // new browsers
                element[add ? addEvent : removeEvent](
                  type,
                  rootListener,
                  false
                );
              }
            : function(element, type, add, custom) {
                // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
                // to simulate event bubbling etc.
                var entry;
                if (add) {
                  registry.put(
                    (entry = new RegEntry(
                      element,
                      custom || type,
                      function(event) {
                        // handler
                        rootListener.call(element, event, custom);
                      },
                      rootListener,
                      null,
                      null,
                      true // is root
                    ))
                  );
                  if (custom && element["_on" + custom] === null)
                    element["_on" + custom] = 0;
                  entry.target.attachEvent(
                    "on" + entry.eventType,
                    entry.handler
                  );
                } else {
                  entry = registry.get(
                    element,
                    custom || type,
                    rootListener,
                    true
                  )[0];
                  if (entry) {
                    entry.target.detachEvent(
                      "on" + entry.eventType,
                      entry.handler
                    );
                    registry.del(entry);
                  }
                }
              },
          once = function(rm, element, type, fn, originalFn) {
            // wrap the handler in a handler that does a remove as well
            return function() {
              fn.apply(this, arguments);
              rm(element, type, originalFn);
            };
          },
          removeListener = function(element, orgType, handler, namespaces) {
            var type = orgType && orgType.replace(nameRegex, ""),
              handlers = registry.get(element, type, null, false),
              removed = {},
              i,
              l;

            for (i = 0, l = handlers.length; i < l; i++) {
              if (
                (!handler || handlers[i].original === handler) &&
                handlers[i].inNamespaces(namespaces)
              ) {
                // TODO: this is problematic, we have a registry.get() and registry.del() that
                // both do registry searches so we waste cycles doing this. Needs to be rolled into
                // a single registry.forAll(fn) that removes while finding, but the catch is that
                // we'll be splicing the arrays that we're iterating over. Needs extra tests to
                // make sure we don't screw it up. @rvagg
                registry.del(handlers[i]);
                if (
                  !removed[handlers[i].eventType] &&
                  handlers[i][eventSupport]
                )
                  removed[handlers[i].eventType] = {
                    t: handlers[i].eventType,
                    c: handlers[i].type
                  };
              }
            }
            // check each type/element for removed listeners and remove the rootListener where it's no longer needed
            for (i in removed) {
              if (!registry.has(element, removed[i].t, null, false)) {
                // last listener of this type, remove the rootListener
                listener(element, removed[i].t, false, removed[i].c);
              }
            }
          },
          // set up a delegate helper using the given selector, wrap the handler function
          delegate = function(selector, fn) {
            //TODO: findTarget (therefore $) is called twice, once for match and once for
            // setting e.currentTarget, fix this so it's only needed once
            var findTarget = function(target, root) {
                var i,
                  array = isString(selector)
                    ? selectorEngine(selector, root)
                    : selector;
                for (; target && target !== root; target = target.parentNode) {
                  for (i = array.length; i--; ) {
                    if (array[i] === target) return target;
                  }
                }
              },
              handler = function(e) {
                var match = findTarget(e.target, this);
                if (match) fn.apply(match, arguments);
              };

            // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
            handler.__beanDel = {
              ft: findTarget, // attach it here for customEvents to use too
              selector: selector
            };
            return handler;
          },
          fireListener = W3C_MODEL
            ? function(isNative, type, element) {
                // modern browsers, do a proper dispatchEvent()
                var evt = doc.createEvent(isNative ? "HTMLEvents" : "UIEvents");
                evt[isNative ? "initEvent" : "initUIEvent"](
                  type,
                  true,
                  true,
                  win,
                  1
                );
                element.dispatchEvent(evt);
              }
            : function(isNative, type, element) {
                // old browser use onpropertychange, just increment a custom property to trigger the event
                element = targetElement(element, isNative);
                isNative
                  ? element.fireEvent("on" + type, doc.createEventObject())
                  : element["_on" + type]++;
              },
          /**
           * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
           */

          /**
           * off(element[, eventType(s)[, handler ]])
           */
          off = function(element, typeSpec, fn) {
            var isTypeStr = isString(typeSpec),
              k,
              type,
              namespaces,
              i;

            if (isTypeStr && typeSpec.indexOf(" ") > 0) {
              // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
              typeSpec = str2arr(typeSpec);
              for (i = typeSpec.length; i--; ) off(element, typeSpec[i], fn);
              return element;
            }

            type = isTypeStr && typeSpec.replace(nameRegex, "");
            if (type && customEvents[type]) type = customEvents[type].base;

            if (!typeSpec || isTypeStr) {
              // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
              if (
                (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, ""))
              )
                namespaces = str2arr(namespaces, ".");
              removeListener(element, type, fn, namespaces);
            } else if (isFunction(typeSpec)) {
              // off(el, fn)
              removeListener(element, null, typeSpec);
            } else {
              // off(el, { t1: fn1, t2, fn2 })
              for (k in typeSpec) {
                if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k]);
              }
            }

            return element;
          },
          /**
           * on(element, eventType(s)[, selector], handler[, args ])
           */
          on = function(element, events, selector, fn) {
            var originalFn, type, types, i, args, entry, first;

            //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
            if (selector === undefined && typeof events === "object") {
              //TODO: this can't handle delegated events
              for (type in events) {
                if (events.hasOwnProperty(type)) {
                  on.call(this, element, type, events[type]);
                }
              }
              return;
            }

            if (!isFunction(selector)) {
              // delegated event
              originalFn = fn;
              args = slice.call(arguments, 4);
              fn = delegate(selector, originalFn, selectorEngine);
            } else {
              args = slice.call(arguments, 3);
              fn = originalFn = selector;
            }

            types = str2arr(events);

            // special case for one(), wrap in a self-removing handler
            if (this === ONE) {
              fn = once(off, element, events, fn, originalFn);
            }

            for (i = types.length; i--; ) {
              // add new handler to the registry and check if it's the first for this element/type
              first = registry.put(
                (entry = new RegEntry(
                  element,
                  types[i].replace(nameRegex, ""), // event type
                  fn,
                  originalFn,
                  str2arr(types[i].replace(namespaceRegex, ""), "."), // namespaces
                  args,
                  false // not root
                ))
              );
              if (entry[eventSupport] && first) {
                // first event of this type on this element, add root listener
                listener(element, entry.eventType, true, entry.customType);
              }
            }

            return element;
          },
          /**
           * add(element[, selector], eventType(s), handler[, args ])
           *
           * Deprecated: kept (for now) for backward-compatibility
           */
          add = function(element, events, fn, delfn) {
            return on.apply(
              null,
              !isString(fn)
                ? slice.call(arguments)
                : [element, fn, events, delfn].concat(
                    arguments.length > 3 ? slice.call(arguments, 5) : []
                  )
            );
          },
          /**
           * one(element, eventType(s)[, selector], handler[, args ])
           */
          one = function() {
            return on.apply(ONE, arguments);
          },
          /**
           * fire(element, eventType(s)[, args ])
           *
           * The optional 'args' argument must be an array, if no 'args' argument is provided
           * then we can use the browser's DOM event system, otherwise we trigger handlers manually
           */
          fire = function(element, type, args) {
            var types = str2arr(type),
              i,
              j,
              l,
              names,
              handlers;

            for (i = types.length; i--; ) {
              type = types[i].replace(nameRegex, "");
              if ((names = types[i].replace(namespaceRegex, "")))
                names = str2arr(names, ".");
              if (!names && !args && element[eventSupport]) {
                fireListener(nativeEvents[type], type, element);
              } else {
                // non-native event, either because of a namespace, arguments or a non DOM element
                // iterate over all listeners and manually 'fire'
                handlers = registry.get(element, type, null, false);
                args = [false].concat(args);
                for (j = 0, l = handlers.length; j < l; j++) {
                  if (handlers[j].inNamespaces(names)) {
                    handlers[j].handler.apply(element, args);
                  }
                }
              }
            }
            return element;
          },
          /**
           * clone(dstElement, srcElement[, eventType ])
           *
           * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
           */
          clone = function(element, from, type) {
            var handlers = registry.get(from, type, null, false),
              l = handlers.length,
              i = 0,
              args,
              beanDel;

            for (; i < l; i++) {
              if (handlers[i].original) {
                args = [element, handlers[i].type];
                if ((beanDel = handlers[i].handler.__beanDel))
                  args.push(beanDel.selector);
                args.push(handlers[i].original);
                on.apply(null, args);
              }
            }
            return element;
          },
          bean = {
            on: on,
            add: add,
            one: one,
            off: off,
            remove: off,
            clone: clone,
            fire: fire,
            Event: Event,
            setSelectorEngine: setSelectorEngine,
            noConflict: function() {
              context[name] = old;
              return this;
            }
          };

        // for IE, clean up on unload to avoid leaks
        if (win.attachEvent) {
          var cleanup = function() {
            var i,
              entries = registry.entries();
            for (i in entries) {
              if (entries[i].type && entries[i].type !== "unload")
                off(entries[i].element, entries[i].type);
            }
            win.detachEvent("onunload", cleanup);
            win.CollectGarbage && win.CollectGarbage();
          };
          win.attachEvent("onunload", cleanup);
        }

        // initialize selector engine to internal default (qSA or throw Error)
        setSelectorEngine();

        return bean;
      });
    })();
  })()
);
