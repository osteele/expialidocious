    function long2css(n) {
      var a = "0123456789ABCDEF";
      var s = '#';
      for (var i = 24; (i -= 4) >= 0; ) {
        s += a.charAt((n>>i) & 0xf);
      }
      return s;
    }
    
    function scaleColor(a, b, s) {
      var n = 0;
      for (var i = 24; (i -= 8) >= 0; ) {
        var ca = (a >> i) & 0xff;
        var cb = (b >> i) & 0xff;
        var cc = Math.floor(ca*(1-s) + cb*s);
        n |= cc << i;
      }
      return n;
    }
