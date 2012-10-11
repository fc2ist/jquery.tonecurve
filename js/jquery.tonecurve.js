/*! jQuery Tone Curve - v0.1.0 - 2012-10-11
* Copyright (c) 2012 moi; Licensed MIT */


(function($) {
  var ToneCurve, default_settings;
  ToneCurve = (function() {
    var activate, attach, createContext, createCurve, createImageData, depth, getSize;

    function ToneCurve(target, config) {
      var $target, origin;
      this.target = target;
      this.config = config;
      $target = $(this.target);
      origin = $target.data('tonecurve');
      if (origin) {
        this.target.src = origin;
      }
      $target.imagesLoaded($.proxy(activate, this));
    }

    depth = 256;

    activate = function() {
      getSize.call(this);
      if (!createContext.call(this)) {
        return false;
      }
      createCurve.call(this);
      createImageData.call(this);
      return attach.call(this);
    };

    getSize = function() {
      this.width = this.target.width;
      return this.height = this.target.height;
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

    createCurve = function() {
      var Lk_x, Lx, d, j, k, len, p, _i, _j, _k, _l, _m, _n;
      p = this.config.input;
      p.unshift([0, 0]);
      p.push([depth - 1, depth - 1]);
      len = p.length;
      Lk_x = new Array(depth);
      for (d = _i = 0; 0 <= depth ? _i < depth : _i > depth; d = 0 <= depth ? ++_i : --_i) {
        Lk_x[d] = new Array(len);
        for (j = _j = 0; 0 <= len ? _j < len : _j > len; j = 0 <= len ? ++_j : --_j) {
          Lk_x[d][j] = 1;
        }
        for (j = _k = 0; 0 <= len ? _k < len : _k > len; j = 0 <= len ? ++_k : --_k) {
          for (k = _l = 0; 0 <= len ? _l < len : _l > len; k = 0 <= len ? ++_l : --_l) {
            if (j === k) {
              continue;
            }
            Lk_x[d][k] *= (d - p[j][0]) / (p[k][0] - p[j][0]);
          }
        }
      }
      Lx = new Array(depth);
      for (d = _m = 0; 0 <= depth ? _m < depth : _m > depth; d = 0 <= depth ? ++_m : --_m) {
        Lx[d] = 0;
        for (j = _n = 0; 0 <= len ? _n < len : _n > len; j = 0 <= len ? ++_n : --_n) {
          Lx[d] += Lk_x[d][j] * p[j][1];
        }
      }
      return this.Lx = Lx;
    };

    createImageData = function() {
      var A, B, G, Lx, R, c, ch, ctx, height, i, imgData, width, x, y, _i, _j;
      c = this.config.channel;
      width = this.width;
      height = this.height;
      ctx = this.context;
      Lx = this.Lx;
      imgData = ctx.getImageData(0, 0, width, height);
      ch = {
        r: false,
        g: false,
        b: false,
        a: false
      };
      if (c.match(/r/i)) {
        ch.r = true;
      }
      if (c.match(/g/i)) {
        ch.g = true;
      }
      if (c.match(/b/i)) {
        ch.b = true;
      }
      if (c.match(/a/i)) {
        ch.a = true;
      }
      for (y = _i = 0; 0 <= height ? _i < height : _i > height; y = 0 <= height ? ++_i : --_i) {
        for (x = _j = 0; 0 <= width ? _j < width : _j > width; x = 0 <= width ? ++_j : --_j) {
          i = (y * width + x) * 4;
          if (ch.r) {
            R = imgData.data[i];
            imgData.data[i] = Math.round(Lx[R]);
          }
          if (ch.g) {
            G = imgData.data[i + 1];
            imgData.data[i + 1] = Math.round(Lx[G]);
          }
          if (ch.b) {
            B = imgData.data[i + 2];
            imgData.data[i + 2] = Math.round(Lx[B]);
          }
          if (ch.a) {
            A = imgData.data[i + 3];
            imgData.data[i + 3] = Math.round(Lx[A]);
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
  $.fn.tonecurve = function(channel, input) {
    var config, option;
    option = {
      channel: channel,
      input: input
    };
    config = $.extend(true, {}, default_settings, option);
    return this.each(function() {
      return new ToneCurve(this, config);
    });
  };
  return default_settings = {
    channel: 'rgb',
    input: [[128, 64]]
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