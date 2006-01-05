/*
Copryight 2005-2006 Oliver steele.  Some rights reserved.

This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 2.5 License:
http://creativecommons.org/licenses/by-nc-sa/2.5/.
*/

function long2css(n) {
  var a = "0123456789ABCDEF";
  var s = '#';
  for (var i = 24; (i -= 4) >= 0; ) {
    s += a.charAt((n>>i) & 0xf);
  }
  return s;
}
    
function interpolateColors(a, b, s) {
  var n = 0;
  for (var i = 24; (i -= 8) >= 0; ) {
    var ca = (a >> i) & 0xff;
    var cb = (b >> i) & 0xff;
    var cc = Math.floor(ca*(1-s) + cb*s);
    n |= cc << i;
  }
  return n;
}
