var DataFrame = function() {
  this.rowNames = [];
  this.columnNames = [];
  this.columns = [];
  this.columnSumCache = {};
};

DataFrame.prototype = {
  processTags: function(data) {
    var posts = data.childNodes;
    var count = 0;
    var max = 0;
    var dateMap = {}; // {Date -> [tagIndex => count]}
    var tagMap = {};
    for (var i in posts) {
      var post = posts[i];
      var date = post.attributes['time'].split('T')[0];
      var tags = post.attributes['tag'].split(' ');
      var di = dateMap[date];
      if (!(di >= 0)) {
        dateMap[date] = di = this.columnNames.length;
        this.columnNames.push(date);
        this.columns.push([]);
      }
      var counts = this.columns[di];
      for (var j in tags) {
        var tag = tags[j];
        var ti = tagMap[tag];
        if (!(ti >= 0)) {
          tagMap[tag] = ti = this.rowNames.length;
          this.rowNames.push(tag);
        }
        while (counts.length <= ti) counts.push(0);
        c = counts[ti] += 1;
        if (c > max) max = c;
      }
    }
    this.max = max; // not used
  },
  
  addColumns_iterate: function (a, b) {
    var sum = [];
    for (var i = a; i < b; i++) {
      var column = this.columns[i];
      for (var t = 0; t < column.length; t++) {
        while (t >= sum.length) sum.push(0);
        sum[t] += column[t];
      }
    }
    while (sum.length < this.rowNames.length) sum.push(0);
    return sum;
  },
  
  addColumns_choose: function (a, b, left, right) {
    if (b - a < 4) return this.addColumns_iterate(a, b);
	//if (b-a==1) return this.columns[a];
	var middle = Math.floor((left + right)/2);
	var s0 = a < middle && this.addColumns_subdivide(a, Math.min(b, middle-1), left, middle);
	var s1 = middle <= b && this.addColumns_subdivide(Math.max(a, middle), b, middle, right);
	if (!s0 || !s1) return s0 || s1;
	var sum = [];
	for (var i = 0; i < s0.length; i++)
	  sum.push(s0[i]+s1[i]);
	return sum;
  },
  
  addColumns_subdivide: function (a, b, left, right) {
	if (arguments.length <= 2) {
	  left = 0;
	  right = this.columns.length;
	}
	var cache = this.columnSumCache;
	var key = a == left && b == right-1 && [a,b];
	if (key && cache[key]) return cache[key];
	if (a==b) return null;
	var sum = this.addColumns_choose(a, b, left, right);
	if (key) cache[key] = sum;
	return sum;
  },

  columnRangeSum: function(a, b) {
	//var t0 = (new Date).getTime();
	sum = this.addColumns_subdivide(a, b);
	//Debug.write((new Date).getTime()-t0);
	return sum;
  },
  
  getColumnSums: function () {
    var sums = [];
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      var sum = 0;
      for (var t = 0; t < column.length; t++) {
        sum += column[t];
      }
      sums.push(sum);
    }
    return sums;
  }
}
