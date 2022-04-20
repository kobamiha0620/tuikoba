jQuery(window).on("load", function () {});
! function (u) {
    u.fn.tile = function (e) {
        var h, i, n, r, t, o = this.length - 1;
        return e = e || this.length, this.each(function () {
            (t = this.style).removeProperty && t.removeProperty("height"), t.removeAttribute && t.removeAttribute("height")
        }), this.each(function (t) {
            (h = 0 == (n = t % e) ? [] : h)[n] = u(this), r = h[n].height(), (0 == n || i < r) && (i = r), t != o && n != e - 1 || u.each(h, function () {
                this.height(i)
            })
        })
    }
}(jQuery);
! function () {
    "use strict";

    function e(t) {
        if (!t) throw new Error("No options passed to Waypoint constructor");
        if (!t.element) throw new Error("No element option passed to Waypoint constructor");
        if (!t.handler) throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + i, this.options = e.Adapter.extend({}, e.defaults, t), this.element = this.options.element, this.adapter = new e.Adapter(this.element), this.callback = t.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = e.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }), this.context = e.Context.findOrCreateByElement(this.options.context), e.offsetAliases[this.options.offset] && (this.options.offset = e.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), r[this.key] = this, i += 1
    }
    var i = 0,
        r = {};
    e.prototype.queueTrigger = function (t) {
        this.group.queueTrigger(this, t)
    }, e.prototype.trigger = function (t) {
        this.enabled && this.callback && this.callback.apply(this, t)
    }, e.prototype.destroy = function () {
        this.context.remove(this), this.group.remove(this), delete r[this.key]
    }, e.prototype.disable = function () {
        return this.enabled = !1, this
    }, e.prototype.enable = function () {
        return this.context.refresh(), this.enabled = !0, this
    }, e.prototype.next = function () {
        return this.group.next(this)
    }, e.prototype.previous = function () {
        return this.group.previous(this)
    }, e.invokeAll = function (t) {
        var e, i = [];
        for (e in r) i.push(r[e]);
        for (var o = 0, n = i.length; o < n; o++) i[o][t]()
    }, e.destroyAll = function () {
        e.invokeAll("destroy")
    }, e.disableAll = function () {
        e.invokeAll("disable")
    }, e.enableAll = function () {
        for (var t in e.Context.refreshAll(), r) r[t].enabled = !0;
        return this
    }, e.refreshAll = function () {
        e.Context.refreshAll()
    }, e.viewportHeight = function () {
        return window.innerHeight || document.documentElement.clientHeight
    }, e.viewportWidth = function () {
        return document.documentElement.clientWidth
    }, e.adapters = [], e.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    }, e.offsetAliases = {
        "bottom-in-view": function () {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function () {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    }, window.Waypoint = e
}(),
function () {
    "use strict";

    function e(t) {
        window.setTimeout(t, 1e3 / 60)
    }

    function i(t) {
        this.element = t, this.Adapter = d.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + o, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }, this.waypoints = {
            vertical: {},
            horizontal: {}
        }, t.waypointContextKey = this.key, n[t.waypointContextKey] = this, o += 1, d.windowContext || (d.windowContext = !0, d.windowContext = new i(window)), this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
    }
    var o = 0,
        n = {},
        d = window.Waypoint,
        t = window.onload;
    i.prototype.add = function (t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[e][t.key] = t, this.refresh()
    }, i.prototype.checkEmpty = function () {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
            e = this.Adapter.isEmptyObject(this.waypoints.vertical),
            i = this.element == this.element.window;
        t && e && !i && (this.adapter.off(".waypoints"), delete n[this.key])
    }, i.prototype.createThrottledResizeHandler = function () {
        function t() {
            e.handleResize(), e.didResize = !1
        }
        var e = this;
        this.adapter.on("resize.waypoints", function () {
            e.didResize || (e.didResize = !0, d.requestAnimationFrame(t))
        })
    }, i.prototype.createThrottledScrollHandler = function () {
        function t() {
            e.handleScroll(), e.didScroll = !1
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function () {
            e.didScroll && !d.isTouch || (e.didScroll = !0, d.requestAnimationFrame(t))
        })
    }, i.prototype.handleResize = function () {
        d.Context.refreshAll()
    }, i.prototype.handleScroll = function () {
        var t, e, i = {},
            o = {
                horizontal: {
                    newScroll: this.adapter.scrollLeft(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left"
                },
                vertical: {
                    newScroll: this.adapter.scrollTop(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up"
                }
            };
        for (t in o) {
            var n, r = o[t],
                s = r.newScroll > r.oldScroll ? r.forward : r.backward;
            for (n in this.waypoints[t]) {
                var a, l, h = this.waypoints[t][n];
                null !== h.triggerPoint && (a = r.oldScroll < h.triggerPoint, l = r.newScroll >= h.triggerPoint, (a && l || !a && !l) && (h.queueTrigger(s), i[h.group.id] = h.group))
            }
        }
        for (e in i) i[e].flushTriggers();
        this.oldScroll = {
            x: o.horizontal.newScroll,
            y: o.vertical.newScroll
        }
    }, i.prototype.innerHeight = function () {
        return this.element == this.element.window ? d.viewportHeight() : this.adapter.innerHeight()
    }, i.prototype.remove = function (t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty()
    }, i.prototype.innerWidth = function () {
        return this.element == this.element.window ? d.viewportWidth() : this.adapter.innerWidth()
    }, i.prototype.destroy = function () {
        var t, e = [];
        for (t in this.waypoints)
            for (var i in this.waypoints[t]) e.push(this.waypoints[t][i]);
        for (var o = 0, n = e.length; o < n; o++) e[o].destroy()
    }, i.prototype.refresh = function () {
        var t, e, i = this.element == this.element.window,
            o = i ? void 0 : this.adapter.offset(),
            n = {};
        for (e in this.handleScroll(), t = {
                horizontal: {
                    contextOffset: i ? 0 : o.left,
                    contextScroll: i ? 0 : this.oldScroll.x,
                    contextDimension: this.innerWidth(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left",
                    offsetProp: "left"
                },
                vertical: {
                    contextOffset: i ? 0 : o.top,
                    contextScroll: i ? 0 : this.oldScroll.y,
                    contextDimension: this.innerHeight(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up",
                    offsetProp: "top"
                }
            }) {
            var r, s = t[e];
            for (r in this.waypoints[e]) {
                var a, l = this.waypoints[e][r],
                    h = l.options.offset,
                    p = l.triggerPoint,
                    c = 0,
                    u = null == p;
                l.element !== l.element.window && (c = l.adapter.offset()[s.offsetProp]), "function" == typeof h ? h = h.apply(l) : "string" == typeof h && (h = parseFloat(h), -1 < l.options.offset.indexOf("%") && (h = Math.ceil(s.contextDimension * h / 100))), a = s.contextScroll - s.contextOffset, l.triggerPoint = Math.floor(c + a - h), a = p < s.oldScroll, h = l.triggerPoint >= s.oldScroll, p = !a && !h, !u && (a && h) ? (l.queueTrigger(s.backward), n[l.group.id] = l.group) : (!u && p || u && s.oldScroll >= l.triggerPoint) && (l.queueTrigger(s.forward), n[l.group.id] = l.group)
            }
        }
        return d.requestAnimationFrame(function () {
            for (var t in n) n[t].flushTriggers()
        }), this
    }, i.findOrCreateByElement = function (t) {
        return i.findByElement(t) || new i(t)
    }, i.refreshAll = function () {
        for (var t in n) n[t].refresh()
    }, i.findByElement = function (t) {
        return n[t.waypointContextKey]
    }, window.onload = function () {
        t && t(), i.refreshAll()
    }, d.requestAnimationFrame = function (t) {
        (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || e).call(window, t)
    }, d.Context = i
}(),
function () {
    "use strict";

    function r(t, e) {
        return t.triggerPoint - e.triggerPoint
    }

    function s(t, e) {
        return e.triggerPoint - t.triggerPoint
    }

    function e(t) {
        this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), i[this.axis][this.name] = this
    }
    var i = {
            vertical: {},
            horizontal: {}
        },
        o = window.Waypoint;
    e.prototype.add = function (t) {
        this.waypoints.push(t)
    }, e.prototype.clearTriggerQueues = function () {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }, e.prototype.flushTriggers = function () {
        for (var t in this.triggerQueues) {
            var e = this.triggerQueues[t];
            e.sort("up" === t || "left" === t ? s : r);
            for (var i = 0, o = e.length; i < o; i += 1) {
                var n = e[i];
                !n.options.continuous && i !== e.length - 1 || n.trigger([t])
            }
        }
        this.clearTriggerQueues()
    }, e.prototype.next = function (t) {
        this.waypoints.sort(r);
        t = o.Adapter.inArray(t, this.waypoints);
        return t === this.waypoints.length - 1 ? null : this.waypoints[t + 1]
    }, e.prototype.previous = function (t) {
        this.waypoints.sort(r);
        t = o.Adapter.inArray(t, this.waypoints);
        return t ? this.waypoints[t - 1] : null
    }, e.prototype.queueTrigger = function (t, e) {
        this.triggerQueues[e].push(t)
    }, e.prototype.remove = function (t) {
        t = o.Adapter.inArray(t, this.waypoints); - 1 < t && this.waypoints.splice(t, 1)
    }, e.prototype.first = function () {
        return this.waypoints[0]
    }, e.prototype.last = function () {
        return this.waypoints[this.waypoints.length - 1]
    }, e.findOrCreate = function (t) {
        return i[t.axis][t.name] || new e(t)
    }, o.Group = e
}(),
function () {
    "use strict";

    function i(t) {
        this.$element = o(t)
    }
    var o = window.jQuery,
        t = window.Waypoint;
    o.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function (t, e) {
        i.prototype[e] = function () {
            var t = Array.prototype.slice.call(arguments);
            return this.$element[e].apply(this.$element, t)
        }
    }), o.each(["extend", "inArray", "isEmptyObject"], function (t, e) {
        i[e] = o[e]
    }), t.adapters.push({
        name: "jquery",
        Adapter: i
    }), t.Adapter = i
}(),
function () {
    "use strict";

    function t(o) {
        return function () {
            var e = [],
                i = arguments[0];
            return o.isFunction(arguments[0]) && ((i = o.extend({}, arguments[1])).handler = arguments[0]), this.each(function () {
                var t = o.extend({}, i, {
                    element: this
                });
                "string" == typeof t.context && (t.context = o(this).closest(t.context)[0]), e.push(new n(t))
            }), e
        }
    }
    var n = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}();
! function (e) {
    var t = function (n, f, s) {
        "use strict";
        var m, y;
        if (function () {
                var e, t = {
                    lazyClass: "lazyload",
                    loadedClass: "lazyloaded",
                    loadingClass: "lazyloading",
                    preloadClass: "lazypreload",
                    errorClass: "lazyerror",
                    autosizesClass: "lazyautosizes",
                    fastLoadedClass: "ls-is-cached",
                    iframeLoadMode: 0,
                    srcAttr: "data-src",
                    srcsetAttr: "data-srcset",
                    sizesAttr: "data-sizes",
                    minSize: 40,
                    customMedia: {},
                    init: !0,
                    expFactor: 1.5,
                    hFac: .8,
                    loadMode: 2,
                    loadHidden: !0,
                    ricTimeout: 0,
                    throttleDelay: 125
                };
                for (e in y = n.lazySizesConfig || n.lazysizesConfig || {}, t) e in y || (y[e] = t[e])
            }(), !f || !f.getElementsByClassName) return {
            init: function () {},
            cfg: y,
            noSupport: !0
        };

        function o(e, t) {
            return de[t] || (de[t] = new RegExp("(\\s|^)" + t + "(\\s|$)")), de[t].test(e[ae]("class") || "") && de[t]
        }

        function c(e, t) {
            o(e, t) || e.setAttribute("class", (e[ae]("class") || "").trim() + " " + t)
        }

        function u(e, t) {
            (t = o(e, t)) && e.setAttribute("class", (e[ae]("class") || "").replace(t, " "))
        }

        function z(e, t, a, n, i) {
            var s = f.createEvent("Event");
            return (a = a || {}).instance = m, s.initEvent(t, !n, !i), s.detail = a, e.dispatchEvent(s), s
        }

        function h(e, t) {
            var a;
            !ee && (a = n.picturefill || y.pf) ? (t && t.src && !e[ae]("srcset") && e.setAttribute("srcset", t.src), a({
                reevaluate: !0,
                elements: [e]
            })) : t && t.src && (e.src = t.src)
        }

        function g(e, t) {
            return (getComputedStyle(e, null) || {})[t]
        }

        function i(e, t, a) {
            for (a = a || e.offsetWidth; a < y.minSize && t && !e._lazysizesWidth;) a = t.offsetWidth, t = t.parentNode;
            return a
        }

        function e(a, e) {
            return e ? function () {
                fe(a)
            } : function () {
                var e = this,
                    t = arguments;
                fe(function () {
                    a.apply(e, t)
                })
            }
        }

        function t(e) {
            var t, a, n = function () {
                    t = null, e()
                },
                i = function () {
                    var e = s.now() - a;
                    e < 99 ? ie(i, 99 - e) : (oe || n)(n)
                };
            return function () {
                a = s.now(), t = t || ie(i, 99)
            }
        }
        var a, r, l, v, p, C, b, d, A, E, _, w, M, N, L, x, W, S, B, T, F, R, D, k, H, O, P, $, q, I, U, j, G, J, K, Q, V, X, Y, Z = f.documentElement,
            ee = n.HTMLPictureElement,
            te = "addEventListener",
            ae = "getAttribute",
            ne = n[te].bind(n),
            ie = n.setTimeout,
            se = n.requestAnimationFrame || ie,
            oe = n.requestIdleCallback,
            re = /^picture$/i,
            le = ["load", "error", "lazyincluded", "_lazyloaded"],
            de = {},
            ce = Array.prototype.forEach,
            ue = function (t, a, e) {
                var n = e ? te : "removeEventListener";
                e && ue(t, a), le.forEach(function (e) {
                    t[n](e, a)
                })
            },
            fe = (X = [], Y = V = [], we._lsFlush = _e, we),
            me = (R = /^img$/i, D = /^iframe$/i, k = "onscroll" in n && !/(gle|ing)bot/.test(navigator.userAgent), P = -1, x = pe, S = O = H = 0, B = y.throttleDelay, T = y.ricTimeout, F = oe && 49 < T ? function () {
                oe(Ce, {
                    timeout: T
                }), T !== y.ricTimeout && (T = y.ricTimeout)
            } : e(function () {
                ie(Ce)
            }, !0), q = e(be), I = function (e) {
                q({
                    target: e.target
                })
            }, U = e(function (t, e, a, n, i) {
                var s, o, r, l, d;
                (r = z(t, "lazybeforeunveil", e)).defaultPrevented || (n && (a ? c(t, y.autosizesClass) : t.setAttribute("sizes", n)), s = t[ae](y.srcsetAttr), a = t[ae](y.srcAttr), i && (o = (d = t.parentNode) && re.test(d.nodeName || "")), l = e.firesLoad || "src" in t && (s || a || o), r = {
                    target: t
                }, c(t, y.loadingClass), l && (clearTimeout(C), C = ie(ge, 2500), ue(t, I, !0)), o && ce.call(d.getElementsByTagName("source"), Ae), s ? t.setAttribute("srcset", s) : a && !o && (D.test(t.nodeName) ? (n = a, 0 == (d = (e = t).getAttribute("data-load-mode") || y.iframeLoadMode) ? e.contentWindow.location.replace(n) : 1 == d && (e.src = n)) : t.src = a), i && (s || o) && h(t, {
                    src: a
                })), t._lazyRace && delete t._lazyRace, u(t, y.lazyClass), fe(function () {
                    var e = t.complete && 1 < t.naturalWidth;
                    l && !e || (e && c(t, y.fastLoadedClass), be(r), t._lazyCache = !0, ie(function () {
                        "_lazyCache" in t && delete t._lazyCache
                    }, 9)), "lazy" == t.loading && O--
                }, !0)
            }), G = t(function () {
                y.loadMode = 3, $()
            }), J = function () {
                p || (s.now() - d < 999 ? ie(J, 999) : (p = !0, y.loadMode = 3, $(), ne("scroll", Ee, !0)))
            }, {
                _: function () {
                    d = s.now(), m.elements = f.getElementsByClassName(y.lazyClass), v = f.getElementsByClassName(y.lazyClass + " " + y.preloadClass), ne("scroll", $, !0), ne("resize", $, !0), ne("pageshow", function (e) {
                        var t;
                        !e.persisted || (t = f.querySelectorAll("." + y.loadingClass)).length && t.forEach && se(function () {
                            t.forEach(function (e) {
                                e.complete && j(e)
                            })
                        })
                    }), n.MutationObserver ? new MutationObserver($).observe(Z, {
                        childList: !0,
                        subtree: !0,
                        attributes: !0
                    }) : (Z[te]("DOMNodeInserted", $, !0), Z[te]("DOMAttrModified", $, !0), setInterval($, 999)), ne("hashchange", $, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend"].forEach(function (e) {
                        f[te](e, $, !0)
                    }), /d$|^c/.test(f.readyState) ? J() : (ne("load", J), f[te]("DOMContentLoaded", $), ie(J, 2e4)), m.elements.length ? (pe(), fe._lsFlush()) : $()
                },
                checkElems: $ = function (e) {
                    var t;
                    (e = !0 === e) && (T = 33), W || (W = !0, (t = B - (s.now() - S)) < 0 && (t = 0), e || t < 9 ? F() : ie(F, t))
                },
                unveil: j = function (e) {
                    var t, a, n, i;
                    e._lazyRace || (!(i = "auto" == (n = (a = R.test(e.nodeName)) && (e[ae](y.sizesAttr) || e[ae]("sizes")))) && p || !a || !e[ae]("src") && !e.srcset || e.complete || o(e, y.errorClass) || !o(e, y.lazyClass)) && (t = z(e, "lazyunveilread").detail, i && ye.updateElem(e, !0, e.offsetWidth), e._lazyRace = !0, O++, U(e, t, i, n, a))
                },
                _aLSL: Ee
            }),
            ye = (r = e(function (e, t, a, n) {
                var i, s, o;
                if (e._lazysizesWidth = n, e.setAttribute("sizes", n += "px"), re.test(t.nodeName || ""))
                    for (s = 0, o = (i = t.getElementsByTagName("source")).length; s < o; s++) i[s].setAttribute("sizes", n);
                a.detail.dataAttr || h(e, a.detail)
            }), {
                _: function () {
                    a = f.getElementsByClassName(y.autosizesClass), ne("resize", l)
                },
                checkElems: l = t(function () {
                    var e, t = a.length;
                    if (t)
                        for (e = 0; e < t; e++) he(a[e])
                }),
                updateElem: he
            }),
            ze = function () {
                !ze.i && f.getElementsByClassName && (ze.i = !0, ye._(), me._())
            };

        function he(e, t, a) {
            var n = e.parentNode;
            n && (a = i(e, n, a), (t = z(e, "lazybeforesizes", {
                width: a,
                dataAttr: !!t
            })).defaultPrevented || (a = t.detail.width) && a !== e._lazysizesWidth && r(e, n, t, a))
        }

        function ge(e) {
            O--, e && !(O < 0) && e.target || (O = 0)
        }

        function ve(e) {
            return (L = null == L ? "hidden" == g(f.body, "visibility") : L) || !("hidden" == g(e.parentNode, "visibility") && "hidden" == g(e, "visibility"))
        }

        function pe() {
            var e, t, a, n, i, s, o, r, l, d, c, u = m.elements;
            if ((b = y.loadMode) && O < 8 && (e = u.length)) {
                for (t = 0, P++; t < e; t++)
                    if (u[t] && !u[t]._lazyRace)
                        if (!k || m.prematureUnveil && m.prematureUnveil(u[t])) j(u[t]);
                        else if ((o = u[t][ae]("data-expand")) && (i = +o) || (i = H), l || (l = !y.expand || y.expand < 1 ? 500 < Z.clientHeight && 500 < Z.clientWidth ? 500 : 370 : y.expand, d = (m._defEx = l) * y.expFactor, c = y.hFac, L = null, H < d && O < 1 && 2 < P && 2 < b && !f.hidden ? (H = d, P = 0) : H = 1 < b && 1 < P && O < 6 ? l : 0), r !== i && (A = innerWidth + i * c, E = innerHeight + i, s = -1 * i, r = i), d = u[t].getBoundingClientRect(), (N = d.bottom) >= s && (_ = d.top) <= E && (M = d.right) >= s * c && (w = d.left) <= A && (N || M || w || _) && (y.loadHidden || ve(u[t])) && (p && O < 3 && !o && (b < 3 || P < 4) || function (e, t) {
                        var a, n = e,
                            i = ve(e);
                        for (_ -= t, N += t, w -= t, M += t; i && (n = n.offsetParent) && n != f.body && n != Z;)(i = 0 < (g(n, "opacity") || 1)) && "visible" != g(n, "overflow") && (a = n.getBoundingClientRect(), i = M > a.left && w < a.right && N > a.top - 1 && _ < a.bottom + 1);
                        return i
                    }(u[t], i))) {
                    if (j(u[t]), n = !0, 9 < O) break
                } else !n && p && !a && O < 4 && P < 4 && 2 < b && (v[0] || y.preloadAfterLoad) && (v[0] || !o && (N || M || w || _ || "auto" != u[t][ae](y.sizesAttr))) && (a = v[0] || u[t]);
                a && !n && j(a)
            }
        }

        function Ce() {
            W = !1, S = s.now(), x()
        }

        function be(e) {
            var t = e.target;
            t._lazyCache ? delete t._lazyCache : (ge(e), c(t, y.loadedClass), u(t, y.loadingClass), ue(t, I), z(t, "lazyloaded"))
        }

        function Ae(e) {
            var t, a = e[ae](y.srcsetAttr);
            (t = y.customMedia[e[ae]("data-media") || e[ae]("media")]) && e.setAttribute("media", t), a && e.setAttribute("srcset", a)
        }

        function Ee() {
            3 == y.loadMode && (y.loadMode = 2), G()
        }

        function _e() {
            var e = Y;
            for (Y = V.length ? X : V, Q = !(K = !0); e.length;) e.shift()();
            K = !1
        }

        function we(e, t) {
            K && !t ? e.apply(this, arguments) : (Y.push(e), Q || (Q = !0, (f.hidden ? ie : se)(_e)))
        }
        return ie(function () {
            y.init && ze()
        }), m = {
            cfg: y,
            autoSizer: ye,
            loader: me,
            init: ze,
            uP: h,
            aC: c,
            rC: u,
            hC: o,
            fire: z,
            gW: i,
            rAF: fe
        }
    }(e, e.document, Date);
    e.lazySizes = t, "object" == typeof module && module.exports && (module.exports = t)
}("undefined" != typeof window ? window : {});
! function (e, t) {
    var a = function () {
        t(e.lazySizes), e.removeEventListener("lazyunveilread", a, !0)
    };
    t = t.bind(null, e, e.document), "object" == typeof module && module.exports ? t(require("lazysizes")) : "function" == typeof define && define.amd ? define(["lazysizes"], t) : e.lazySizes ? a() : e.addEventListener("lazyunveilread", a, !0)
}(window, function (e, i, o) {
    "use strict";
    var l, d, u = {};

    function s(e, t, a) {
        var n, r;
        u[e] || (n = i.createElement(t ? "link" : "script"), r = i.getElementsByTagName("script")[0], t ? (n.rel = "stylesheet", n.href = e) : (n.onload = function () {
            n.onerror = null, n.onload = null, a()
        }, n.onerror = n.onload, n.src = e), u[e] = !0, u[n.src || n.href] = !0, r.parentNode.insertBefore(n, r))
    }
    i.addEventListener && (l = function (e, t) {
        var a = i.createElement("img");
        a.onload = function () {
            a.onload = null, a.onerror = null, a = null, t()
        }, a.onerror = a.onload, a.src = e, a && a.complete && a.onload && a.onload()
    }, addEventListener("lazybeforeunveil", function (e) {
        var t, a, n;
        if (e.detail.instance == o && !e.defaultPrevented) {
            var r = e.target;
            if ("none" == r.preload && (r.preload = r.getAttribute("data-preload") || "auto"), null != r.getAttribute("data-autoplay"))
                if (r.getAttribute("data-expand") && !r.autoplay) try {
                    r.play()
                } catch (e) {} else requestAnimationFrame(function () {
                    r.setAttribute("data-expand", "-10"), o.aC(r, o.cfg.lazyClass)
                });
            (t = r.getAttribute("data-link")) && s(t, !0), (t = r.getAttribute("data-script")) && (e.detail.firesLoad = !0, s(t, null, function () {
                e.detail.firesLoad = !1, o.fire(r, "_lazyloaded", {}, !0, !0)
            })), (t = r.getAttribute("data-require")) && (o.cfg.requireJs ? o.cfg.requireJs([t]) : s(t)), (a = r.getAttribute("data-bg")) && (e.detail.firesLoad = !0, l(a, function () {
                r.style.backgroundImage = "url(" + (d.test(a) ? JSON.stringify(a) : a) + ")", e.detail.firesLoad = !1, o.fire(r, "_lazyloaded", {}, !0, !0)
            })), (n = r.getAttribute("data-poster")) && (e.detail.firesLoad = !0, l(n, function () {
                r.poster = n, e.detail.firesLoad = !1, o.fire(r, "_lazyloaded", {}, !0, !0)
            }))
        }
    }, !(d = /\(|\)|\s|'/)))
});
var _ua = function (e) {
        return {
            Tablet: -1 != e.indexOf("windows") && -1 != e.indexOf("touch") || -1 != e.indexOf("ipad") || -1 != e.indexOf("android") && -1 == e.indexOf("mobile") || -1 != e.indexOf("firefox") && -1 != e.indexOf("tablet") || -1 != e.indexOf("kindle") || -1 != e.indexOf("silk") || -1 != e.indexOf("playbook"),
            Mobile: -1 != e.indexOf("windows") && -1 != e.indexOf("phone") || -1 != e.indexOf("iphone") || -1 != e.indexOf("ipod") || -1 != e.indexOf("android") && -1 != e.indexOf("mobile") || -1 != e.indexOf("firefox") && -1 != e.indexOf("mobile") || -1 != e.indexOf("blackberry")
        }
    }(window.navigator.userAgent.toLowerCase()),
    osVer = "Android",
    breakNum = 600,
    tabletNum = 1024;

function setMouse() {
    var e = $(".cursor"),
        t = $(".follower"),
        n = 0,
        i = 0,
        a = 0,
        o = 0;
    TweenMax.to({}, .001, {
        repeat: -1,
        onRepeat: function () {
            a += (n - a) / 10, o += (i - o) / 10, TweenMax.set(t, {
                css: {
                    left: a - 5,
                    top: o - 5
                }
            }), TweenMax.set(e, {
                css: {
                    left: n - 4,
                    top: i - 4
                }
            })
        }
    }), $(document).on("mousemove", function (e) {
        n = e.pageX, i = e.pageY
    }), $("a").on({
        mouseenter: function () {
            e.addClass("is-active"), t.addClass("is-active")
        },
        mouseleave: function () {
            e.removeClass("is-active"), t.removeClass("is-active")
        }
    })
}

function setVideo() {
    function t(e) {
        var t = $(window).scrollTop() + $(window).height();
        e.each(function (e) {
            t > $(this).offset().top && $(this).get(0).play()
        })
    }
    $(".movieStyle_01").each(function () {
        $(this).find(".video").get(0).play()
    }), $(window).on("load", function () {
        var e = $(".movieStyle_01 video");
        e.length && (t(e), $(window).on("scroll", function () {
            t(e)
        }))
    })
}

function setMenuPosition() {
    $("#mainNav").hasClass("active") || setTimeout(function () {
        $("#mainNav").addClass("out")
    }, 1e3);
    var e = !1;
    $(window).scroll(function () {
        $("#mainNav").removeClass("out"), !1 !== e && clearTimeout(e), e = setTimeout(function () {
            $(this).scrollTop();
            $("#mainNav").addClass("out")
        }, 1e3)
    })
}

function setBuyBtn() {
    var e = $(".price-item--regular").text().replace("JPY", ""),
        e = $.trim(e);
    $(".priceLabel .label").text(e), "売り切れ" == $(".product-form__cart-submit").attr("aria-label") && $("#customCartBtn").addClass("dis"), $("#customCartBtn,#customCartBtn_01").on("click", function () {
        $(".product-form__cart-submit").click()
    }), $("#customCartBtn_02").on("click", function () {
        $("#io-related-prd-id .vw-but-re").click()
    }), $("#customBuyBtn").on("click", function () {
        $(".shopify-payment-button button").click()
    }), $("#optionBtn").on("click", function () {
        $("#io-related-prd-id .vw-but-re").click()
    })
}

function setCateFilter() {
    $("#faqNav a").on("click", function () {
        var e = "." + $(this).attr("class").replace("active ");
        $(this).parents("#faqNav").find("a").removeClass("active"), $(this).addClass("active"), ".type_0" == e ? $("#faqWrap section").fadeIn("fast").removeClass("disp").removeClass("dispOdd") : ($("#faqWrap section").hide(), $("#faqWrap").find(e).fadeIn("fast").addClass("disp"), $("#faqWrap").find(e + ":odd").addClass("dispOdd"))
    })
}

function setPhotoChanger() {
    $(".photoChanger").each(function () {
        var t, e = $(this).find("li").length;
        $(this).find("li:nth-child(1)").addClass("action"), 1 < e && (t = $(this), setInterval(function () {
            var e;
            (e = t).find("li:nth-child(2)").addClass("action"), setTimeout(function () {
                e.find("li:nth-child(1)").removeClass("action"), e.find("li:nth-child(1)").appendTo(e)
            }, 2e3)
        }, 5e3))
    })
}

function setMega() {
    $("header .col-nav .parent a").hover(function () {
        $("header .productNavWrapper").slideDown("fast"), $(this).addClass("active")
    }, function () {}), $("header").hover(function () {}, function () {
        $("header .productNavWrapper").slideUp("fast"), $("header .col-nav .parent a").removeClass("active")
    })
}

function displayCart() {
    $("#CartCount").each(function () {
        0 != $(this).find("span").text() && $(this).addClass("active")
    })
}

function setAcc() {
    $(".accSec h2").on("click", function () {
        $(this).toggleClass("active"), $(this).parent().next().slideToggle("fast")
    })
}
$(function () {
    setScroll(), $("#wrapper").hasClass("home"), _ua.Tablet || _ua.Mobile, _ua.Mobile
}), $(window).on("load", function () {
    svg4everybody(), judgeWinSize(), setMainMenu(), setAcc(), setWay(), setLoaded(), setMega(), setMenuPosition(), $("#wrapper").hasClass("home")
});
var menuOpenFlag = !1;

function setMainMenu() {
    var e;
    $(".burgerNav").on("click", function () {
        ($(this).hasClass("active") ? s : function () {
            e = $(window).scrollTop() - o, $("#mainNav").addClass("active"), $(".burgerNav").addClass("active"), $("#wrapper").addClass("menuOpen"), $("#wrapper").hasClass("setSp") && $("#outerMenu").css("top", -e);
            menuOpenFlag = !0, setTimeout(function () {
                $("#mainNav").height() < $(".mainNavSec").height() + 90 ? $("#mainNav .closeBtn").addClass("style_01") : $("#mainNav .closeBtn").removeClass("style_01")
            }, 500)
        })()
    }), $("#mainNav a").on("click", function (e) {
        e.stopPropagation()
    }), $("#clickBlocker,.closeArea,#mainNav .closeBtn").on("click", function () {
        s()
    });
    var t = $(window).width(),
        n = !1,
        i = window.innerWidth;

    function a(e) {
        e.preventDefault()
    }
    window.addEventListener("resize", function () {
        t = $(window).width(), i != window.innerWidth && (i = window.innerWidth, !1 !== n && clearTimeout(n), n = setTimeout(function () {
            tabletNum < t && s()
        }, 200))
    });
    var o = $("#outerMenu").offset().top;

    function s() {
        $("#mainNav").removeClass("active"), $(".burgerNav").removeClass("active"), $("#mainNav").removeClass("out"), $("#outerMenu").css("top", ""), $("#wrapper").removeClass("menuOpen"), document.removeEventListener("touchmove", a, {
            passive: !1
        }), menuOpenFlag = !1, setTimeout(function () {
            $("#mainNav").addClass("out")
        }, 1e3), $("html, body").prop({
            scrollTop: e + o
        })
    }
}

function setHeader() {
    n(), $(window).scroll(function () {
        n()
    });
    $(window).width();
    var e = !1,
        t = window.innerWidth;

    function n() {
        baseHeight = 10, $(this).scrollTop() <= baseHeight ? $("#wrapper").removeClass("fixedHeader") : $(this).scrollTop() > baseHeight && $("#wrapper").addClass("fixedHeader")
    }
    window.addEventListener("resize", function () {
        $(window).width(), t != window.innerWidth && (t = window.innerWidth, !1 !== e && clearTimeout(e), e = setTimeout(function () {
            $("#wrapper").removeClass("fixedHeader")
        }, 200))
    })
}

function judgeWinSize() {
    var e = $(window).width();
    breakNum < e ? $("#wrapper").addClass("setPc") : $("#wrapper").addClass("setSp");
    var t = !1,
        n = window.innerWidth;
    window.addEventListener("resize", function () {
        n != window.innerWidth && (n = window.innerWidth, !1 !== t && clearTimeout(t), t = setTimeout(function () {
            e = $(window).width(), breakNum < e ? ($("#wrapper").addClass("setPc"), $("#wrapper").removeClass("setSp")) : ($("#wrapper").addClass("setSp"), $("#wrapper").removeClass("setPc"))
        }, 200))
    })
}

function setLoaded() {
    $("#loading").addClass("loaded"), $("#wrapper").addClass("loaded"), setTimeout(function () {
        $("#wrapper").addClass("loadEnd"), $("#loading").addClass("loadEnd"), $("#mainNav").removeClass("foot")
    }, 300), $("body,html").animate({
        scrollTop: 0
    }, 0, "swing")
}

function setWay() {
    $(".way,.alphaWay,.scaleWay,.setAnimation,.nullWay").waypoint(function (e) {
        var t = $(this.element);
        $(this.element);
        "down" === e && t.addClass("active")
    }, {
        offset: "70%"
    }), setTimeout(function () {
        $(".galleryWidget.bottom").waypoint(function (e) {
            var t = $(this.element);
            $(this.element);
            "down" === e ? t.addClass("active") : t.removeClass("active")
        }, {
            offset: "4.296875%"
        })
    }, 1e3), $(".galleryWidget .item").waypoint(function (e) {
        var t = $(this.element);
        $(this.element);
        "down" === e && t.addClass("active")
    }, {
        offset: "-145px"
    }), $("#wrapper").hasClass("setPc") ? $(".galleryWidget .item").waypoint(function (e) {
        var t = $(this.element);
        $(this.element);
        "up" === e && t.removeClass("active")
    }, {
        offset: "-155px"
    }) : $(".galleryWidget .item").waypoint(function (e) {
        var t = $(this.element);
        $(this.element);
        "up" === e && t.removeClass("active")
    }, {
        offset: "-195/375*100vw"
    }), $(".galleryWidget .item").waypoint(function (e) {
        var t = $(this.element);
        $(this.element);
        "down" === e && t.addClass("move")
    }, {
        offset: "30%"
    }), $(".shuffle").waypoint(function (e) {
        var t = $(this.element);
        "down" === e && (t.addClass("active"), t.shuffleLetters())
    }, {
        offset: "70%"
    }), $(".scaleway,.nullWay,.ttlStyle_05,.fade_01,.fade_02").waypoint(function (e) {
        var t = $(this.element);
        "down" === e && t.addClass("active")
    }, {
        offset: "70%"
    })
}

function setScroll() {
    var a = $("header").height() + 40;
    $('a[href^="#"]').click(function (e) {
        var t = $(this).attr("href"),
            n = $("#" == t || "" == t ? "html" : t),
            i = n.offset().top - a;
        $(this).hasClass("unqNav") && closeFnc(), $.when($("html, body").animate({
            scrollTop: i
        }, 400, "swing"), e.preventDefault()).done(function () {
            var e = n.offset().top - a;
            e == i || $("html, body").animate({
                scrollTop: e
            }, 10, "swing")
        })
    })
}

function startScroll() {
    var i = $("header").height() + 40,
        e = $(location).attr("hash");
    e && (timer = setTimeout(function () {
        var t = $("#" == e || "" == e ? "html" : e),
            n = t.offset().top - i;
        $.when($("html, body").animate({
            scrollTop: n
        }, 400, "swing")).done(function () {
            var e = t.offset().top - i;
            e == n || $("html, body").animate({
                scrollTop: e
            }, 10, "swing")
        })
    }, 1500))
}
$(window).on("load scroll resize", function () {
    var e = $(window).scrollTop();
    $(document).height() - window.innerHeight <= e ? $("#mainNav").addClass("foot") : $("#mainNav").removeClass("foot")
});
var isLandscape = function () {
    window.innerHeight > window.innerWidth ? (jQuery("body").addClass("portrait"), jQuery("body").removeClass("landscape")) : (jQuery("body").addClass("landscape"), jQuery("body").removeClass("portrait"))
};

function heightLineGroup() {
    $(window).width();
    startResize()
}

function setAutoHeight(e, t) {
    $(e).tile(t)
}

function startResize() {
    var e = !1,
        t = window.innerWidth;
    window.addEventListener("resize", function () {
        t != window.innerWidth && (t = window.innerWidth, !1 !== e && clearTimeout(e), e = setTimeout(function () {
            heightLineGroup()
        }, 200))
    })
}
_ua.Mobile && (jQuery(window).resize(function () {
    isLandscape()
}), isLandscape());
! function (e, i, l) {
    "use strict";
    var n, o, c;
    i.createElement("picture");

    function t() {}

    function s(e, t, s, r) {
        e.addEventListener ? e.addEventListener(t, s, r || !1) : e.attachEvent && e.attachEvent("on" + t, s)
    }
    var S = {},
        a = !1,
        r = i.createElement("img"),
        p = r.getAttribute,
        f = r.setAttribute,
        d = r.removeAttribute,
        u = i.documentElement,
        h = {},
        x = {
            algorithm: ""
        },
        m = "data-pfsrc",
        A = m + "set",
        g = navigator.userAgent,
        y = /rident/.test(g) || /ecko/.test(g) && g.match(/rv\:(\d+)/) && 35 < RegExp.$1,
        b = "currentSrc",
        v = /\s+\+?\d+(e\d+)?w/,
        w = /(\([^)]+\))?\s*(.+)/,
        E = e.picturefillCFG,
        z = "font-size:100%!important;",
        T = !0,
        R = {},
        C = {},
        M = e.devicePixelRatio,
        P = {
            px: 1,
            in: 96
        },
        D = i.createElement("a"),
        k = !1,
        I = /^[ \t\n\r\u000c]+/,
        U = /^[, \t\n\r\u000c]+/,
        $ = /^[^ \t\n\r\u000c]+/,
        B = /[,]+$/,
        L = /^\d+$/,
        Q = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,
        g = function (t) {
            var s = {};
            return function (e) {
                return e in s || (s[e] = t(e)), s[e]
            }
        };

    function W(e) {
        return " " === e || "\t" === e || "\n" === e || "\f" === e || "\r" === e
    }

    function G(e, t) {
        return e.w ? (e.cWidth = S.calcListLength(t || "100vw"), e.res = e.w / e.cWidth) : e.res = e.d, e
    }
    var F, H, j, q, N, O, V, J, K, X, _, Y, Z, ee, te, se, re, ne = (F = /^([\d\.]+)(em|vw|px)$/, H = g(function (e) {
            return "return " + function () {
                for (var e = arguments, t = 0, s = e[0]; ++t in e;) s = s.replace(e[t], e[++t]);
                return s
            }((e || "").toLowerCase(), /\band\b/g, "&&", /,/g, "||", /min-([a-z-\s]+):/g, "e.$1>=", /max-([a-z-\s]+):/g, "e.$1<=", /calc([^)]+)/g, "($1)", /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)", /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi, "") + ";"
        }), function (e, t) {
            var s;
            if (!(e in R))
                if (R[e] = !1, t && (s = e.match(F))) R[e] = s[1] * P[s[2]];
                else try {
                    R[e] = new Function("e", H(e))(P)
                } catch (e) {}
            return R[e]
        }),
        ie = function (e) {
            if (a) {
                var t, s, r, n = e || {};
                if (n.elements && 1 === n.elements.nodeType && ("IMG" === n.elements.nodeName.toUpperCase() ? n.elements = [n.elements] : (n.context = n.elements, n.elements = null)), r = (t = n.elements || S.qsa(n.context || i, n.reevaluate || n.reselect ? S.sel : S.selShort)).length) {
                    for (S.setupRun(n), k = !0, s = 0; s < r; s++) S.fillImg(t[s], n);
                    S.teardownRun(n)
                }
            }
        };

    function ce(e, t) {
        return e.res - t.res
    }

    function ae(e, t) {
        var s, r, n;
        if (e && t)
            for (n = S.parseSet(t), e = S.makeUrl(e), s = 0; s < n.length; s++)
                if (e === S.makeUrl(n[s].url)) {
                    r = n[s];
                    break
                } return r
    }

    function ue(t, o) {
        function e(e) {
            var e = e.exec(t.substring(c));
            if (e) return e = e[0], c += e.length, e
        }
        var p, f, s, r, n, i = t.length,
            c = 0,
            d = [];

        function a() {
            for (var e, t, s, r, n, i, c, a = !1, u = {}, l = 0; l < f.length; l++) r = (c = f[l])[c.length - 1], n = c.substring(0, c.length - 1), i = parseInt(n, 10), c = parseFloat(n), L.test(n) && "w" === r ? ((e || t) && (a = !0), 0 === i ? a = !0 : e = i) : Q.test(n) && "x" === r ? ((e || t || s) && (a = !0), c < 0 ? a = !0 : t = c) : L.test(n) && "h" === r ? ((s || t) && (a = !0), 0 === i ? a = !0 : s = i) : a = !0;
            a || (u.url = p, e && (u.w = e), t && (u.d = t), s && (u.h = s), s || t || e || (u.d = 1), 1 === u.d && (o.has1x = !0), u.set = o, d.push(u))
        }
        for (;;) {
            if (e(U), i <= c) return d;
            p = e($), f = [], "," === p.slice(-1) ? (p = p.replace(B, ""), a()) : function () {
                for (e(I), s = "", r = "in descriptor";;) {
                    if (n = t.charAt(c), "in descriptor" === r)
                        if (W(n)) s && (f.push(s), s = "", r = "after descriptor");
                        else {
                            if ("," === n) return c += 1, s && f.push(s), a();
                            if ("(" === n) s += n, r = "in parens";
                            else {
                                if ("" === n) return s && f.push(s), a();
                                s += n
                            }
                        }
                    else if ("in parens" === r)
                        if (")" === n) s += n, r = "in descriptor";
                        else {
                            if ("" === n) return f.push(s), a();
                            s += n
                        }
                    else if ("after descriptor" === r && !W(n)) {
                        if ("" === n) return a();
                        r = "in descriptor", --c
                    }
                    c += 1
                }
            }()
        }
    }

    function le(e) {
        var t, s, r, n, i, c, a = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,
            u = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;
        for (r = (s = function (e) {
                var t, s = "",
                    r = [],
                    n = [],
                    i = 0,
                    c = 0,
                    a = !1;

                function u() {
                    s && (r.push(s), s = "")
                }

                function l() {
                    r[0] && (n.push(r), r = [])
                }
                for (;;) {
                    if ("" === (t = e.charAt(c))) return u(), l(), n;
                    if (a) "*" !== t || "/" !== e[c + 1] ? c += 1 : (a = !1, c += 2, u());
                    else {
                        if (W(t)) {
                            if (e.charAt(c - 1) && W(e.charAt(c - 1)) || !s) {
                                c += 1;
                                continue
                            }
                            if (0 === i) {
                                u(), c += 1;
                                continue
                            }
                            t = " "
                        } else if ("(" === t) i += 1;
                        else if (")" === t) --i;
                        else {
                            if ("," === t) {
                                u(), l(), c += 1;
                                continue
                            }
                            if ("/" === t && "*" === e.charAt(c + 1)) {
                                a = !0, c += 2;
                                continue
                            }
                        }
                        s += t, c += 1
                    }
                }
            }(e)).length, t = 0; t < r; t++)
            if (i = (n = s[t])[n.length - 1], c = i, a.test(c) && 0 <= parseFloat(c) || (u.test(c) || ("0" === c || "-0" === c || "+0" === c))) {
                if (i = i, n.pop(), 0 === n.length) return i;
                if (n = n.join(" "), S.matchesMedia(n)) return i
            } return "100vw"
    }

    function oe() {
        2 === q.width && (S.supSizes = !0), o = S.supSrcset && !S.supSizes, a = !0, setTimeout(ie)
    }
    e.console && console.warn, b in r || (b = "src"), h["image/jpeg"] = !0, h["image/gif"] = !0, h["image/png"] = !0, h["image/svg+xml"] = i.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"), S.ns = ("pf" + (new Date).getTime()).substr(0, 9), S.supSrcset = "srcset" in r, S.supSizes = "sizes" in r, S.supPicture = !!e.HTMLPictureElement, S.supSrcset && S.supPicture && !S.supSizes && (j = i.createElement("img"), r.srcset = "data:,a", j.src = "data:,a", S.supSrcset = r.complete === j.complete, S.supPicture = S.supSrcset && S.supPicture), S.supSrcset && !S.supSizes ? (j = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", (q = i.createElement("img")).onload = oe, q.onerror = oe, q.setAttribute("sizes", "9px"), q.srcset = j + " 1w,data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw== 9w", q.src = j) : a = !0, S.selShort = "picture>img,img[srcset]", S.sel = S.selShort, S.cfg = x, S.DPR = M || 1, S.u = P, S.types = h, S.setSize = t, S.makeUrl = g(function (e) {
        return D.href = e, D.href
    }), S.qsa = function (e, t) {
        return "querySelector" in e ? e.querySelectorAll(t) : []
    }, S.matchesMedia = function () {
        return e.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches ? S.matchesMedia = function (e) {
            return !e || matchMedia(e).matches
        } : S.matchesMedia = S.mMQ, S.matchesMedia.apply(this, arguments)
    }, S.mMQ = function (e) {
        return !e || ne(e)
    }, S.calcLength = function (e) {
        e = ne(e, !0) || !1;
        return e = e < 0 ? !1 : e
    }, S.supportsType = function (e) {
        return !e || h[e]
    }, S.parseSize = g(function (e) {
        e = (e || "").match(w);
        return {
            media: e && e[1],
            length: e && e[2]
        }
    }), S.parseSet = function (e) {
        return e.cands || (e.cands = ue(e.srcset, e)), e.cands
    }, S.getEmValue = function () {
        var e, t, s, r;
        return !n && (e = i.body) && (t = i.createElement("div"), s = u.style.cssText, r = e.style.cssText, t.style.cssText = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)", u.style.cssText = z, e.style.cssText = z, e.appendChild(t), n = t.offsetWidth, e.removeChild(t), n = parseFloat(n, 10), u.style.cssText = s, e.style.cssText = r), n || 16
    }, S.calcListLength = function (e) {
        var t;
        return e in C && !x.uT || (t = S.calcLength(le(e)), C[e] = t || P.width), C[e]
    }, S.setRes = function (e) {
        if (e)
            for (var t, s = 0, r = (t = S.parseSet(e)).length; s < r; s++) G(t[s], e.sizes);
        return t
    }, S.setRes.res = G, S.applySetCandidate = function (e, t) {
        if (e.length) {
            var s, r, n, i, c, a, u, l, o, p, f, d, h, m, A = t[S.ns],
                g = S.DPR,
                v = A.curSrc || t[b],
                w = A.curCan || (u = t, l = v, w = e[0].set, (w = ae(l, w = !w && l ? (w = u[S.ns].sets) && w[w.length - 1] : w)) && (l = S.makeUrl(l), u[S.ns].curSrc = l, (u[S.ns].curCan = w).res || G(w, w.set.sizes)), w);
            if (w && w.set === e[0].set && ((a = y && !t.complete && w.res - .1 > g) || (w.cached = !0, w.res >= g && (c = w))), !c)
                for (e.sort(ce), c = e[(i = e.length) - 1], r = 0; r < i; r++)
                    if ((s = e[r]).res >= g) {
                        c = e[n = r - 1] && (a || v !== S.makeUrl(s.url)) && (o = e[n].res, p = s.res, f = g, d = e[n].cached, m = h = void 0, o = "saveData" === x.algorithm ? 2.7 < o ? f + 1 : (m = (p - f) * (h = Math.pow(o - .6, 1.5)), d && (m += .1 * h), o + m) : 1 < f ? Math.sqrt(o * p) : o, f < o) ? e[n] : s;
                        break
                    } c && (w = S.makeUrl(c.url), A.curSrc = w, A.curCan = c, w !== v && S.setSrc(t, c), S.setSize(t))
        }
    }, S.setSrc = function (e, t) {
        e.src = t.url, "image/svg+xml" === t.set.type && (t = e.style.width, e.style.width = e.offsetWidth + 1 + "px", e.offsetWidth + 1 && (e.style.width = t))
    }, S.getSet = function (e) {
        for (var t, s, r = !1, n = e[S.ns].sets, i = 0; i < n.length && !r; i++)
            if ((t = n[i]).srcset && S.matchesMedia(t.media) && (s = S.supportsType(t.type))) {
                r = t = "pending" === s ? s : t;
                break
            } return r
    }, S.parseSets = function (e, t, s) {
        var r, n, i, c, a = t && "PICTURE" === t.nodeName.toUpperCase(),
            u = e[S.ns];
        u.src !== l && !s.src || (u.src = p.call(e, "src"), u.src ? f.call(e, m, u.src) : d.call(e, m)), u.srcset !== l && !s.srcset && S.supSrcset && !e.srcset || (r = p.call(e, "srcset"), u.srcset = r, c = !0), u.sets = [], a && (u.pic = !0, function (e, t) {
            for (var s, r, n = e.getElementsByTagName("source"), i = 0, c = n.length; i < c; i++)(s = n[i])[S.ns] = !0, (r = s.getAttribute("srcset")) && t.push({
                srcset: r,
                media: s.getAttribute("media"),
                type: s.getAttribute("type"),
                sizes: s.getAttribute("sizes")
            })
        }(t, u.sets)), u.srcset ? (n = {
            srcset: u.srcset,
            sizes: p.call(e, "sizes")
        }, u.sets.push(n), (i = (o || u.src) && v.test(u.srcset || "")) || !u.src || ae(u.src, n) || n.has1x || (n.srcset += ", " + u.src, n.cands.push({
            url: u.src,
            d: 1,
            set: n
        }))) : u.src && u.sets.push({
            srcset: u.src,
            sizes: null
        }), u.curCan = null, u.curSrc = l, u.supported = !(a || n && !S.supSrcset || i && !S.supSizes), c && S.supSrcset && !u.supported && (r ? (f.call(e, A, r), e.srcset = "") : d.call(e, A)), u.supported && !u.srcset && (!u.src && e.src || e.src !== S.makeUrl(u.src)) && (null === u.src ? e.removeAttribute("src") : e.src = u.src), u.parsed = !0
    }, S.fillImg = function (e, t) {
        var s, r = t.reselect || t.reevaluate;
        e[S.ns] || (e[S.ns] = {}), s = e[S.ns], !r && s.evaled === c || (s.parsed && !t.reevaluate || S.parseSets(e, e.parentNode, t), s.supported ? s.evaled = c : (t = e, s = S.getSet(t), e = !1, "pending" !== s && (e = c, s && (s = S.setRes(s), S.applySetCandidate(s, t))), t[S.ns].evaled = e))
    }, S.setupRun = function () {
        k && !T && M === e.devicePixelRatio || (T = !1, M = e.devicePixelRatio, R = {}, C = {}, S.DPR = M || 1, P.width = Math.max(e.innerWidth || 0, u.clientWidth), P.height = Math.max(e.innerHeight || 0, u.clientHeight), P.vw = P.width / 100, P.vh = P.height / 100, c = [P.height, P.width, M].join("-"), P.em = S.getEmValue(), P.rem = P.em)
    }, S.supPicture ? S.fillImg = ie = t : (_ = e.attachEvent ? /d$|^c/ : /d$|^c|^i/, Y = function () {
        var e = i.readyState || "";
        Z = setTimeout(Y, "loading" === e ? 200 : 999), i.body && (S.fillImgs(), (N = N || _.test(e)) && clearTimeout(Z))
    }, Z = setTimeout(Y, i.body ? 9 : 99), ee = u.clientHeight, s(e, "resize", (O = function () {
        T = Math.max(e.innerWidth || 0, u.clientWidth) !== P.width || u.clientHeight !== ee, ee = u.clientHeight, T && S.fillImgs()
    }, V = 99, X = function () {
        var e = new Date - K;
        e < V ? J = setTimeout(X, V - e) : (J = null, O())
    }, function () {
        K = new Date, J = J || setTimeout(X, V)
    })), s(i, "readystatechange", Y)), S.picturefill = ie, S.fillImgs = ie, S.teardownRun = t, ie._ = S, e.picturefillCFG = {
        pf: S,
        push: function (e) {
            var t = e.shift();
            "function" == typeof S[t] ? S[t].apply(S, e) : (x[t] = e[0], k && S.fillImgs({
                reselect: !0
            }))
        }
    };
    for (; E && E.length;) e.picturefillCFG.push(E.shift());
    e.picturefill = ie, "object" == typeof module && "object" == typeof module.exports ? module.exports = ie : "function" == typeof define && define.amd && define("picturefill", function () {
        return ie
    }), S.supPicture || (h["image/webp"] = (te = "image/webp", se = "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==", (re = new e.Image).onerror = function () {
        h[te] = !1, ie()
    }, re.onload = function () {
        h[te] = 1 === re.width, ie()
    }, re.src = se, "pending"))
}(window, document);
! function (e, t) {
    "function" == typeof define && define.amd ? define([], function () {
        return e.svg4everybody = t()
    }) : "object" == typeof exports ? module.exports = t() : e.svg4everybody = t()
}(this, function () {
    function c(e, t) {
        if (t) {
            var n = !e.getAttribute("viewBox") && t.getAttribute("viewBox"),
                i = document.createDocumentFragment(),
                o = t.cloneNode(!0);
            for (n && e.setAttribute("viewBox", n); o.childNodes.length;) i.appendChild(o.firstChild);
            e.appendChild(i)
        }
    }
    return function (e) {
        e = e || {};
        var r = document.getElementsByTagName("use"),
            a = "shim" in e ? e.shim : /\bEdge\/12\b|\bTrident\/[567]\b|\bVersion\/7.0 Safari\b/.test(navigator.userAgent) || (navigator.userAgent.match(/AppleWebKit\/(\d+)/) || [])[1] < 537,
            s = e.validate,
            d = window.requestAnimationFrame || setTimeout,
            u = {};
        a && function e() {
            for (; i = r[0];) {
                var t, n, i, o = i.parentNode;
                o && /svg/i.test(o.nodeName) && (t = i.getAttribute("xlink:href"), !a || s && !s(t, o, i) || (t = (n = t.split("#"))[0], n = n[1], o.removeChild(i), t.length ? ((i = u[t] = u[t] || new XMLHttpRequest).s || (i.s = [], i.open("GET", t), i.send()), i.s.push([o, n]), function (e) {
                    e.onreadystatechange = function () {
                        var t;
                        4 === e.readyState && ((t = document.createElement("x")).innerHTML = e.responseText, e.s.splice(0).map(function (e) {
                            c(e[0], t.querySelector("#" + e[1].replace(/(\W)/g, "\\$1")))
                        }))
                    }, e.onreadystatechange()
                }(i)) : c(o, document.getElementById(n))))
            }
            d(e, 17)
        }()
    }
});
! function (i) {
    i(function () {
        i.yuga.selflink()
    }), i.yuga = {
        Uri: function (e) {
            var a, t = this;
            this.originalPath = e, this.absolutePath = ((a = document.createElement("a")).href = e, a.href);
            var s, n = {
                    schema: 2,
                    username: 5,
                    password: 6,
                    host: 7,
                    path: 9,
                    query: 10,
                    fragment: 11
                },
                r = /^((\w+):)?(\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/.exec(this.absolutePath);
            for (s in n) this[s] = r[n[s]];
            this.querys = {}, this.query && i.each(t.query.split("&"), function () {
                var e = this.split("=");
                2 == e.length && (t.querys[e[0]] = e[1])
            })
        },
        selflink: function (e) {
            var a = i.extend({
                selfLinkAreaSelector: "body",
                selfLinkClass: "current",
                parentsLinkClass: "parentsLink",
                postfix: "",
                changeImgSelf: !0,
                changeImgParents: !0
            }, e);
            i(a.selfLinkAreaSelector + (a.selfLinkAreaSelector ? " " : "") + "a[href]").each(function () {
                var e = new i.yuga.Uri(this.getAttribute("href"));
                e.absolutePath.replace("#columnTop", "") != location.href || e.fragment ? 0 <= location.href.search(e.absolutePath) && (i(this).addClass(a.parentsLinkClass), a.changeImgParents) : (i(this).addClass(a.selfLinkClass), a.changeImgSelf)
            })
        }
    }
}(jQuery);
//# sourceMappingURL=master.js.map

function popup(){
    $('.js-modal-close').on('click',function(){
        $('#popup0427').fadeOut().css('display', 'none');
        $('.modal__bg').fadeOut().css('display', 'none');
        $('.modal__content').fadeOut().css('display', 'none');
        return false;
    });
}
popup();