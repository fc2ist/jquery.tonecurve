(($)->

  class ToneCurve
    constructor:(@target, @config)->
      $target = $( @target )
      origin = $target.data('tonecurve')
      if !origin then $target.data('tonecurve', @target.src)
      if origin && @config.origin then @target.src = origin
      $target.imagesLoaded( $.proxy(activate, @) )

    depth = 256

    activate = ->
      getSize.call(@)
      if !createContext.call(@) then return false

      p = @config.input
      input =
        r: false,
        g: false,
        b: false,
        a: false

      for k,v of p
        if k.length > 1 then continue
        if k.match(/r/i)
          input.r = v
        if k.match(/g/i)
          input.g = v
        if k.match(/b/i)
          input.b = v
        if k.match(/a/i)
          input.a = v

      for k,v of p
        if k.length < 2 then continue
        if !input.r && k.match(/r/i)
          input.r = v
        if !input.g && k.match(/g/i)
          input.g = v
        if !input.b && k.match(/b/i)
          input.b = v
        if !input.a && k.match(/a/i)
          input.a = v

      @curve = {}

      if input.r
        @curve.r = createCurve.call(@, input.r)
      if input.g
        @curve.g = createCurve.call(@, input.g)
      if input.b
        @curve.b = createCurve.call(@, input.b)
      if input.a
        @curve.a = createCurve.call(@, input.a)

      createImageData.call(@)
      attach.call(@)

    getSize = ->
      @width = @target.naturalWidth || @target.width
      @height = @target.naturalHeight || @target.height

    createContext = ->
      canvas = document.createElement('canvas')
      if !canvas.getContext then return false
      canvas.width = @width
      canvas.height = @height
      @canvas = canvas
      @context = canvas.getContext('2d')
      @context.drawImage( @target, 0, 0 )
      return true

    createCurve = (input)->
      f = []
      x = []
      y = []
      for i in [0...input.length]
        p = input[i]
        x.push( p[0] )
        y.push( p[1] )
      cdf = new MonotonicCubicSpline(x, y)
      for d in [0...depth]
        f[d] = cdf.interpolate(d)
      return f

    createImageData = ->
      c = @config.channel
      width = @width
      height = @height
      ctx = @context
      Lx = @Lx
      imgData = ctx.getImageData(0, 0, width, height)

      curve = @curve

      for y in [0...height]
        for x in [0...width]
          i = (y * width + x) * 4
          if curve.r
            R = imgData.data[ i ]
            imgData.data[ i ] = Math.round( curve.r[R] )
          if curve.g
            G = imgData.data[ i + 1 ]
            imgData.data[ i + 1 ] = Math.round( curve.g[G] )
          if curve.b
            B = imgData.data[ i + 2 ]
            imgData.data[ i + 2 ] = Math.round( curve.b[B] )
          if curve.a
            A = imgData.data[ i + 3 ]
            imgData.data[ i + 3 ] = Math.round( curve.a[A] )

      ctx.putImageData(imgData, 0, 0)
      @dataURL = @canvas.toDataURL()

    attach = ->
      @target.src = @dataURL

  class MonotonicCubicSpline

    constructor: (x, y) ->
      n = x.length
      delta = []; m = []; alpha = []; beta = []; dist = []; tau = []
      for i in [0...(n - 1)]
        delta[i] = (y[i + 1] - y[i]) / (x[i + 1] - x[i])
        m[i] = (delta[i - 1] + delta[i]) / 2 if i > 0
      m[0] = delta[0]
      m[n - 1] = delta[n - 2]
      to_fix = []
      for i in [0...(n - 1)]
        to_fix.push(i) if delta[i] == 0
      for i in to_fix
        m[i] = m[i + 1] = 0
      for i in [0...(n - 1)]
        alpha[i] = m[i] / delta[i]
        beta[i]  = m[i + 1] / delta[i]
        dist[i]  = Math.pow(alpha[i], 2) + Math.pow(beta[i], 2)
        tau[i]   = 3 / Math.sqrt(dist[i])
      to_fix = []
      for i in [0...(n - 1)]
        to_fix.push(i) if dist[i] > 9
      for i in to_fix
        m[i]     = tau[i] * alpha[i] * delta[i]
        m[i + 1] = tau[i] * beta[i]  * delta[i]
      @x = x[0...n]
      @y = y[0...n]
      @m = m

    interpolate: (x) ->
      for i in [(@x.length - 2)..0]
        break if @x[i] <= x
      h = @x[i + 1] - @x[i]
      t = (x - @x[i]) / h
      t2 = Math.pow(t, 2)
      t3 = Math.pow(t, 3)
      h00 =  2 * t3 - 3 * t2 + 1
      h10 =      t3 - 2 * t2 + t
      h01 = -2 * t3 + 3 * t2
      h11 =      t3  -    t2
      y = h00 * @y[i] +
          h10 * h * @m[i] +
          h01 * @y[i + 1] +
          h11 * h * @m[i + 1]
      return y

  getACV = (path)->
    curve =
      rgb: [],
      r: [],
      g: [],
      b: []
    $.ajax(
      url: path,
      async: false,
      dataType: 'dataview'
    ).success((view)->
      c = ['r', 'g', 'b']
      view.seek( 4 )
      len = view.getUint16() & 0xff
      ary = curve.rgb
      ary.push( [0, view.getUint16() & 0xff] )
      view.seek( view.tell() + 2 )
      for i in [1...len]
        y = view.getUint16() & 0xff
        x = view.getUint16() & 0xff
        ary.push( [x, y] )
      for i in [0...3]
        len = view.getUint16() & 0xff
        ary = curve[ c[i] ]
        for j in [0...len]
          y = view.getUint16() & 0xff
          x = view.getUint16() & 0xff
          ary.push( [x, y] )
    )
    return curve

  $.fn.tonecurve = (input, origin)->
    option = {
      input: input,
      origin: origin
    }
    config = $.extend(true, {}, option)
    if typeof input == 'string'
      if !jDataView then return this
      config.input = getACV(input)
    return this.each(->
      new ToneCurve( this, config )
    )

)(jQuery)