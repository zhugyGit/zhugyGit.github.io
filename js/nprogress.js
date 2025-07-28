(function(b, a) {
    if (typeof define === "function" && define.amd) {
        define(a)
    } else {
        if (typeof exports === "object") {
            module.exports = a()
        } else {
            b.NProgress = a()
        }
    }
}
)(this, function() {
    var g = {};
    g.version = "0.2.0";
    var k = g.settings = {
        minimum: 0.08,
        easing: "ease",
        positionUsing: "",
        speed: 200,
        trickle: true,
        trickleRate: 0.02,
        trickleSpeed: 800,
        showSpinner: true,
        barSelector: '[role="bar"]',
        spinnerSelector: '[role="spinner"]',
        parent: "body",
        template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
    };
    g.configure = function(n) {
        var m, o;
        for (m in n) {
            o = n[m];
            if (o !== undefined && n.hasOwnProperty(m)) {
                k[m] = o
            }
        }
        return this
    }
    ;
    g.status = null;
    g.set = function(p) {
        var s = g.isStarted();
        p = c(p, k.minimum, 1);
        g.status = (p === 1 ? null : p);
        var q = g.render(!s)
          , m = q.querySelector(k.barSelector)
          , r = k.speed
          , o = k.easing;
        q.offsetWidth;
        h(function(n) {
            if (k.positionUsing === "") {
                k.positionUsing = g.getPositioningCSS()
            }
            e(m, b(p, r, o));
            if (p === 1) {
                e(q, {
                    transition: "none",
                    opacity: 1
                });
                q.offsetWidth;
                setTimeout(function() {
                    e(q, {
                        transition: "all " + r + "ms linear",
                        opacity: 0
                    });
                    setTimeout(function() {
                        g.remove();
                        n()
                    }, r)
                }, r)
            } else {
                setTimeout(n, r)
            }
        });
        return this
    }
    ;
    g.isStarted = function() {
        return typeof g.status === "number"
    }
    ;
    g.start = function() {
        if (!g.status) {
            g.set(0)
        }
        var m = function() {
            setTimeout(function() {
                if (!g.status) {
                    return
                }
                g.trickle();
                m()
            }, k.trickleSpeed)
        };
        if (k.trickle) {
            m()
        }
        return this
    }
    ;
    g.done = function(m) {
        if (!m && !g.status) {
            return this
        }
        return g.inc(0.3 + 0.5 * Math.random()).set(1)
    }
    ;
    g.inc = function(m) {
        var o = g.status;
        if (!o) {
            return g.start()
        } else {
            if (typeof m !== "number") {
                m = (1 - o) * c(Math.random() * o, 0.1, 0.95)
            }
            o = c(o + m, 0, 0.994);
            return g.set(o)
        }
    }
    ;
    g.trickle = function() {
        return g.inc(Math.random() * k.trickleRate)
    }
    ;
    (function() {
        var n = 0
          , m = 0;
        g.promise = function(o) {
            if (!o || o.state() === "resolved") {
                return this
            }
            if (m === 0) {
                g.start()
            }
            n++;
            m++;
            o.always(function() {
                m--;
                if (m === 0) {
                    n = 0;
                    g.done()
                } else {
                    g.set((n - m) / n)
                }
            });
            return this
        }
    }
    )();
    g.render = function(n) {
        if (g.isRendered()) {
            return document.getElementById("nprogress")
        }
        a(document.documentElement, "nprogress-busy");
        var q = document.createElement("div");
        q.id = "nprogress";
        q.innerHTML = k.template;
        var m = q.querySelector(k.barSelector), p = n ? "-100" : l(g.status || 0), o = document.querySelector(k.parent), r;
        e(m, {
            transition: "all 0 linear",
            transform: "translate3d(" + p + "%,0,0)"
        });
        if (!k.showSpinner) {
            r = q.querySelector(k.spinnerSelector);
            r && j(r)
        }
        if (o != document.body) {
            a(o, "nprogress-custom-parent")
        }
        o.appendChild(q);
        return q
    }
    ;
    g.remove = function() {
        i(document.documentElement, "nprogress-busy");
        i(document.querySelector(k.parent), "nprogress-custom-parent");
        var m = document.getElementById("nprogress");
        m && j(m)
    }
    ;
    g.isRendered = function() {
        return !!document.getElementById("nprogress")
    }
    ;
    g.getPositioningCSS = function() {
        var m = document.body.style;
        var n = ("WebkitTransform"in m) ? "Webkit" : ("MozTransform"in m) ? "Moz" : ("msTransform"in m) ? "ms" : ("OTransform"in m) ? "O" : "";
        if (n + "Perspective"in m) {
            return "translate3d"
        } else {
            if (n + "Transform"in m) {
                return "translate"
            } else {
                return "margin"
            }
        }
    }
    ;
    function c(p, o, m) {
        if (p < o) {
            return o
        }
        if (p > m) {
            return m
        }
        return p
    }
    function l(m) {
        return (-1 + m) * 100
    }
    function b(p, q, o) {
        var m;
        if (k.positionUsing === "translate3d") {
            m = {
                transform: "translate3d(" + l(p) + "%,0,0)"
            }
        } else {
            if (k.positionUsing === "translate") {
                m = {
                    transform: "translate(" + l(p) + "%,0)"
                }
            } else {
                m = {
                    "margin-left": l(p) + "%"
                }
            }
        }
        m.transition = "all " + q + "ms " + o;
        return m
    }
    var h = (function() {
        var n = [];
        function m() {
            var o = n.shift();
            if (o) {
                o(m)
            }
        }
        return function(o) {
            n.push(o);
            if (n.length == 1) {
                m()
            }
        }
    }
    )();
    var e = (function() {
        var o = ["Webkit", "O", "Moz", "ms"]
          , p = {};
        function n(s) {
            return s.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(u, t) {
                return t.toUpperCase()
            })
        }
        function r(u) {
            var v = document.body.style;
            if (u in v) {
                return u
            }
            var t = o.length, s = u.charAt(0).toUpperCase() + u.slice(1), w;
            while (t--) {
                w = o[t] + s;
                if (w in v) {
                    return w
                }
            }
            return u
        }
        function q(s) {
            s = n(s);
            return p[s] || (p[s] = r(s))
        }
        function m(s, t, u) {
            t = q(t);
            s.style[t] = u
        }
        return function(t, v) {
            var s = arguments, u, w;
            if (s.length == 2) {
                for (u in v) {
                    w = v[u];
                    if (w !== undefined && v.hasOwnProperty(u)) {
                        m(t, u, w)
                    }
                }
            } else {
                m(t, s[1], s[2])
            }
        }
    }
    )();
    function f(m, o) {
        var n = typeof m == "string" ? m : d(m);
        return n.indexOf(" " + o + " ") >= 0
    }
    function a(m, n) {
        var p = d(m)
          , o = p + n;
        if (f(p, n)) {
            return
        }
        m.className = o.substring(1)
    }
    function i(m, n) {
        var p = d(m), o;
        if (!f(m, n)) {
            return
        }
        o = p.replace(" " + n + " ", " ");
        m.className = o.substring(1, o.length - 1)
    }
    function d(m) {
        return (" " + (m.className || "") + " ").replace(/\s+/gi, " ")
    }
    function j(m) {
        m && m.parentNode && m.parentNode.removeChild(m)
    }
    return g
});