var base64Chars = [
    'A','B','C','D','E','F','G','H',
    'I','J','K','L','M','N','O','P',
    'Q','R','S','T','U','V','W','X',
    'Y','Z','a','b','c','d','e','f',
    'g','h','i','j','k','l','m','n',
    'o','p','q','r','s','t','u','v',
    'w','x','y','z','0','1','2','3',
    '4','5','6','7','8','9','+','/'
    ];

function base64(input){
  var result = '';
  var col = 0;
  var i = 0;
  function next(){
    if (i >= input.length) return null;
    return input.charCodeAt(i++) & 0xff;
  }
  while (i < input.length) {
    var b0 = next();
    result += base64Chars[b0 >> 2];
    var bits = b0 << 4;
    var b1 = next();
    bits |= b1 >> 4;
    result += base64Chars[bits & 0x3F];
    if (b1 == null) {result += '=='; break;}
    bits = b1 << 2;
    var b2 = next();
    bits |= b2 >> 6;
    result += base64Chars[bits & 0x3F];
    if (b2 == null) {result += '='; break;}
    result += base64Chars[b2 & 0x3F];
    if ((col += 4) >= 76){
        result += '\n';
        col = 0;
    }
  }
  return result;
}

function encodeBase64b(input){
  var result = '';
  var col = 0;
  var n = 0;
  var rshift = 0;
  for (var i = 0; i < input.length; i++) {
    var b = input.charCodeAt(i);
    n |= b >> (rshift += 2);
    result += base64Chars[n & 0x3f];
    n = b << 6 - rshift;
    rshift = rshift % 6;
    if ((col += 4) >= 76){
        result += '\n';
        col = 0;
    }
  }
  for (var i = input.length; i++ % 3; ) result += '=';
  return result;
}
  /*bits:
  b0>>2
  b0<<4 | b1>>4
  b1<<2 | b2>>6
  b2<<0
  
  b0>>2   b0<<4
  b1>>4   b1<<2
  b2>>6   b2<<0
  -----

}
/*
function c64(str) {
    print(encodeBase64b(str));
    print(encodeBase64(str));
}
c64('osteele:tsn0plade');
//print(encodeBase64b("osteele:tsn0plade"));
//print(encodeBase64("osteele:tsn0plade"));
print("b3N0ZWVsZTp0c24wcGxhZGU=");
  */