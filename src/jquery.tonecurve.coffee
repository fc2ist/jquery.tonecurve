(($)->

  class ToneCurve
    constructor:(@target, @config)->
      $target = $( @target )
      if @config.origin
        origin = $target.data('tonecurve')
        if origin then @target.src = origin
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
      @width = @target.width
      @height = @target.height

    createContext = ->
      canvas = document.createElement('canvas')
      if !canvas.getContext then return false
      canvas.width = @width
      canvas.height = @height
      @canvas = canvas
      @context = canvas.getContext('2d')
      @context.drawImage( @target, 0, 0 )
      return true

    createCurve = (p)->
      len = p.length

      Lk_x = new Array( depth )
      for d in [0...depth]
        Lk_x[d] = new Array(len)
        for j in [0...len]
          Lk_x[d][j] = 1
        for j in [0...len]
          for k in [0...len]
            if j == k then continue
            Lk_x[d][k] *= (d - p[j][0]) / (p[k][0] - p[j][0])

      Lx = new Array( depth )
      for d in [0...depth]
        Lx[d] = 0
        for j in [0...len]
          Lx[d] += Lk_x[d][j] * p[j][1]

      return Lx

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


  $.fn.tonecurve = (input, origin)->
    option =
      input: input,
      origin: origin
    if !input
      option.input = { rgb: [ [0,0], [128, 64], [255,255] ] }
    config = $.extend(true, {}, default_settings, option)
    return this.each(->
      new ToneCurve( this, config )
    )

  default_settings =
    origin: false


)(jQuery)