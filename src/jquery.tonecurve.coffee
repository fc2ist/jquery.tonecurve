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
      createCurve.call(@)
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

    createCurve = ->
      p = @config.input
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

      @Lx = Lx

    createImageData = ->
      c = @config.channel
      width = @width
      height = @height
      ctx = @context
      Lx = @Lx
      imgData = ctx.getImageData(0, 0, width, height)

      ch =
        r: false,
        g: false,
        b: false,
        a: false
      if c.match(/r/i) then ch.r = true
      if c.match(/g/i) then ch.g = true
      if c.match(/b/i) then ch.b = true
      if c.match(/a/i) then ch.a = true

      for y in [0...height]
        for x in [0...width]
          i = (y * width + x) * 4
          if ch.r
            R = imgData.data[ i ]
            imgData.data[ i ] = Math.round( Lx[R] )
          if ch.g
            G = imgData.data[ i + 1 ]
            imgData.data[ i + 1 ] = Math.round( Lx[G] )
          if ch.b
            B = imgData.data[ i + 2 ]
            imgData.data[ i + 2 ] = Math.round( Lx[B] )
          if ch.a
            A = imgData.data[ i + 3 ]
            imgData.data[ i + 3 ] = Math.round( Lx[A] )

      ctx.putImageData(imgData, 0, 0)
      @dataURL = @canvas.toDataURL()

    attach = ->
      @target.src = @dataURL


  $.fn.tonecurve = (channel, input)->
    option =
      channel: channel,
      input: input
    config = $.extend(true, {}, default_settings, option)
    return this.each(->
      new ToneCurve( this, config )
    )

  default_settings =
    channel: 'rgb',
    input: [ [0,0], [128, 64], [255,255] ],
    origin: false


)(jQuery)