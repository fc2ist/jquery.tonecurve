/*! jQuery Tone Curve - v0.3.1 - 2012-10-12
* Copyright (c) 2012 moi; Licensed MIT */


(function($) {
  var MonotonicCubicSpline, ToneCurve, getACV;
  ToneCurve = (function() {
    var activate, attach, createContext, createCurve, createImageData, depth, getSize;

    function ToneCurve(target, config) {
      var $target, origin;
      this.target = target;
      this.config = config;
      $target = $(this.target);
      origin = $target.data('tonecurve');
      if (!origin) {
        $target.data('tonecurve', this.target.src);
      }
      if (origin && this.config.origin) {
        this.target.src = origin;
      }
      $target.imagesLoaded($.proxy(activate, this));
    }

    depth = 256;

    activate = function() {
      var input, k, p, v;
      getSize.call(this);
      if (!createContext.call(this)) {
        return false;
      }
      p = this.config.input;
      input = {
        r: false,
        g: false,
        b: false,
        a: false
      };
      for (k in p) {
        v = p[k];
        if (k.length > 1) {
          continue;
        }
        if (k.match(/r/i)) {
          input.r = v;
        }
        if (k.match(/g/i)) {
          input.g = v;
        }
        if (k.match(/b/i)) {
          input.b = v;
        }
        if (k.match(/a/i)) {
          input.a = v;
        }
      }
      for (k in p) {
        v = p[k];
        if (k.length < 2) {
          continue;
        }
        if (!input.r && k.match(/r/i)) {
          input.r = v;
        }
        if (!input.g && k.match(/g/i)) {
          input.g = v;
        }
        if (!input.b && k.match(/b/i)) {
          input.b = v;
        }
        if (!input.a && k.match(/a/i)) {
          input.a = v;
        }
      }
      this.curve = {};
      if (input.r) {
        this.curve.r = createCurve.call(this, input.r);
      }
      if (input.g) {
        this.curve.g = createCurve.call(this, input.g);
      }
      if (input.b) {
        this.curve.b = createCurve.call(this, input.b);
      }
      if (input.a) {
        this.curve.a = createCurve.call(this, input.a);
      }
      createImageData.call(this);
      return attach.call(this);
    };

    getSize = function() {
      this.width = this.target.naturalWidth || this.target.width;
      return this.height = this.target.naturalHeight || this.target.height;
    };

    createContext = function() {
      var canvas;
      canvas = document.createElement('canvas');
      if (!canvas.getContext) {
        return false;
      }
      canvas.width = this.width;
      canvas.height = this.height;
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.context.drawImage(this.target, 0, 0);
      return true;
    };

    createCurve = function(input) {
      var cdf, d, f, i, p, x, y, _i, _j, _ref;
      f = [];
      x = [];
      y = [];
      for (i = _i = 0, _ref = input.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        p = input[i];
        x.push(p[0]);
        y.push(p[1]);
      }
      cdf = new MonotonicCubicSpline(x, y);
      for (d = _j = 0; 0 <= depth ? _j < depth : _j > depth; d = 0 <= depth ? ++_j : --_j) {
        f[d] = cdf.interpolate(d);
      }
      return f;
    };

    createImageData = function() {
      var A, B, G, Lx, R, c, ctx, curve, height, i, imgData, width, x, y, _i, _j;
      c = this.config.channel;
      width = this.width;
      height = this.height;
      ctx = this.context;
      Lx = this.Lx;
      imgData = ctx.getImageData(0, 0, width, height);
      curve = this.curve;
      for (y = _i = 0; 0 <= height ? _i < height : _i > height; y = 0 <= height ? ++_i : --_i) {
        for (x = _j = 0; 0 <= width ? _j < width : _j > width; x = 0 <= width ? ++_j : --_j) {
          i = (y * width + x) * 4;
          if (curve.r) {
            R = imgData.data[i];
            imgData.data[i] = Math.round(curve.r[R]);
          }
          if (curve.g) {
            G = imgData.data[i + 1];
            imgData.data[i + 1] = Math.round(curve.g[G]);
          }
          if (curve.b) {
            B = imgData.data[i + 2];
            imgData.data[i + 2] = Math.round(curve.b[B]);
          }
          if (curve.a) {
            A = imgData.data[i + 3];
            imgData.data[i + 3] = Math.round(curve.a[A]);
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return this.dataURL = this.canvas.toDataURL();
    };

    attach = function() {
      return this.target.src = this.dataURL;
    };

    return ToneCurve;

  })();
  MonotonicCubicSpline = (function() {

    function MonotonicCubicSpline(x, y) {
      var alpha, beta, delta, dist, i, m, n, tau, to_fix, _i, _j, _k, _l, _len, _len1, _m, _n, _ref, _ref1, _ref2, _ref3;
      n = x.length;
      delta = [];
      m = [];
      alpha = [];
      beta = [];
      dist = [];
      tau = [];
      for (i = _i = 0, _ref = n - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        delta[i] = (y[i + 1] - y[i]) / (x[i + 1] - x[i]);
        if (i > 0) {
          m[i] = (delta[i - 1] + delta[i]) / 2;
        }
      }
      m[0] = delta[0];
      m[n - 1] = delta[n - 2];
      to_fix = [];
      for (i = _j = 0, _ref1 = n - 1; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        if (delta[i] === 0) {
          to_fix.push(i);
        }
      }
      for (_k = 0, _len = to_fix.length; _k < _len; _k++) {
        i = to_fix[_k];
        m[i] = m[i + 1] = 0;
      }
      for (i = _l = 0, _ref2 = n - 1; 0 <= _ref2 ? _l < _ref2 : _l > _ref2; i = 0 <= _ref2 ? ++_l : --_l) {
        alpha[i] = m[i] / delta[i];
        beta[i] = m[i + 1] / delta[i];
        dist[i] = Math.pow(alpha[i], 2) + Math.pow(beta[i], 2);
        tau[i] = 3 / Math.sqrt(dist[i]);
      }
      to_fix = [];
      for (i = _m = 0, _ref3 = n - 1; 0 <= _ref3 ? _m < _ref3 : _m > _ref3; i = 0 <= _ref3 ? ++_m : --_m) {
        if (dist[i] > 9) {
          to_fix.push(i);
        }
      }
      for (_n = 0, _len1 = to_fix.length; _n < _len1; _n++) {
        i = to_fix[_n];
        m[i] = tau[i] * alpha[i] * delta[i];
        m[i + 1] = tau[i] * beta[i] * delta[i];
      }
      this.x = x.slice(0, n);
      this.y = y.slice(0, n);
      this.m = m;
    }

    MonotonicCubicSpline.prototype.interpolate = function(x) {
      var h, h00, h01, h10, h11, i, t, t2, t3, y, _i, _ref;
      for (i = _i = _ref = this.x.length - 2; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
        if (this.x[i] <= x) {
          break;
        }
      }
      h = this.x[i + 1] - this.x[i];
      t = (x - this.x[i]) / h;
      t2 = Math.pow(t, 2);
      t3 = Math.pow(t, 3);
      h00 = 2 * t3 - 3 * t2 + 1;
      h10 = t3 - 2 * t2 + t;
      h01 = -2 * t3 + 3 * t2;
      h11 = t3 - t2;
      y = h00 * this.y[i] + h10 * h * this.m[i] + h01 * this.y[i + 1] + h11 * h * this.m[i + 1];
      return y;
    };

    return MonotonicCubicSpline;

  })();
  getACV = function(path) {
    var curve;
    if (!jDataView) {
      return false;
    }
    curve = {
      rgb: [],
      r: [],
      g: [],
      b: []
    };
    $.ajax({
      url: path,
      async: false,
      dataType: 'dataview'
    }).success(function(view) {
      var ary, c, i, j, len, x, y, _i, _j, _results;
      if (!view) {
        curve = false;
        return;
      }
      c = ['r', 'g', 'b'];
      view.seek(4);
      len = view.getUint16() & 0xff;
      ary = curve.rgb;
      ary.push([0, view.getUint16() & 0xff]);
      view.seek(view.tell() + 2);
      for (i = _i = 1; 1 <= len ? _i < len : _i > len; i = 1 <= len ? ++_i : --_i) {
        y = view.getUint16() & 0xff;
        x = view.getUint16() & 0xff;
        ary.push([x, y]);
      }
      _results = [];
      for (i = _j = 0; _j < 3; i = ++_j) {
        len = view.getUint16() & 0xff;
        ary = curve[c[i]];
        _results.push((function() {
          var _k, _results1;
          _results1 = [];
          for (j = _k = 0; 0 <= len ? _k < len : _k > len; j = 0 <= len ? ++_k : --_k) {
            y = view.getUint16() & 0xff;
            x = view.getUint16() & 0xff;
            _results1.push(ary.push([x, y]));
          }
          return _results1;
        })());
      }
      return _results;
    });
    return curve;
  };
  return $.fn.tonecurve = function(input, origin) {
    var config, option;
    option = {
      input: input,
      origin: origin
    };
    config = $.extend(true, {}, option);
    if (typeof input === 'string') {
      config.input = getACV(input);
      if (!config.input) {
        return this;
      }
    }
    return this.each(function() {
      return new ToneCurve(this, config);
    });
  };
})(jQuery);

/*!
 * jQuery imagesLoaded plugin v2.0.1
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */
(function(c,n){var k="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";c.fn.imagesLoaded=function(l){function m(){var b=c(h),a=c(g);d&&(g.length?d.reject(e,b,a):d.resolve(e));c.isFunction(l)&&l.call(f,e,b,a)}function i(b,a){b.src===k||-1!==c.inArray(b,j)||(j.push(b),a?g.push(b):h.push(b),c.data(b,"imagesLoaded",{isBroken:a,src:b.src}),o&&d.notifyWith(c(b),[a,e,c(h),c(g)]),e.length===j.length&&(setTimeout(m),e.unbind(".imagesLoaded")))}var f=this,d=c.isFunction(c.Deferred)?c.Deferred():
0,o=c.isFunction(d.notify),e=f.find("img").add(f.filter("img")),j=[],h=[],g=[];e.length?e.bind("load.imagesLoaded error.imagesLoaded",function(b){i(b.target,"error"===b.type)}).each(function(b,a){var e=a.src,d=c.data(a,"imagesLoaded");if(d&&d.src===e)i(a,d.isBroken);else if(a.complete&&a.naturalWidth!==n)i(a,0===a.naturalWidth||0===a.naturalHeight);else if(a.readyState||a.complete)a.src=k,a.src=e}):m();return d?d.promise(f):f}})(jQuery);